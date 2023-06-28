import { BotApi, GameApi, plugin } from '#xiuxian-api'
export class BoxInformation extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)个人信息$/, fnc: 'showUserMsg' },
        { reg: /^(#|\/)面板信息$/, fnc: 'showUIDuipment' },
        { reg: /^(#|\/)功法信息$/, fnc: 'showTalent' }
      ]
    })
  }

  async showUserMsg(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { path, name, data } = GameApi.Information.showUserPlayer(e.user_id, e.user_avatar)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async showUIDuipment(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { path, name, data } = GameApi.Information.showUserEquipment(e.user_id, e.user_avatar)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async showTalent(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { path, name, data } = GameApi.Information.showUserTalent(e.user_id, e.user_avatar)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }
}
