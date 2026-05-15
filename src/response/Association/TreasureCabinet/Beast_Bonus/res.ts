import { Text, useSend } from 'alemonjs';
import { shijianc, addNajieThing } from '@src/model/index';
import { getDataList } from '@src/model/DataList';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { keys, keysAction } from '@src/model/keys';
import { isKeys } from '@src/model/utils/isKeys';
import { getDataByKey, setDataByKey } from '@src/model/DataControl';
import { readDanyao, writeDanyao } from '@src/model/danyao';

export const regular = /^(#|＃|\/)?神兽赐福$/;

function isDateParts(v): v is {
  Y: number;
  M: number;
  D: number;
} {
  return !!v && typeof v === 'object' && 'Y' in v && 'M' in v && 'D' in v;
}

function toNamedList(arr): Array<{ name: string; class?: string }> {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr
    .map(it => {
      if (it && typeof it === 'object') {
        const o = it;

        if (typeof o.name === 'string') {
          return {
            name: o.name,
            class: typeof o.class === 'string' ? o.class : undefined
          };
        }
      }

      return undefined;
    })
    .filter(v => v !== undefined);
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    return false;
  }

  if (!isKeys(player['宗门'], ['宗门名称'])) {
    void Send(Text('你尚未加入宗门'));

    return false;
  }

  const playerGuild = player['宗门'] as any;

  const assRaw = await getDataJSONParseByKey(keys.association(playerGuild.宗门名称));

  if (!assRaw || !isKeys(assRaw, ['power', '宗门神兽'])) {
    void Send(Text('宗门数据不存在'));

    return false;
  }

  const ass = assRaw as any;

  if (!ass.宗门神兽 || ass.宗门神兽 === '0' || ass.宗门神兽 === '无') {
    void Send(Text('你的宗门还没有神兽的护佑，快去召唤神兽吧'));

    return false;
  }

  const nowTime = Date.now();
  const Today = shijianc(nowTime);
  const lastsignTime = await getLastsignBonus(userId);

  if (isDateParts(Today) && isDateParts(lastsignTime)) {
    if (Today.Y === lastsignTime.Y && Today.M === lastsignTime.M && Today.D === lastsignTime.D) {
      void Send(Text('今日已经接受过神兽赐福了，明天再来吧'));

      return false;
    }
  }

  await setDataByKey(keysAction.getLastSignBonus(userId), nowTime);

  // 检查神赐丹效果
  const dy = await readDanyao(userId);
  let bonusProb = 0;
  let shouldConsumeShenci = false;

  if (dy.beiyong2 > 0 && dy.beiyong3 > 0) {
    bonusProb = Number(dy.beiyong3);
    shouldConsumeShenci = true;
  }

  const random = Math.random();
  const baseProb = 0.3; // 基础成功概率30%
  const finalProb = Math.min(baseProb + bonusProb, 0.95); // 最高95%概率

  if (random > finalProb) {
    void Send(Text(`${ass.宗门神兽}闭上了眼睛，表示今天不想理你`));

    return false;
  }

  const beast = ass.宗门神兽;

  const qilinData = await getDataList('Qilin');
  const qinlongData = await getDataList('Qinglong');
  const xuanwuData = await getDataList('Xuanwu');
  const danyaoData = await getDataList('Danyao');
  const gongfaData = await getDataList('Gongfa');
  const equipmentData = await getDataList('Equipment');

  const highProbLists: Record<string, Array<{ name: string; class?: string }>> = {
    麒麟: toNamedList(qilinData),
    青龙: toNamedList(qinlongData),
    玄武: toNamedList(xuanwuData),
    朱雀: toNamedList(xuanwuData),
    白虎: toNamedList(xuanwuData)
  };

  const normalLists: Record<string, Array<{ name: string; class?: string }>> = {
    麒麟: toNamedList(danyaoData),
    青龙: toNamedList(gongfaData),
    玄武: toNamedList(equipmentData),
    朱雀: toNamedList(equipmentData),
    白虎: toNamedList(equipmentData)
  };

  const highList = highProbLists[beast] || [];
  const normalList = normalLists[beast] || [];

  if (!highList.length && !normalList.length) {
    void Send(Text('神兽奖励配置缺失'));

    return false;
  }

  const randomB = Math.random();
  const fromList = randomB > 0.9 && highList.length ? highList : normalList;
  const item = fromList[Math.floor(Math.random() * fromList.length)];

  if (!item) {
    void Send(Text('本次赐福意外失败'));

    return false;
  }

  const category = item.class && typeof item.class === 'string' ? item.class : '道具';

  await addNajieThing(userId, item.name, category as any, 1);

  // 消耗神赐丹效果
  if (shouldConsumeShenci) {
    dy.beiyong2--;
    if (dy.beiyong2 <= 0) {
      dy.beiyong2 = 0;
      dy.beiyong3 = 0;
    }
    await writeDanyao(userId, dy);
  }

  if (randomB > 0.9) {
    const message = shouldConsumeShenci
      ? `看见你来了, ${beast} 很高兴，仔细挑选了 ${item.name} 给你\n神赐丹生效，剩余次数：${dy.beiyong2}`
      : `看见你来了, ${beast} 很高兴，仔细挑选了 ${item.name} 给你`;

    void Send(Text(message));
  } else {
    const message = shouldConsumeShenci
      ? `${beast} 今天心情不错，随手丢给了你 ${item.name}\n神赐丹生效，剩余次数：${dy.beiyong2}`
      : `${beast} 今天心情不错，随手丢给了你 ${item.name}`;

    void Send(Text(message));
  }

  return false;
});

async function getLastsignBonus(userId: string): Promise<{
  Y: number;
  M: number;
  D: number;
} | null> {
  const time = await getDataByKey(keysAction.getLastSignBonus(userId));

  if (time) {
    const parts = shijianc(Number(time));

    if (isDateParts(parts)) {
      return parts;
    }
  }

  return null;
}

export default onResponse(selects, [mw.current, res.current]);
