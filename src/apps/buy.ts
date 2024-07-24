import { ReverseEquipmentNameMap, ReverseSkillNameMap } from '../model/base.js'
import { getSkillById } from '../model/skills.js'
import { getEquipmentById } from '../model/equipment.js'
import component from '../image/index.js'
import { getUserName } from '../model/utils.js'
import { Messages, Segment } from 'yunzai'
import { DB } from '../model/db-system.js'
const message = new Messages('message.group')
message.use(
  async (e) => {
    // 获取账号
    const uid = e.user_id
    // 尝试读取数据，如果没有数据将自动创建
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.shopping(data, uid).then(img => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') {
        e.reply(Segment.image(img))
      } else {
        e.reply('图片生成失败~')
      }
    })
    return false
  },
  [/^(#|\/)?万宝楼$/]
)
message.use(
  async (e) => {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?购买武器/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseEquipmentNameMap[name]
    if (!ID) {
      e.reply(`此方世界没有《${name}》`)
      return
    }
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    // 看看money
    const sData = getEquipmentById(Number(ID))
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

    DB.create(uid, data)

    e.reply(`购得${name}`)
    return false
  },
  [/^(#|\/)?购买武器/]
)
message.use(
  async (e) => {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?购买功法/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseSkillNameMap[name]
    if (!ID) {
      e.reply(`此方世界没有《${name}》`)
      return
    }
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    // 看看money
    const sData = getSkillById(Number(ID))
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
    DB.create(uid, data)

    e.reply(`购得${name}`)
    return false
  },
  [/^(#|\/)?购买功法/]
)
export default message
