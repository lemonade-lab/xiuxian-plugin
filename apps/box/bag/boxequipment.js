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
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const thing_name = e.msg.replace(/^(#|\/)装备/, '')
    const najie_thing = GameApi.GameUser.userBagSearch({
      UID,
      name: thing_name
    })
    if (!najie_thing) {
      e.reply(`没有[${thing_name}]`)
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
    equipment.push(najie_thing)
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment',
      DATA: equipment
    })
    GameApi.GameUser.userBag({ UID, name: thing_name, ACCOUNT: -1 })
    GameApi.GameUser.readPanel({ UID })
    e.reply(`装备[${thing_name}]`)
    return false
  }
  async deleteEquipment(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const thing_name = e.msg.replace(/^(#|\/)卸下/, '')
    let equipment = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment'
    })
    const islearned = equipment.find((item) => item.name == thing_name)
    if (!islearned) {
      return false
    }
    const q = {
      x: 0
    }
    equipment.forEach((item, index, arr) => {
      if (item.name == thing_name && q.x == 0) {
        q.x = 1
        arr.splice(index, 1)
      }
    })
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_equipment',
      DATA: equipment
    })
    GameApi.GameUser.userBag({ UID, name: thing_name, ACCOUNT: 1 })
    GameApi.GameUser.readPanel({ UID })
    e.reply(`已卸下[${thing_name}]`)
    return false
  }
}
