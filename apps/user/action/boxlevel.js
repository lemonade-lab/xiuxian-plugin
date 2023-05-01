import { BotApi, GameApi, plugin, name, dsc } from '../../../model/api/api.js'
export class BoxLevel extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: '^#突破$', fnc: 'levelUp' },
        { reg: '^#破体$', fnc: 'levelMaxUp' },
        { reg: '^#渡劫$', fnc: 'levelBreak' }
      ]
    })
  }
  levelUp = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已死亡')
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
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已死亡')
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

  levelBreak = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    const msg = await GameApi.UserAction.levelBreak({ UID: e.user_id })
    if (msg) {
      e.reply(msg)
      return false
    }
    e.reply('仙路已断')
    return false
  }
}
