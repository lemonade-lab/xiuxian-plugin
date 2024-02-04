import {
  existplayer,
  ifbaoji,
  Harm,
  data,
  ForwardMsg
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class tzzyt extends plugin {
  constructor() {
    super({
      name: 'Yunzai_Bot_修仙_ZYT',
      dsc: '镇妖塔',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: /^(#|\/)挑战镇妖塔$/,
          fnc: 'WorldBossBattle'
        },
        {
          reg: /^(#|\/)一键挑战镇妖塔$/,
          fnc: 'all_WorldBossBattle'
        }
      ]
    })
  }

  //与未知妖物战斗
  async WorldBossBattle(e) {
    let user_id = e.user_id
    let ifexistplay = await existplayer(user_id)
    if (!ifexistplay) return false
    let player = await data.getData('player', user_id)
    const equipment = data.getData('equipment', user_id)
    const type = ['weapon', 'protective_clothing', 'magic_weapon']
    for (let j of type) {
      if (
        equipment[j].atk < 10 &&
        equipment[j].def < 10 &&
        equipment[j].HP < 10
      ) {
        e.reply('请更换其他固定数值装备爬塔')
        return false
      }
    }
    if (player.镇妖塔层数 > 6000) {
      e.reply('已达到上限')
      return false
    }
    let ZYTcs = player.镇妖塔层数
    let Health = 0
    let Attack = 0
    let Defence = 0
    let Reward = 0
    Health = 50000 * ZYTcs + 10000
    Attack = 22000 * ZYTcs + 10000
    Defence = 36000 * ZYTcs + 10000
    if (ZYTcs < 100) {
      Reward = 260 * ZYTcs + 100
    } else if (ZYTcs >= 100 && ZYTcs < 200) {
      Reward = 360 * ZYTcs + 1000
    } else if (ZYTcs >= 200) {
      Reward = 700 * ZYTcs + 1000
    }
    if (Reward > 400000) Reward = 400000
    let bosszt = {
      Health: Health,
      OriginHealth: Health,
      isAngry: 0,
      isWeak: 0,
      Attack: Attack,
      Defence: Defence,
      KilledTime: -1,
      Reward: Reward
    }
    let Time = 2
    let now_Time = new Date().getTime() //获取当前时间戳
    let shuangxiuTimeout = 60000 * Time
    let last_time = Number(await redis.get('xiuxian@1.4.0:' + user_id + 'CD')) //获得上次the时间戳,
    if (now_Time < last_time + shuangxiuTimeout) {
      let Couple_m = Math.trunc(
        (last_time + shuangxiuTimeout - now_Time) / 60 / 1000
      )
      let Couple_s = Math.trunc(
        ((last_time + shuangxiuTimeout - now_Time) % 60000) / 1000
      )
      e.reply('正在CD中，' + `剩余cd:  ${Couple_m}分 ${Couple_s}秒`)
      return false
    }
    let BattleFrame = 0
    let TotalDamage = 0
    let msg = []
    let BOSSCurrentAttack = bosszt.isAngry
      ? Math.trunc(bosszt.Attack * 1.8)
      : bosszt.isWeak
      ? Math.trunc(bosszt.Attack * 0.7)
      : bosszt.Attack
    let BOSSCurrentDefence = bosszt.isWeak
      ? Math.trunc(bosszt.Defence * 0.7)
      : bosszt.Defence
    while (player.now_bool > 0 && bosszt.Health > 0) {
      let Random = Math.random()
      if (!(BattleFrame & 1)) {
        let Player_To_BOSS_Damage =
          Harm(player.攻击, BOSSCurrentDefence) +
          Math.trunc(player.攻击 * player.talent.法球倍率)
        let SuperAttack = Math.random() < player.暴击率 ? 1.5 : 1
        msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`)
        if (Random > 0.5 && BattleFrame == 0) {
          msg.push('你the进攻被反手了！')
          Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 0.3)
        } else if (Random > 0.94) {
          msg.push('你the攻击被破解了')
          Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 6)
        } else if (Random > 0.9) {
          msg.push('你the攻击被挡了一部分')
          Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 0.8)
        } else if (Random < 0.1) {
          msg.push('你抓到了未知妖物the破绽')
          Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 1.2)
        }
        Player_To_BOSS_Damage = Math.trunc(
          Player_To_BOSS_Damage * SuperAttack + Math.random() * 100
        )
        bosszt.Health -= Player_To_BOSS_Damage
        TotalDamage += Player_To_BOSS_Damage
        if (bosszt.Health < 0) {
          bosszt.Health = 0
        }
        msg.push(
          `${player.name}${ifbaoji(
            SuperAttack
          )}造成伤害${Player_To_BOSS_Damage}，未知妖物剩余血量${bosszt.Health}`
        )
      } else {
        let BOSS_To_Player_Damage = Harm(
          BOSSCurrentAttack,
          Math.trunc(player.防御 * 0.1)
        )
        if (Random > 0.94) {
          msg.push('未知妖物the攻击被你破解了')
          BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 0.6)
        } else if (Random > 0.9) {
          msg.push('未知妖物the攻击被你挡了一部分')
          BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 0.8)
        } else if (Random < 0.1) {
          msg.push('未知妖物抓到了你the破绽')
          BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 1.2)
        }
        player.now_bool -= BOSS_To_Player_Damage
        bosszt.isAngry ? --bosszt.isAngry : 0
        bosszt.isWeak ? --bosszt.isWeak : 0
        if (!bosszt.isAngry && BOSSCurrentAttack > bosszt.Attack)
          BOSSCurrentAttack = bosszt.Attack
        if (!bosszt.isWeak && BOSSCurrentDefence < bosszt.Defence)
          BOSSCurrentDefence = bosszt.Defence
        if (player.now_bool < 0) {
          player.now_bool = 0
        }
        msg.push(
          `未知妖物攻击了${player.name}，造成伤害${BOSS_To_Player_Damage}，${player.name}剩余血量${player.now_bool}`
        )
      }
      BattleFrame++
    }
    if (msg.length <= 30) await ForwardMsg(e, msg)
    else {
      msg.length = 30
      await ForwardMsg(e, msg)
      e.reply('战斗过长，仅展示部分内容')
    }
    await redis.set('xiuxian@1.4.0:' + user_id + 'CD', now_Time)
    if (bosszt.Health <= 0) {
      player.镇妖塔层数 += 5
      player.money += Reward
      player.now_bool += Reward * 21
      e.reply([
        segment.at(user_id),
        `\n恭喜通过此层镇妖塔，层数+5！增加money${Reward}回复血量${Reward * 21}`
      ])
      data.setData('player', user_id, player)
    }
    if (player.now_bool <= 0) {
      player.now_bool = 0
      player.money -= Math.trunc(Reward * 2)
      e.reply([
        segment.at(user_id),
        `\n你未能通过此层镇妖塔！money-${Math.trunc(Reward * 2)}`
      ])
      data.setData('player', user_id, player)
    }
    return false
  }

  async all_WorldBossBattle(e) {
    let user_id = e.user_id
    let ifexistplay = await existplayer(user_id)
    if (!ifexistplay) return false
    let player = await data.getData('player', user_id)
    const equipment = await data.getData('equipment', user_id)
    const type = ['weapon', 'protective_clothing', 'magic_weapon']
    for (let j of type) {
      if (
        equipment[j].atk < 10 &&
        equipment[j].def < 10 &&
        equipment[j].HP < 10
      ) {
        e.reply('请更换其他固定数值装备爬塔')
        return false
      }
    }
    let lingshi = 0
    let cengshu = 0
    while (player.now_bool > 0) {
      let ZYTcs = player.镇妖塔层数
      let Health = 0
      let Attack = 0
      let Defence = 0
      let Reward = 0
      Health = 50000 * ZYTcs + 10000
      Attack = 22000 * ZYTcs + 10000
      Defence = 36000 * ZYTcs + 10000
      if (ZYTcs < 100) {
        Reward = 260 * ZYTcs + 100
      } else if (ZYTcs >= 100 && ZYTcs < 200) {
        Reward = 360 * ZYTcs + 1000
      } else if (ZYTcs >= 200) {
        Reward = 700 * ZYTcs + 1000
      }
      if (Reward > 400000) Reward = 400000
      if (player.镇妖塔层数 > 6000) Reward = 0
      let bosszt = {
        Health: Health,
        OriginHealth: Health,
        isAngry: 0,
        isWeak: 0,
        Attack: Attack,
        Defence: Defence,
        KilledTime: -1,
        Reward: Reward
      }
      let BattleFrame = 0
      let msg = []
      let TotalDamage = 0
      let BOSSCurrentAttack = bosszt.isAngry
        ? Math.trunc(bosszt.Attack * 1.8)
        : bosszt.isWeak
        ? Math.trunc(bosszt.Attack * 0.7)
        : bosszt.Attack
      let BOSSCurrentDefence = bosszt.isWeak
        ? Math.trunc(bosszt.Defence * 0.7)
        : bosszt.Defence
      while (player.now_bool > 0 && bosszt.Health > 0) {
        let Random = Math.random()
        if (!(BattleFrame & 1)) {
          let Player_To_BOSS_Damage =
            Harm(player.攻击, BOSSCurrentDefence) +
            Math.trunc(player.攻击 * player.talent.法球倍率)
          let SuperAttack = Math.random() < player.暴击率 ? 1.5 : 1
          msg.push(`第${Math.trunc(BattleFrame / 2) + 1}回合：`)
          if (Random > 0.5 && BattleFrame == 0) {
            msg.push('你the进攻被反手了！')
            Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 0.3)
          } else if (Random > 0.94) {
            msg.push('你the攻击被破解了')
            Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 6)
          } else if (Random > 0.9) {
            msg.push('你the攻击被挡了一部分')
            Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 0.8)
          } else if (Random < 0.1) {
            msg.push('你抓到了未知妖物the破绽')
            Player_To_BOSS_Damage = Math.trunc(Player_To_BOSS_Damage * 1.2)
          }
          Player_To_BOSS_Damage = Math.trunc(
            Player_To_BOSS_Damage * SuperAttack + Math.random() * 100
          )
          bosszt.Health -= Player_To_BOSS_Damage
          TotalDamage += Player_To_BOSS_Damage
          if (bosszt.Health < 0) {
            bosszt.Health = 0
          }
          msg.push(
            `${player.name}${ifbaoji(
              SuperAttack
            )}造成伤害${Player_To_BOSS_Damage}，未知妖物剩余血量${
              bosszt.Health
            }`
          )
        } else {
          let BOSS_To_Player_Damage = Harm(
            BOSSCurrentAttack,
            Math.trunc(player.防御 * 0.1)
          )
          if (Random > 0.94) {
            msg.push('未知妖物the攻击被你破解了')
            BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 0.6)
          } else if (Random > 0.9) {
            msg.push('未知妖物the攻击被你挡了一部分')
            BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 0.8)
          } else if (Random < 0.1) {
            msg.push('未知妖物抓到了你the破绽')
            BOSS_To_Player_Damage = Math.trunc(BOSS_To_Player_Damage * 1.2)
          }
          player.now_bool -= BOSS_To_Player_Damage
          bosszt.isAngry ? --bosszt.isAngry : 0
          bosszt.isWeak ? --bosszt.isWeak : 0
          if (!bosszt.isAngry && BOSSCurrentAttack > bosszt.Attack)
            BOSSCurrentAttack = bosszt.Attack
          if (!bosszt.isWeak && BOSSCurrentDefence < bosszt.Defence)
            BOSSCurrentDefence = bosszt.Defence
          if (player.now_bool < 0) {
            player.now_bool = 0
          }
          msg.push(
            `未知妖物攻击了${player.name}，造成伤害${BOSS_To_Player_Damage}，${player.name}剩余血量${player.now_bool}`
          )
        }
        BattleFrame++
      }
      if (bosszt.Health <= 0) {
        player.镇妖塔层数 += 5
        cengshu += 5
        lingshi += Reward
        if (Reward > 0) player.money -= 20000
        player.now_bool = player.血量上限
      } else if (player.now_bool <= 0) {
        player.now_bool = 0
        player.money -= Math.trunc(Reward * 2)
      }
    }
    player.money += lingshi
    e.reply([
      segment.at(user_id),
      `\n恭喜你获得money${lingshi},本次通过${cengshu}层,失去部分money`
    ])
    data.setData('player', user_id, player)
    return false
  }
}
