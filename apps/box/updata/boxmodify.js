import { BotApi, GameApi, plugin } from '../../../model/api/index.js'
export class BoxModify extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)更改道号[\u4e00-\u9fa5]*$/, fnc: 'changeName' },
        { reg: /^(#|\/)更改道宣[\u4e00-\u9fa5]*$/, fnc: 'changeAutograph' }
      ]
    })
  }
  async changeName(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    let new_name = e.msg.replace(/^(#|\/)更改道号/, '')
    if (new_name.length == 0) {
      return false
    }
    if (new_name.length > 8) {
      e.reply('这名可真是稀奇')
      return false
    }
    const CDID = '3'
    const now_time = new Date().getTime()
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const CDTime = cf['CD']['Name'] ? cf['CD']['Name'] : 5
    const { CDMSG } = GameApi.GamePublic.cooling({ UID, CDID })
    if (CDMSG) {
      e.reply(CDMSG)
      return false
    }
    GameApi.GamePublic.setRedis(UID, CDID, now_time, CDTime)
    const life = GameApi.UserData.controlActionInitial({
      NAME: 'life',
      CHOICE: 'user_life',
      INITIAL: []
    })
    life.forEach((item) => {
      if (item.qq == UID) {
        item.name = new_name
      }
    })
    GameApi.UserData.controlAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: life
    })
    const { path, name, data } = GameApi.Information.userDataShow({
      UID: e.user_id
    })
    const isreply = e.reply(BotApi.ImgIndex.showPuppeteer({ path, name, data }))
    BotApi.User.surveySet({ e, isreply })
    return false
  }
  async changeAutograph(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    const player = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_player'
    })
    let new_msg = e.msg.replace(/^(#|\/)更改道号/, '')
    new_msg = new_msg.replace(' ', '')
    if (new_msg.length == 0 || new_msg.length > 50) {
      e.reply('请正确设置,且道宣最多50字符')
      return false
    }
    const CDID = '4'
    const now_time = new Date().getTime()
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const CDTime = cf['CD']['Autograph'] ? cf['CD']['Autograph'] : 5
    const { CDMSG } = GameApi.GamePublic.cooling({ UID, CDID })
    if (CDMSG) {
      e.reply(CDMSG)
      return false
    }
    GameApi.GamePublic.setRedis(UID, CDID, now_time, CDTime)
    player.autograph = new_msg
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_player',
      DATA: player
    })
    const { path, name, data } = GameApi.Information.userDataShow({
      UID: e.user_id
    })
    const isreply = e.reply(BotApi.ImgIndex.showPuppeteer({ path, name, data }))
    BotApi.User.surveySet({ e, isreply })
    return false
  }
}
