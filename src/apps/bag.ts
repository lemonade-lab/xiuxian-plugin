import { ReverseEquipmentNameMap, ReverseSkillNameMap } from '@src/model/base'
import { getSkillById } from '@src/model/skills'
import { getUserName } from '@src/model/utils'
import component from '@src/image/index'
import { Messages, Segment } from 'yunzaijs'
import { DB } from '@src/model/db-system'
const message = new Messages('message.group')
message.use(
  async e => {
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
    component.bag(data, uid).then(img => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') {
        e.reply(Segment.image(img))
      } else {
        e.reply('图片生成失败~')
      }
    })
    return false
  },
  [/^(#|\/)?(储物袋|背包)$/]
)
message.use(
  async e => {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?学习/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseSkillNameMap[name]
    if (!ID) {
      e.reply(`此方世界没有功法《${name}》`)
      return
    }
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    const T = data.skill[ID]
    if (T) {
      e.reply(`已学习`)
      return
    }
    const item = data.bags.find(
      item => item.id === Number(ID) && item.type === 'skill'
    )
    const count = item?.count
    if (!item || count <= 0) {
      e.reply(`没有功法《${name}》`)
      return
    }
    item.count -= 1
    if (item.count <= 0) {
      data.bags.splice(data.bags.indexOf(item), 1)
    }

    const sData = getSkillById(Number(ID))
    data.efficiency += sData.efficiency
    data.skill[ID] = true
    // 保存

    DB.create(uid, data)

    e.reply(`学得${name}`)
    return false
  },
  [/^(#|\/)?学习/]
)
message.use(
  async e => {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?装备武器/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseEquipmentNameMap[name]

    if (!ID) {
      e.reply(`此方世界没有此物《${name}》`)
      return
    }
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    if (data.equipments?.arms) {
      e.reply(`已装备武器`)
      return
    }
    const item = data.bags.find(
      item => item.id === Number(ID) && item.type === 'equipment'
    )

    if (!item || item.count <= 0) {
      e.reply(`没有武器 [${name}]`)
      return
    }
    item.count -= 1
    if (item.count <= 0) {
      data.bags.splice(data.bags.indexOf(item), 1)
    }
    // 记录武器
    data.equipments.arms = ID
    // 保存
    DB.create(uid, data)
    e.reply(`装备 [${name}]`)
  },
  [/^(#|\/)?装备武器/]
)
message.use(
  async e => {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?卸下武器/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseEquipmentNameMap[name]
    if (!ID) {
      e.reply(`此方世界没有此物《${name}》`)
      return
    }
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    if (!data.equipments?.arms) {
      e.reply(`未装备武器`)
      return
    }
    data.equipments.arms = null
    const item = data.bags.find(item => item.id === Number(ID))
    if (!item) {
      data.bags.push({ id: Number(ID), count: 1, type: 'equipment', name })
    }
    // 保存
    DB.create(uid, data)
    e.reply(`卸下 [${name}]`)
    return
  },
  [/^(#|\/)?卸下武器/]
)

export default message
