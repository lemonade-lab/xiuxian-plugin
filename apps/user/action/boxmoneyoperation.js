import { BotApi, GameApi, plugin, name, dsc } from '../../../model/api/api.js'
export class BoxMoneyOperation extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [{ reg: '^#赠送灵石.*$', fnc: 'giveMoney' }]
    })
  }

  giveMoney = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const A = e.user_id
    const B = await BotApi.User.at({ e })
    if (!B || B == A) return false
    const existB = await GameApi.GameUser.existUserSatus({ UID: B })
    if (!existB) {
      e.reply('已仙鹤')
      return false
    }
    let islingshi = e.msg.replace('#赠送灵石', '')
    islingshi = await GameApi.GamePublic.leastOne({ value: islingshi })
    const money = await GameApi.GameUser.userBagSearch({
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
    const CDTime = cf['CD']['Transfer'] ? cf['CD']['Transfer'] : 5
    const CDID = '5'
    const now_time = new Date().getTime()
    const { CDMSG } = await GameApi.GamePublic.cooling({ UID: A, CDID })
    if (CDMSG) {
      e.reply(CDMSG)
      return false
    }
    GameApi.GamePublic.setRedis(A, CDID, now_time, CDTime)
    await GameApi.GameUser.userBag({
      UID: A,
      name: '下品灵石',
      ACCOUNT: -islingshi
    })
    await GameApi.GameUser.userBag({
      UID: B,
      name: '下品灵石',
      ACCOUNT: islingshi
    })
    e.reply([segment.at(B), `你获得了由 ${A}赠送的${islingshi}*[下品灵石]`])
    return false
  }
}
