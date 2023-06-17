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
  levelUp = async (e) => {
    if (!this.verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { UserLevelUpMSG } = await GameApi.UserAction.userLevelUp({
      UID: e.user_id
    })
    if (UserLevelUpMSG) {
      e.reply(UserLevelUpMSG)
    }
    return false
  }
  levelMaxUp = async (e) => {
    if (!this.verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { UserLevelUpMSG } = await GameApi.UserAction.userLevelUp({
      UID: e.user_id,
      choise: 'max'
    })
    if (UserLevelUpMSG) {
      e.reply(UserLevelUpMSG)
    }
    return false
  }
}
