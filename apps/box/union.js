import { GameApi, plugin } from '../../model/api/index.js'
export class Boxunion extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)联盟报到$/, fnc: 'userCheckin' },
        { reg: /^(#|\/)联盟签到$/, fnc: 'userignIn' },
        { reg: /^(#|\/)联盟商会$/, fnc: 'unionShop' }
      ]
    })
  }

  async unionShop(e) {
    if (!this.verify(e)) return false
    if (!UnionMessage(e)) return false
    e.reply('待世界升级~')
    return false
  }

  async userSignIn(e) {
    if (!this.verify(e)) return false
    if (!UnionMessage(e)) return false
    const UID = e.user_id
    const SignData = GameApi.UserData.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'sign',
      INITIAL: {}
    })
    const { signTine, sginMath } = SignData[UID]
    const NowTime = new Date().getTime()
    const NowMath = new Date().getMonth()
    const NowDay = new Date().getDay()
    // 签到时间-超过24h,重置size
    // 签到的月份,不同月重置size
    if (NowTime - signTine > 24 * 60000 * 60 || sginMath != NowMath) {
      // 超过24h
      SignData[UID].signSize = 0
    }
    if (NowDay == SignData[UID].signDay) {
      e.reply('今日已签到~')
      return false
    }
    SignData[UID].signSize += 1
    SignData[UID].signTine = signTine
    if (SignData[UID].signSize > 28) {
      e.reply('本月签到已满28天')
    }
    SignData[UID].sginMath = NowMath
    // 保存
    GameApi.UserData.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'sign',
      DATA: SignData,
      INITIAL: {}
    })
    e.reply(`本月累计签到${SignData[UID].signSize}天~`)
    return false
  }

  async userCheckin(e) {
    if (!this.verify(e)) return false
    if (!UnionMessage(e)) return false
    const UID = e.user_id
    const level = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (level.levelId != 1) {
      e.reply('[修仙联盟]方正\n前辈莫要开玩笑')
      return false
    }
    const action = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    if (action.newnoe != 1) {
      e.reply('[修仙联盟]方正\n道友要不仔细看看自己的储物袋')
      return false
    }
    action.newnoe = 0
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action',
      DATA: action
    })
    const randomthing = GameApi.GameUser.randomThing()
    GameApi.GameUser.userBag({
      UID,
      name: randomthing.name,
      ACCOUNT: randomthing.acount
    })
    e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧`)
    return false
  }
}

function UnionMessage(e) {
  if (!GameApi.GameUser.existUserSatus(e.user_id)) {
    e.reply('已仙鹤')
    return false
  }
  const { state, msg } = GameApi.Wrap.Go(e.user_id)
  if (state == 4001) {
    e.reply(msg)
    return false
  }
  const addressName = '联盟'
  if (!GameApi.WrapMap.mapAction({ UID: e.user_id, addressName })) {
    e.reply(`需[(#|/)前往+城池名+${addressName}]`)
    return false
  }
  return true
}
