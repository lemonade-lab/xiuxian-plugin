import { ReverseEquipmentNameMap, ReverseSkillNameMap } from '../model/base.js'
import { getSkillById } from '../model/skills.js'
import { getEquipmentById } from '../model/equipment.js'
import component from '../image/index.js'
import { getUserName } from '../model/utils.js'
import { Messages, Segment } from 'yunzai'
import { DB } from '../model/db-system.js'
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
  async e => {
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
    const item = data.bags.find(
      v => v.id === Number(ID) && v.type === 'equipment'
    )
    if (!item) {
      data.bags.push({
        id: Number(ID),
        type: 'equipment',
        name,
        count: 1
      })
    } else {
      item.count += 1
    }
    // 保存

    DB.create(uid, data)

    e.reply(`购得${name}`)
    return false
  },
  [/^(#|\/)?购买武器/]
)
message.use(
  async e => {
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
    const item = data.bags.find(v => v.id === Number(ID) && v.type === 'skill')
    if (!item) {
      data.bags.push({
        id: Number(ID),
        type: 'skill',
        name,
        count: 1
      })
    } else {
      item.count += 1
    }
    // 保存
    DB.create(uid, data)

    e.reply(`购得${name}`)
    return false
  },
  [/^(#|\/)?购买功法/]
)

message.use(
  async e => {
    const list = e.msg.replace(/^(#|\/)?出售/, '').split('*')
    if (!list) return false
    const item = list[0]
    const count = list[1] || 1
    const uid = e.user_id
    let money = 0
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    const itemData = data.bags.find(v => v.name === item)
    if (!itemData) {
      e.reply(`没有${item}`)
      return
    }
    if (itemData.count < Number(count)) {
      e.reply(`没有${item}了`)
      return
    }
    itemData.count -= Number(count)
    if (itemData.count === 0) {
      data.bags = data.bags.filter(v => v.name !== item)
    }
    if (itemData.type === 'equipment') {
      const sData = getEquipmentById(itemData.id)
      data.money += sData.price * Number(count)
      money = sData.price * Number(count)
    } else if (itemData.type === 'skill') {
      const sData = getSkillById(itemData.id)
      data.money += sData.price * Number(count)
      money = sData.price * Number(count)
    }
    await DB.create(uid, data)
    e.reply(`出售${item}x${count}，获得灵石${money}`)
    return false
  },
  [/^(#|\/)?出售/]
)

export default message
