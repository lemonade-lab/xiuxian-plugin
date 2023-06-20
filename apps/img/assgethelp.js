import { plugin, BotApi } from '../../model/api/index.js'
// 汐颜
export class AssGetHelp extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)宗门帮助$/,
          fnc: 'assHelpImg'
        },
        {
          reg: /^(#|\/)宗门管理$/,
          fnc: 'assHelpAdmin'
        }
      ]
    })
  }

  async assHelpImg(e) {
    if (!this.verify(e)) return false
    const data = BotApi.getboxhelp({ name: 'ass_help' })
    if (!data) return false
    const isreply = e.reply(await BotApi.ImgCache.helpcache({ i: 6, data }))
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }

  async assHelpAdmin(e) {
    if (!this.verify(e)) return false
    const data = BotApi.getboxhelp({ name: 'ass_admin' })
    if (!data) return false
    const isreply = e.reply(await BotApi.ImgCache.helpcache({ i: 7, data }))
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }
}
