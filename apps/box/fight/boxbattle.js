import { BotApi, GameApi, plugin } from '../../../model/api/index.js'
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
    const UIDA = e.user_id
    let UIDB = BotApi.Robot.at({ e })
    if (!UIDB || UIDA == UIDB) {
      UIDB = e.msg.replace(/^(#|\/)打劫/, '')
      if (!UIDB || UIDA == UIDB) return false
    }
    e.reply(GameApi.Dll.Duel.getDuel({ e, UIDA, UIDB }))
    return false
  }
  async handWashing(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const Level = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    const money = 10000 * Level.level_id
    if (Level.prestige > 0) {
      const thing = GameApi.GameUser.userBagSearch({
        UID,
        name: '下品灵石'
      })
      if (!thing || thing.acount < money) {
        e.reply(`[天机门]韩立\n清魔力需要${money}[下品灵石]`)
        return false
      }
      GameApi.GameUser.userBag({
        UID,
        name: '下品灵石',
        ACCOUNT: -money
      })
      Level.prestige -= 1
      GameApi.UserData.controlAction({
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
