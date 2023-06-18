import { BotApi, GameApi, plugin } from '../../../model/api/index.js'
export class BoxMoneyOperation extends plugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)赠送物品[\u4e00-\u9fa5]+\*\d+$/, fnc: 'giveMoney' }]
    })
  }

  async giveMoney(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
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
    const existB = GameApi.GameUser.existUserSatus({ UID: B })
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
    let thingName = e.msg.replace(/^(#|\/)赠送物品/, '')
    const [name, acount] = thingName.split('*')
    const money = GameApi.GameUser.userBagSearch({
      UID: A,
      name
    })
    if (!money || money.acount < acount) {
      e.reply(`似乎没有${acount}[${name}]`)
      return false
    }
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
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
    GameApi.GameUser.userBag({
      UID: A,
      name,
      ACCOUNT: -acount
    })
    GameApi.GameUser.userBag({
      UID: B,
      name,
      ACCOUNT: acount
    })
    e.reply([segment.at(B), `获得了由 ${A}赠送的${acount}*[${name}]`])
    return false
  }
}
