import { BotApi, GameApi, plugin } from '#xiuxian-api'
export class Wist extends plugin {
  constructor() {
    super({
      event: 'notice.group.poke',
      priority: 99999,
      rule: [{ fnc: 'helpWist' }]
    })
  }

  async helpWist(e) {
    if (e.self_id != e.target_id) return false
    if (!super.verify(e)) return false
    const cf = GameApi.Defset.getConfig('cooling')
    const T = cf.switch ? cf.switch.twist : true
    if (!T) return false
    const data = BotApi.getboxhelp('help')
    if (!data) return false
    const isreply = e.reply(await BotApi.ImgCache.helpcache(3, data))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }
}
