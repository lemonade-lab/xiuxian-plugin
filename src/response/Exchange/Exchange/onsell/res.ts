import { Text, useSend } from 'alemonjs';

import { convert2integer } from '@src/model/utils/number';
import { foundthing } from '@src/model/cultivation';
import { existNajieThing, addNajieThing } from '@src/model/najie';
import { addCoin } from '@src/model/economy';
import { readExchange, writeExchange } from '@src/model/trade';
import { existplayer, readNajie, readPlayer } from '@src/model';
import type { NajieItem, Najie } from '@src/types/player';
import type { NajieCategory, ExchangeRecord } from '@src/types/model';

import { selects } from '@src/response/mw-captcha';
export const regular = /^(#|＃|\/)?上架.*$/;

interface EquipLike {
  name: string;
  pinji: number;
  数量?: number;
}
interface PetLike {
  name: string;
  数量?: number;
}

const PINJI_MAP: Record<string, number> = {
  劣: 0,
  普: 1,
  优: 2,
  精: 3,
  极: 4,
  绝: 5,
  顶: 6
};
const PINJI_TEXT = ['劣', '普', '优', '精', '极', '绝', '顶'];

function parsePinji(raw: string | undefined): number | undefined {
  if (!raw) {
    return undefined;
  }
  if (raw in PINJI_MAP) {
    return PINJI_MAP[raw];
  }
  const n = Number(raw);

  return Number.isInteger(n) && n >= 0 && n <= 6 ? n : undefined;
}
function isPositive(n): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n > 0;
}
function normalizeCategory(v): NajieCategory {
  return String(v) as NajieCategory;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  if (!(await existplayer(userId))) {
    return false;
  }

  const najie: Najie | null = await readNajie(userId);

  if (!najie) {
    return false;
  }

  const raw = e.MessageText.replace(/^(#|＃|\/)?上架/, '').trim();

  if (!raw) {
    void Send(Text('格式：#上架物品名*价格*数量 (装备/仙宠可附加 *品级)'));

    return false;
  }
  const parts = raw
    .split('*')
    .map(s => s.trim())
    .filter(Boolean);

  if (parts.length < 2) {
    void Send(Text('参数不足，至少需要 物品*价格*数量'));

    return false;
  }

  let thingName: string = parts[0];
  const numericCode = Number(parts[0]);

  if (Number.isInteger(numericCode)) {
    if (numericCode > 1000) {
      const pet = najie.仙宠?.[numericCode - 1001];

      if (!pet) {
        void Send(Text('仙宠代号输入有误!'));

        return false;
      }
      thingName = pet.name;
    } else if (numericCode > 100) {
      const equip = najie.装备?.[numericCode - 101];

      if (!equip) {
        void Send(Text('装备代号输入有误!'));

        return false;
      }
      thingName = equip.name;
    }
  }

  const thingDefRaw = await foundthing(thingName);

  if (!thingDefRaw) {
    void Send(Text(`这方世界没有[${thingName}]`));

    return false;
  }
  // 运行时守卫：只要包含 name 即可，其余字段容错
  const baseItem: NajieItem = {
    name: String(thingDefRaw.name || thingName),
    class: String(thingDefRaw.class || thingDefRaw.type || '道具')
  };
  const itemClass = normalizeCategory(baseItem.class);

  let pinjiInput: number | undefined;
  let priceRaw: string;
  let amountRaw: string;

  if (itemClass === '装备') {
    const attemptPinji = parsePinji(parts[1]);

    if (attemptPinji !== undefined) {
      pinjiInput = attemptPinji;
      priceRaw = parts[2];
      amountRaw = parts[3];
    } else {
      priceRaw = parts[1];
      amountRaw = parts[2];
    }
  } else {
    priceRaw = parts[1];
    amountRaw = parts[2];
  }

  const price = convert2integer(priceRaw);
  const amount = convert2integer(amountRaw);

  if (!isPositive(price) || !isPositive(amount)) {
    void Send(Text('价格与数量需为正整数'));

    return false;
  }

  let selected: EquipLike | PetLike | undefined;
  let finalPinji: number | undefined = pinjiInput;

  if (itemClass === '装备') {
    const equips = (najie.装备 || []).filter(i => i.name === thingName);

    if (!equips.length) {
      void Send(Text(`你没有[${thingName}]`));

      return false;
    }
    if (finalPinji !== undefined) {
      selected = equips.find(ei => ei.pinji === finalPinji);
      if (!selected) {
        void Send(Text(`你没有该品级的[${thingName}]`));

        return false;
      }
    } else {
      selected = equips.reduce((p, c) => (c.pinji > p.pinji ? c : p));
      finalPinji = (selected as EquipLike).pinji;
    }
  } else if (itemClass === '仙宠') {
    const pets = (najie.仙宠 || []).filter(i => i.name === thingName);

    if (!pets.length) {
      void Send(Text(`你没有[${thingName}]`));

      return false;
    }
    selected = pets[0];
  }

  if ((itemClass === '装备' || itemClass === '仙宠') && amount !== 1) {
    void Send(Text(`${itemClass}一次只能上架 1 个`));

    return false;
  }

  const ownedCount = await existNajieThing(userId, thingName, itemClass, finalPinji);

  if (!ownedCount || ownedCount < amount) {
    void Send(Text(`你没有那么多[${thingName}]`));

    return false;
  }

  const totalPrice = Math.trunc(price * amount);

  if (!isPositive(totalPrice)) {
    void Send(Text('总价计算异常'));

    return false;
  }

  // 计算手续费
  let fee = Math.trunc(totalPrice * 0.03);

  // 固定不超过10w
  if (fee > 100000) {
    fee = 100000;
  } else if (fee < 10000) {
    // 最少1w。
    fee = 10000;
  }

  const player = await readPlayer(userId);

  if (player.灵石 < fee) {
    void Send(Text(`就这点灵石还想上架，需要手续费 ${fee}`));

    return false;
  }

  const exchange: ExchangeRecord[] = await readExchange();

  const isMeLength = exchange.filter(item => item.qq === userId)?.length || 0;

  if (isMeLength >= 3) {
    void Send(Text(`你已发布了${isMeLength}个物品，请先处理`));

    return false;
  }

  await addCoin(userId, -fee);

  const nowTime = Date.now();
  let newRecord: ExchangeRecord;

  if (itemClass === '装备' || itemClass === '仙宠') {
    if (!selected) {
      void Send(Text('内部错误：未选中上架对象'));

      return false;
    }
    const pinjiText = PINJI_TEXT[finalPinji ?? 0] ?? '劣';

    /**
     * 修复装备属性丢失问题：保存装备的完整属性信息
     *
     * 问题描述：之前上架时只保存了装备的基本信息（name、class、pinji），
     * 导致装备的攻击、防御、血量等重要属性丢失，玩家购买后获得的是基础模板装备。
     *
     * 解决方案：在交易记录中保存装备的所有属性，包括：
     * - atk: 攻击力
     * - def: 防御力
     * - HP: 血量
     * - bao: 暴击
     * - type: 装备类型
     * - 数量: 装备数量
     * - 出售价: 装备出售价（用于记录装备的原始出售价值）
     */
    newRecord = {
      thing: {
        name: thingName,
        class: itemClass,
        pinji: pinjiText,
        pinji2: finalPinji,
        名号: thingName,
        // 保存装备的完整属性，确保交易后属性不丢失
        atk: (selected as any).atk,
        def: (selected as any).def,
        HP: (selected as any).HP,
        // 保存装备的出售价（不是交易价格，而是装备本身的出售价值）
        出售价: (selected as any).出售价,
        bao: (selected as any).bao,
        type: (selected as any).type,
        数量: (selected as any).数量,
        // 保存装备的id，用于确定五行属性显示
        id: (selected as any).id
      },
      price,
      amount,
      qq: userId,
      now_time: nowTime
    } as ExchangeRecord;
    await addNajieThing(userId, selected.name, itemClass, -amount, finalPinji);
  } else {
    newRecord = {
      thing: { name: thingName, class: itemClass },
      price,
      amount,
      qq: userId,
      now_time: nowTime
    };
    await addNajieThing(userId, thingName, itemClass, -amount);
  }

  exchange.push(newRecord);
  await writeExchange(exchange);
  void Send(Text('上架成功！'));
});

import mw from '@src/response/mw-captcha';
export default onResponse(selects, [mw.current, res.current]);
