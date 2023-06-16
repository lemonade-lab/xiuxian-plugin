import { BotApi, GameApi, plugin, name, dsc, verify } from '../../../model/api/api.js'
export class BoxModify extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: /^#更改道号[\u4e00-\u9fa5]*$/, fnc: 'changeName' },
        { reg: /^#更改道宣[\u4e00-\u9fa5]*$/, fnc: 'changeAutograph' }
      ]
    })
  }
  changeName = async (e) => {
    if (!verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    let new_name = e.msg.replace('#更改道号', '')
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
    const { CDMSG } = await GameApi.GamePublic.cooling({ UID, CDID })
    if (CDMSG) {
      e.reply(CDMSG)
      return false
    }
    GameApi.GamePublic.setRedis(UID, CDID, now_time, CDTime)
    const life = await GameApi.UserData.listActionInitial({
      NAME: 'life',
      CHOICE: 'user_life',
      INITIAL: []
    })
    life.forEach((item) => {
      if (item.qq == UID) {
        item.name = new_name
      }
    })
    await GameApi.UserData.listAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: life
    })
    const { path, name, data } = await GameApi.Information.userDataShow({
      UID: e.user_id
    })
    const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
    await BotApi.User.surveySet({ e, isreply })
    return false
  }
  changeAutograph = async (e) => {
    if (!verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    const player = GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_player'
    })
    let new_msg = e.msg.replace('#更改道宣', '')
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
    const { CDMSG } = await GameApi.GamePublic.cooling({ UID, CDID })
    if (CDMSG) {
      e.reply(CDMSG)
      return false
    }
    GameApi.GamePublic.setRedis(UID, CDID, now_time, CDTime)
    player.autograph = new_msg
    await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_player',
      DATA: player
    })
    const { path, name, data } = await GameApi.Information.userDataShow({
      UID: e.user_id
    })
    const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
    await BotApi.User.surveySet({ e, isreply })
    return false
  }
}
