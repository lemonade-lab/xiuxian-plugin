import gameUser from '../user/index.js'
import { BotApi } from '../../api/botapi.js'
import { GameApi } from '../../../model/api/api.js'
const Sneakattack = [
  '你个老六偷袭,却连怪物的防御都破不了,被怪物一巴掌给拍死了!',
  '你找准时机,突然暴起冲向怪物,但是怪物及时反应,转眼被怪物咬死!',
  '你突然一个左勾拳,谁料怪物揭化发',
  '一拳挥出,如流云遁日般迅疾轻捷,风声呼啸,草飞沙走,看似灵巧散漫,其实就是!你被怪物打得口吐鲜血,身影急退,掉落山崖而亡',
  '拳之上凝结了庞大的气势,金色的光芒遮天蔽日,一条宛若黄金浇铸的真龙形成,浩浩荡荡地冲向怪物,但招式过于花里胡哨,怪物一个喷嚏就把你吹晕了',
  '打的山崩地裂，河水倒卷，余波万里,可恶,是幻境,什么时候!突然怪物偷袭,被一口盐汽水喷死!'
]
class gameBattle {
  /*怪物战斗*/
  monsterbattle = async ({ e, battleA, battleB, battleNameB }) => {
    const battle_msg = {
      msg: [],
      QQ: 1
    }
    const battle = {
      Z: 1
    }
    const battle_hurt = {
      hurtA: 0,
      hurtB: 0
    }
    if (battleA.speed >= battleB.speed - 5) {
      battle_hurt.hurtA =
        battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0
      if (battle_hurt.hurtA <= 1) {
        battle_msg.msg.push(Sneakattack[Math.random() * Sneakattack.length])
        battleA.nowblood = 0
        battle_msg.QQ = 0
        await gameUser.userMsgAction({
          NAME: e.user_id,
          CHOICE: 'user_battle',
          DATA: battleA
        })
        return battle_msg
      }
      const T = await this.probability(battleA.burst)
      if (T) {
        battle_hurt.hurtA += Math.floor((battle_hurt.hurtA * battleA.burstmax) / 100)
      }
      battleB.nowblood = battleB.nowblood - battle_hurt.hurtA
      if (battleB.nowblood < 1) {
        battle_msg.msg.push('你仅出一招~')
        battle_msg.msg.push(`就击败了[${battleNameB}]!`)
        return battle_msg
      } else {
        battle_msg.msg.push(`你个老六偷袭`)
        battle_msg.msg.push(`造成${battle_hurt.hurtA}伤害`)
      }
    } else {
      battle_msg.msg.push('你个老六想偷袭')
      battle_msg.msg.push(`[${battleNameB}]一个转身就躲过去了`)
    }
    while (true) {
      battle.Z++
      if (battle.Z == 30) {
        break
      }
      battle_hurt.hurtB =
        battleB.attack - battleA.defense >= 0 ? battleB.attack - battleA.defense + 1 : 0
      const F = await this.probability(battleB.burst)
      if (F) {
        battle_hurt.hurtB += Math.floor((battle_hurt.hurtB * battleB.burstmax) / 100)
      }
      battleA.nowblood = battleA.nowblood - battle_hurt.hurtB
      if (battle_hurt.hurtB > 1) {
        if (battleA.nowblood < 1) {
          battle_msg.msg.push(`经过${battle.Z}回合`)
          battle_msg.msg.push(`你被[${battleNameB}]击败了!`)
          battleA.nowblood = 0
          battle_msg.QQ = 0
          break
        }
      }
      battle_hurt.hurtA =
        battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0
      const T = await this.probability(battleA.burst)
      if (T) {
        battle_hurt.hurtA += Math.floor((battle_hurt.hurtA * battleA.burstmax) / 100)
      }
      if (battle_hurt.hurtA <= 1) {
        battle_msg.msg.push('你再次攻击')
        battle_msg.msg.push(`却连[${battleNameB}]的防御都破不了`)
        battle_msg.msg.push('就被一巴掌给拍死了!')
        battleA.nowblood = 0
        battle_msg.QQ = 0
        break
      }
      battleB.nowblood = battleB.nowblood - battle_hurt.hurtA
      if (battleB.nowblood < 1) {
        battle_msg.msg.push(`经过${battle.Z}回合`)
        battle_msg.msg.push(`你击败了[${battleNameB}]!`)
        break
      }
    }
    battle_msg.msg.push(`[血量剩余]:${battleA.nowblood}`)
    await gameUser.userMsgAction({
      NAME: e.user_id,
      CHOICE: 'user_battle',
      DATA: battleA
    })
    return battle_msg
  }

  /*战斗模型*/
  battle = async ({ e, A, B }) => {
    const battle_msg = {
      msg: [],
      QQ: 1
    }
    const battle = {
      X: 1,
      Y: 0,
      Z: 1
    }
    const battle_hurt = {
      hurtA: 0,
      hurtB: 0
    }
    const battleA = await gameUser.userMsgAction({
      NAME: A,
      CHOICE: 'user_battle'
    })
    const battleB = await gameUser.userMsgAction({
      NAME: B,
      CHOICE: 'user_battle'
    })
    battle_msg.QQ = A
    if (battleA.speed >= battleB.speed - 5) {
      battle_hurt.hurtA =
        battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0
      const T = await this.probability(battleA.burst)
      if (T) {
        battle_hurt.hurtA += Math.floor((battle_hurt.hurtA * battleA.burstmax) / 100)
      }
      if (battle_hurt.hurtA <= 1) {
        battle_msg.msg.push('你个老六想偷袭,却连对方的防御都破不了,被对方一巴掌给拍死了!')
        battleA.nowblood = 0
        battle_msg.QQ = B
        await BotApi.User.forwardMsg({ e, data: battle_msg.msg })
        await gameUser.userMsgAction({
          NAME: A,
          CHOICE: 'user_battle',
          DATA: battleA
        })
        return battle_msg.QQ
      }
      battleB.nowblood = battleB.nowblood - battle_hurt.hurtA
      if (battleB.nowblood < 1) {
        battle_msg.msg.push('你仅出一招,就击败了对方!')
        battleB.nowblood = 0
        await BotApi.User.forwardMsg({ e, data: battle_msg.msg })
        await gameUser.userMsgAction({
          NAME: B,
          CHOICE: 'user_battle',
          DATA: battleB
        })
        return battle_msg.QQ
      } else {
        battle_msg.msg.push(`你个老六偷袭成功,造成 ${battle_hurt.hurtA}伤害`)
      }
    } else {
      battle_msg.msg.push('你个老六想偷袭,对方却一个转身就躲过去了')
    }
    while (true) {
      battle.X++
      battle.Z++
      if (battle.X == 15) {
        await BotApi.User.forwardMsg(e, battle_msg.msg)
        battle_msg.msg = []
        battle.X = 0
        battle.Y++
        if (battle.Y == 2) {
          break
        }
      }
      battle_hurt.hurtB =
        battleB.attack - battleA.defense >= 0 ? battleB.attack - battleA.defense + 1 : 0
      const F = await this.probability(battleB.burst)
      if (F) {
        battle_hurt.hurtB += Math.floor((battle_hurt.hurtB * battleB.burstmax) / 100)
      }
      battleA.nowblood = battleA.nowblood - battle_hurt.hurtB
      if (battle_hurt.hurtB > 1) {
        if (battleA.nowblood < 0) {
          battle_msg.msg.push(`第${battle.Z}回合:对方造成${battle_hurt.hurtB}伤害`)
          battleA.nowblood = 0
          battle_msg.QQ = B
          await BotApi.User.forwardMsg({ e, data: battle_msg.msg })
          break
        }
      } else {
        battle_msg.msg.push(`第${battle.Z}回合:对方造成${battle_hurt.hurtB}伤害`)
      }
      battle_hurt.hurtA =
        battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0
      const T = await this.probability(battleA.burst)
      if (T) {
        battle_hurt.hurtA += Math.floor((battle_hurt.hurtA * battleA.burstmax) / 100)
      }
      if (battle_hurt.hurtA <= 1) {
        battle_msg.msg.push('你连对方的防御都破不了,被对方一巴掌给拍死了!')
        battleA.nowblood = 0
        battle_msg.QQ = B
        await BotApi.User.forwardMsg({ e, data: battle_msg.msg })
        break
      }
      battleB.nowblood = battleB.nowblood - battle_hurt.hurtA
      if (battleB.nowblood < 0) {
        battle_msg.msg.push(`第${battle.Z}回合:你造成${battle_hurt.hurtA}伤害,并击败了对方!`)
        battle_msg.msg.push('你击败了对方!')
        battleB.nowblood = 0
        await BotApi.User.forwardMsg({ e, data: battle_msg.msg })
        break
      } else {
        battle_msg.msg.push(`第${battle.Z}回合:你造成${battle_hurt.hurtA}伤害`)
      }
    }
    battle_msg.msg.push(`[血量状态]:${battleA.nowblood}`)
    await gameUser.userMsgAction({
      NAME: A,
      CHOICE: 'user_battle',
      DATA: battleA
    })
    await gameUser.userMsgAction({
      NAME: B,
      CHOICE: 'user_battle',
      DATA: battleB
    })
    return battle_msg.QQ
  }

  /*暴击率*/
  probability = async (P) => {
    if (P > 100) {
      return true
    }
    if (P > Math.floor(Math.random() * (100 - 1) + 1)) {
      return true
    }
    return false
  }
  /*雷劫伤害*/
  Thunderbolt_damage = async ({ UID }) => {
    const talent = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_talent'
    })
    let Thunderbolt = {
      T_attack: 49040,
      T_arpg: 300,
      T_arpb: 30
    }
    for (let i = 0; i < talent.length; i++) {
      if (talent[i] < 6) {
        Thunderbolt.T_arpb -= 6
      } else {
        Thunderbolt.T_arpb -= 3
      }
    }
    let n = Math.round(Math.random() * 5 + 5)
    const battle = await gameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    let T_attack = Thunderbolt.T_attack
    let T_arpg = Thunderbolt.T_arpg
    let T_arpb = Thunderbolt.T_arpb
    let defense = battle.defense
    let damage = Math.trunc((n * T_attack * 26129) / (defense - T_arpg * T_arpb))
    return damage
  }
}
export default new gameBattle()
