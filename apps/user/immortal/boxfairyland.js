import { BotApi, GameApi, plugin, name, dsc } from '../../../model/api/api.js'
export class boxfairyland extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: '^#渡劫$', fnc: 'levelBreak' },
        { reg: '^#望天$', fnc: 'breakSky' }
      ]
    })
  }

  /**
   * 成就仙人境
   */

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

  /**
   * 仙人突破
   */

  breakSky = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false
    if (!BotApi.User.controlMessage({ e })) return false
    return
  }

}
