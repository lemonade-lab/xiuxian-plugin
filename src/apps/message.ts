import { getUserName } from '../model/utils.js'
import component from '../image/index.js'
import { Messages } from '../import'
import { DB } from '../model/db-system.js'
const message = new Messages()
message.response(/^(#|\/)?功法信息$/, async (e) => {
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
  component.kill(data, uid).then((img) => {
    // 获取到图片后发送
    if (typeof img !== 'boolean') e.reply(segment.image(img))
  })
  return false
})
message.response(/^(#|\/)?装备信息$/, async (e) => {
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
  component.equipment(data, uid).then((img) => {
    // 获取到图片后发送
    if (typeof img !== 'boolean') e.reply(segment.image(img))
  })
  return false
})
message.response(/^(#|\/)?启动修复$/, async (e) => {
  e.reply('待更新')
  return false
})
export default message
