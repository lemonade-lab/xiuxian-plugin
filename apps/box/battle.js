import { BotApi, GameApi, plugin } from '#xiuxian-api'
export class BoxBattle extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)打劫.*$/, fnc: 'duel' },
        { reg: /^(#|\/)洗手$/, fnc: 'handWashing' }
      ]
    })
  }

  async duel(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    console.log('debuger')
    const UID = e.user_id
    const UIDA = UID
    let UIDB = BotApi.Robot.at(e)
    if (!UIDB || UIDA == UIDB) {
      UIDB = e.cmd_msg.replace(/^(#|\/)打劫/, '')
      if (!UIDB || UIDA == UIDB) return false
    }
    if (!GameApi.Player.isUser(UIDB)) {
      e.reply(`查无此人`)
      return false
    }
    if (!GameApi.Player.getUserLifeSatus(UIDA) || !GameApi.Player.getUserLifeSatus(UIDB)) {
      e.reply(`已仙鹤`)
      return false
    }
    const { state, msg } = GameApi.Action.Go(UID)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const CDID = 11
    const nowTime = new Date().getTime()
    const cf = GameApi.Defset.getConfig('cooling')
    const CDTime = cf.CD.Attack ? cf.CD.Attack : 5
    const { state: coolingState, msg: coolingMsg } = GameApi.Burial.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(coolingMsg)
      return false
    }
    const actionA = GameApi.Data.controlAction({
      NAME: UIDA,
      CHOICE: 'playerAction'
    })
    const actionB = GameApi.Data.controlAction({
      NAME: UIDB,
      CHOICE: 'playerAction'
    })
    if (actionA.region != actionB.region) {
      e.reply('此地未找到此人')
      return false
    }
    if (actionA.address == 1) {
      const najieThing = GameApi.Bag.searchBagByName({
        UID: UIDA,
        name: '决斗令'
      })
      if (!najieThing) {
        e.reply('[修仙联盟]普通卫兵:城内不可出手!')
        return false
      }
      GameApi.Bag.addBagThing({
        UID: UIDA,
        name: najieThing.name,
        ACCOUNT: -1
      })
    }
    GameApi.Burial.set(UIDA, CDID, nowTime, CDTime)
    // 增加
    const SpecialData = GameApi.Data.controlAction({
      NAME: UIDA,
      CHOICE: 'playerSpecial'
    })
    SpecialData.prestige += 1
    GameApi.Data.controlAction({
      NAME: UIDA,
      CHOICE: 'playerSpecial',
      DATA: SpecialData
    })
    const BattleDataA = GameApi.Data.read(UIDA, 'playerBattle')
    const BattleDataB = GameApi.Data.read(UIDB, 'playerBattle')
    const LifeData = GameApi.Data.readInitial('life', 'playerLife', {})
    const BMSG = GameApi.Fight.start(
      { battleA: BattleDataA, UIDA, NAMEA: LifeData[UIDA].name },
      { battleB: BattleDataB, UIDB, NAMEB: LifeData[UIDB].name }
    )
    GameApi.Data.write(UIDA, 'playerBattle', BMSG.battleA)
    GameApi.Data.write(UIDB, 'playerBattle', BMSG.battleB)
    /**
     * 如果平局,直接返回
     */
    const firstArray = BMSG.msg.slice(0, 16)
    const secondArray = BMSG.msg.slice(16)
    if (BMSG.victory == 0) {
      /** 平局了,保存双方存档即可 */
      if (firstArray.length != 0) {
        BotApi.Robot.surveySet(
          e,
          await e.reply(
            await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: firstArray } })
          )
        )
      }
      if (secondArray.length != 0) {
        BotApi.Robot.surveySet(
          e,
          await e.reply(
            await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: secondArray } })
          )
        )
      }
      return false
    }

    const SpecialB = GameApi.Data.controlAction({
      NAME: UIDB,
      CHOICE: 'playerSpecial'
    })

    const user = {
      PartyA: UIDA, // 默认a赢了
      PartyB: UIDB,
      prestige: SpecialB.prestige
    }

    if (BMSG.victory == UIDB) {
      /** 结果是b赢了 */
      user.PartyA = UIDB
      user.PartyB = UIDA
      user.prestige = SpecialData.prestige
    }

    if (!GameApi.Method.isTrueInRange(1, 100, Math.floor(user.prestige))) {
      // 没有触发抢劫
      if (firstArray.length != 0) {
        BotApi.Robot.surveySet(
          e,
          await e.reply(
            await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: firstArray } })
          )
        )
      }
      if (secondArray.length != 0) {
        BotApi.Robot.surveySet(
          e,
          await e.reply(
            await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: secondArray } })
          )
        )
      }
      return false
    }

    /**
     * 查看败者背包
     */
    let BagData = GameApi.Data.controlAction({
      NAME: user.PartyB,
      CHOICE: 'playerBag'
    })

    if (BagData.thing.length == 0) {
      /** 背包没东西 */
      if (firstArray.length != 0) {
        BotApi.Robot.surveySet(
          e,
          await e.reply(
            await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: firstArray } })
          )
        )
      }
      if (secondArray.length != 0) {
        BotApi.Robot.surveySet(
          e,
          await e.reply(
            await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: secondArray } })
          )
        )
      }
      return
    }
    /**
     * 随机得到一个物品
     */
    const thing = GameApi.Method.Anyarray(BagData.thing)
    /**
     * 扣除物品
     */
    BagData.thing = BagData.thing.filter((item) => item.name != thing.name)
    /**
     * 交换物品
     */
    GameApi.Data.controlAction({
      NAME: user.PartyB,
      CHOICE: 'playerBag',
      DATA: BagData
    })
    GameApi.Bag.addBagThing({
      UID: user.PartyA,
      name: thing.name,
      ACCOUNT: thing.acount
    })
    secondArray.push(
      `${LifeData[user.PartyA].name}夺走了${LifeData[user.PartyA].name}的[${thing.name}]*${
        thing.acount
      }`
    )
    if (firstArray.length != 0) {
      BotApi.Robot.surveySet(
        e,
        await e.reply(
          await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: firstArray } })
        )
      )
    }
    if (secondArray.length != 0) {
      BotApi.Robot.surveySet(
        e,
        await e.reply(
          await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: secondArray } })
        )
      )
    }
    return false
  }

  async handWashing(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const LevelData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    const money = 10000 * LevelData.gaspractice.realm
    if (money == 0) {
      e.reply('[天机门]李逍遥\n凡人不可捷越')
      return false
    }
    const SpecialData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerSpecial'
    })
    if (SpecialData.prestige <= 0) {
      e.reply('[天机门]李逍遥\n你一身清廉')
      return false
    }
    const thing = GameApi.Bag.searchBagByName({
      UID,
      name: '下品灵石'
    })
    if (!thing || thing.acount < money) {
      e.reply(`[天机门]韩立\n清煞气需要[下品灵石]*${money}`)
      return false
    }
    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: -money
    })
    SpecialData.prestige -= 1
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerSpecial',
      DATA: SpecialData
    })
    e.reply('[天机门]南宫问天\n为你清除[煞气]*1')
    return false
  }
}
