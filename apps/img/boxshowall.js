import { BotApi, GameApi, plugin } from '#xiuxian-api'
export class Boxshowall extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)修仙地图$/, fnc: 'showMap' },
        { reg: /^(#|\/)修仙配置$/, fnc: 'showConfig' },
        { reg: /^(#|\/)修仙管理$/, fnc: 'adminSuper' },
        { reg: /^(#|\/)修仙帮助$/, fnc: 'boxhelp' },
        { reg: /^(#|\/)黑市帮助$/, fnc: 'dark_help' }
      ]
    })
  }

  async showMap(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const isreply = e.reply(await BotApi.obtainingImages({ path: 'map', name: 'map' }))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async showConfig(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const cf = GameApi.Defset.getConfig('cooling')
    const Ttwist = cf.switch ? cf.switch.twist : true
    const Tcome = cf.switch ? cf.switch.come : true
    const isreply = e.reply(
      await BotApi.obtainingImages({
        path: 'defset',
        name: 'defset',
        data: {
          ...cf,
          Ttwist: Ttwist ? '开启' : '关闭',
          Tcome: Tcome ? '开启' : '关闭'
        }
      })
    )
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async adminSuper(e) {
    if (!e.isMaster) return false
    if (!super.verify(e)) return false
    e = super.escape(e)
    const data = BotApi.getboxhelp('admin')
    if (!data) return false
    const isreply = e.reply(await BotApi.ImgCache.helpcache(0, data))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async boxhelp(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const data = BotApi.getboxhelp('help')
    if (!data) return false
    const isreply = e.reply(await BotApi.ImgCache.helpcache(1, data))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async dark_help(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const data = BotApi.getboxhelp('dark_help')
    if (!data) return false
    const isreply = e.reply(await BotApi.ImgCache.helpcache(2, data))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }
}
