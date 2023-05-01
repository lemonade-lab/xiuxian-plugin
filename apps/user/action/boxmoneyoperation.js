import { BotApi, GameApi, plugin, name, dsc } from '../../../model/api/api.js'
export class BoxMoneyOperation extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: '^#赠送灵石.*$', fnc: 'giveMoney' },
        { reg: '^#联盟报到$', fnc: 'userCheckin' }
      ]
    })
  }
  userCheckin = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已死亡')
      return false
    }
    const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const address_name = '联盟'
    const map = await GameApi.GameMap.mapExistence({
      action,
      addressName: address_name
    })
    if (!map) {
      e.reply(`需[#前往+城池名+${address_name}]`)
      return false
    }
    const level = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (level.level_id != 1) {
      e.reply('[修仙联盟]方正\n前辈莫要开玩笑')
      return false
    }
    if (action.newnoe != 1) {
      e.reply('[修仙联盟]方正\n道友要不仔细看看自己的储物袋')
      return false
    }
    action.newnoe = 0
    await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action',
      DATA: action
    })
    const randomthing = await GameApi.GameUser.randomThing()
    await GameApi.GameUser.userBag({
      UID,
      name: randomthing.name,
      ACCOUNT: randomthing.acount
    })
    await GameApi.GameUser.userBag({
      UID,
      name: '下品灵石',
      ACCOUNT: Number(10)
    })
    e.reply(
      `[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧\n还有${Number(
        10
      )}颗[下品灵石]\n可在必要的时候用到`
    )
    return false
  }
  giveMoney = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已死亡')
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
      e.reply('已死亡')
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