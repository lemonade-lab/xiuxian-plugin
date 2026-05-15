import { Image, Text, useMention, useSend } from 'alemonjs';
import { existplayer, readPlayer, existNajieThing, addNajieThing, zdBattle, addHP, writePlayer, formatRemaining } from '@src/model/index';
import { getDataByKey, getDataJSONParseByKey, setDataByKey, setDataJSONStringifyByKey } from '@src/model/DataControl';
import { getDataList } from '@src/model/DataList';
import { keys, keysAction } from '@src/model/keys';
import { config } from '@src/model/api';
import { getAvatar } from '@src/model/utils/utilsx.js';
import { screenshot } from '@src/image';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import { isKeys } from '@src/model/utils/isKeys';
import type { ActionRecord, Player } from '@src/types';

export const regular = /^(#|＃|\/)?打劫$/;

interface PlayerWithFaQiu extends Player {
  法球倍率: number;
}

function extractFaQiu(lg: any): number | undefined {
  if (!lg || typeof lg !== 'object') {
    return undefined;
  }

  const v = lg.法球倍率;

  return typeof v === 'number' ? v : undefined;
}

const res = onResponse(selects, async e => {
  const Send = useSend(e);
  const userId = e.UserId;

  // 读取玩家 (基础校验 + 境界)
  const playerAA = await readPlayer(userId);

  if (!playerAA) {
    void Send(Text('存档不存在'));

    return false;
  }

  if (playerAA.level_id < 17) {
    void Send(Text('境界不足，暂未开放！'));

    return;
  }

  // 时间窗口校验（星阁开启时禁止）
  const nowDate = new Date();
  const cfg = await config.getConfig('xiuxian', 'xiuxian');
  const openHour = cfg?.openHour ?? 20;
  const closeHour = cfg?.closeHour ?? 22;
  const day0 = new Date(nowDate);
  const dayTs = day0.setHours(0, 0, 0, 0);
  const openTime = dayTs + openHour * 3600 * 1000;
  const closeTime = dayTs + closeHour * 3600 * 1000;
  const nowTs = nowDate.getTime();

  if (nowTs >= openTime && nowTs <= closeTime) {
    void Send(Text('这个时间由星阁阁主看管,还是不要张扬较好'));

    return false;
  }

  const lastGameTimeA = await getDataByKey(keysAction.lastGameTime(userId));

  if (lastGameTimeA && +lastGameTimeA === 0) {
    void Send(Text('猜大小正在进行哦!'));

    return false;
  }

  const [mention] = useMention(e);

  const target = await mention.findOne({ IsBot: false });

  if (target.code !== 2000 || !target?.data?.UserId) {
    void Send(Text('请@要打劫的修仙者'));

    return false;
  }

  const targetUserId = target?.data?.UserId;

  if (userId === targetUserId) {
    void Send(Text('咋的，自己弄自己啊？'));

    return false;
  }

  if (!(await existplayer(targetUserId))) {
    void Send(Text('不可对凡人出手!'));

    return false;
  }

  const levelList = await getDataList('Level1');
  const levelA = levelList.find(it => it.level_id === playerAA.level_id);

  if (!levelA) {
    void Send(Text('你的境界数据异常'));

    return false;
  }

  const nowLevelIdAA = levelA.level_id;

  const playerBB = await readPlayer(targetUserId);

  if (!playerBB?.level_id) {
    void Send(Text('对方为错误存档！'));

    return false;
  }
  if (playerBB.level_id < 17) {
    void Send(Text('对方等级过低！'));

    return;
  }

  const levelB = levelList.find(it => it.level_id === playerBB.level_id);

  if (!levelB) {
    void Send(Text('对方境界数据异常'));

    return false;
  }

  const nowLevelIdBB = levelB.level_id;

  if (nowLevelIdAA > 41 && nowLevelIdBB <= 41) {
    void Send(Text('仙人不可对凡人出手！'));

    return false;
  }

  if (nowLevelIdAA >= 12 && nowLevelIdBB < 12) {
    void Send(Text('不可欺负弱小！'));

    return false;
  }

  // 同宗门禁止
  const playerAFull = await getDataJSONParseByKey(keys.player(userId));
  const playerBFull = await getDataJSONParseByKey(keys.player(targetUserId));

  if (!playerAFull || !playerBFull) {
    void Send(Text('玩家数据异常'));

    return false;
  }

  if (playerAFull?.宗门 && playerBFull?.宗门 && isKeys(playerAFull.宗门, ['宗门名称']) && isKeys(playerBFull.宗门, ['宗门名称'])) {
    const playerAGuild = playerAFull.宗门;
    const playerBGuild = playerBFull.宗门;
    const assA = await getDataJSONParseByKey(keys.association(playerAGuild.宗门名称));
    const assB = await getDataJSONParseByKey(keys.association(playerBGuild.宗门名称));

    if (assA && assB && isKeys(assA, ['宗门名称']) && isKeys(assB, ['宗门名称'])) {
      const assAData = assA;
      const assBData = assB;

      if (assAData.宗门名称 === assBData.宗门名称) {
        void Send(Text('门派禁止内讧'));

        return false;
      }
    }
  }

  const actionA: ActionRecord | null = await getDataJSONParseByKey(keysAction.action(userId));

  if (actionA && isKeys(actionA, ['end_time'])) {
    const actionAData = actionA as ActionRecord;
    const end = Number(actionAData.end_time);

    if (!Number.isNaN(end) && Date.now() <= end) {
      const remain = end - Date.now();

      void Send(Text(`正在${actionAData.action}中,剩余时间:${formatRemaining(remain)}`));

      return false;
    }
  }

  // 被动方小游戏占用
  const lastGameTimeB = await getDataByKey(keysAction.lastGameTime(targetUserId));

  if (lastGameTimeB && +lastGameTimeB === 0) {
    void Send(Text('对方猜大小正在进行哦，等他赚够了再打劫也不迟!'));

    return false;
  }

  // 被动方忙碌标记
  let isBbusy = false;
  const bAction: ActionRecord | null = null;

  try {
    const bActionRes = await getDataJSONParseByKey(keysAction.action(targetUserId));

    if (bActionRes) {
      if (bAction && isKeys(bAction, ['end_time']) && Date.now() <= Number(bAction.end_time)) {
        isBbusy = true;
        const haveYSS = await existNajieThing(userId, '隐身水', '道具');

        if (!haveYSS) {
          const remain = Number(bAction.end_time) - Date.now();

          void Send(Text(`对方正在${bAction.action}中,剩余时间:${formatRemaining(remain)}`));

          return false;
        }
      }
    }
  } catch {
    /* ignore */
  }

  // 打劫 CD
  const lastDajieTimeRaw = await getDataByKey(keysAction.lastDajieTime(userId));
  const lastDajieTime = Number(lastDajieTimeRaw) || 0;
  const robCdMin = cfg?.CD?.rob ?? 10;
  const robTimeout = Math.floor(robCdMin * 60000);

  if (Date.now() < lastDajieTime + robTimeout) {
    const remain = lastDajieTime + robTimeout - Date.now();

    void Send(Text(`打劫正在CD中，剩余cd:${formatRemaining(remain)}`));

    return false;
  }

  const playerA = await readPlayer(userId);
  const playerB = await readPlayer(targetUserId);

  if (!playerA || !playerB) {
    void Send(Text('玩家数据异常'));

    return false;
  }

  if (playerA.修为 < 0) {
    void Send(Text('还是闭会关再打劫吧'));

    return false;
  }

  if (playerB.当前血量 < 20000) {
    void Send(Text(`${playerB.名号} 重伤未愈,就不要再打他了`));

    return false;
  }

  if (playerB.灵石 < 30002) {
    void Send(Text(`${playerB.名号} 太穷了,就不要再打他了`));

    return false;
  }

  const finalMsg: string[] = [];

  if (isBbusy) {
    finalMsg.push(`${playerB.名号}正在${bAction?.action}，${playerA.名号}利用隐身水悄然接近，但被发现。`);
    await addNajieThing(userId, '隐身水', '道具', -1);
  } else {
    finalMsg.push(`${playerA.名号}向${playerB.名号}发起了打劫。`);
  }

  await setDataByKey(keysAction.lastDajieTime(userId), String(Date.now()));

  const faA = extractFaQiu(playerA.灵根);

  if (faA !== undefined) {
    (playerA).法球倍率 = faA;
  }

  const faB = extractFaQiu(playerB.灵根);

  if (faB !== undefined) {
    (playerB).法球倍率 = faB;
  }

  playerA.当前血量 = playerA.血量上限;
  playerB.当前血量 = playerB.血量上限;

  let battle: { msg: string[]; A_xue: number; B_xue: number };

  try {
    battle = await zdBattle(playerA, playerB);
  } catch {
    void Send(Text('战斗过程出错'));

    return false;
  }

  const msgArr = Array.isArray(battle.msg) ? battle.msg : [];

  await addHP(userId, battle.A_xue);
  await addHP(targetUserId, battle.B_xue);

  const winA = `${playerA.名号}击败了${playerB.名号}`;
  const winB = `${playerB.名号}击败了${playerA.名号}`;

  const img = await screenshot('CombatResult', userId, {
    msg: finalMsg,
    playerA: {
      id: userId,
      name: playerA.名号,
      avatar: getAvatar(userId),
      power: playerA.战力,
      hp: playerA.当前血量,
      maxHp: playerA.血量上限
    },
    playerB: {
      id: targetUserId,
      name: playerB.名号,
      avatar: getAvatar(targetUserId),
      power: playerB.战力,
      hp: playerB.当前血量,
      maxHp: playerB.血量上限
    },
    result: msgArr.includes(winA) ? 'A' : msgArr.includes(winB) ? 'B' : 'draw'
  });

  if (Buffer.isBuffer(img)) {
    void Send(Image(img));
  }

  if (msgArr.includes(winA)) {
    const hasDoll = await existNajieThing(targetUserId, '替身人偶', '道具');

    if (hasDoll && playerB.魔道值 < 1 && (playerB.灵根?.type === '转生' || (playerB.level_id ?? 0) > 41)) {
      void Send(Text(`${playerB.名号}使用了道具替身人偶,躲过了此次打劫`));
      await addNajieThing(targetUserId, '替身人偶', '道具', -1);

      return false;
    }

    const mdzJL = playerB.魔道值 || 0;
    let lingshi = Math.trunc(playerB.灵石 / 5);
    const qixue = Math.trunc(100 * nowLevelIdAA);
    const mdz = Math.trunc(lingshi / 10000);

    if (lingshi >= playerB.灵石) {
      lingshi = Math.trunc(playerB.灵石 / 2);
    }

    playerA.灵石 += lingshi + mdzJL;
    playerB.灵石 -= lingshi;
    playerA.血气 += qixue;
    playerA.魔道值 = (playerA.魔道值 || 0) + mdz;
    await writePlayer(userId, playerA);
    await writePlayer(targetUserId, playerB);
    finalMsg.push(`经过一番大战,${winA},成功抢走${lingshi}灵石,${playerA.名号}获得${qixue}血气`);
  } else if (msgArr.includes(winB)) {
    const qixue = Math.trunc(100 * nowLevelIdBB);

    if (playerA.灵石 < 30002) {
      playerB.血气 += qixue;
      await writePlayer(targetUserId, playerB);

      // 关禁闭逻辑
      const actionTime2 = 60000 * 60;

      try {
        let act = await getDataJSONParseByKey(keysAction.action(userId));

        act ??= { action: '禁闭' };
        act.action = '禁闭';
        act.end_time = Date.now() + actionTime2;
        await setDataJSONStringifyByKey(keysAction.action(userId), act);
      } catch {
        /* ignore */
      }

      finalMsg.push(`经过一番大战,${playerA.名号}被${playerB.名号}击败了,${playerB.名号}获得${qixue}血气,${playerA.名号}被关禁闭60分钟`);
    } else {
      let lingshi = Math.trunc(playerA.灵石 / 4);

      if (lingshi < 0) {
        lingshi = 0;
      }

      playerA.灵石 -= lingshi;
      playerB.灵石 += lingshi;
      playerB.血气 += qixue;
      await writePlayer(userId, playerA);
      await writePlayer(targetUserId, playerB);
      finalMsg.push(`经过一番大战,${playerA.名号}被${playerB.名号}击败了,${playerB.名号}获得${qixue}血气,${playerA.名号}被劫走${lingshi}灵石`);
    }
  } else {
    void Send(Text('战斗过程出错'));

    return false;
  }

  void Send(Text(finalMsg.join('\n')));

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
