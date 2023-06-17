import { GameApi, plugin } from '../../../model/api/index.js'
export class BoxLevel extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)突破$/, fnc: 'levelUp' },
        { reg: /^(#|\/)破境$/, fnc: 'levelMaxUp' }
      ]
    })
  }

  async levelUp(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    const { UserLevelUpMSG } = GameApi.UserAction.userLevelUp({
      UID: e.user_id
    })
    if (UserLevelUpMSG) {
      e.reply(UserLevelUpMSG)
    }
    return false
  }

  async levelMaxUp(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    const { UserLevelUpMSG } = GameApi.UserAction.userLevelUp({
      UID: e.user_id,
      choise: 'max'
    })
    if (UserLevelUpMSG) {
      e.reply(UserLevelUpMSG)
    }
    return false
  }
}
