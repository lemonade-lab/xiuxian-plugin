import { getUserName } from '@src/model/utils.js'
import component from '@src/image/index.js'
import { Messages, Segment } from 'yunzaijs'
import { DB } from '@src/model/db-system.js'
import { UserMessageBase } from '@src/model/base.js'
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
    component.kill(data, uid).then(img => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') {
        e.reply(Segment.image(img))
      } else {
        e.reply('图片生成失败~')
      }
    })
    return false
  },
  [/^(#|\/)?功法信息$/]
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
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.equipment(data, uid).then(img => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') {
        e.reply(Segment.image(img))
      } else {
        e.reply('图片生成失败~')
      }
    })
    return false
  },
  [/^(#|\/)?装备信息$/]
)
message.use(
  async e => {
    const uid = e.user_id
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('数据错误')
      return
    }
    for (const key in UserMessageBase) {
      //
      if (
        // 自动不存在
        !Object.prototype.hasOwnProperty.call(data, key) ||
        typeof data[key] != typeof UserMessageBase[key]
      ) {
        // 不存在key 进行初始化操作
        data[key] = UserMessageBase[key]
      } else {
        // 是对象

        // 是数组
        if (Array.isArray(data[key])) {
          //
        }

        // 进一步修正
      }
    }
    await DB.create(uid, data)
    e.reply('已完成修正')
    return false
  },
  [/^(#|\/)?修复数据$/]
)
export default message
