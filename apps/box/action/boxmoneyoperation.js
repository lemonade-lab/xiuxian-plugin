import { BotApi, GameApi, plugin } from '../../../model/api/index.js'
export class BoxMoneyOperation extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)赠送灵石\d+$/, fnc: 'giveMoney' },
        { reg: /^(#|\/)赠送物品[\u4e00-\u9fa5]*$/, fnc: 'giveGoods' }
      ]
    })
  }

  async giveGoods(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    e.reply('待世界升级')
  }

  async giveMoney(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
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
    let islingshi = e.msg.replace(/^(#|\/)赠送灵石/, '')
    islingshi = GameApi.GamePublic.leastOne({ value: islingshi })
    const money = GameApi.GameUser.userBagSearch({
      UID: A,
      name: '下品灵石'
    })
    if (!money || money.acount < islingshi) {
      e.reply(`似乎没有${islingshi}[下品灵石]`)
      return false
    }
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const CDTime = cf.CD.Transfer ? cf.CD.Transfer : 5
    const CDID = '5'
    const nowTime = new Date().getTime()
    const { CDMSG } = GameApi.GamePublic.cooling({ UID: A, CDID })
    if (CDMSG) {
      e.reply(CDMSG)
      return false
    }
    GameApi.GamePublic.setRedis(A, CDID, nowTime, CDTime)
    GameApi.GameUser.userBag({
      UID: A,
      name: '下品灵石',
      ACCOUNT: -islingshi
    })
    GameApi.GameUser.userBag({
      UID: B,
      name: '下品灵石',
      ACCOUNT: islingshi
    })
    e.reply([segment.at(B), `你获得了由 ${A}赠送的${islingshi}*[下品灵石]`])
    return false
  }
}
