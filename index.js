import { BotApi, GameApi } from './model/api/api.js'
import { AppName } from './app.config.js'
GameApi.Schedule.scheduleJobflie({ time: '0 0 */1 * * ?' })
const apps = await BotApi.toIndex('apps')
  .then((res) => {
    logger.info(`${AppName} start ~`)
    return res
  })
  .catch((err) => {
    logger.info(err)
  })
export { apps }
