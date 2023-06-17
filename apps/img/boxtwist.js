import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxtWist extends plugin {
  constructor() {
    super({
      event: 'notice.group.poke',
      priority: 99999,
      rule: [{ fnc: 'helpWist' }]
    })
  }
  async helpWist(e) {
    if (e.self_id != e.target_id) return false
    if (!this.verify(e)) return false
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const T = cf['switch'] ? cf['switch']['twist'] : true
    if (!T) return false
    const data = BotApi.ImgHelp.getboxhelp({ name: 'help' })
    if (!data) return false
    const isreply = e.reply(BotApi.ImgCache.helpcache({ i: 3, data }))
    BotApi.User.surveySet({ e, isreply })
    return false
  }
}
