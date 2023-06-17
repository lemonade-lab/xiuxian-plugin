import { BotApi } from './model/api/index.js'
import { AppName } from './app.config.js'

/** 检测配置 */

/** 读取配置 */
// const task = BotApi.getConfig({ app: 'task', name: 'task' })

/** 启动寿命记时 */
// const fnc = GameApi.GameUser.startLife()

/** 启动备份 */

/** 启动应用 */
const apps = await BotApi.toIndex('apps')
  .then((res) => {
    console.info(`${AppName} start ~`)
    return res
  })
  .catch((err) => {
    console.info(err)
  })
export { apps }
