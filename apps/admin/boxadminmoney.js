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
  gifts = async (e) => {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    const UID = await BotApi.User.at({ e })
    if (!UID) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    const thing_name = e.msg.replace(/^(#|\/)修仙馈赠/, '')
    const [name, acount] = thing_name.split('*')
    const quantity = GameApi.GamePublic.leastOne({ value: acount })
    const bag = await GameApi.GameUser.userBag({
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
  deduction = async (e) => {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    const UID = await BotApi.User.at({ e })
    if (!UID) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    let lingshi = e.msg.replace(/^(#|\/)修仙扣除/, '')
    lingshi = await GameApi.GamePublic.leastOne({ value: lingshi })
    const thing = await GameApi.GameUser.userBagSearch({
      UID,
      name: '下品灵石'
    })
    if (!thing || thing.acount < lingshi) {
      e.reply('他好穷的')
      return false
    }
    await GameApi.GameUser.userBag({
      UID,
      name: '下品灵石',
      ACCOUNT: -lingshi
    })
    e.reply(`已扣除${lingshi}[下品灵石]`)
    return false
  }
}
