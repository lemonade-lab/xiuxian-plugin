import { createApps, setMessage } from 'alemon'
import { AppName } from './app.config.js'
import createdata from './model/game/data/createdata.js'

/** 检测配置 */
createdata.createConfig()

/**  重定向message */
setMessage(AppName, (e: any) => {
  e.isMaster = false // 非主人
  if (e.msg?.author.id) {
    // 用户id
    e.user_id = e.msg.author.id
    // 用户头像
    e.user_avatar = e.msg.author.avatar
  }
  // e.msg是重要字段|不能被顶替掉
  return e
})

/** 创建应用 */
await createApps(AppName)
