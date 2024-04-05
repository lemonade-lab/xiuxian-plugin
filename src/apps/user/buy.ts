import { type Event, plugin, define } from '../../../import'
import { writeArchiveData } from '../../model/data'
import { getUserMessageByUid } from '../../model/message'
import { ReverseEquipmentNameMap, ReverseKillNameMap } from '../../model/base'
import { getKillById } from '../../model/kills'
import { getEuipmentById } from '../../model/equipment'
import component from '../../image/index.js'
import { getUserName } from '../../model/utils.js'
export class buy extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?万宝楼$/,
          fnc: 'shopping'
        },
        {
          reg: /^(#|\/)?购买功法/,
          fnc: 'buyKill'
        },
        {
          reg: /^(#|\/)?购买武器/,
          fnc: 'buyEquitment'
        }
      ]
    })
  }

  /**
   * 万宝楼
   * @param e
   * @returns
   */
  async shopping(e: Event) {
    // 获取账号
    const uid = e.user_id
    // 尝试读取数据，如果没有数据将自动创建
    const data = getUserMessageByUid(uid)
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.shopping(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }

  /**
   * 购买
   * @param e
   * @returns
   */
  async buyEquitment(e: Event) {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?购买武器/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseEquipmentNameMap[name]
    if (!ID) {
      e.reply(`此方世界没有《${name}》`)
      return
    }
    const data = getUserMessageByUid(uid)
    // 看看money
    const sData = getEuipmentById(Number(ID))
    if (data.money < sData.price) {
      e.reply(`灵石不足${sData.price}`)
      return
    }
    data.money -= sData.price
    const count = data.bags.equipments[ID]
    if (!count || count <= 0) {
      data.bags.equipments[ID] = 1
    } else {
      data.bags.equipments[ID] += 1
    }
    // 保存
    writeArchiveData('player', uid, data)
    e.reply(`购得${name}`)
    return false
  }

  /**
   * 购买
   * @param e
   * @returns
   */
  async buyKill(e: Event) {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?购买功法/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseKillNameMap[name]
    if (!ID) {
      e.reply(`此方世界没有《${name}》`)
      return
    }
    const data = getUserMessageByUid(uid)
    // 看看money
    const sData = getKillById(Number(ID))
    if (data.money < sData.price) {
      e.reply(`灵石不足${sData.price}`)
      return
    }
    data.money -= sData.price
    const count = data.bags.kills[ID]
    if (!count || count <= 0) {
      data.bags.kills[ID] = 1
    } else {
      data.bags.kills[ID] += 1
    }
    // 保存
    writeArchiveData('player', uid, data)
    e.reply(`购得${name}`)
    return false
  }
}
