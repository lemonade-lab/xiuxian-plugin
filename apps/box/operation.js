import { BotApi, GameApi, plugin } from '#xiuxian-api'
export class BoxMoneyOperation extends plugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)赠送[\u4e00-\u9fa5]+\*\d+$/, fnc: 'giveMoney' }]
    })
  }

  async giveMoney(e) {
    if (!super.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Action.Go(UID)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const A = e.user_id
    const B = BotApi.Robot.at(e)
    if (!B || B == A) return false
    const existB = GameApi.Player.getUserLifeSatus(B)
    if (!existB) {
      e.reply('已仙鹤')
      return false
    }
    const actionA = GameApi.Data.controlAction({
      NAME: A,
      CHOICE: 'playerAction'
    })
    const actionB = GameApi.Data.controlAction({
      NAME: B,
      CHOICE: 'playerAction'
    })
    if (actionA.region != actionB.region) {
      return `此地未找到此人`
    }
    let thingName = e.cmd_msg.replace(/^(#|\/)赠送/, '')
    const [name, acount] = thingName.split('*')
    const money = GameApi.Bag.searchBagByName({
      UID: A,
      name
    })
    if (!money || money.acount < acount) {
      e.reply(`似乎没有[${name}]*${acount}`)
      return false
    }
    const cf = GameApi.Defset.getConfig('cooling')
    const CDTime = cf.CD.Transfer ? cf.CD.Transfer : 5
    const CDID = 5
    const nowTime = new Date().getTime()
    const { state: coolingState, msg: coolingMsg } = GameApi.Burial.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(coolingMsg)
      return false
    }
    GameApi.Burial.set(A, CDID, nowTime, CDTime)
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
    const LifeData = GameApi.Data.controlAction({
      NAME: 'life',
      CHOICE: 'playerLife'
    })
    e.reply(`"${LifeData[A].name}"赠送了"${LifeData[B].name}"[${name}]*${acount}`)
    return false
  }
}
