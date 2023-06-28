import { BotApi, GameApi, plugin } from '#xiuxian-api'
export class BoxStart extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)踏入仙途$/, fnc: 'createMsg' },
        { reg: /^(#|\/)再入仙途$/, fnc: 'reCreateMsg' }
      ]
    })
  }

  async createMsg(e) {
    if (!super.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { path, name, data } = GameApi.Information.showUserPlayer(e.user_id)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async reCreateMsg(e) {
    if (!super.verify(e)) return false
    const UID = e.user_id
    const cf = GameApi.Defset.getConfig('cooling')
    const CDTime = cf.CD.Reborn ? cf.CD.Reborn : 850
    const CDID = 8
    const nowTime = new Date().getTime()
    const { state: coolingState, msg: coolingMsg } = GameApi.Burial.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(coolingMsg)
      return false
    }
    GameApi.Burial.set(UID, CDID, nowTime, CDTime)
    GameApi.Action.delete(UID)
    // 重生后life重置,不需要做其他修改
    GameApi.Player.createPlayer(e.user_id)
    const { path, name, data } = GameApi.Information.showUserPlayer(e.user_id)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet(e, isreply)
    return false
  }
}
