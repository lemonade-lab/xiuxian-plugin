import { BotApi, GameApi, plugin, name, dsc } from '../../../model/api/api.js'
export class BoxBattle extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: '^#死斗.*$', fnc: 'duel' },
        { reg: '^#洗手$', fnc: 'handWashing' }
      ]
    })
  }
  duel = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    const UIDA = e.user_id
    let UIDB = await BotApi.User.at({ e })
    if (!UIDB || UIDA == UIDB) {
      UIDB = e.msg.replace('#死斗', '')
      if (!UIDB || UIDA == UIDB) return false
    }
    e.reply(await GameApi.Dll.Duel.getDuel({ e, UIDA, UIDB }))
    return false
  }
  handWashing = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return false
    }
    const Level = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    const money = 10000 * Level.level_id
    if (Level.prestige > 0) {
      const thing = await GameApi.GameUser.userBagSearch({
        UID,
        name: '下品灵石'
      })
      if (!thing || thing.acount < money) {
        e.reply(`[天机门]韩立\n清魔力需要${money}[下品灵石]`)
        return false
      }
      await GameApi.GameUser.userBag({
        UID,
        name: '下品灵石',
        ACCOUNT: -money
      })
      Level.prestige -= 1
      await GameApi.UserData.listAction({
        NAME: UID,
        CHOICE: 'user_level',
        DATA: Level
      })
      e.reply('[天机门]南宫问天\n为你清除[魔力]*1')
      return false
    } else {
      e.reply('[天机门]李逍遥\n你一身清廉')
    }
    return false
  }
}
