import { Messages, Segment } from 'yunzai'
import { DB } from '../model/db-system'
import RedisClient from '../model/redis'
import {
  EquipmentNameMap,
  ReverseEquipmentNameMap,
  ReverseSkillNameMap
} from '../model/base'
import component from '../image/index'

const message = new Messages('message.group')

message.use(
  async e => {
    const data = await RedisClient.get('exchange', 'list')
    if (!data.type) {
      e.reply('暂无人上架')
      return
    }
    const list = data.data
    const img = await component.exchange({ data: list })
    if (img) e.reply(Segment.image(img))
    return false
  },
  [/^(#|\/)?太虚商行/]
)

message.use(
  async e => {
    const msg = e.msg.replace(/^(#|\/)?上架/, '').trim()
    const list = msg.split('*')
    let update = false
    if (list.length == 2) {
      list.push('1')
    }
    const data = await DB.findOne(e.user_id)
    if (!data) return false
    // 检查背包是否为空
    if (
      Object.keys(data.bags.equipments).length == 0 &&
      Object.keys(data.bags.kills).length == 0
    ) {
      e.reply('你身上没有东西可以上架')
      return false
    }
    const num = await RedisClient.get('exchange', 'number')

    if (!num.type) num.data.num = 0
    const exchangeList = await RedisClient.get('exchange', 'list')
    if (!exchangeList.type) exchangeList.data = []

    // 检查装备背包是否有该物品
    for (const item in data.bags.equipments) {
      if (data.bags.equipments.hasOwnProperty(item)) {
        if (
          list[0] == EquipmentNameMap[item] &&
          data.bags.equipments[item] >= Number(list[2])
        ) {
          await RedisClient.set('exchange', 'list', '', [
            ...exchangeList.data,
            {
              id: num.data.num + 1,
              name: EquipmentNameMap[item],
              num: Number(list[2]),
              price: Number(list[1]),
              updater: e.user_id,
              type: 'equipment'
            }
          ])
          await RedisClient.set('exchange', 'number', '', {
            num: num.data.num + 1
          })
          e.reply(
            `上架成功，${EquipmentNameMap[item]} ${list[2]}个，售价${list[1]}`
          )
          data.bags.equipments[item] -= Number(list[2])
          if (data.bags.equipments[item] == 0) delete data.bags.equipments[item]
          update = true
        }
      }
    }

    // 检查功法背包是否有要上架的功法
    for (const item in data.bags.kills) {
      if (data.bags.kills.hasOwnProperty(item)) {
        if (list[0] == item && data.bags.kills[item] >= Number(list[2])) {
          await RedisClient.set('exchange', 'list', '', [
            ...exchangeList.data,
            {
              id: num.data.num + 1,
              name: item,
              num: Number(list[2]),
              price: Number(list[1]),
              updater: e.user_id,
              type: 'kill'
            }
          ])
          await RedisClient.set('exchange', 'number', '', {
            num: num.data.num + 1
          })
          e.reply(`上架成功，${item} ${list[2]}个，售价${list[1]}`)
          data.bags.kills[item] -= Number(list[2])
          if (data.bags.kills[item] == 0) delete data.bags.kills[item]
          update = true
        }
      }
    }
    if (!update) {
      e.reply('没有找到该物品')
      return
    }

    await DB.create(e.user_id, data)
    return
  },
  [/^(#|\/)?上架/]
)

message.use(
  async e => {
    const msg = e.msg.replace(/^(#|\/)?下架/, '').trim()
    if (!msg) return
    if (isNaN(Number(msg))) {
      e.reply('请输入正确的下架物品id')
      return
    }
    const list = await RedisClient.get('exchange', 'list')
    if (!list.type) return
    const data = await DB.findOne(e.user_id)
    if (!data) return
    if (!list.data.some(item => item.id == msg && item.updater == e.user_id)) {
      e.reply('没有找到该物品')
      return
    }
    const item = list.data.find(
      item => item.id == msg && item.updater == e.user_id
    )
    if (item.type == 'kill') {
      await RedisClient.set(
        'exchange',
        'list',
        '',
        list.data.filter(item => item.id != msg)
      )
      data.bags.kills[ReverseSkillNameMap[item.name]]
        ? data.bags.kills[ReverseSkillNameMap[item.name]] + item.num
        : (data.bags.kills[ReverseSkillNameMap[item.name]] = item.num)
      await DB.create(e.user_id, data)
      await e.reply(`下架成功，你获得${item.name}x${item.num}`)
      return
    } else {
      await RedisClient.set(
        'exchange',
        'list',
        '',
        list.data.filter(item => item.id != msg)
      )
      data.bags.equipments[ReverseEquipmentNameMap[item.name]]
        ? (data.bags.equipments[ReverseEquipmentNameMap[item.name]] += item.num)
        : (data.bags.equipments[ReverseEquipmentNameMap[item.name]] = item.num)
      await DB.create(e.user_id, data)
      await e.reply(`下架成功，你获得${item.name}x${item.num}`)
      return
    }
  },
  [/^(#|\/)?下架/]
)

message.use(
  async e => {
    const msg = e.msg.replace(/^(#|\/)?选购/, '').trim()
    if (isNaN(Number(msg))) {
      e.reply('请输入正确的编号')
      return false
    }
    const list = await RedisClient.get('exchange', 'list')
    if (!list.type) {
      e.reply('当前没有上架的物品')
      return false
    }

    if (!list.data.some(item => item.id == msg)) {
      e.reply('请输入正确的编号')
      return false
    }
    const inp = await DB.findOne(e.user_id)
    if (!inp) {
      e.reply('数据错误')
      return false
    }
    if (inp.money < list.data.find(item => item.id == msg).price) {
      e.reply('你的钱不够')
      return false
    }
    inp.money -= list.data.find(item => item.id == msg).price
    const item = list.data.find(item => item.id == msg)
    if (item.updater == e.user_id) {
      e.reply('不能购买自己的物品')
      return false
    }
    const out = await DB.findOne(item.updater)
    if (!out) return false
    if (item.type == 'equipment') {
      const ID = ReverseEquipmentNameMap[item.name]
      const count = inp.bags.equipments[ID]
      if (!count || count <= 0) {
        inp.bags.equipments[ID] = 1
      } else {
        inp.bags.equipments[ID] += 1
      }
    } else {
      const ID = ReverseSkillNameMap[item.name]
      const count = inp.bags.kills[ID]
      if (!count || count <= 0) {
        inp.bags.kills[ID] = 1
      } else {
        inp.bags.kills[ID] += 1
      }
    }
    out.money += item.price
    await DB.update(e.user_id, inp)
    await DB.update(item.updater, out)
    await RedisClient.set(
      'exchange',
      'list',
      '',
      list.data.filter(item => item.id != msg)
    )
    e.reply('购买成功')
  },

  [/^(#|\/)?选购/]
)
export default message
