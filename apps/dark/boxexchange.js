import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxExchange extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)虚空镜$/, fnc: 'supermarket' },
        { reg: /^(#|\/)上架[\u4e00-\u9fa5]+\*\d+\*\d+$/, fnc: 'onsell' },
        { reg: /^(#|\/)下架物品$/, fnc: 'Offsell' },
        { reg: /^(#|\/)选购\d+$/, fnc: 'purchase' }
      ]
    })
  }

  async supermarket(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const exchange = GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      INITIAL: {}
    })
    const msg = ['___[虚空镜]___']
    for (let item in exchange) {
      msg.push(
        `编号:${exchange[item].ID}\n物品:${exchange[item].thing.name}\n数量:${exchange[item].account}\n价格:${exchange[item].money}\n`
      )
    }
    const isreply = await e.reply(
      await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } })
    )
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }

  async onsell(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const [thingName, account, money] = e.msg.replace(/^(#|\/)上架/, '').split('*')
    const bagThing = GameApi.Bag.searchBagByName({
      UID,
      name: thingName
    })
    if (!bagThing) {
      e.reply(`没有[${thingName}]`)
      return false
    }
    if (bagThing.acount < account) {
      e.reply(`[${thingName}]不够`)
      return false
    }
    const myDate = new Date().getTime()
    const sum = Math.floor(Math.random() * (10 - 1) + 1)
    const exchange = GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      INITIAL: {}
    })
    const ID = myDate + sum
    const LifeData = GameApi.UserData.controlActionInitial({
      NAME: 'life',
      CHOICE: 'user_life',
      INITIAL: {}
    })
    if (exchange[LifeData[UID].createTime]) {
      e.reply('有待出售物品未成功出售~')
      return false
    }
    exchange[LifeData[UID].createTime] = {
      ID,
      thing: bagThing,
      account,
      money: money * account
    }
    GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      DATA: exchange,
      INITIAL: {}
    })
    GameApi.Bag.addBagThing({
      UID,
      name: bagThing.name,
      ACCOUNT: -account
    })
    e.reply(`成功上架:\n${bagThing.name}*${account}*${money}\n编号:${ID}`)
    return false
  }

  async Offsell(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    let exchange = GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      INITIAL: {}
    })
    /**
     * 还要再加一个寿命信息,拿到创建的时间
     */
    const LifeData = GameApi.UserData.controlActionInitial({
      NAME: 'life',
      CHOICE: 'user_life',
      INITIAL: {}
    })
    /**
     * 每个人的创建时间都不同,可以作为第二个UID
     */
    if (!exchange[LifeData[UID].createTime]) {
      e.reply('未有上架物品')
      return
    }
    const najie = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_bag'
    })
    if (najie.thing.length >= najie.grade * 10) {
      e.reply('储物袋已满')
      return false
    }
    GameApi.Bag.addBagThing({
      UID,
      name: exchange[LifeData[UID].createTime].thing.name,
      ACCOUNT: exchange[LifeData[UID].createTime].account
    })
    delete exchange[LifeData[UID].createTime]
    GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      DATA: exchange,
      INITIAL: {}
    })
    e.reply(`成功下架个人物品`)
    return false
  }

  async purchase(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    // 寻找id
    let ID = e.msg.replace(/^(#|\/)选购/, '')
    let x = 888888888
    let y = 888888888
    let exchange = GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      INITIAL: {}
    })
    for (let item in exchange) {
      if (exchange[item].ID == ID) {
        x = ID
        y = item
      }
    }
    if (x == 888888888 || y == 888888888) {
      e.reply(`找不到${ID}`)
      return false
    }
    // 验证
    const money = GameApi.Bag.searchBagByName({
      UID,
      name: '下品灵石'
    })
    if (!money || money.acount < exchange[y].money) {
      e.reply(`似乎没有${exchange[y].money}下品灵石`)
      return false
    }
    const najie = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_bag'
    })
    if (najie.thing.length >= najie.grade * 10) {
      e.reply('储物袋已满')
      return false
    }
    GameApi.Bag.addBagThing({
      UID,
      name: exchange[y].thing.name,
      ACCOUNT: exchange[y].account
    })
    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: -exchange[x].money
    })
    GameApi.Bag.addBagThing({
      UID: exchange[x].UID,
      name: '下品灵石',
      ACCOUNT: exchange[x].money
    })
    delete exchange[y]
    GameApi.UserData.controlActionInitial({
      NAME: 'exchange',
      CHOICE: 'generate_exchange',
      DATA: exchange,
      INITIAL: {}
    })
    e.reply(`成功选购${ID}`)
    return false
  }
}
