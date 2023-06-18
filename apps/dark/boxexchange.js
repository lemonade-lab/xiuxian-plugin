import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxExchange extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)虚空镜$/, fnc: 'supermarket' },
        { reg: /^(#|\/)上架[\u4e00-\u9fa5]*$/, fnc: 'onsell' },
        { reg: /^(#|\/)下架[\u4e00-\u9fa5]*$/, fnc: 'Offsell' },
        { reg: /^(#|\/)选购\d+$/, fnc: 'purchase' }
      ]
    })
  }

  async supermarket(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const exchange = GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      INITIAL: []
    })
    const msg = ['___[虚空镜]___']
    for (let item of exchange) {
      msg.push(
        `编号:${item.ID}\n物品:${item.thing.name}\n数量:${item.account}\n价格:${item.money}\n`
      )
    }
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    return false
  }

  async onsell(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const [thingName, thingAcount, thingMoney] = e.msg.replace(/^(#|\/)上架/, '').split('*')
    const bagThing = GameApi.GameUser.userBagSearch({
      UID,
      name: thingName
    })
    if (!bagThing) {
      e.reply(`没有[${thingName}]`)
      return false
    }
    const account = GameApi.Method.leastOne(thingAcount)
    const money = GameApi.Method.leastOne(thingMoney)
    if (bagThing.acount < account) {
      e.reply(`[${thingName}]不够`)
      return false
    }
    const myDate = new Date().getTime()
    const sum = Math.floor(Math.random() * (10 - 1) + 1)
    const exchange = GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      INITIAL: []
    })
    exchange.push({
      ID: `${myDate}${sum}`,
      UID,
      thing: bagThing,
      account: Number(account),
      money: Number(money * account)
    })
    GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      DATA: exchange,
      INITIAL: []
    })
    GameApi.GameUser.userBag({
      UID,
      name: bagThing.name,
      ACCOUNT: -Number(account)
    })
    e.reply(`成功上架:\n${bagThing.name}*${account}*${money}\n编号:${myDate}${sum}`)
    return false
  }

  async Offsell(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    let ID = e.msg.replace(/^(#|\/)下架/, '')
    let x = 888888888
    let exchange = GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      INITIAL: []
    })
    exchange.forEach((item, index) => {
      if (item.ID == ID) {
        x = index
      }
    })
    if (x == 888888888) {
      e.reply(`找不到${ID}`)
      return false
    }
    if (exchange[x].UID != UID) {
      return false
    }
    let najie = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_bag'
    })
    if (najie.thing.length >= najie.grade * 10) {
      e.reply('储物袋已满')
      return false
    }
    GameApi.GameUser.userBag({
      UID,
      name: exchange[x].thing.name,
      ACCOUNT: Number(exchange[x].account)
    })
    exchange = exchange.filter((item) => item.ID != ID)
    GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      DATA: exchange,
      INITIAL: []
    })
    e.reply(`成功下架${ID}`)
    return false
  }

  async purchase(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    let ID = e.msg.replace(/^(#|\/)选购/, '')
    let x = 888888888
    let exchange = GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      INITIAL: []
    })
    exchange.forEach((item, index) => {
      if (item.ID == ID) {
        x = index
      }
    })
    if (x == 888888888) {
      e.reply(`找不到${ID}`)
      return false
    }
    const money = GameApi.GameUser.userBagSearch({
      UID,
      name: '下品灵石'
    })
    if (!money || money.acount < exchange[x].money) {
      e.reply(`似乎没有${exchange[x].money}下品灵石`)
      return false
    }
    let najie = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_bag'
    })
    if (najie.thing.length >= najie.grade * 10) {
      e.reply('储物袋已满')
      return false
    }
    GameApi.GameUser.userBag({
      UID,
      name: exchange[x].thing.name,
      ACCOUNT: Number(exchange[x].account)
    })
    GameApi.GameUser.userBag({
      UID,
      name: '下品灵石',
      ACCOUNT: -Number(exchange[x].money)
    })
    GameApi.GameUser.userBag({
      UID: exchange[x].UID,
      name: '下品灵石',
      ACCOUNT: Number(exchange[x].money)
    })
    exchange = exchange.filter((item) => item.ID != ID)
    GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      DATA: exchange,
      INITIAL: []
    })
    e.reply(`成功选购${ID}`)
    return false
  }
}
