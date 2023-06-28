import { createApps, setMessage } from 'alemon'
import { AppName } from './app.config.js'

/**
 * 重定向message
 */
setMessage(AppName, (e) => {
  e.isMaster = false // 非主人
  if (e.msg?.author.id) {
    // 用户id
    e.user_id = e.msg.author.id
    // 用户头像
    e.user_avatar = e.msg.author.avatar
  }
  // e消息不能被顶替掉....
  // 只能新增
  /* 建议开发时在此处打印,用于观察 */
  console.info(e)
  return e
})

/**
 * 创建应用
 */
await createApps(AppName)
