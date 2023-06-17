import { BotApi, GameApi, plugin } from '../../../model/api/index.js'
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
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    const { path, name, data } = GameApi.Information.userDataShow({
      UID: e.user_id
    })
    const isreply = e.reply(BotApi.obtainingImages({ path, name, data }))
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
    const CDTime = cf['CD']['Reborn'] ? cf['CD']['Reborn'] : 850
    const CDID = '8'
    const now_time = new Date().getTime()
    const { CDMSG } = GameApi.GamePublic.cooling({ UID, CDID })
    if (CDMSG) {
      e.reply(CDMSG)
      return false
    }
    GameApi.GamePublic.setRedis(UID, CDID, now_time, CDTime)
    GameApi.GamePublic.offAction({ UID })
    let life = GameApi.UserData.controlActionInitial({
      NAME: 'life',
      CHOICE: 'user_life',
      INITIAL: []
    })
    life = life.filter((item) => item.qq != UID)
    GameApi.UserData.controlAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: life
    })
    GameApi.GameUser.createBoxPlayer({ UID: e.user_id })
    const { path, name, data } = GameApi.Information.userDataShow({
      UID: e.user_id
    })
    const isreply = e.reply(BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }
}
