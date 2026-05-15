import { notUndAndNull } from './common.js';
import { readEquipment } from './equipment.js';
import * as _ from 'lodash-es';
import type { Player, Equipment } from '../types/player.js';
import type { BattleEntity, BattleResult, Skill, EquipmentSlots } from '../types/model';
import { getDataList } from './DataList.js';

/**
 * 进行自动战斗计算
 * @param AplayerA 参战玩家 A (调用方视角)
 * @param BplayerB 参战玩家 B (对手)
 */
export async function zdBattle(AplayerA: Player | BattleEntity, BplayerB: Player | BattleEntity): Promise<BattleResult> {
  // 运行时克隆并断言为 Player 的最小子集；缺失字段使用回退默认值
  const normalize = (p: Player | BattleEntity): Player => {
    return {
      名号: p.名号,
      level_id: p.level_id ?? 0,
      Physique_id: p.Physique_id ?? 0,
      修为: p.修为 ?? 0,
      灵石: p.灵石 ?? 0,
      血气: p.血气 ?? 0,
      当前血量: p.当前血量,
      血量上限: p.血量上限 ?? p.当前血量,
      攻击: p.攻击,
      防御: p.防御,
      攻击加成: p.攻击加成 ?? 0,
      防御加成: p.防御加成 ?? 0,
      生命加成: p.生命加成 ?? 0,
      暴击率: p.暴击率,
      暴击伤害: p.暴击伤害 ?? 0,
      镇妖塔层数: p.镇妖塔层数 ?? 0,
      神魄段数: p.神魄段数 ?? 0,
      favorability: p.favorability ?? 0,
      灵根: p.灵根 ?? { name: '未知', type: '普通', 法球倍率: 1 },
      仙宠: p.仙宠 ?? { name: '无', type: 'none', 加成: 0 },
      学习的功法: p.学习的功法 ?? [],
      修炼效率提升: p.修炼效率提升 ?? 0,
      宗门: p.宗门,
      islucky: p.islucky ?? 0,
      addluckyNo: p.addluckyNo ?? 0,
      幸运: p.幸运 ?? 0,
      魔道值: p.魔道值 ?? 0,
      id: p.id,
      神石: p.神石 ?? 0,
      法球倍率: Number(p.法球倍率 ?? p.灵根?.法球倍率 ?? 1) || 1
    };
  };
  let playerA: Player = normalize(BplayerB);
  let playerB: Player = normalize(AplayerA);
  let cnt = 0;
  let A_xue = 0;
  let B_xue = 0;
  let t: Player;
  const msg: string[] = [];

  const data = {
    jineng1: await getDataList('Jineng1'),
    jineng2: await getDataList('Jineng2')
  };

  const jineng1: Skill[] = data.jineng1;
  const jineng2: Skill[] = data.jineng2;
  const wuxing = ['金', '木', '土', '水', '火'] as const;
  const type: EquipmentSlots[] = ['武器', '护具', '法宝'];

  if (playerA.隐藏灵根 && typeof playerA.id === 'string') {
    let buff = 1;
    const wx: string[] = [];
    const equ = await readEquipment(playerA.id);

    for (const i of wuxing) {
      if (playerA.隐藏灵根.name.includes(i)) {
        wx.push(i);
      }
    }
    for (const i of type) {
      const item = equ?.[i];

      if (item && typeof item.id === 'number' && item.id > 0 && item.id < 6) {
        buff += kezhi(item.id, wx);
      }
    }
    playerA.攻击 = Math.trunc(playerA.攻击 * buff);
    playerA.防御 = Math.trunc(playerA.防御 * buff);
    playerA.当前血量 = Math.trunc(playerA.当前血量 * buff);
    msg.push(`${playerA.名号}与装备产生了共鸣,自身全属性提高${Math.trunc((buff - 1) * 100)}%`);
  }
  if (playerB.隐藏灵根 && typeof playerB.id === 'string') {
    let buff = 1;
    const wx: string[] = [];
    const equ = await readEquipment(playerB.id);

    for (const i of wuxing) {
      if (playerB.隐藏灵根.name.includes(i)) {
        wx.push(i);
      }
    }
    for (const i of type) {
      const item = equ?.[i];

      if (item && typeof item.id === 'number' && item.id > 0 && item.id < 6) {
        buff += kezhi(item.id, wx);
      }
    }
    playerB.攻击 = Math.trunc(playerB.攻击 * buff);
    playerB.防御 = Math.trunc(playerB.防御 * buff);
    playerB.当前血量 = Math.trunc(playerB.当前血量 * buff);
    msg.push(`${playerB.名号}与装备产生了共鸣,自身全属性提高${Math.trunc((buff - 1) * 100)}%`);
  }
  // 双方初始魔道/神石处理复用原逻辑
  const preBuffCheck = (P: Player) => {
    if ((P.魔道值 ?? 0) > 999) {
      let buff = Math.trunc(P.魔道值 / 1000) / 100 + 1;

      if (buff > 1.3) {
        buff = 1.3;
      }
      if (P.灵根.name === '九重魔功') {
        buff += 0.2;
      }
      msg.push(`魔道值为${P.名号}提供了${Math.trunc((buff - 1) * 100)}%的增伤`);
    } else if ((P.魔道值 ?? 0) < 1 && (P.灵根.type === '转生' || P.level_id > 41)) {
      let buff = (P.神石 ?? 0) * 0.0015;

      if (buff > 0.3) {
        buff = 0.3;
      }
      if (P.灵根.name === '九转轮回体') {
        buff += 0.2;
      }
      msg.push(`神石为${P.名号}提供了${Math.trunc(buff * 100)}%的减伤`);
    }
  };

  preBuffCheck(playerA);
  preBuffCheck(playerB);

  while (playerA.当前血量 > 0 && playerB.当前血量 > 0) {
    const cnt2 = Math.trunc(cnt / 2);
    const Random = Math.random();
    const random = Math.random();
    let buff = 1;

    t = playerA;
    playerA = playerB;
    playerB = t;
    let baoji = baojishanghai(playerA.暴击率);

    if (notUndAndNull(playerA.仙宠)) {
      if (playerA.仙宠.type === '暴伤') {
        baoji += playerA.仙宠.加成;
      } else if (playerA.仙宠.type === '战斗') {
        const ran = Math.random();

        if (ran < 0.35) {
          playerA.攻击 += Math.trunc(playerA.攻击 * playerA.仙宠.加成);
          playerA.防御 += Math.trunc(playerA.防御 * playerA.仙宠.加成);
          msg.push(`仙宠【${playerA.仙宠.name}】辅佐了[${playerA.名号}]，使其伤害增加了[${Math.trunc(playerA.仙宠.加成 * 100)}%]`);
        }
      }
    }
    if (typeof playerA.id === 'string') {
      const equipment = await readEquipment(playerA.id);
      const ran = Math.random();

      if (equipment?.武器?.name === '紫云剑' && ran > 0.7) {
        playerA.攻击 *= 3;
        msg.push(`${playerA.名号}触发了紫云剑被动,攻击力提高了200%`);
      } else if (equipment?.武器?.name === '炼血竹枪' && ran > 0.75) {
        playerA.攻击 *= 2;
        playerA.当前血量 = Math.trunc(playerA.当前血量 * 1.2);
        msg.push(`${playerA.名号}触发了炼血竹枪被动,攻击力提高了100%,血量回复了20%`);
      } else if (equipment?.武器?.name === '少阴玉剑' && ran > 0.85) {
        playerA.当前血量 = Math.trunc(playerA.当前血量 * 1.4);
        msg.push(`${playerA.名号}触发了少阴玉剑被动,血量回复了40%`);
      }
    }
    let 伤害 = Harm(playerA.攻击 * 0.85, playerB.防御);
    const 法球伤害 = Math.trunc(playerA.攻击 * (playerA.法球倍率 ?? 1));

    伤害 = Math.trunc(baoji * 伤害 + 法球伤害 + playerA.防御 * 0.1);
    let count = 0;

    for (let i = 0; i < jineng1.length; i++) {
      if (
        (jineng1[i].class === '常驻' && (cnt2 === jineng1[i].cnt || jineng1[i].cnt === -1) && Random < jineng1[i].pr)
        || (playerA.学习的功法
          && jineng1[i].class === '功法'
          && playerA.学习的功法.indexOf(jineng1[i].name) > -1
          && (cnt2 === jineng1[i].cnt || jineng1[i].cnt === -1)
          && Random < jineng1[i].pr)
        || (playerA.灵根
          && jineng1[i].class === '灵根'
          && playerA.灵根.name === jineng1[i].name
          && (cnt2 === jineng1[i].cnt || jineng1[i].cnt === -1)
          && Random < jineng1[i].pr)
      ) {
        msg.push(jineng1[i].msg2 === '' ? playerA.名号 + jineng1[i].msg1 : playerA.名号 + jineng1[i].msg1 + playerB.名号 + jineng1[i].msg2);
        伤害 = 伤害 * jineng1[i].beilv + jineng1[i].other;
        count++;
      }
      if (count === 3) {
        break;
      }
    }
    for (let i = 0; i < jineng2.length; i++) {
      if (
        (playerB.学习的功法
          && jineng2[i].class === '功法'
          && playerB.学习的功法.indexOf(jineng2[i].name) > -1
          && (cnt2 === jineng2[i].cnt || jineng2[i].cnt === -1)
          && random < jineng2[i].pr)
        || (playerB.灵根
          && jineng2[i].class === '灵根'
          && playerB.灵根.name === jineng2[i].name
          && (cnt2 === jineng2[i].cnt || jineng2[i].cnt === -1)
          && random < jineng2[i].pr)
      ) {
        msg.push(jineng2[i].msg2 === '' ? playerB.名号 + jineng2[i].msg1 : playerB.名号 + jineng2[i].msg1 + playerA.名号 + jineng2[i].msg2);
        伤害 = 伤害 * jineng2[i].beilv + jineng2[i].other;
      }
    }
    if ((playerA.魔道值 ?? 0) > 999) {
      buff += Math.trunc((playerA.魔道值 ?? 0) / 1000) / 100;
      if (buff > 1.3) {
        buff = 1.3;
      }
      if (playerA.灵根.name === '九重魔功') {
        buff += 0.2;
      }
    }
    if ((playerB.魔道值 ?? 0) < 1 && (playerB.灵根.type === '转生' || playerB.level_id > 41)) {
      let buff2 = (playerB.神石 ?? 0) * 0.0015;

      if (buff2 > 0.3) {
        buff2 = 0.3;
      }
      if (playerB.灵根.name === '九转轮回体') {
        buff2 += 0.2;
      }
      buff -= buff2;
    }
    伤害 = Math.trunc(伤害 * buff);
    playerB.当前血量 -= 伤害;
    if (playerB.当前血量 < 0) {
      playerB.当前血量 = 0;
    }
    if (cnt % 2 === 0) {
      playerA.防御 = AplayerA.防御;
      playerA.攻击 = AplayerA.攻击;
    } else {
      playerA.攻击 = BplayerB.攻击;
      playerA.防御 = BplayerB.防御;
    }
    msg.push(
      `第${cnt2 + 1}回合：\n  ${playerA.名号}攻击了${playerB.名号}，${ifbaoji(baoji)}造成伤害${伤害 > 100000 ? (伤害 / 10000).toFixed(1) + '万' : 伤害}，${playerB.名号}剩余血量${(playerB.当前血量 / playerB.血量上限).toFixed(0)}%`
    );
    cnt++;
  }
  if (cnt % 2 === 0) {
    t = playerA;
    playerA = playerB;
    playerB = t;
  }
  if (playerA.当前血量 <= 0) {
    AplayerA.当前血量 = 0;
    msg.push(`${BplayerB.名号}击败了${AplayerA.名号}`);
    B_xue = playerB.当前血量 - BplayerB.当前血量;
    A_xue = -AplayerA.当前血量;
  } else if (playerB.当前血量 <= 0) {
    BplayerB.当前血量 = 0;
    msg.push(`${AplayerA.名号}击败了${BplayerB.名号}`);
    B_xue = -BplayerB.当前血量;
    A_xue = playerA.当前血量 - AplayerA.当前血量;
  }

  return { msg, A_xue, B_xue };
}
export function baojishanghai(baojilv: number): number {
  if (baojilv > 1) {
    baojilv = 1;
  }
  const rand = Math.random();
  let bl = 1;

  if (rand < baojilv) {
    bl = baojilv + 1.5;
  }

  return bl;
}
export function Harm(atk: number, def: number): number {
  let x: number;
  const s = atk / def;
  const rand = Math.trunc(Math.random() * 11) / 100 + 0.95;

  if (s < 1) {
    x = 0.1;
  } else if (s > 2.5) {
    x = 1;
  } else {
    x = 0.6 * s - 0.5;
  }
  x = Math.trunc(x * atk * rand);

  return x;
}
export function kezhi(equ: number, wx: readonly string[]): number {
  const wuxing = ['金', '木', '土', '水', '火', '金'] as const;
  const equ_wx = wuxing[equ - 1];

  for (const j of wx) {
    if (j === equ_wx) {
      return 0.04;
    }
  }
  for (const j of wx) {
    for (let i = 0; i < wuxing.length - 1; i++) {
      if (wuxing[i] === equ_wx && wuxing[i + 1] === j) {
        return -0.02;
      }
    }
  }

  return 0;
}
export function ifbaoji(baoji: number): string {
  return baoji === 1 ? '' : '触发暴击，';
}

export default { zdBattle, baojishanghai, Harm, kezhi, ifbaoji };
