import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxDice extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)万花坊$/, fnc: 'userDice' },
        { reg: /^(#|\/)命运转盘[\u4e00-\u9fa5]+\*\d+$$/, fnc: 'wheelDestiny' }
      ]
    })
  }

  async userDice(e) {
    if (!this.verify(e)) return false
    if (!diceMessage(e)) return false
    const msg = ['___[万花坊]___']
    msg.push('[(#|/)命运转盘+物品名*数量]')
    const commoditiesList = GameApi.Listdata.controlAction({
      NAME: 'wheeldisc',
      CHOICE: 'generate_all'
    })
    for (let item of commoditiesList) {
      const id = item.id.split('-')
      switch (id[0]) {
        case '1': {
          msg.push(`物品:${item.name}\n攻击:${item.attack}%\n声望:${item.price}`)
          break
        }
        case '2': {
          msg.push(`物品:${item.name}\n防御:${item.defense}%\n声望:${item.price}`)
          break
        }
        case '3': {
          msg.push(`物品:${item.name}\n暴伤:${item.burstmax}%\n声望:${item.price}`)
          break
        }
        case '4': {
          if (id[1] == 1) {
            msg.push(`物品:${item.name}\n气血:${item.blood}%\n声望:${item.price}`)
          } else {
            msg.push(`物品:${item.name}\n修为:${item.experience}\n声望:${item.price}`)
          }
          break
        }
        case '5': {
          msg.push(`物品:${item.name}\n天赋:${item.size}%\n声望:${item.price}`)
          break
        }
        case '6': {
          msg.push(`物品:${item.name}\n声望:${item.price}`)
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
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }

  async wheelDestiny(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!diceMessage(e)) return false
    const thingName = e.msg.replace(/^(#|\/)命运转盘/, '')
    const [NAME, ACCOUNT] = thingName.split('*')
    const commoditiesList = GameApi.Listdata.controlAction({
      NAME: 'wheeldisc',
      CHOICE: 'generate_all'
    })
    const FindData = commoditiesList.find((item) => item.name == NAME)
    if (!FindData) {
      e.reply('[万花坊]千变子\n此物品不可为也')
      return
    }
    const goods = GameApi.Bag.searchBagByName({
      UID,
      name: NAME
    })
    if (!goods || goods.acount < ACCOUNT) {
      e.reply(`似乎没有[${NAME}]*${ACCOUNT}`)
      return false
    }
    const LevelData = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    if (LevelData.gaspractice.realm < 1) {
      return false
    }
    /** 扣除 */
    GameApi.Bag.addBagThing({
      UID,
      name: NAME.name,
      ACCOUNT
    })
    if (!GameApi.Method.isTrueInRange(1, 100, 50)) {
      e.reply('[万花坊]千变\n一无所获')
      return false
    }
    /* 随机物品 */
    const randomthing = GameApi.GP.randomThing()
    GameApi.Bag.addBagThing({
      UID,
      name: randomthing.name,
      ACCOUNT
    })
    e.reply(`[万花坊]千变子\n${NAME}成功转化为${randomthing.name}`)
    return false
  }
}

function diceMessage(e) {
  if (!GameApi.Player.getUserLifeSatus(e.user_id)) {
    e.reply('已仙鹤')
    return false
  }
  const addressName = '万花坊'
  if (!GameApi.Map.mapAction({ UID: e.user_id, addressName })) {
    e.reply(`需[(#|/)前往+城池名+${addressName}]`)
    return false
  }
  return true
}
