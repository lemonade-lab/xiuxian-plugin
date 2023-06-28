import { BotApi, GameApi, plugin } from '#xiuxian-api'
/** 购买物品是原价的1.2倍 */
const ExchangeRate = 1.2
export class BoxTransaction extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)万宝楼$/, fnc: 'showComodities' },
        { reg: /^(#|\/)购买[\u4e00-\u9fa5]+\*\d+$/, fnc: 'buyComodities' },
        { reg: /^(#|\/)出售[\u4e00-\u9fa5]+\*\d+$/, fnc: 'sellComodities' },
        { reg: /^(#|\/)置换所有物品$/, fnc: 'substitution' },
        { reg: /^(#|\/)一键出售[\u4e00-\u9fa5]*$/, fnc: 'shellAllType' }
      ]
    })
  }

  async showComodities(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    if (!transactionMessage(e)) return false
    const msg = ['___[万宝楼]___']
    msg.push('[(#|/)购买+物品名*数量]')
    const commoditiesList = GameApi.Data.controlAction({
      NAME: 'commodities',
      CHOICE: 'generate_all'
    })
    for (let item of commoditiesList) {
      const id = item.id.split('-')
      switch (id[0]) {
        case '1': {
          msg.push(`物品:${item.name}\n攻击:${item.attack}%\n价格:${item.price * ExchangeRate}`)
          break
        }
        case '2': {
          msg.push(`物品:${item.name}\n防御:${item.defense}%\n价格:${item.price * ExchangeRate}`)
          break
        }
        case '3': {
          msg.push(`物品:${item.name}\n暴伤:${item.burstmax}%\n价格:${item.price * ExchangeRate}`)
          break
        }
        case '4': {
          if (id[1] == 1) {
            msg.push(`物品:${item.name}\n气血:${item.blood}%\n价格:${item.price * ExchangeRate}`)
          } else {
            msg.push(
              `物品:${item.name}\n修为:${item.experience}\n价格:${item.price * ExchangeRate}`
            )
          }
          break
        }
        case '5': {
          msg.push(`物品:${item.name}\n天赋:${item.size}%\n价格:${item.price * ExchangeRate}`)
          break
        }
        case '6': {
          msg.push(`物品:${item.name}\n价格:${item.price * ExchangeRate}`)
          break
        }
        default: {
          break
        }
      }
    }
    const isreply = await e.reply(
      await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } })
    )
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async buyComodities(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!transactionMessage(e)) return false
    const [thingName, quantity] = e.cmd_msg.replace(/^(#|\/)购买/, '').split('*')
    const Commodities = GameApi.Data.controlAction({
      NAME: 'commodities',
      CHOICE: 'generate_all'
    })
    const ifexist = Commodities.find((item) => item.name == thingName)
    if (!ifexist) {
      e.reply(`[万宝楼]小二\n不卖[${thingName}]`)
      return false
    }
    const money = GameApi.Bag.searchBagByName({
      UID,
      name: '下品灵石'
    })
    const price = ifexist.price * quantity * ExchangeRate
    if (!money || money.acount < price) {
      e.reply(`似乎没有${price}*[下品灵石]`)
      return false
    }
    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: -Number(price)
    })
    GameApi.Bag.addBagThing({
      UID,
      name: ifexist.name,
      ACCOUNT: Number(quantity)
    })
    e.reply(`[万宝楼]薛仁贵\n你花[${price}]下品灵石购买了[${thingName}]*${quantity},`)
    return false
  }

  async sellComodities(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!transactionMessage(e)) return false
    const [thingName, quantity] = e.cmd_msg.replace(/^(#|\/)出售/, '').split('*')
    const najieThing = GameApi.Bag.searchBagByName({
      UID,
      name: thingName
    })
    if (!najieThing) {
      e.reply(`[万宝楼]小二\n你没[${thingName}]`)
      return false
    }

    if (najieThing.acount < quantity) {
      e.reply('[万宝楼]小二\n数量不足')
      return false
    }

    GameApi.Bag.addBagThing({
      UID,
      name: najieThing.name,
      ACCOUNT: -Number(quantity)
    })
    const commoditiesPrice = najieThing.price * quantity
    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: Number(commoditiesPrice)
    })
    e.reply(`[万宝楼]欧阳峰\n出售得${commoditiesPrice}*[下品灵石]`)
    return false
  }

  async substitution(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!transactionMessage(e)) return false
    let bag = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBag'
    })
    let money = 0
    for (let item of bag.thing) {
      if (!isNaN(item.acount) && !isNaN(item.price)) {
        money += Number(item.acount) * Number(item.price)
      }
    }
    if (isNaN(money)) {
      return false
    }
    if (money == 0) {
      return false
    }
    bag.thing = []
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBag',
      DATA: bag
    })
    GameApi.Bag.addBagThing({ UID, name: '下品灵石', ACCOUNT: money })
    e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`)
    return false
  }

  async shellAllType(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!transactionMessage(e)) return false
    const type = e.cmd_msg.replace(/^(#|\/)一键出售/, '')
    const maptype = {
      武器: '1',
      护具: '2',
      法宝: '3',
      丹药: '4',
      功法: '5',
      道具: '6'
    }
    if (!Object.prototype.hasOwnProperty.call(maptype, type)) {
      e.reply(`[蜀山派]叶凡\n此处不收[${type}]`)
      return false
    }
    let bag = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBag'
    })
    let money = 0
    const arr = []
    for (let item of bag.thing) {
      const id = item.id.split('-')
      if (id[0] == maptype[type]) {
        if (!isNaN(item.acount) && !isNaN(item.price)) {
          money += item.acount * item.price
        }
      } else {
        arr.push(item)
      }
    }
    if (isNaN(money)) {
      return false
    }
    if (money == 0) {
      return false
    }
    bag.thing = arr
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBag',
      DATA: bag
    })
    GameApi.Bag.addBagThing({ UID, name: '下品灵石', ACCOUNT: money })
    e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`)
    return false
  }
}
function transactionMessage(e) {
  if (!GameApi.Player.getUserLifeSatus(e.user_id)) {
    e.reply('已仙鹤')
    return false
  }
  const addressName = '万宝楼'
  if (!GameApi.Map.mapAction({ UID: e.user_id, addressName })) {
    e.reply(`需[(#|/)前往+城池名+${addressName}]`)
    return false
  }
  return true
}
