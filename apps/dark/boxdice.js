import { BotApi, plugin } from '../../model/api/index.js'
export class BoxDice extends plugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)万花坊$/, fnc: 'userDice' }]
    })
  }
  userDice = async (e) => {
    if (!this.verify(e)) return false
    const msg = ['__[万花坊]__']
    msg.push('待世界升级')
    BotApi.User.forwardMsgSurveySet({ e, data: msg })
    if (e.group.is_owner || e.group.is_admin) {
      e.recall()
    }
    return false
  }
}
