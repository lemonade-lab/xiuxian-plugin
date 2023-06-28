import { createApps, setMessage } from 'alemon'
import { AppName } from './app.config.js'

setMessage(AppName, (e) => {
  e.isMaster = false // 非主人
  e.msg = e.cmd_msg // 指令
  e.user_id = '' // uid
  e.isGroup = true // 是否是群聊
  /* 建议开发时在此处打印,用于观察 */
  console.info(e)
  return e
})

createApps(AppName)
