import { BotApi, GameApi, plugin } from '../../model/api/index.js'
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
    const UID = e.user_id
    if (!modifiyMessage(e)) return false
    let theName = e.msg.replace(/^(#|\/)更改道号/, '')
    if (theName.length == 0) {
      return false
    }
    if (theName.length > 8) {
      e.reply('这名可真是稀奇')
      return false
    }
    const CDID = '3'
    const nowTime = new Date().getTime()
    const cf = GameApi.Defset.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const CDTime = cf.CD.Name ? cf.CD.Name : 5
    const { state: coolingState, msg: coolingMsg } = GameApi.Wrap.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(coolingMsg)
      return false
    }
    GameApi.Wrap.setRedis(UID, CDID, nowTime, CDTime)
    const LifeData = GameApi.UserData.controlActionInitial({
      NAME: 'life',
      CHOICE: 'user_life',
      INITIAL: {}
    })
    LifeData[UID].name = theName
    GameApi.UserData.controlAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: LifeData
    })
    const { path, name, data } = GameApi.Information.userDataShow(e.user_id)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }

  async changeAutograph(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!modifiyMessage(e)) return false
    let theMsg = e.msg.replace(/^(#|\/)更改道号/, '')
    if (theMsg.length == 0 || theMsg.length > 50) {
      e.reply('请正确设置,且道宣最多50字符')
      return false
    }
    const CDID = '4'
    const nowTime = new Date().getTime()
    const cf = GameApi.Defset.getConfig({
      app: 'parameter',
      name: 'cooling'
    })
    const CDTime = cf.CD.Autograph ? cf.CD.Autograph : 5
    const { state: coolingState, msg: coolingMsg } = GameApi.Wrap.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(coolingMsg)
      return false
    }
    GameApi.Wrap.setRedis(UID, CDID, nowTime, CDTime)
    const LifeData = GameApi.UserData.controlActionInitial({
      NAME: 'life',
      CHOICE: 'user_life',
      INITIAL: {}
    })
    LifeData[UID].autograph = theMsg
    GameApi.UserData.controlAction({
      NAME: 'life',
      CHOICE: 'user_life',
      DATA: LifeData
    })
    const { path, name, data } = GameApi.Information.userDataShow(e.user_id)
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }
}

function modifiyMessage(e) {
  if (!GameApi.Player.existUserSatus(e.user_id)) {
    e.reply('已仙鹤')
    return false
  }
  const { state, msg } = GameApi.Wrap.Go(e.user_id)
  if (state == 4001) {
    e.reply(msg)
    return false
  }
  return true
}
