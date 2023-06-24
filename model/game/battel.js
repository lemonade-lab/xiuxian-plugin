import { BotApi } from '../api/botapi.js'
import Data from './data/index.js'
class Battle {
  constructor() {
    /** 文案模板 */
    this.Sneakattack = [
      '你个老六偷袭,却连怪物的防御都破不了,被怪物一巴掌给拍死了!',
      '你找准时机,突然暴起冲向怪物,但是怪物及时反应,转眼被怪物咬死!',
      '你突然一个左勾拳,谁料怪物揭化发',
      '一拳挥出,如流云遁日般迅疾轻捷,风声呼啸,草飞沙走,看似灵巧散漫,其实就是!你被怪物打得口吐鲜血,身影急退,掉落山崖而亡',
      '拳之上凝结了庞大的气势,金色的光芒遮天蔽日,一条宛若黄金浇铸的真龙形成,浩浩荡荡地冲向怪物,但招式过于花里胡哨,怪物一个喷嚏就把你吹晕了',
      '打的山崩地裂，河水倒卷，余波万里,可恶,是幻境,什么时候!突然怪物偷袭,被一口盐汽水喷死!'
    ]

    /** 消息模板 */
    this.battleMsg = {
      msg: [],
      UID: 1
    }

    this.battleHurt = {
      hurtA: 0,
      hurtB: 0
    }
  }

  /* 暴击率 */
  probability(P) {
    if (P > 100) {
      return true
    }
    if (P > Math.random() * (100 - 1) + 1) {
      return true
    }
    return false
  }

  /* 怪物战斗 */
  monsterbattle(e, battleA, battleB, battleNameB) {
    const battleMsg = this.battleMs
    const battleHurt = this.battleHurt
    const battle = {
      Z: 1
    }
    // 敏捷判断
    if (battleA.speed >= battleB.speed - 5) {
      battleHurt.hurtA =
        battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0
      if (battleHurt.hurtA <= 1) {
        battleMsg.msg.push(this.Sneakattack[Math.random() * this.Sneakattack.length])
        battleA.nowblood = 0
        battleMsg.UID = 0
        Data.controlAction({
          NAME: e.user_id,
          CHOICE: 'playerBattle',
          DATA: battleA
        })
        return battleMsg
      }
      const T = this.probability(battleA.burst)
      if (T) {
        battleHurt.hurtA += Math.floor((battleHurt.hurtA * battleA.burstmax) / 100)
      }
      battleB.nowblood = battleB.nowblood - battleHurt.hurtA
      if (battleB.nowblood < 1) {
        battleMsg.msg.push('你仅出一招~')
        battleMsg.msg.push(`就击败了[${battleNameB}]!`)
        return battleMsg
      } else {
        battleMsg.msg.push(`你个老六偷袭`)
        battleMsg.msg.push(`造成${battleHurt.hurtA}伤害`)
      }
    } else {
      battleMsg.msg.push('你个老六想偷袭')
      battleMsg.msg.push(`[${battleNameB}]一个转身就躲过去了`)
    }
    while (true) {
      battle.Z++
      if (battle.Z == 30) {
        break
      }
      battleHurt.hurtB =
        battleB.attack - battleA.defense >= 0 ? battleB.attack - battleA.defense + 1 : 0
      const F = this.probability(battleB.burst)
      if (F) {
        battleHurt.hurtB += Math.floor((battleHurt.hurtB * battleB.burstmax) / 100)
      }
      battleA.nowblood = battleA.nowblood - battleHurt.hurtB
      if (battleHurt.hurtB > 1) {
        if (battleA.nowblood < 1) {
          battleMsg.msg.push(`经过${battle.Z}回合`)
          battleMsg.msg.push(`你被[${battleNameB}]击败了!`)
          battleA.nowblood = 0
          battleMsg.UID = 0
          break
        }
      }
      battleHurt.hurtA =
        battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0
      const T = this.probability(battleA.burst)
      if (T) {
        battleHurt.hurtA += Math.floor((battleHurt.hurtA * battleA.burstmax) / 100)
      }
      if (battleHurt.hurtA <= 1) {
        battleMsg.msg.push('你再次攻击')
        battleMsg.msg.push(`却连[${battleNameB}]的防御都破不了`)
        battleMsg.msg.push('就被一巴掌给拍死了!')
        battleA.nowblood = 0
        battleMsg.UID = 0
        break
      }
      battleB.nowblood = battleB.nowblood - battleHurt.hurtA
      if (battleB.nowblood < 1) {
        battleMsg.msg.push(`经过${battle.Z}回合`)
        battleMsg.msg.push(`你击败了[${battleNameB}]!`)
        break
      }
    }
    battleMsg.msg.push(`[血量剩余]:${battleA.nowblood}`)
    Data.controlAction({
      NAME: e.user_id,
      CHOICE: 'playerBattle',
      DATA: battleA
    })
    return battleMsg
  }

  /* 战斗模型 */
  battle(e, A, B) {
    const battleMsg = this.battleMs
    const battleHurt = this.battleHurt
    const battle = {
      X: 1,
      Y: 0,
      Z: 1
    }
    const battleA = Data.controlAction({
      NAME: A,
      CHOICE: 'playerBattle'
    })
    const battleB = Data.controlAction({
      NAME: B,
      CHOICE: 'playerBattle'
    })
    battleMsg.UID = A
    if (battleA.speed >= battleB.speed - 5) {
      battleHurt.hurtA =
        battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0
      const T = this.probability(battleA.burst)
      if (T) {
        battleHurt.hurtA += Math.floor((battleHurt.hurtA * battleA.burstmax) / 100)
      }
      if (battleHurt.hurtA <= 1) {
        battleMsg.msg.push('你个老六想偷袭,却连对方的防御都破不了,被对方一巴掌给拍死了!')
        battleA.nowblood = 0
        battleMsg.UID = B
        BotApi.obtainingImages({ e, data: battleMsg.msg })
        Data.controlAction({
          NAME: A,
          CHOICE: 'playerBattle',
          DATA: battleA
        })
        return battleMsg.UID
      }
      battleB.nowblood = battleB.nowblood - battleHurt.hurtA
      if (battleB.nowblood < 1) {
        battleMsg.msg.push('你仅出一招,就击败了对方!')
        battleB.nowblood = 0
        BotApi.obtainingImages({ e, data: battleMsg.msg })
        Data.controlAction({
          NAME: B,
          CHOICE: 'playerBattle',
          DATA: battleB
        })
        return battleMsg.UID
      } else {
        battleMsg.msg.push(`你个老六偷袭成功,造成 ${battleHurt.hurtA}伤害`)
      }
    } else {
      battleMsg.msg.push('你个老六想偷袭,对方却一个转身就躲过去了')
    }
    while (true) {
      battle.X++
      battle.Z++
      if (battle.X == 15) {
        BotApi.obtainingImages(e, battleMsg.msg)
        battleMsg.msg = []
        battle.X = 0
        battle.Y++
        if (battle.Y == 2) {
          break
        }
      }
      battleHurt.hurtB =
        battleB.attack - battleA.defense >= 0 ? battleB.attack - battleA.defense + 1 : 0
      const F = this.probability(battleB.burst)
      if (F) {
        battleHurt.hurtB += Math.floor((battleHurt.hurtB * battleB.burstmax) / 100)
      }
      battleA.nowblood = battleA.nowblood - battleHurt.hurtB
      if (battleHurt.hurtB > 1) {
        if (battleA.nowblood < 0) {
          battleMsg.msg.push(`第${battle.Z}回合:对方造成${battleHurt.hurtB}伤害`)
          battleA.nowblood = 0
          battleMsg.UID = B
          BotApi.obtainingImages({ e, data: battleMsg.msg })
          break
        }
      } else {
        battleMsg.msg.push(`第${battle.Z}回合:对方造成${battleHurt.hurtB}伤害`)
      }
      battleHurt.hurtA =
        battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0
      const T = this.probability(battleA.burst)
      if (T) {
        battleHurt.hurtA += Math.floor((battleHurt.hurtA * battleA.burstmax) / 100)
      }
      if (battleHurt.hurtA <= 1) {
        battleMsg.msg.push('你连对方的防御都破不了,被对方一巴掌给拍死了!')
        battleA.nowblood = 0
        battleMsg.UID = B
        BotApi.obtainingImages({ e, data: battleMsg.msg })
        break
      }
      battleB.nowblood = battleB.nowblood - battleHurt.hurtA
      if (battleB.nowblood < 0) {
        battleMsg.msg.push(`第${battle.Z}回合:你造成${battleHurt.hurtA}伤害,并击败了对方!`)
        battleMsg.msg.push('你击败了对方!')
        battleB.nowblood = 0
        break
      } else {
        battleMsg.msg.push(`第${battle.Z}回合:你造成${battleHurt.hurtA}伤害`)
      }
    }
    battleMsg.msg.push(`[血量状态]:${battleA.nowblood}`)
    Data.controlAction({
      NAME: A,
      CHOICE: 'playerBattle',
      DATA: battleA
    })
    Data.controlAction({
      NAME: B,
      CHOICE: 'playerBattle',
      DATA: battleB
    })
    return battleMsg.UID
  }

  /**
   * 输入双方面板
   *
   * 返回双方面板
   * @param {*} A
   * @param {*} B
   * @returns
   */

  /* 战斗模型 */
  start(battleA, battleB, A, B) {
    // 战斗消息
    const battleMsg = this.battleMs
    // 战斗伤害
    const battleHurt = this.battleHurt
    //
    const battle = {
      X: 1,
      Y: 0,
      Z: 1
    }
    battleMsg.UID = A
    if (battleA.speed >= battleB.speed - 5) {
      battleHurt.hurtA =
        battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0
      const T = this.probability(battleA.burst)
      if (T) {
        battleHurt.hurtA += Math.floor((battleHurt.hurtA * battleA.burstmax) / 100)
      }
      if (battleHurt.hurtA <= 1) {
        battleMsg.msg.push('你个老六想偷袭,却连对方的防御都破不了,被对方一巴掌给拍死了!')
        battleA.nowblood = 0
        battleMsg.UID = B
        // tudo
        Data.controlAction({
          NAME: A,
          CHOICE: 'playerBattle',
          DATA: battleA
        })
        return battleMsg.UID
      }
      battleB.nowblood = battleB.nowblood - battleHurt.hurtA
      if (battleB.nowblood < 1) {
        battleMsg.msg.push('你仅出一招,就击败了对方!')
        battleB.nowblood = 0
        Data.controlAction({
          NAME: B,
          CHOICE: 'playerBattle',
          DATA: battleB
        })
        return battleMsg.UID
      } else {
        battleMsg.msg.push(`你个老六偷袭成功,造成 ${battleHurt.hurtA}伤害`)
      }
    } else {
      battleMsg.msg.push('你个老六想偷袭,对方却一个转身就躲过去了')
    }
    while (true) {
      battle.X++
      battle.Z++
      if (battle.X == 15) {
        battleMsg.msg = []
        battle.X = 0
        battle.Y++
        if (battle.Y == 2) {
          break
        }
      }
      battleHurt.hurtB =
        battleB.attack - battleA.defense >= 0 ? battleB.attack - battleA.defense + 1 : 0
      const F = this.probability(battleB.burst)
      if (F) {
        battleHurt.hurtB += Math.floor((battleHurt.hurtB * battleB.burstmax) / 100)
      }
      battleA.nowblood = battleA.nowblood - battleHurt.hurtB
      if (battleHurt.hurtB > 1) {
        if (battleA.nowblood < 0) {
          battleMsg.msg.push(`第${battle.Z}回合:对方造成${battleHurt.hurtB}伤害`)
          battleA.nowblood = 0
          battleMsg.UID = B
          break
        }
      } else {
        battleMsg.msg.push(`第${battle.Z}回合:对方造成${battleHurt.hurtB}伤害`)
      }
      battleHurt.hurtA =
        battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0
      const T = this.probability(battleA.burst)
      if (T) {
        battleHurt.hurtA += Math.floor((battleHurt.hurtA * battleA.burstmax) / 100)
      }
      if (battleHurt.hurtA <= 1) {
        battleMsg.msg.push('你连对方的防御都破不了,被对方一巴掌给拍死了!')
        battleA.nowblood = 0
        battleMsg.UID = B
        break
      }
      battleB.nowblood = battleB.nowblood - battleHurt.hurtA
      if (battleB.nowblood < 0) {
        battleMsg.msg.push(`第${battle.Z}回合:你造成${battleHurt.hurtA}伤害,并击败了对方!`)
        battleMsg.msg.push('你击败了对方!')
        battleB.nowblood = 0
        break
      } else {
        battleMsg.msg.push(`第${battle.Z}回合:你造成${battleHurt.hurtA}伤害`)
      }
    }
    battleMsg.msg.push(`[血量状态]:${battleA.nowblood}`)
    Data.controlAction({
      NAME: A,
      CHOICE: 'playerBattle',
      DATA: battleA
    })
    Data.controlAction({
      NAME: B,
      CHOICE: 'playerBattle',
      DATA: battleB
    })
    return battleMsg.UID
  }
}
export default new Battle()
