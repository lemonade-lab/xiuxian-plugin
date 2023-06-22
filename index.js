import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { AppName, DirPath } from './app.config.js'
import createdata from './model/game/data/createdata.js'

/** 检测配置 */
createdata.createConfig()

/** 读取配置 */
// const task = BotApi.getConfig({  name: 'task' })

/** 启动寿命记时 */
// const fnc = GameApi.Player.startLife()

/** 启动备份 */

/** 启动应用 */
const firstName = `plugins/${AppName}`
const filepath = `./${firstName}/apps`
const name = []
const sum = []
const travel = (dir, callback) => {
  for (let file of readdirSync(dir)) {
    if (file.search('.js') != -1) {
      name.push(file.replace('.js', ''))
    }
    let pathname = join(dir, file)
    if (statSync(pathname).isDirectory()) {
      travel(pathname, callback)
    } else {
      callback(pathname)
    }
  }
}
travel(filepath, (val) => {
  if (val.search('.js') != -1) sum.push(val)
})
let apps = {}
for (let item of sum) {
  const address = `${DirPath}${item.replace(/\\/g, '/').replace(`${firstName}`, '')}`
  let allExport = await import(`file:${address}`)
  let keys = Object.keys(allExport)
  for (let key of keys) {
    if (allExport[key].prototype) {
      if (Object.prototype.hasOwnProperty.call(apps, key)) {
        console.info(`Template detection:已经存在class ${key}同名导出\n    ${address}`)
      }
      apps[key] = allExport[key]
    } else {
      console.info(`Template detection:存在非class属性${key}导出\n    ${address}`)
    }
  }
}
console.info(`《凡人修仙》启动 ~`)
export { apps }
