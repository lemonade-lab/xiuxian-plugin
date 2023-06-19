import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxMoneyOperation extends plugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)赠送[\u4e00-\u9fa5]+\*\d+$/, fnc: 'giveMoney' }]
    })
  }

  async giveMoney(e) {
    if (!this.verify(e)) return false
    if (!GameApi.Player.getUserLifeSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Wrap.Go(e.user_id)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const A = e.user_id
    const B = BotApi.Robot.at({ e })
    if (!B || B == A) return false
    const existB = GameApi.Player.getUserLifeSatus(B)
    if (!existB) {
      e.reply('已仙鹤')
      return false
    }
    const actionA = GameApi.UserData.controlAction({
      NAME: A,
      CHOICE: 'user_action'
    })
    const actionB = GameApi.UserData.controlAction({
      NAME: B,
      CHOICE: 'user_action'
    })
    if (actionA.region != actionB.region) {
      return `此地未找到此人`
    }
    let thingName = e.msg.replace(/^(#|\/)赠送/, '')
    const [name, acount] = thingName.split('*')
    const money = GameApi.Bag.searchBagByName({
      UID: A,
      name
    })
    if (!money || money.acount < acount) {
      e.reply(`似乎没有${acount}[${name}]`)
      return false
    }
    const cf = GameApi.Defset.getConfig({
      name: 'cooling'
    })
    const CDTime = cf.CD.Transfer ? cf.CD.Transfer : 5
    const CDID = '5'
    const nowTime = new Date().getTime()
    const { state: coolingState, msg: coolingMsg } = GameApi.Wrap.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(coolingMsg)
      return false
    }
    GameApi.Wrap.setRedis(A, CDID, nowTime, CDTime)
    GameApi.Bag.addBagThing({
      UID: A,
      name,
      ACCOUNT: -acount
    })
    GameApi.Bag.addBagThing({
      UID: B,
      name,
      ACCOUNT: acount
    })
    e.reply(`${A}赠送了${B}物品[${name}]*${acount}`)
    return false
  }
}
