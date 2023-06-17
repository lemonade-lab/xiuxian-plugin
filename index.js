import { BotApi } from './model/api/index.js'
import { AppName } from './app.config.js'
const apps = await BotApi.toIndex('apps')
  .then((res) => {
    logger.info(`${AppName} start ~`)
    return res
  })
  .catch((err) => {
    logger.info(err)
  })
export { apps }
