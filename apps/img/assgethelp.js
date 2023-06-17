import { plugin, BotApi } from '../../model/api/index.js'
//汐颜
export class assGetHelp extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)宗门(帮助|菜单|help|列表)$/,
          fnc: 'assHelpImg'
        },
        {
          reg: /^(#|\/)宗门管理$/,
          fnc: 'assHelpAdmin'
        }
      ]
    })
  }
  assHelpImg = async (e) => {
    if (!this.verify(e)) return false
    const data = BotApi.ImgHelp.getboxhelp({ name: 'ass_help' })
    if (!data) return false
    const isreply = e.reply(BotApi.ImgCache.helpcache({ i: 6, data }))
    BotApi.User.surveySet({ e, isreply })
    return false
  }
  assHelpAdmin = async (e) => {
    if (!this.verify(e)) return false
    const data = BotApi.ImgHelp.getboxhelp({ name: 'ass_admin' })
    if (!data) return false
    const isreply = e.reply(BotApi.ImgCache.helpcache({ i: 7, data }))
    BotApi.User.surveySet({ e, isreply })
    return false
  }
}
