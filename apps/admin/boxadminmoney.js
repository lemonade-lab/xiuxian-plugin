import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class boxadminmoney extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)修仙扣除.*$/, fnc: 'deduction' },
        { reg: /^(#|\/)修仙馈赠.*$/, fnc: 'gifts' }
      ]
    })
  }

  async gifts(e) {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    const UID = BotApi.Robot.at({ e })
    if (!UID) return false
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const thingName = e.msg.replace(/^(#|\/)修仙馈赠/, '')
    const [name, acount] = thingName.split('*')
    const quantity = GameApi.Method.leastOne(acount)
    const bag = GameApi.GameUser.userBag({
      UID,
      name,
      ACCOUNT: quantity
    })
    if (bag) {
      e.reply(`${UID}获得馈赠[${name}]*${quantity}`)
    } else {
      e.reply(`馈赠[${name}]失败`)
    }
    return false
  }

  async deduction(e) {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    const UID = BotApi.Robot.at({ e })
    if (!UID) return false
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    let lingshi = e.msg.replace(/^(#|\/)修仙扣除/, '')
    lingshi = GameApi.Method.leastOne(lingshi)
    const thing = GameApi.GameUser.userBagSearch({
      UID,
      name: '下品灵石'
    })
    if (!thing || thing.acount < lingshi) {
      e.reply('他好穷的')
      return false
    }
    GameApi.GameUser.userBag({
      UID,
      name: '下品灵石',
      ACCOUNT: -lingshi
    })
    e.reply(`已扣除${lingshi}[下品灵石]`)
    return false
  }
}
