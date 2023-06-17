import fs from 'node:fs'
import path from 'node:path'
import { AppName, MyDirPath } from './app.config.js'

/** 检测配置 */

/** 读取配置 */
// const task = BotApi.getConfig({ app: 'task', name: 'task' })

/** 启动寿命记时 */
// const fnc = GameApi.GameUser.startLife()

/** 启动备份 */

/** 启动应用 */
const firstName = `plugins/${AppName}`
const filepath = `./${firstName}/apps`
const name = []
const sum = []
const travel = (dir, callback) => {
  for (let file of fs.readdirSync(dir)) {
    if (file.search('.js') != -1) {
      name.push(file.replace('.js', ''))
    }
    let pathname = path.join(dir, file)
    if (fs.statSync(pathname).isDirectory()) {
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
  const address = `${MyDirPath}${item.replace(/\\/g, '/').replace(`${firstName}`, '')}`
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
console.log(`${AppName} start ~`)
export { apps }
