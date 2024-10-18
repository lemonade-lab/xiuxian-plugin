import {
  ReverseEquipmentNameMap,
  ReverseSkillNameMap
} from '@src/model/base.js'
import { getSkillById } from '@src/model/skills.js'
import { getEquipmentById } from '@src/model/equipment.js'
import component from '@src/image/index.js'
import { getUserName } from '@src/model/utils.js'
import { Messages, Segment } from 'yunzaijs'
import { DB } from '@src/model/db-system.js'
import { MedicineList } from '@src/model/medicine.js'
import image from '@src/image/index.js'
import { getLevelById } from '@src/model/level.js'
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
    if (Number(count) <= 0) {
      e.reply(`数量不能小于等于0`)
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
    } else if (itemData.type === 'medicine') {
      const sData = MedicineList.find(v => v.name === item)
      data.money += sData.price * Number(count)
      money = sData.price * Number(count)
    }
    await DB.create(uid, data)
    e.reply(`出售${item}x${count}，获得灵石${money}`)
    return false
  },
  [/^(#|\/)?出售/]
)
let sureMap = {}
let timeoutMap = {}
message.use(
  async e => {
    const uid = e.user_id
    sureMap[uid] = true
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }

    const list = data.bags.filter(v => !v.isLocked)
    if (list.length === 0) {
      e.reply('你没有东西可以出售')
      return
    }
    const msg = []
    list.forEach(v => {
      msg.push(`${v.name}*${v.count}`)
    })
    e.reply(`你确定出售\n${msg.join('\n')}吗？\n发送【确认出售】以确认`)
    timeoutMap[uid] = setTimeout(
      () => {
        sureMap[uid] = false
        e.reply([Segment.at(uid), ' 已自动取消出售'])
      },
      1000 * 60 * 5
    )
    return false
  },
  [/^(#|\/)?一键出售$/]
)
message.use(
  async e => {
    if (!sureMap[e.user_id]) return false
    delete sureMap[e.user_id]
    clearTimeout(timeoutMap[e.user_id])
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    if (data.bags.length === 0) {
      e.reply('你没有东西可以出售')
      return
    }
    let money = 0
    const list = data.bags.filter(v => !v.isLocked)
    const isLocked_List = data.bags.filter(v => v.isLocked)
    list.forEach(v => {
      if (v.type === 'equipment') {
        const sData = getEquipmentById(v.id)
        data.money += sData.price * v.count
        money += sData.price * v.count
      } else if (v.type === 'skill') {
        const sData = getSkillById(v.id)
        data.money += sData.price * v.count
        money += sData.price * v.count
      } else if (v.type === 'medicine') {
        const sData = MedicineList.find(i => i.name === v.name)
        data.money += sData.price * v.count
        money += sData.price * v.count
      }
    })
    data.bags = []
    if (isLocked_List.length > 0) {
      data.bags = isLocked_List
    }
    await DB.create(uid, data)
    e.reply(`出售所有物品，获得灵石${money}`)
    return false
  },
  [/^(#|\/)?确认出售$/]
)

message.use(
  async e => {
    const uid = e.user_id
    sureMap[uid] = false
    if (timeoutMap[uid]) clearTimeout(timeoutMap[uid])
    e.reply('已取消出售')
    return false
  },
  [/^(#|\/)?取消出售/]
)

message.use(
  async e => {
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    const msg = e.msg.replace(/^(#|\/)?解锁/, '')
    if (msg === '') {
      e.reply('请输入解锁物品名称')
      return
    }
    const item = data.bags.find(v => v.name === msg)
    if (!item) {
      e.reply(`没有${msg}`)
      return
    }
    item.isLocked = false
    await DB.create(uid, data)
    e.reply(`已解锁${msg}`)
    return false
  },
  [/^(#|\/)?解锁/]
)

message.use(
  async e => {
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    const msg = e.msg.replace(/^(#|\/)?锁定/, '')
    if (msg === '') {
      e.reply('请输入锁定物品名称')
      return
    }
    const item = data.bags.find(v => v.name === msg)
    if (!item) {
      e.reply(`没有${msg}`)
      return
    }
    item.isLocked = true
    await DB.create(uid, data)
    e.reply(`已锁定${msg}`)
    return false
  },
  [/^(#|\/)?锁定/]
)

message.use(
  async e => {
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    const msg = e.msg.replace(/^(#|\/)?服用/, '')
    if (msg === '') {
      e.reply('请输入丹药名称')
      return
    }
    let name = msg
    let count = 1
    if (msg.includes('*')) {
      const arr = msg.split('*')
      name = arr[0]
      count = Number(arr[1])
    }
    const item = data.bags.find(v => v.name === name)
    if (!item) {
      e.reply(`没有${name}`)
      return
    }
    if (item.type !== 'medicine') {
      e.reply('这不是丹药')
      return
    }
    if (item.count < count) {
      e.reply('数量不足')
      return
    }

    if (count < 1) {
      e.reply('数量不能小于1')
      return
    }
    const sData = MedicineList.find(v => v.name === name)
    if (!sData) {
      e.reply('丹药不存在')
      return
    }
    switch (sData.type) {
      case 'blood':
        if (sData.blood > 1) {
          data.blood += sData.blood * count
        } else {
          const level = getLevelById(data.level_id)
          let allBlood = data.base.blood + level.blood
          for (const key in data.equipments) {
            if (data.equipments[key] == null) continue
            const equipment = getEquipmentById(Number(data.equipments[key]))
            allBlood += equipment.blood
          }
          data.blood += Math.floor(allBlood * sData.blood) * count
          data.blood = data.blood > allBlood ? allBlood : data.blood
        }
        break
      case 'attack':
        data.base.attack += sData.attack * count
        break
      case 'agile':
        data.base.agile += sData.agile * count
        break
      default:
        break
    }
    item.count -= count
    if (item.count === 0) {
      data.bags = data.bags.filter(v => v.name !== name)
    }
    await DB.create(uid, data)
    const img = await image.message(data, uid)
    if (img) e.reply(Segment.image(img))
  },
  [/^(#|\/)?服用/]
)

export default message
