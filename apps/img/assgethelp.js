import { plugin, BotApi } from '#xiuxian-api'
// 汐颜
export class AssGetHelp extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)门派帮助$/,
          fnc: 'assHelpImg'
        },
        {
          reg: /^(#|\/)门派管理$/,
          fnc: 'assHelpAdmin'
        }
      ]
    })
  }

  async assHelpImg(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const data = BotApi.getboxhelp('ass_help')
    if (!data) return false
    const isreply = e.reply(await BotApi.ImgCache.helpcache(6, data))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async assHelpAdmin(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const data = BotApi.getboxhelp('ass_admin')
    if (!data) return false
    const isreply = e.reply(await BotApi.ImgCache.helpcache(7, data))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }
}
