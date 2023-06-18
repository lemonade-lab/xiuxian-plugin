import { BotApi, plugin } from '../../model/api/index.js'
export class BoxDice extends plugin {
  constructor() {
    super({
      rule: [{ reg: /^(#|\/)万花坊$/, fnc: 'userDice' }]
    })
  }

  async userDice(e) {
    if (!this.verify(e)) return false
    const msg = ['__[万花坊]__']
    msg.push('待世界升级')
    const isreply = await e.reply(
      await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } })
    )
    BotApi.Robot.surveySet({ e, isreply })
    if (e.group.is_owner || e.group.is_admin) {
      e.recall()
    }
    return false
  }
}
