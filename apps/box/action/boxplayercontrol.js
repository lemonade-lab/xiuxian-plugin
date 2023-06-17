import { GameApi, plugin } from '../../../model/api/index.js'
export class BoxPlayerControl extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)降妖$/, fnc: 'dagong' },
        { reg: /^(#|\/)闭关$/, fnc: 'biguan' },
        { reg: /^(#|\/)出关$/, fnc: 'chuGuan' },
        { reg: /^(#|\/)归来$/, fnc: 'endWork' }
      ]
    })
  }
  biguan = async (e) => {
    if (!this.verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = GameApi.GamePublic.GoMini({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    const now_time = new Date().getTime()
    const actionObject = {
      actionName: '闭关',
      startTime: now_time
    }
    GameApi.GamePublic.setAction(UID, actionObject)
    e.reply('开始两耳不闻窗外事...')
    return false
  }
  dagong = async (e) => {
    if (!this.verify(e)) return false
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
    const now_time = new Date().getTime()
    const actionObject = {
      actionName: '降妖',
      startTime: now_time
    }
    GameApi.GamePublic.setAction(UID, actionObject)
    e.reply('开始外出...')
    return false
  }
  chuGuan = async (e) => {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    let action = await GameApi.GamePublic.getAction(UID)
    if (!action) return false
    if (action.actionName != '闭关') return false
    const startTime = action.startTime
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const timeUnit = cf['biguan']['time'] ? cf['biguan']['time'] : 5
    const time = Math.floor((new Date().getTime() - startTime) / 60000)
    if (time < timeUnit) {
      e.reply('只是呆了一会儿...')
      await GameApi.GamePublic.offAction({ UID })
      return false
    }
    await GameApi.GamePublic.offAction({ UID })
    await this.upgrade(UID, time, action.actionName, e)
    return false
  }
  endWork = async (e) => {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    let action = await GameApi.GamePublic.getAction(UID)
    if (!action) return false
    if (action.actionName != '降妖') return false
    const startTime = action.startTime
    const cf = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const timeUnit = cf['work']['time'] ? cf['work']['time'] : 5
    const time = Math.floor((new Date().getTime() - startTime) / 60000)
    if (time < timeUnit) {
      e.reply('只是呆了一会儿...')
      await GameApi.GamePublic.offAction({ UID })
      return false
    }
    await GameApi.GamePublic.offAction({ UID })
    await this.upgrade(UID, time, action.actionName, e)
    return false
  }
  upgrade = async (user_id, time, name, e) => {
    if (!this.verify(e)) return false
    const UID = user_id
    const talent = await GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_talent'
    })
    const buff = Math.floor(talent.talentsize / 100) + Number(1)
    const appSize = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    let map = {
      闭关: 'biguan',
      降妖: 'work'
    }
    let other = Math.floor(appSize[map[name]]['size'] * time * buff)
    if (Math.random() * (100 - 1) + 1 < 20) {
      other -= Math.floor(other / 3)
    }
    let othername = 'experience'
    let msg = `闭关结束\n[修为]*${other}`
    if (name != '闭关') {
      othername = 'experiencemax'
      msg = `降妖归来\n[气血]*${other}`
    }
    await GameApi.GameUser.updataUser({
      UID,
      CHOICE: 'user_level',
      ATTRIBUTE: othername,
      SIZE: other
    })
    await GameApi.GameUser.updataUserBlood({ UID, SIZE: Number(90) })
    msg += '\n[血量状态]90%'
    msg += `\n${name}结束`
    e.reply([segment.at(UID), msg])
    return false
  }
}
