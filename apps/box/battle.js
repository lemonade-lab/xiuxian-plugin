import { BotApi, GameApi, plugin } from '../../model/api/index.js'
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
    if (!this.verify(e)) return false
    const UID = e.user_id
    const UIDA = UID
    let UIDB = BotApi.Robot.at({ e })
    if (!UIDB || UIDA == UIDB) {
      UIDB = e.msg.replace(/^(#|\/)打劫/, '')
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
    const { state, msg } = GameApi.Wrap.Go(e.user_id)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const CDID = '11'
    const nowTime = new Date().getTime()
    const cf = GameApi.Defset.getConfig({ name: 'cooling' })
    const CDTime = cf.CD.Attack ? cf.CD.Attack : 5
    const { state: coolingState, msg: coolingMsg } = GameApi.Wrap.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(coolingMsg)
      return false
    }
    const actionA = GameApi.UserData.controlAction({
      NAME: UIDA,
      CHOICE: 'playerAction'
    })
    const actionB = GameApi.UserData.controlAction({
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
    GameApi.Wrap.setRedis(UIDA, CDID, nowTime, CDTime)
    // 增加
    const Level = GameApi.UserData.controlAction({
      NAME: UIDA,
      CHOICE: 'playerLevel'
    })
    Level.prestige += 1
    GameApi.UserData.controlAction({
      NAME: UIDA,
      CHOICE: 'playerLevel',
      DATA: Level
    })
    // 战斗记录
    const user = {
      a: UIDA,
      b: UIDB,
      c: UIDA
    }
    user.c = GameApi.Battle.battle({ e, A: UIDA, B: UIDB })
    const LevelB = GameApi.UserData.controlAction({
      NAME: UIDB,
      CHOICE: 'playerLevel'
    })
    if (user.c != UIDA) {
      user.c = UIDA
      user.a = UIDB
      user.b = user.c
    }
    const LifeData = GameApi.UserData.controlAction({
      NAME: 'life',
      CHOICE: 'playerLife'
    })
    const P = Math.floor(Math.random() * (99 - 1) + 1)
    if (P <= LevelB.prestige) {
      e.reply(`${LifeData[user.a].name}战胜了${LifeData[user.b].name}`)
      return false
    }
    let bagB = GameApi.UserData.controlAction({
      NAME: user.b,
      CHOICE: 'playerBag'
    })
    if (bagB.thing.length == 0) {
      e.reply(`${LifeData[user.a].name}战胜了${LifeData[user.b].name}`)
    }
    const thing = GameApi.Method.Anyarray(bagB.thing)
    bagB.thing = bagB.thing.filter((item) => item.name != thing.name)
    GameApi.UserData.controlAction({
      NAME: user.b,
      CHOICE: 'playerBag',
      DATA: bagB
    })
    GameApi.Bag.addBagThing({
      UID: user.a,
      name: thing.name,
      ACCOUNT: thing.acount
    })
    e.reply(
      `${LifeData[user.a].name}夺走了${LifeData[user.b].name}的[${thing.name}]*${thing.acount}`
    )
    return false
  }

  async handWashing(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const LevelData = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    const money = 10000 * LevelData.level.gaspractice.realm
    if (money == 0) {
      e.reply('[天机门]李逍遥\n凡人不可捷越')
      return false
    }
    if (LevelData.prestige <= 0) {
      e.reply('[天机门]李逍遥\n你一身清廉')
      return false
    }
    const thing = GameApi.Bag.searchBagByName({
      UID,
      name: '下品灵石'
    })
    if (!thing || thing.acount < money) {
      e.reply(`[天机门]韩立\n清煞气需要${money}[下品灵石]`)
      return false
    }
    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: -money
    })
    LevelData.prestige -= 1
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel',
      DATA: LevelData
    })
    e.reply('[天机门]南宫问天\n为你清除[煞气]*1')
    return false
  }
}
