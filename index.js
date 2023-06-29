import { readdirSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { AppName } from './app.config.js'
import createdata from './model/game/data/createdata.js'

/** 检测配置 */
createdata.createConfig()

/** 读取配置 */
// const task = BotApi.getConfig( 'task' )

/** 启动寿命记时 */
// const fnc = GameApi.Player.startLife()

/** 启动备份 */

/**
 * 递归得到所有js/ts文件绝对路径
 * @param dirPath 指定目录下
 * @returns
 */
function getAllJsAndTsFilesSync(dirPath) {
  const files = []
  const entries = readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name)
    if (entry.isDirectory()) {
      // 递归获取子目录中的文件路径
      files.push(...getAllJsAndTsFilesSync(fullPath))
    } else if (entry.isFile() && /\.js$/i.test(entry.name)) {
      // 如果是以 .js结尾的文件，则将其路径保存到数组中
      files.push(fullPath)
    }
  }
  return files
}

/** 启动应用 */
async function startApps(DirName) {
  const filepath = join(process.cwd(), 'plugins', AppName, DirName ? DirName : 'apps')
  const apps = {}
  mkdirSync(filepath, { recursive: true })
  const arr = getAllJsAndTsFilesSync(filepath)
  for await (let AppDir of arr) {
    //文件对象:对象中有多个class
    const dirObject = await import(`file://${AppDir}`)
    for (let item in dirObject) {
      //如果该导出是class
      if (dirObject[item].prototype) {
        //如果没发现有
        if (Object.prototype.hasOwnProperty.call(apps, item)) {
          console.error(`[同名class export]  ${AppDir}`)
        }
        apps[item] = dirObject[item]
      } else {
        console.error(`[非class export]  ${AppDir}`)
      }
    }
  }
  return apps
}
const app = await startApps('apps')
const ayz = await startApps('apps-yz')
const apps = { ...app, ...ayz }
console.info(`《凡人修仙》启动`)
export { apps }
