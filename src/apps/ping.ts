import RedisClient from '@src/model/redis'
import { getUserName } from '@src/model/utils'
import component from '@src/image/index'
import { MINING, MINING_BLOOD, MINING_MONEY } from '@src/model/config'
import { getLevelById } from '@src/model/level'
import { Messages, Segment } from 'yunzaijs'
import { DB } from '@src/model/db-system'
import { getEquipmentById } from '@src/model/equipment'

const message = new Messages('message.group')

message.use(
  async e => {
    const uid = e.user_id
    if (!(await DB.exists(uid))) {
      DB.findOne(uid)
    }
    const message = await RedisClient.get('door', uid)
    if (message.type) {
      e.reply(message.msg)
      return
    }
    const status = await RedisClient.get('instance', e.user_id)
    if (status.type != null) {
      e.reply(status.msg)
      return
    }
    const taken = await RedisClient.get('taken', uid)
    if (taken.type) {
      e.reply(taken.msg)
      return
    }

    RedisClient.set('door', uid, '闭关中...', {
      type: 'ping',
      time: Date.now()
    })
    e.reply('开始两耳不闻窗外事')
    return false
  },
  [/^(#|\/)?闭关$/]
)

message.use(
  async e => {
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    const message = await RedisClient.get('door', uid)
    if (!message.type) {
      e.reply('没有在闭关哦')
      return
    }
    const status = await RedisClient.get('instance', e.user_id)
    if (status.type != null) {
      e.reply(status.msg)
      return
    }

    if (message.data.type && message.data.type !== 'ping') {
      e.reply(message.msg)
      return
    }
    const time = message.data.time
    const Now = Date.now()
    // 30 s 一次
    const size = Math.floor((Now - time) / (1000 * 30))
    await RedisClient.del('door', uid)
    if (size >= 1) {
      const level = getLevelById(data.level_id)

      let allBlood = data.base.blood + level.blood
      for (const key in data.equipments) {
        if (data.equipments[key] == null) continue
        const equipment = getEquipmentById(Number(data.equipments[key]))
        allBlood += equipment.blood
      }

      const num =
        Math.floor(allBlood * 0.01) < 100 ? 100 : Math.floor(allBlood * 0.01)

      const blood = size * num
      const cur = data.blood + blood
      data.blood = cur > allBlood ? allBlood : cur
      // 后得的血量上限
      const baseBlood = Math.floor((Now - time) / (1000 * 60))
      data.base.blood += baseBlood * (data.level_id || 1)
      DB.create(uid, data)
    }
    // 修正名字
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.message(data, uid).then(img => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') {
        e.reply(Segment.image(img))
      } else {
        e.reply('图片生成失败~')
      }
    })
    return false
  },
  [/^(#|\/)?出关$/]
)

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
    const status = await RedisClient.get('instance', e.user_id)
    if (status.type != null) {
      e.reply(status.msg)
      return
    }
    const message = await RedisClient.get('door', uid)
    if (message.type) {
      e.reply(message.msg)
      return
    }
    const taken = await RedisClient.get('taken', uid)
    if (taken.type) {
      e.reply(taken.msg)
      return
    }
    await RedisClient.set('door', e.user_id, '锻体中...', {
      type: 'exercise',
      time: Date.now()
    })
    e.reply('你开始锻体了')
    return false
  },
  [/^(#|\/)?锻体$/]
)
message.use(
  async e => {
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    const Now = Date.now()
    const message = await RedisClient.get('door', e.user_id)
    if (!message.type) {
      e.reply('你还没有开始锻体哦')
      return
    }
    if (message.data.type !== 'exercise') {
      e.reply(message.msg)
      return
    }
    const time = message.data.time
    const size = Math.floor((Now - time) / (1000 * 30))
    await RedisClient.del('door', e.user_id)
    if (size <= 0) {
      e.reply('锻体时间太短，并没有得到什么锻炼')
      return false
    }
    const attack = Math.floor(((Now - time) / (1000 * 60)) * 0.6)
    const defense = Math.floor(((Now - time) / (1000 * 60)) * 0.2)

    data.base.attack += attack * (data.level_id || 1)
    data.base.defense += defense * (data.level_id || 1)
    await DB.create(uid, data)

    component.message(data, uid).then(img => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') {
        e.reply(Segment.image(img))
      } else {
        e.reply('图片生成失败~')
      }
    })
  },
  [/^(#|\/)?结束锻体$/]
)

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
    // 不能在闭关
    const Biguan = await RedisClient.get('door', uid)
    if (Biguan.type) {
      e.reply(Biguan.msg)
      return
    }
    const status = await RedisClient.get('instance', e.user_id)
    if (status.type != null) {
      e.reply(status.msg)
      return
    }
    // 当前身体空虚，精血不足。
    const Minibg = await RedisClient.get('mining', uid)
    const now = Date.now()
    const time = now - (Minibg.data?.time ?? 0)
    const cd = Minibg.data?.cd ?? MINING

    if (Minibg.type && time <= cd) {
      e.reply(`采集频繁，先等等${Math.floor((cd - time) / 1000)}秒`)
      return
    }
    // 看看精血
    if (data.blood <= MINING_BLOOD) {
      e.reply('精血不足,先休息休息吧')
      return
    }
    const money = Math.floor((MINING_MONEY * data.level_id) / 5) + MINING_MONEY
    data.blood -= MINING_BLOOD
    data.money += money
    RedisClient.set('mining', uid, '采集冷却', {
      time: now,
      cd: MINING
    })

    DB.create(uid, data)

    e.reply(`采得${money}块灵石`)
    return false
  },
  [/^(#|\/)?采矿$/]
)

message.use(
  async e => {
    const data = await DB.findOne(e.user_id)
    if (!data) {
      e.reply('操作频繁')
      return
    }
    if (data.blood <= MINING_BLOOD) {
      e.reply('精血不足,先休息休息吧')
      return
    }
    // 不能在闭关
    const Biguan = await RedisClient.get('door', e.user_id)
    if (Biguan.type) {
      e.reply(Biguan.msg)
      return
    }
    const status = await RedisClient.get('instance', e.user_id)
    if (status.type != null) {
      e.reply(status.msg)
      return
    }
    const now = Date.now()
    const Minibg = await RedisClient.get('mining', e.user_id)
    const time = now - (Minibg.data?.time ?? 0)
    const cd = Minibg.data?.cd ?? MINING

    if (Minibg.type && time <= cd) {
      e.reply(`采集频繁，先等等${Math.floor((cd - time) / 1000)}秒`)
      return
    }
    const size = Math.floor(data.blood / MINING_BLOOD)
    const money = Math.floor((size * MINING_MONEY * (data.level_id || 1)) / 5)
    data.blood -= size * MINING_BLOOD
    data.money += money

    await RedisClient.set('mining', e.user_id, '采集冷却', {
      time: Date.now(),
      cd:
        Math.floor((size * MINING) / 1.5) > 24 * 60 * 60 * 1000
          ? 24 * 60 * 60 * 1000
          : Math.floor((size * MINING) / 1.5)
    })
    await DB.create(e.user_id, data)
    e.reply(`采得${money}块灵石`)
  },
  [/^(#|\/)?连续采矿$/]
)

export default message
