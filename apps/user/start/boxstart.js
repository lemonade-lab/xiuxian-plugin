import { BotApi, GameApi, plugin, verify } from '../../../model/api/index.js'
export class BoxStart extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)踏入仙途$/, fnc: 'createMsg' },
        { reg: /^(#|\/)再入仙途$/, fnc: 'reCreateMsg' }
      ]
    })
    this.task = {
      cron: GameApi.DefsetUpdata.getConfig({ app: 'task', name: 'task' }).LifeTask,
      name: 'LifeTask',
      fnc: () => {
        GameApi.GameUser.startLife()
      }
    }
  }
  createMsg = async (e) => {
    if (!verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { path, name, data } = await GameApi.Information.userDataShow({
      UID: e.user_id
    })
    const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
    await BotApi.User.surveySet({ e, isreply })
    return false
  }
  reCreateMsg = async (e) => {
    if (!verify(e)) return false
    const UID = e.user_id
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const CDTime = cf['CD']['Reborn'] ? cf['CD']['Reborn'] : 850
    const CDID = '8'
    const now_time = new Date().getTime()
    const { CDMSG } = await GameApi.GamePublic.cooling({ UID, CDID })
    if (CDMSG) {
      e.reply(CDMSG)
      return false
    }
    GameApi.GamePublic.setRedis(UID, CDID, now_time, CDTime)
    await GameApi.GamePublic.offAction({ UID })
    let life = await GameApi.UserData.listActionInitial({
      NAME: 'life',
      CHOICE: 'user_life',
      INITIAL: []
    })
    life = await life.filter((item) => item.qq != UID)
    await GameApi.UserData.listAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: life
    })
    await GameApi.GameUser.createBoxPlayer({ UID: e.user_id })
    const { path, name, data } = await GameApi.Information.userDataShow({
      UID: e.user_id
    })
    const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
    await BotApi.User.surveySet({ e, isreply })
    return false
  }
}
