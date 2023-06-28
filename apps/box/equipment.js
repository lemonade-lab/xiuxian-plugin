import { GameApi, plugin } from '#xiuxian-api'
export class BoxEquipment extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)装备[\u4e00-\u9fa5]*$/, fnc: 'addEquipment' },
        { reg: /^(#|\/)卸下[\u4e00-\u9fa5]*$/, fnc: 'deleteEquipment' }
      ]
    })
  }

  async addEquipment(e) {
    if (!super.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const thingName = e.cmd_msg.replace(/^(#|\/)装备/, '')
    const najieThing = GameApi.Bag.searchBagByName({
      UID,
      name: thingName
    })
    if (!najieThing) {
      e.reply(`没有[${thingName}]`)
      return false
    }
    const equipment = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerEquipment'
    })
    if (equipment.length >= GameApi.Defset.getConfig('cooling').myconfig.equipment) {
      return false
    }
    equipment.push(najieThing)
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerEquipment',
      DATA: equipment
    })
    GameApi.Bag.addBagThing({ UID, name: thingName, ACCOUNT: -1 })
    GameApi.Battle.updatePanel(UID)
    e.reply(`装备[${thingName}]`)
    return false
  }

  async deleteEquipment(e) {
    if (!super.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const thingName = e.cmd_msg.replace(/^(#|\/)卸下/, '')
    let equipment = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerEquipment'
    })
    const islearned = equipment.find((item) => item.name == thingName)
    if (!islearned) {
      return false
    }
    const q = {
      x: 0
    }
    equipment.forEach((item, index, arr) => {
      if (item.name == thingName && q.x == 0) {
        q.x = 1
        arr.splice(index, 1)
      }
    })
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerEquipment',
      DATA: equipment
    })
    GameApi.Bag.addBagThing({ UID, name: thingName, ACCOUNT: 1 })
    GameApi.Battle.updatePanel(UID)
    e.reply(`已卸下[${thingName}]`)
    return false
  }
}
