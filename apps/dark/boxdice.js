import { BotApi, plugin } from '../../model/api/index.js'
export class BoxDice extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)万花坊$/, fnc: 'userDice' },
        { reg: /^(#|\/)命运转盘[\u4e00-\u9fa5]+\*\d+$$/, fnc: 'wheelDestiny' }
      ]
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

  async wheelDestiny(e) {
    if (!this.verify(e)) return false
    e.reply('待更新')
    /**
     * 输入指定物品*5
     * 一定概率转化成其他物品
     */
    return false
  }
}
