import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class Boxadminmoney extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)修仙扣除[\u4e00-\u9fa5]+\*\d+$/, fnc: 'deduction' },
        { reg: /^(#|\/)修仙馈赠[\u4e00-\u9fa5]+\*\d+$/, fnc: 'gifts' }
      ]
    })
  }

  async deduction(e) {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    const UID = BotApi.Robot.at({ e })
    if (!UID) return false
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const thingName = e.msg.replace(/^(#|\/)修仙扣除/, '')
    const [name, ACCOUNT] = thingName.split('*')
    const thing = GameApi.Bag.searchBagByName({
      UID,
      name
    })
    if (!thing || thing.acount < ACCOUNT) {
      e.reply('数量不足')
      return false
    }
    GameApi.Bag.addBagThing({
      UID,
      name,
      ACCOUNT: -ACCOUNT
    })
    const LifeData = GameApi.UserData.controlAction({
      NAME: 'life',
      CHOICE: 'playerLife'
    })
    e.reply(`${LifeData[UID]}被扣除${ACCOUNT}[${name}]`)
    return false
  }

  async gifts(e) {
    if (!e.isMaster) return false
    if (!this.verify(e)) return false
    const UID = BotApi.Robot.at({ e })
    if (!UID) return false
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const thingName = e.msg.replace(/^(#|\/)修仙馈赠/, '')
    const [name, ACCOUNT] = thingName.split('*')
    const bag = GameApi.Bag.addBagThing({
      UID,
      name,
      ACCOUNT
    })
    const LifeData = GameApi.UserData.controlAction({
      NAME: 'life',
      CHOICE: 'playerLife'
    })
    if (bag) {
      e.reply(`${LifeData[UID].name}获馈赠[${name}]*${ACCOUNT}`)
    }
    return false
  }
}
