import { type Event, plugin, define } from '../import'
import { ReverseEquipmentNameMap, ReverseKillNameMap } from '../model/base'
import { writeArchiveData } from '../model/data'
import { getKillById } from '../model/kills'
import { getUserMessageByUid } from '../model/message'
import { getUserName } from '../model/utils'
import component from '../image/index'
export class bag extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?储物袋/,
          fnc: 'bag'
        },
        {
          reg: /^(#|\/)?学习/,
          fnc: 'study'
        },
        {
          reg: /^(#|\/)?装备武器/,
          fnc: 'addEuitment'
        },
        {
          reg: /^(#|\/)?卸下武器/,
          fnc: 'deleTeEuitment'
        }
      ]
    })
  }

  /**
   * 储物袋
   * @param e
   * @returns
   */
  async bag(e: Event) {
    // 获取账号
    const uid = e.user_id
    // 尝试读取数据，如果没有数据将自动创建
    const data = getUserMessageByUid(uid)
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.bag(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }

  /**
   * 学习
   * @param e
   * @returns
   */
  async study(e: Event) {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?学习/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseKillNameMap[name]
    if (!ID) {
      e.reply(`此方世界没有功法《${name}》`)
      return
    }
    const data = getUserMessageByUid(uid)
    const T = data.kills[ID]
    if (T) {
      e.reply(`已学习`)
      return
    }
    const count = data.bags.kills[ID]
    if (!count || count <= 0) {
      e.reply(`没有功法《${name}》`)
      return
    }
    data.bags.kills[ID] -= 1
    if (data.bags.kills[ID] <= 0) {
      delete data.bags.kills[ID]
    }
    const sData = getKillById(Number(ID))
    data.efficiency += sData.efficiency
    data.kills[ID] = true
    // 保存
    writeArchiveData('player', uid, data)
    e.reply(`学得${name}`)
    return false
  }

  /**
   *
   * @param e
   */
  async addEuitment(e: Event) {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?装备武器/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseEquipmentNameMap[name]
    if (!ID) {
      e.reply(`此方世界没有此物《${name}》`)
      return
    }
    const data = getUserMessageByUid(uid)
    if (data.equipments?.arms) {
      e.reply(`已装备武器`)
      return
    }
    const count = data.bags.equipments[ID]
    if (!count || count <= 0) {
      e.reply(`没有武器 [${name}]`)
      return
    }
    data.bags.equipments[ID] -= 1
    if (data.bags.equipments[ID] <= 0) {
      delete data.bags.equipments[ID]
    }
    // 记录武器
    data.equipments.arms = ID
    // 保存
    writeArchiveData('player', uid, data)
    e.reply(`装备 [${name}]`)
  }

  /**
   *
   * @param e
   * @returns
   */
  async deleTeEuitment(e: Event) {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?卸下武器/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseEquipmentNameMap[name]
    if (!ID) {
      e.reply(`此方世界没有此物《${name}》`)
      return
    }
    const data = getUserMessageByUid(uid)
    if (!data.equipments?.arms) {
      e.reply(`未装备武器`)
      return
    }
    data.equipments.arms = null
    const count = data.bags.equipments[ID]
    if (!count || count <= 0) {
      data.bags.equipments[ID] = 1
    } else {
      data.bags.equipments[ID]++
    }
    // 保存
    writeArchiveData('player', uid, data)
    e.reply(`卸下 [${name}]`)
    return
  }
}
