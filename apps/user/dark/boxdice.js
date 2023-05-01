import { BotApi, GameApi, plugin, name, dsc } from '../../../model/api/api.js'
export class BoxDice extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [{ reg: '^#万花坊$', fnc: 'userDice' }]
    })
  }
  userDice = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    const msg = ['__[万花坊]__']
    msg.push('待更新')
    await BotApi.User.forwardMsgSurveySet({ e, data: msg })
    if (e.group.is_owner || e.group.is_admin) {
      await e.recall()
    }
    return false
  }
}
