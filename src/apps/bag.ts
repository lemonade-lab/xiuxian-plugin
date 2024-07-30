import {
  EquipmentNameMap,
  ReverseEquipmentNameMap,
  ReverseSkillNameMap,
  SkillNameMap
} from '../model/base'
import { getSkillById } from '../model/skills'
import { getUserName } from '../model/utils'
import component from '../image/index'
import { Messages, Segment } from 'yunzai'
import { DB } from '../model/db-system'
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
    const T = data.kills[ID]
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
    data.kills[ID] = true
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

message.use(
  async e => {
    if (!e.isMaster) {
      e.reply('权限不足')
      return
    }
    const all = await DB.findAll()
    for (const data of all) {
      if (Object.prototype.toString.call(data.bags) === '[object Array]')
        continue
      if (
        Object.keys(data.bags['kills']).length > 0 ||
        Object.keys(data.bags['equipments']).length > 0
      ) {
        const newBag = []
        for (const key in data.bags['kills']) {
          const item = data.bags['kills'][key]
          if (item) {
            newBag.push({
              id: key,
              count: 1,
              type: 'skill',
              name: SkillNameMap[key]
            })
          }
        }
        for (const key in data.bags['equipments']) {
          const item = data.bags['equipments'][key]
          if (item) {
            newBag.push({
              id: key,
              count: 1,
              type: 'equipment',
              name: EquipmentNameMap[key]
            })
          }
        }
        data.bags = newBag
        await DB.create(data.uid, data)
      } else {
        data.bags = []
        await DB.create(data.uid, data)
      }
    }
    e.reply('同步数据成功')
    return false
  },
  [/(#|\/)?同步旧版背包数据$/]
)

export default message
