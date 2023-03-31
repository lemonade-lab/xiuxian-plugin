import plugin from '../../../../lib/plugins/plugin.js';
import { segment } from 'oicq';
import data from '../../model/XiuxianData.js';
import { existplayer, ifbaoji, Harm } from '../../model/xiuxian.js';

//本模块由(qq:1695037643)和jio佬完成
export class DSC extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: 'Yunzai_Bot_修仙_BOSS',
      /** 功能描述 */
      dsc: 'BOSS模块',
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 600,
      rule: [
        {
          reg: '^#炼神魄$',
          fnc: 'WorldBossBattle',
        },
        {
          reg: '^#一键炼神魄$',
          fnc: 'all_WorldBossBattle',
        },
      ],
    });
  }

  //与未知妖物战斗
  async WorldBossBattle(e) {
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let player = await data.getData('player', usr_qq);
    if (player.神魄段数 > 6000) {
      e.reply('已达到上限');
      return;
    }
    let 神魄段数 = player.神魄段数;
    //人数的万倍
    let Health = 100000 * 神魄段数;
    //攻击
    let Attack = 100000 * 神魄段数;
    //防御
    let Defence = 15000 * 神魄段数;
    //奖励下降
    let Reward = 1200 * 神魄段数;
    if (Reward > 400000) Reward = 400000;
    let bosszt = {
      Health: Health,
      OriginHealth: Health,
      isAngry: 0,
      isWeak: 0,
      Attack: Attack,
      Defence: Defence,
      KilledTime: -1,
      Reward: Reward,
    };
    var Time = 2;
    let now_Time = new Date().getTime(); //获取当前时间戳
    let shuangxiuTimeout = parseInt(60000 * Time);
    let last_time = await redis.get('xiuxian:player:' + usr_qq + 'CD'); //获得上次的时间戳,
    last_time = parseInt(last_time);
    if (now_Time < last_time + shuangxiuTimeout) {
      let Couple_m = Math.trunc(
        (last_time + shuangxiuTimeout - now_Time) / 60 / 1000
      );
      let Couple_s = Math.trunc(
        ((last_time + shuangxiuTimeout - now_Time) % 60000) / 1000
      );
      e.reply('正在CD中，' + `剩余cd:  ${Couple_m}分 ${Couple_s}秒`);
      return;
    }
    let BattleFrame = 0;
    let TotalDamage = 0;
    let msg = [];
    let BOSSCurrentAttack = bosszt.isAngry
      ? Math.trunc(bosszt.Attack * 1.8)
      : bosszt.isWeak
      ? Math.trunc(bosszt.Attack * 0.7)
      : bosszt.Attack;
    let BOSSCurrentDefence = bosszt.isWeak
      ? Math.trunc(bosszt.Defence * 0.7)
      : bosszt.Defence;
    while (player.当前血量 > 0 && bosszt.Health > 0) {
      if (!(BattleFrame & 1)) {
        let Player_To_BOSS_Damage =
          Harm(player.攻击, BOSSCurrentDefence) +
          Math.trunc(player.攻击 * player.灵根.法球倍率);
        let SuperAttack = 2 < player.暴击率 ? 1.5 : 1;
        msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`);
        if (BattleFrame == 0) {
          msg.push('你进入锻神池，开始了！');
          Player_To_BOSS_Damage = 0;
        }
        Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * SuperAttack);
        bosszt.Health -= Player_To_BOSS_Damage;
        TotalDamage += Player_To_BOSS_Damage;
        if (bosszt.Health < 0) {
          bosszt.Health = 0;
        }
        msg.push(
          `${player.名号}${ifbaoji(
            SuperAttack
          )}消耗了${Player_To_BOSS_Damage}，此段剩余${bosszt.Health}未炼化`
        );
      } else {
        let BOSS_To_Player_Damage = Harm(
          BOSSCurrentAttack,
          Math.trunc(player.防御 * 0.1)
        );
        player.当前血量 -= BOSS_To_Player_Damage;
        bosszt.isAngry ? --bosszt.isAngry : 0;
        bosszt.isWeak ? --bosszt.isWeak : 0;
        if (!bosszt.isAngry && BOSSCurrentAttack > bosszt.Attack)
          BOSSCurrentAttack = bosszt.Attack;
        if (!bosszt.isWeak && BOSSCurrentDefence < bosszt.Defence)
          BOSSCurrentDefence = bosszt.Defence;
        if (player.当前血量 < 0) {
          player.当前血量 = 0;
        }
        msg.push(
          `${player.名号}损失血量${BOSS_To_Player_Damage}，${player.名号}剩余血量${player.当前血量}`
        );
      }
      BattleFrame++;
    }
    if (msg.length <= 30) await ForwardMsg(e, msg);
    else {
      msg.length = 30;
      await ForwardMsg(e, msg);
      e.reply('战斗过长，仅展示部分内容');
    }
    await redis.set('xiuxian:player:' + usr_qq + 'CD', now_Time);
    if (bosszt.Health <= 0) {
      player.神魄段数 += 5;
      player.血气 += Reward;
      player.当前血量 = player.血量上限;
      e.reply([
        segment.at(usr_qq),
        `\n你成功突破一段神魄，段数+5！血气增加${Reward} 血量补偿满血！`,
      ]);
      data.setData('player', usr_qq, player);
    }
    if (player.当前血量 <= 0) {
      player.当前血量 = 0;
      player.修为 -= Math.trunc(Reward * 2);
      e.reply([
        segment.at(usr_qq),
        `\n你未能通过此层锻神池！修为-${Math.trunc(Reward * 2)}`,
      ]);
      data.setData('player', usr_qq, player);
    }
    return true;
  }

  //与未知妖物战斗
  async all_WorldBossBattle(e) {
    //不开放私聊功能
    if (!e.isGroup) {
      return;
    }
    let usr_qq = e.user_id;
    let xueqi = 0;
    let cengshu = 0;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let player = await data.getData('player', usr_qq);
    while (player.当前血量 > 0) {
      let 神魄段数 = player.神魄段数;
      //人数的万倍
      let Health = 100000 * 神魄段数;
      //攻击
      let Attack = 100000 * 神魄段数;
      //防御
      let Defence = 15000 * 神魄段数;
      //奖励下降
      let Reward = 1200 * 神魄段数;
      if (Reward > 400000) Reward = 400000;
      if (player.神魄段数 > 6000) Reward = 0;
      let bosszt = {
        Health: Health,
        OriginHealth: Health,
        isAngry: 0,
        isWeak: 0,
        Attack: Attack,
        Defence: Defence,
        KilledTime: -1,
        Reward: Reward,
      };
      let BattleFrame = 0;
      let TotalDamage = 0;
      let msg = [];
      let BOSSCurrentAttack = bosszt.isAngry
        ? Math.trunc(bosszt.Attack * 1.8)
        : bosszt.isWeak
        ? Math.trunc(bosszt.Attack * 0.7)
        : bosszt.Attack;
      let BOSSCurrentDefence = bosszt.isWeak
        ? Math.trunc(bosszt.Defence * 0.7)
        : bosszt.Defence;
      while (player.当前血量 > 0 && bosszt.Health > 0) {
        if (!(BattleFrame & 1)) {
          let Player_To_BOSS_Damage =
            Harm(player.攻击, BOSSCurrentDefence) +
            Math.trunc(player.攻击 * player.灵根.法球倍率);
          let SuperAttack = 2 < player.暴击率 ? 1.5 : 1;
          msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`);
          if (BattleFrame == 0) {
            msg.push('你进入锻神池，开始了！');
            Player_To_BOSS_Damage = 0;
          }
          Player_To_BOSS_Damage = Math.trunc(
            Player_To_BOSS_Damage * SuperAttack
          );
          bosszt.Health -= Player_To_BOSS_Damage;
          TotalDamage += Player_To_BOSS_Damage;
          if (bosszt.Health < 0) {
            bosszt.Health = 0;
          }
          msg.push(
            `${player.名号}${ifbaoji(
              SuperAttack
            )}消耗了${Player_To_BOSS_Damage}，此段剩余${bosszt.Health}未炼化`
          );
        } else {
          let BOSS_To_Player_Damage = Harm(
            BOSSCurrentAttack,
            Math.trunc(player.防御 * 0.1)
          );
          player.当前血量 -= BOSS_To_Player_Damage;
          bosszt.isAngry ? --bosszt.isAngry : 0;
          bosszt.isWeak ? --bosszt.isWeak : 0;
          if (!bosszt.isAngry && BOSSCurrentAttack > bosszt.Attack)
            BOSSCurrentAttack = bosszt.Attack;
          if (!bosszt.isWeak && BOSSCurrentDefence < bosszt.Defence)
            BOSSCurrentDefence = bosszt.Defence;
          if (player.当前血量 < 0) {
            player.当前血量 = 0;
          }
          msg.push(
            `${player.名号}损失血量${BOSS_To_Player_Damage}，${player.名号}剩余血量${player.当前血量}`
          );
        }
        BattleFrame++;
      }
      if (bosszt.Health <= 0) {
        player.神魄段数 += 5;
        cengshu += 5;
        xueqi += Reward;
        player.当前血量 = player.血量上限;
      } else if (player.当前血量 <= 0) {
        player.当前血量 = 0;
        player.修为 -= Math.trunc(Reward * 2);
      }
    }
    player.血气 += xueqi;
    e.reply([
      segment.at(usr_qq),
      `\n恭喜你获得血气${xueqi},本次通过${cengshu}层,失去部分修为`,
    ]);
    data.setData('player', usr_qq, player);
    return;
  }
}

//发送转发消息
//输入data一个数组,元素是字符串,每一个元素都是一条消息.
async function ForwardMsg(e, data) {
  //Bot.logger.mark(data);
  let msgList = [];
  for (let i of data) {
    msgList.push({
      message: i,
      nickname: Bot.nickname,
      user_id: Bot.uin,
    });
  }
  if (msgList.length == 1) {
    await e.reply(msgList[0].message);
  } else {
    //console.log(msgList);
    await e.reply(await Bot.makeForwardMsg(msgList));
  }
  return;
}
