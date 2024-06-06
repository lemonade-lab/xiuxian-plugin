import { getReStartUserMessageByUid } from '../model/message.js'
import component from '../image/index.js'
import { Themes } from '../model/base.js'
import { getUserName } from '../model/utils.js'
import RedisClient from '../model/redis.js'
import { USER_RECREATE } from '../model/config.js'

import { Messages } from '../import'
import { DB } from '../model/db-system.js'
const message = new Messages()

message.response(/^(#|\/|\*)?(个人信息|踏入仙途|修仙帮助)$/, async (e) => {
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
  component.message(data, uid).then((img) => {
    // 获取到图片后发送
    if (typeof img !== 'boolean') {
      e.reply(segment.image(img))
    } else {
      e.reply('图片生成失败~')
    }
  })
  return false
})

message.response(/^(#|\/)?再入仙途$/, async (e) => {
  // 获取账号
  const uid = e.user_id
  const eMessage = await RedisClient.get('reCreate', uid)
  const now = Date.now()
  const time = now - (eMessage.data?.time ?? 0)
  if (eMessage.type && time <= USER_RECREATE) {
    e.reply(eMessage.msg)
    return
  }
  RedisClient.set('reCreate', uid, '重生冷却中', {
    time: now
  })
  // 尝试读取数据，如果没有数据将自动创建
  const data = getReStartUserMessageByUid(uid)
  data.name = getUserName(data.name, e.sender.nickname)
  // 数据植入组件
  component.message(data, uid).then((img) => {
    // 获取到图片后发送
    if (typeof img !== 'boolean') {
      e.reply(segment.image(img))
    } else {
      e.reply('图片生成失败~')
    }
  })
  return false
})

message.response(/^(#|\/)?改名/, async (e) => {
  const uid = e.user_id
  const nickname = e.msg
    .replace(/^(#|\/)?改名/, '')
    .replace(/[^\u4e00-\u9fa5]/g, '')
  if (nickname.length < 1) {
    e.reply('名字不符合要求哦')
    return
  }
  // 尝试读取数据，如果没有数据将自动创建
  const data = await DB.findOne(uid)
  if (!data) {
    e.reply('操作频繁')
    return
  }
  if (data.name !== nickname) {
    data.name = nickname
    // 写入

    DB.create(uid, data)
  }
  // 数据植入组件
  component.message(data, uid).then((img) => {
    // 获取到图片后发送
    if (typeof img !== 'boolean') {
      e.reply(segment.image(img))
    } else {
      e.reply('图片生成失败~')
    }
  })
  return false
})

message.response(/^(#|\/)?签名/, async (e) => {
  const uid = e.user_id
  const autograph = e.msg
    .replace(/^(#|\/)?签名/, '')
    .replace(/[^\u4e00-\u9fa5]/g, '')
  if (autograph.length < 1) {
    e.reply('名字不符合要求哦')
    return
  }
  // 尝试读取数据，如果没有数据将自动创建
  const data = await DB.findOne(uid)
  if (!data) {
    e.reply('操作频繁')
    return
  }
  data.autograph = autograph
  // 写入

  DB.create(uid, data)

  // 数据植入组件
  component.message(data, uid).then((img) => {
    // 获取到图片后发送
    if (typeof img !== 'boolean') {
      e.reply(segment.image(img))
    } else {
      e.reply('图片生成失败~')
    }
  })
  return false
})

message.response(/^(#|\/)?更换主题$/, async (e) => {
  // 获取账号
  const uid = e.user_id
  // 尝试读取数据，如果没有数据将自动创建
  const data = await DB.findOne(uid)
  if (!data) {
    e.reply('操作频繁')
    return
  }
  // 得到配置
  const index = Themes.indexOf(data.theme)
  // 如果存在
  if (Themes[index + 1]) {
    // 切换
    data.theme = Themes[index + 1]
    // 保存
  } else {
    // 不存在。返回第一个
    data.theme = Themes[0]
  }
  DB.create(uid, data)
  data.name = getUserName(data.name, e.sender.nickname)
  // 数据植入组件
  component.message(data, uid).then((img) => {
    // 获取到图片后发送
    if (typeof img !== 'boolean') {
      e.reply(segment.image(img))
    } else {
      e.reply('图片生成失败~')
    }
  })
  return false
})

export default message
