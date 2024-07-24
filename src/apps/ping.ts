import RedisClient from '../model/redis'
import { getUserName } from '../model/utils'
import component from '../image/index'
import {
  DOOR_CLOSE_SIZE,
  MINING,
  MINING_BLOOD,
  MINING_MONEY
} from '../model/config'
import { getLevelById } from '../model/level'
import { Messages, Segment } from 'yunzai'
import { DB } from '../model/db-system'
const message = new Messages('message.group')

message.use(
  async (e) => {
    const uid = e.user_id
    if (!(await DB.exists(uid))) {
      DB.findOne(uid)
    }
    const message = await RedisClient.get('door', uid)
    if (message.type) {
      e.reply(message.msg)
      return
    }
    RedisClient.set('door', uid, '闭关中...', {
      time: Date.now()
    })
    e.reply('开始两耳不闻窗外事')
    return false
  },
  [/^(#|\/)?闭关$/]
)

message.use(
  async (e) => {
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
    const time = message.data.time
    const Now = Date.now()
    // 30 s 一次
    const size = Math.floor((Now - time) / (1000 * 30))
    await RedisClient.del('door', uid)
    if (size >= 1) {
      const blool = size * DOOR_CLOSE_SIZE
      const cur = data.blood + blool
      // 还没有装备
      // const equipment = getEuipmentById()
      const equipment = {
        blood: 0
      }
      const level = getLevelById(data.level_id)
      const max = data.base.blood + equipment.blood + level.blood
      data.blood = cur > max ? max : cur
      // 后得的血量上限
      const baseBlood = Math.floor((Now - time) / (1000 * 60))
      data.base.blood += baseBlood
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
  async (e) => {
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
  async (e) => {
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
    const now = Date.now()
    const Minibg = await RedisClient.get('mining', e.user_id)
    const time = now - (Minibg.data?.time ?? 0)
    const cd = Minibg.data?.cd ?? MINING

    if (Minibg.type && time <= cd) {
      e.reply(`采集频繁，先等等${Math.floor((cd - time) / 1000)}秒`)
      return
    }
    const size = Math.floor(data.blood / MINING_BLOOD)
    const money = Math.floor((size * MINING_MONEY * data.level_id) / 5)
    data.blood -= size * MINING_BLOOD
    data.money += money

    await RedisClient.set('mining', e.user_id, '采集冷却', {
      time: Date.now(),
      cd: Math.floor((size * MINING) / 1.5)
    })
    await DB.create(e.user_id, data)
    e.reply(`采得${money}块灵石`)
  },
  [/^(#|\/)?连续采矿$/]
)

export default message
