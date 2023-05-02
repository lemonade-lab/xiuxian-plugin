import { GameApi, plugin, name, dsc, verify } from '../../../model/api/api.js'
export class boxfairyland extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: '^#渡劫$', fnc: 'breakLevel' },
        { reg: '^#望天$', fnc: 'breakSky' }
      ]
    })
  }

  /**
   * 成就仙人境
   */

  breakLevel = async (e) => {
    if (!verify(e)) return false
    const msg = await GameApi.UserAction.levelBreak({ UID: e.user_id })
    if (msg) {
      e.reply(msg)
      return false
    }
    e.reply('待世界升级~')
    return false
  }

  /**
   * 仙人突破
   */

  breakSky = async (e) => {
    if (!verify(e)) return false
    e.reply('待世界升级~')
    return false
  }
}
