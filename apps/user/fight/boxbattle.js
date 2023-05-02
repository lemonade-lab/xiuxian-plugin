import { BotApi, GameApi, plugin, name, dsc, verify } from '../../../model/api/api.js'
export class BoxBattle extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: '^#打劫.*$', fnc: 'duel' },
        { reg: '^#洗手$', fnc: 'handWashing' }
      ]
    })
  }
  duel = async (e) => {
    if (!verify(e)) return false
    const UIDA = e.user_id
    let UIDB = await BotApi.User.at({ e })
    if (!UIDB || UIDA == UIDB) {
      UIDB = e.msg.replace('#打劫', '')
      if (!UIDB || UIDA == UIDB) return false
    }
    e.reply(await GameApi.Dll.Duel.getDuel({ e, UIDA, UIDB }))
    return false
  }
  handWashing = async (e) => {
    if (!verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
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
