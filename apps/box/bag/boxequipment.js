import { GameApi, plugin } from '../../../model/api/index.js'
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
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const thingName = e.msg.replace(/^(#|\/)装备/, '')
    const najieThing = GameApi.GameUser.userBagSearch({
      UID,
      name: thingName
    })
    if (!najieThing) {
      e.reply(`没有[${thingName}]`)
      return false
    }
    const equipment = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment'
    })
    if (
      equipment.length >=
      GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' }).myconfig.equipment
    ) {
      return false
    }
    equipment.push(najieThing)
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment',
      DATA: equipment
    })
    GameApi.GameUser.userBag({ UID, name: thingName, ACCOUNT: -1 })
    GameApi.GameUser.readPanel({ UID })
    e.reply(`装备[${thingName}]`)
    return false
  }

  async deleteEquipment(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const thingName = e.msg.replace(/^(#|\/)卸下/, '')
    let equipment = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment'
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
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment',
      DATA: equipment
    })
    GameApi.GameUser.userBag({ UID, name: thingName, ACCOUNT: 1 })
    GameApi.GameUser.readPanel({ UID })
    e.reply(`已卸下[${thingName}]`)
    return false
  }
}
