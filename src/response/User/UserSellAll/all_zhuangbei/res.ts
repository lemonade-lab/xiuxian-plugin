import { Image, Text, useSend } from 'alemonjs';

import { existplayer, readPlayer, foundthing, insteadEquipment, keys } from '@src/model/index';

import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { getEquipmentImage } from '@src/model/image';
import { getDataList } from '@src/model/DataList';
import { EquipmentLike } from '@src/types/model';
import { Player } from '@src/types/player';
import { getDataJSONParseByKey } from '@src/model/DataControl';
export const regular = /^(#|＃|\/)?一键装备$/;

interface EquipItem {
  name: string;
  type: '武器' | '护具' | '法宝';
  atk: number;
  def: number;
  HP: number;
  [k: string]: unknown;
}

interface EquipmentSlots {
  武器?: EquipItem;
  护具?: EquipItem;
  法宝?: EquipItem;
  [k: string]: EquipItem | undefined;
}

function num(v, d = 0) {
  const num = Number(v);

  if (isNaN(num) || !isFinite(num)) {
    return d;
  }

  return num;
}

async function calcBaseThree(player: Player): Promise<[number, number, number] | null> {
  const levelObj = (await getDataList('Level1')).find(i => i['level_id'] === player.level_id);
  const phyObj = (await getDataList('Level2')).find(i => i['level_id'] === player.Physique_id);

  if (!levelObj || !phyObj) {
    return null;
  }
  const atk = num(levelObj.基础攻击) + num(player.攻击加成) + num(phyObj.基础攻击);
  const def = num(levelObj.基础防御) + num(player.防御加成) + num(phyObj.基础防御);
  const hp = num(levelObj.基础血量) + num(player.生命加成) + num(phyObj.基础血量);

  return [atk, def, hp];
}

function score(e: EquipItem, base: [number, number, number]): number {
  const small = e.atk < 10 && e.def < 10 && e.HP < 10;

  return small ? e.atk * base[0] * 0.43 + e.def * base[1] * 0.16 + e.HP * base[2] * 0.41 : e.atk * 0.43 + e.def * 0.16 + e.HP * 0.41;
}

function toEquipLike(item: EquipItem, cls: string): EquipmentLike {
  return {
    name: item.name,
    type: item.type,
    atk: num(item.atk),
    def: num(item.def),
    HP: num(item.HP),
    class: cls,
    bao: num(item.bao),
    pinji: num(item?.pinji ?? 0)
  };
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const najie = await getDataJSONParseByKey(keys.najie(userId));

  if (!najie) {
    return;
  }

  const player = await readPlayer(userId);

  if (!player) {
    return;
  }
  const base = await calcBaseThree(player);

  if (!base) {
    void Send(Text('境界数据缺失，无法智能换装'));

    return false;
  }

  const equipment = await getDataJSONParseByKey(keys.equipment(userId));

  if (!equipment) {
    void Send(Text('当前装备数据异常'));

    return false;
  }
  const bagList = Array.isArray(najie?.装备) ? najie?.装备 : [];

  const slotTypes: Array<keyof EquipmentSlots> = ['武器', '护具', '法宝'];

  for (const slot of slotTypes) {
    const current = equipment[slot];

    if (!current) {
      continue;
    }
    let bestScore = score(current, base);

    let best: EquipItem | null = null;

    for (const item of bagList) {
      if (item?.type !== slot) {
        continue;
      }
      const thing = await foundthing(item.name);

      if (!thing) {
        continue;
      }
      const sc = score(item, base);

      if (sc > bestScore) {
        bestScore = sc;
        best = item;
      }
    }
    if (best) {
      const defThing = await foundthing(best.name);

      if (defThing) {
        const equipArg = toEquipLike(best, defThing.class);

        await insteadEquipment(userId, equipArg);
      }
    }
  }
  const img = await getEquipmentImage(e);

  if (Buffer.isBuffer(img)) {
    void Send(Image(img));

    return false;
  }
  void Send(Text('图片加载失败'));
});

export default onResponse(selects, [mw.current, res.current]);
