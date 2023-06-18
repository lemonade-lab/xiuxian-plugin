import { BotApi, GameApi, plugin } from '../../model/api/index.js'
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
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    const { path, name, data } = GameApi.Information.userDataShow(e.user_id)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }

  async reCreateMsg(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const CDTime = cf.CD.Reborn ? cf.CD.Reborn : 850
    const CDID = '8'
    const nowTime = new Date().getTime()
    const { state: coolingState, msg: coolingMsg } = GameApi.Wrap.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(coolingMsg)
      return false
    }
    GameApi.Wrap.setRedis(UID, CDID, nowTime, CDTime)
    GameApi.Wrap.deleteAction(UID)
    // 重生后life重置,不需要做其他修改
    GameApi.GameUser.createBoxPlayer(e.user_id)
    const { path, name, data } = GameApi.Information.userDataShow(e.user_id)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }
}
