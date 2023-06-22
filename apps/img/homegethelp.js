import { BotApi, plugin } from '../../model/api/index.js'
// 秋雨
export class HomeGetHelp extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)洞府帮助$/,
          fnc: 'homeHelp'
        },
        {
          reg: /^(#|\/)洞府管理$/,
          fnc: 'homeAdmin'
        }
      ]
    })
  }

  async homeHelp(e) {
    if (!this.verify(e)) return false
    const data = BotApi.getboxhelp('home_help')
    if (!data) {
      return false
    }
    const isreply = e.reply(await BotApi.ImgCache.helpcache(4, data))
    BotApi.Robot.surveySet(e, isreply)
  }

  async homeAdmin(e) {
    if (!this.verify(e)) return false
    const data = BotApi.getboxhelp('home_admin')
    if (!data) {
      return false
    }
    const isreply = e.reply(await BotApi.ImgCache.helpcache(5, data))
    BotApi.Robot.surveySet(e, isreply)
  }
}
