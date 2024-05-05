import { existsArchiveSync, writeArchiveData } from '../model/data'
import { getUserMessageByUid } from '../model/message'
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

import { Messages } from '../import'
const message = new Messages()

message.response(/^(#|\/)?闭关$/, async (e) => {
  const uid = e.user_id
  if (!existsArchiveSync('player', uid)) {
    getUserMessageByUid(uid)
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
})

message.response(/^(#|\/)?出关$/, async (e) => {
  const uid = e.user_id
  const data = getUserMessageByUid(uid)
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
    writeArchiveData('player', uid, data)
  }
  // 修正名字
  data.name = getUserName(data.name, e.sender.nickname)
  // 数据植入组件
  component.message(data, uid).then((img) => {
    // 获取到图片后发送
    if (typeof img !== 'boolean') e.reply(segment.image(img))
  })
  return false
})

message.response(/^(#|\/)?采矿$/, async (e) => {
  // 获取账号
  const uid = e.user_id
  // 尝试读取数据，如果没有数据将自动创建
  const data = getUserMessageByUid(uid)
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
  if (Minibg.type && time <= MINING) {
    e.reply(`采集频繁，先等等${Math.floor((MINING - time) / 1000)}秒`)
    return
  }
  // 看看精血
  if (data.blood <= MINING_BLOOD) {
    e.reply('精血不足,先休息休息吧')
    return
  }
  data.blood -= MINING_BLOOD
  data.money += MINING_MONEY
  RedisClient.set('mining', uid, '采集冷却', {
    time: now
  })
  writeArchiveData('player', uid, data)
  e.reply(`采得${MINING_MONEY}块灵石`)
  return false
})

export default message
