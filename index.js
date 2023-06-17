import { BotApi } from './model/api/index.js'
import { AppName } from './app.config.js'

/**
 * 启动配置
 */

/***
 * 启动定时
 */

/**
 * 启动应用
 */
const apps = await BotApi.toIndex('apps')
  .then((res) => {
    console.info(`${AppName} start ~`)
    return res
  })
  .catch((err) => {
    console.info(err)
  })
export { apps }
