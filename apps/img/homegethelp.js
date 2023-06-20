import { BotApi, plugin } from '../../model/api/index.js'
// 秋雨
export class HomeGetHelp extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)家园帮助$/,
          fnc: 'homeHelp'
        },
        {
          reg: /^(#|\/)家园管理$/,
          fnc: 'homeAdmin'
        }
      ]
    })
  }

  async homeHelp(e) {
    if (!this.verify(e)) return false
    const data = BotApi.getboxhelp({ name: 'home_help' })
    if (!data) {
      return
    }
    const isreply = e.reply(await BotApi.ImgCache.helpcache({ i: 4, data }))
    BotApi.Robot.surveySet({ e, isreply })
  }

  async homeAdmin(e) {
    if (!this.verify(e)) return false
    const data = BotApi.getboxhelp({ name: 'home_admin' })
    if (!data) {
      return
    }
    const isreply = e.reply(await BotApi.ImgCache.helpcache({ i: 5, data }))
    BotApi.Robot.surveySet({ e, isreply })
  }
}
