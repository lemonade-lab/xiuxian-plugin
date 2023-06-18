import { BotApi, GameApi, plugin } from '../../../model/api/index.js'
/** 购买物品是原价的1.1倍 */
const ExchangeRate = 1.1
export class BoxTransaction extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)万宝楼$/, fnc: 'showComodities' },
        { reg: /^(#|\/)购买.*$/, fnc: 'buyComodities' },
        { reg: /^(#|\/)出售.*$/, fnc: 'sellComodities' }
      ]
    })
  }

  async showComodities(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }

    const addressName = '万宝楼'
    if (!GameApi.WrapMap.mapAction({ UID, addressName })) {
      e.reply(`需[(#|/)前往+城池名+${addressName}]`)
    }

    const msg = ['___[万宝楼]___\n[(#|/)购买+物品名*数量]\n不填数量,默认为1']

    const commoditiesList = GameApi.UserData.controlAction({
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

    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))

    return false
  }

  async buyComodities(e) {
    if (!this.verify(e)) return false

    const UID = e.user_id

    if (!GameApi.GameUser.existUserSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }

    const addressName = '万宝楼'
    if (!GameApi.WrapMap.mapAction({ UID, addressName })) {
      e.reply(`需[(#|/)前往+城池名+${addressName}]`)
    }

    const [thingName, thingAcount] = e.msg.replace(/^(#|\/)购买/, '').split('*')
    let quantity = GameApi.Method.leastOne(thingAcount)
    if (quantity > 99) {
      quantity = 99
    }
    const Commodities = GameApi.UserData.controlAction({
      NAME: 'commodities',
      CHOICE: 'generate_all'
    })
    const ifexist = Commodities.find((item) => item.name == thingName)
    if (!ifexist) {
      e.reply(`[万宝楼]小二\n不卖[${thingName}]`)
      return false
    }
    const money = GameApi.GameUser.userBagSearch({
      UID,
      name: '下品灵石'
    })
    const price = ifexist.price * quantity * ExchangeRate
    if (!money || money.acount < price) {
      e.reply(`似乎没有${price}*[下品灵石]`)
      return false
    }
    GameApi.GameUser.userBag({
      UID,
      name: '下品灵石',
      ACCOUNT: -Number(price)
    })
    GameApi.GameUser.userBag({
      UID,
      name: ifexist.name,
      ACCOUNT: Number(quantity)
    })
    e.reply(`[万宝楼]薛仁贵\n你花[${price}]下品灵石购买了[${thingName}]*${quantity},`)
    return false
  }

  async sellComodities(e) {
    if (!this.verify(e)) return false

    const UID = e.user_id

    if (!GameApi.GameUser.existUserSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }

    const addressName = '万宝楼'
    if (!GameApi.WrapMap.mapAction({ UID, addressName })) {
      e.reply(`需[(#|/)前往+城池名+${addressName}]`)
    }

    const [thingName, thingAcount] = e.msg.replace(/^(#|\/)出售/, '').split('*')

    let quantity = GameApi.Method.leastOne(thingAcount)
    if (quantity > 99) {
      quantity = 99
    }

    const najieThing = GameApi.GameUser.userBagSearch({
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

    GameApi.GameUser.userBag({
      UID,
      name: najieThing.name,
      ACCOUNT: -Number(quantity)
    })

    const commoditiesPrice = najieThing.price * quantity

    GameApi.GameUser.userBag({
      UID,
      name: '下品灵石',
      ACCOUNT: Number(commoditiesPrice)
    })
    e.reply(`[万宝楼]欧阳峰\n出售得${commoditiesPrice}*[下品灵石]`)
    return false
  }
}
