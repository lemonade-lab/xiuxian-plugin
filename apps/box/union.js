import { GameApi, plugin } from '../../model/api/index.js'
export class Boxunion extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)联盟报到$/, fnc: 'userCheckin' },
        { reg: /^(#|\/)联盟签到$/, fnc: 'userSignIn' },
        { reg: /^(#|\/)联盟商会$/, fnc: 'unionShop' },
        { reg: /^(#|\/)兑换[\u4e00-\u9fa5]+\*\d+$/, fnc: 'unionBuy' }
      ]
    })
  }

  async unionShop(e) {
    if (!this.verify(e)) return false
    if (!UnionMessage(e)) return false
    e.reply('[尚未开张~]')
    return false
  }

  async unionBuy(e) {
    if (!this.verify(e)) return false
    if (!UnionMessage(e)) return false
    e.reply('[尚未开张~]')
    return false
  }

  async userSignIn(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!UnionMessage(e)) return false
    const SignData = GameApi.UserData.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'sign',
      INITIAL: {}
    })
    const NowTime = new Date().getTime()
    const NowMath = new Date().getMonth()
    const NowDay = new Date().getDay()
    if (NowTime - SignData[UID].signTine > 24 * 60000 * 60 || SignData[UID].sginMath != NowMath) {
      SignData[UID].signSize = 0
    }
    if (NowDay == SignData[UID].signDay) {
      e.reply('今日已签到~')
      return false
    }
    SignData[UID].signSize += 1
    SignData[UID].signTine = NowTime
    SignData[UID].signDay = NowDay
    if (SignData[UID].signSize > 28) {
      e.reply('本月签到已满28天')
      return false
    }
    SignData[UID].sginMath = NowMath
    // 保存
    GameApi.UserData.controlActionInitial({
      CHOICE: 'user_life',
      NAME: 'sign',
      DATA: SignData,
      INITIAL: {}
    })
    if (SignData[UID].signSize % 7 == 0) {
      const randomthing = GameApi.GP.randomThing()
      GameApi.Bag.addBagThing({
        UID,
        name: randomthing.name,
        ACCOUNT: 1
      })
      e.reply(`本月累计签到${SignData[UID].signSize}天~\n获得${randomthing.name}`)
    } else {
      const ACCOUNT = 20 * (SignData[UID].signSize % 7)
      GameApi.Bag.addBagThing({
        UID,
        name: '中品灵石',
        ACCOUNT
      })
      e.reply(`本月累计签到${SignData[UID].signSize}天~获得[中品灵石]*${ACCOUNT}`)
    }
    return false
  }

  async userCheckin(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!UnionMessage(e)) return false
    const LevelData = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (LevelData.level.gaspractice.realm != 0) {
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
    const randomthing = GameApi.GP.randomThing()
    GameApi.Bag.addBagThing({
      UID,
      name: randomthing.name,
      ACCOUNT: 1
    })
    e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧`)
    return false
  }
}

function UnionMessage(e) {
  if (!GameApi.Player.getUserLifeSatus(e.user_id)) {
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
