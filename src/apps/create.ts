import { getReStartUserMessageByUid } from '@src/model/message.js'
import component from '@src/image/index.js'
import { Themes } from '@src/model/base.js'
import { getUserName } from '@src/model/utils.js'
import RedisClient from '@src/model/redis.js'
import { USER_RECREATE } from '@src/model/config.js'

import { Messages, Segment, setBotTask } from 'yunzaijs'
import { DB } from '@src/model/db-system.js'
const message = new Messages('message')

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
    await DB.create(uid, data)
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
  [/^(#|\/|\*)?(个人信息|踏入仙途|修仙帮助)$/]
)

message.use(
  async e => {
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
  [/^(#|\/)?再入仙途$/]
)

message.use(
  async e => {
    const uid = e.user_id
    const nickname = e.msg
      .replace(/^(#|\/)?改名/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    if (nickname.length < 1) {
      e.reply('名字不符合要求哦')
      return
    }
    if (nickname.length > 6) {
      e.reply('名字太长了哦')
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
  [/^(#|\/)?改名/]
)

message.use(
  async e => {
    const uid = e.user_id
    const autograph = e.msg
      .replace(/^(#|\/)?签名/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    if (autograph.length < 1) {
      e.reply('签名不符合要求哦')
      return
    }
    if (autograph.length > 20) {
      e.reply('签名太长了哦')
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
  [/^(#|\/)?签名/]
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
  [/^(#|\/)?更换主题$/]
)

message.use(
  async e => {
    if (!e.isMaster) {
      e.reply('权限不足')
      return false
    }
    await DB.pushAll()
    await e.reply('同步成功')
    return false
  },
  [/^(#|\/)?同步用户列表$/]
)

const userListTask = setBotTask(async () => {
  await DB.pushAll()
  console.log('同步用户列表')
}, '0 0 0/1 * * ?')

userListTask.on('error', err => {
  console.error('同步用户列表失败', err)
})

export default message
