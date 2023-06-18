import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxBank extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)金银坊$/, fnc: 'moneyWorkshop' },
        { reg: /^(#|\/)金银置换.*$/, fnc: 'substitution' }
      ]
    })
  }

  async moneyWorkshop(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const StorageList = GameApi.UserData.controlActionInitial({
      NAME: 'storage',
      CHOICE: 'user_bank',
      INITIAL: {}
    })
    const WhiteBarList = GameApi.UserData.controlActionInitial({
      NAME: 'whiteBar',
      CHOICE: 'user_bank',
      INITIAL: {}
    })
    const msg = []
    if (!Object.prototype.hasOwnProperty.call(StorageList, UID)) {
      msg.push('无存款记录')
    } else {
      msg.push(`存款:${StorageList[UID].account}`)
    }
    if (!Object.prototype.hasOwnProperty.call(StorageList, UID)) {
      msg.push('无白条记录')
    } else {
      msg.push(`借款:${WhiteBarList[UID].money}`)
    }
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    return false
  }

  async substitution(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const [account, name] = e.msg.replace(/^(#|\/)金银置换/, '').split('*')
    let theAccount = GameApi.Method.leastOne(account)
    const money = GameApi.GameUser.userBagSearch({
      UID,
      name: '下品灵石'
    })
    if (!money || money.acount < theAccount) {
      e.reply(`[金银坊]金老三\n?哪儿来的穷鬼！`)
      return false
    }
    if (theAccount < 5000) {
      e.reply(`[金银坊]金老三\n少于5000不换`)
      return false
    }
    let theName = '中品灵石'
    let size = 30
    switch (name) {
      case '上品灵石': {
        theName = name
        size = 400
        break
      }
      case '极品灵石': {
        theName = name
        size = 5000
        break
      }
      default: {
        theName = '中品灵石'
        size = 30
        break
      }
    }
    const theMoney = Math.floor(theAccount / size)
    GameApi.GameUser.userBag({
      UID,
      name: '下品灵石',
      ACCOUNT: -Number(theAccount)
    })
    GameApi.GameUser.userBag({
      UID,
      name: theName,
      ACCOUNT: Number(theMoney)
    })
    e.reply(`[下品灵石]*${theAccount}\n置换成\n[${theName}]*${theMoney}`)
    return false
  }
}
