import fs from 'node:fs'
import path from 'path'
import { appname } from '../main.js'
/**
 * 机器人入口
 */
class index {
  toindex = async (parameter) => {
    const { indexName } = parameter
    const filepath = `./plugins/${appname}/${indexName}`
    let apps = {}
    const name = []
    const sum = []
    const travel = (dir, callback) => {
      fs.readdirSync(dir).forEach((file) => {
        let temporary = file.search('.js')
        if (temporary != -1) {
          let y = file.replace('.js', '')
          name.push(y)
        }
        var pathname = path.join(dir, file)
        if (fs.statSync(pathname).isDirectory()) {
          travel(pathname, callback)
        } else {
          callback(pathname)
        }
      })
    }
    travel(filepath, (path) => {
      //屏蔽非js文件的目录
      let temporary = path.search('.js')
      if (temporary != -1) {
        //收集目录
        sum.push(path)
      }
    })
    for (let item of sum) {
      let address = item.replace(/\\/g, '/').replace(`plugins/${appname}`, '')
      //随深度的增加而增加
      let allExport = (await import(`../..${address}`));
      let keys = Object.keys(allExport);
      keys.forEach((key) => {
        if (allExport[key].prototype) {
          if (apps.hasOwnProperty(key)) {
            logger.info(`Template detection:已经存在class ${key}同名导出\n    ../..${address}`);
          }
          apps[key] = allExport[key];
        } else {
          logger.info(`Template detection:存在非class属性${key}导出\n    ../..${address}`);
        }
      });
    }
    return apps
  }
}
export default new index()