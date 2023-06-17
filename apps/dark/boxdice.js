import { BotApi, plugin, verify } from '../../model/api/index.js'
export class BoxDice extends plugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)万花坊$/, fnc: 'userDice' }]
    })
  }
  userDice = async (e) => {
    if (!verify(e)) return false
    const msg = ['__[万花坊]__']
    msg.push('待世界升级')
    await BotApi.User.forwardMsgSurveySet({ e, data: msg })
    if (e.group.is_owner || e.group.is_admin) {
      await e.recall()
    }
    return false
  }
}
