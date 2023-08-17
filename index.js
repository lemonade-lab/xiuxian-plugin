import { appsOut } from './robot/index.js'
import { AppName } from './app.config.js'
const apps = await appsOut().then((req) => {
  console.info(`${AppName} start ~`)
  return req
})
export { apps }
