import { Image, Text, useMention, useSend } from 'alemonjs';
import { existplayer, keys, zdBattle } from '@src/model/index';
import { getDataJSONParseByKey } from '@src/model/DataControl';
import { getAvatar } from '@src/model/utils/utilsx.js';
import { screenshot } from '@src/image';
import { selects } from '@src/response/mw-captcha';
import mw from '@src/response/mw-captcha';
import type { Player } from '@src/types';

export const regular = /^(#|＃|\/)?以武会友$/;

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

  if (!(await existplayer(userId))) {
    void Send(Text('你还未开始修仙'));

    return false;
  }

  const [mention] = useMention(e);
  const res = await mention.findOne();
  const target = res?.data;

  if (!target || res.code !== 2000) {
    void Send(Text('请@要切磋的修仙者'));

    return false;
  }

  const targetUserId = target.UserId;

  if (userId === targetUserId) {
    void Send(Text('你还跟自己修炼上了是不是?'));

    return false;
  }

  const player = await getDataJSONParseByKey(keys.player(userId));

  if (!player) {
    void Send(Text('你的数据不存在'));

    return false;
  }

  const playerDataB = await getDataJSONParseByKey(keys.player(targetUserId));

  if (!playerDataB) {
    void Send(Text('对方数据不存在'));

    return false;
  }

  const playerA = player as Player;
  const playerB = playerDataB as Player;

  // 复制（避免副作用）
  const a = { ...playerA };
  const b = { ...playerB };

  if (a.灵根) {
    const v = extractFaQiu(a.灵根);

    if (v !== undefined) {
      a.法球倍率 = v;
    }
  }

  if (b.灵根) {
    const v = extractFaQiu(b.灵根);

    if (v !== undefined) {
      b.法球倍率 = v;
    }
  }

  a.当前血量 = a.血量上限;
  b.当前血量 = b.血量上限;

  try {
    const dataBattle = await zdBattle(a, b);

    const header = `${playerA.名号}向${playerB.名号}发起了切磋。\n`;

    const winA = `${playerA.名号}击败了${playerB.名号}`;
    const winB = `${playerB.名号}击败了${playerA.名号}`;

    const img = await screenshot('CombatResult', userId, {
      msg: [header, ...(dataBattle.msg ?? [])],
      playerA: {
        id: userId,
        name: playerA.名号,
        avatar: getAvatar(userId),
        power: (playerA as any).战力,
        hp: playerA.当前血量,
        maxHp: playerA.血量上限
      },
      playerB: {
        id: targetUserId,
        name: playerB.名号,
        avatar: getAvatar(targetUserId),
        power: (playerB as any).战力,
        hp: playerB.当前血量,
        maxHp: playerB.血量上限
      },
      result: dataBattle.msg.includes(winA) ? 'A' : dataBattle.msg.includes(winB) ? 'B' : 'draw'
    });

    if (Buffer.isBuffer(img)) {
      void Send(Image(img));
    } else {
      const result = dataBattle.msg.includes(winA) ? 'A' : dataBattle.msg.includes(winB) ? 'B' : 'draw';

      void Send(Text(header + result));
    }
  } catch (_err) {
    void Send(Text('战斗过程出现异常'));
  }

  return false;
});

export default onResponse(selects, [mw.current, res.current]);
