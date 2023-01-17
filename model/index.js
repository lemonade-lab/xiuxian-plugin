import fs from 'node:fs'
import path from 'path'
import { appname } from './main.js'
/**
 * 机器人入口
 */
class index {
  constructor() { }
  toindex = async (input) => {
    let filepath = `./plugins/${appname}/${input}`
    let apps = {}
    let name = []
    let newsum = []
    const travel = (dir, callback) => {
      fs.readdirSync(dir).forEach((file) => {
        let model = dir.search('model')
        if (model == -1) {
          let resources = dir.search('resources')
          if (resources == -1) {
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
          }
        }
      })
    }
    travel(filepath, (pathname) => {
      let temporary = pathname.search('.js')
      if (temporary != -1) {
        newsum.push(pathname)
      }
    })
    for (var j = 0 ;j < newsum.length ;j++) {
      newsum[j] = newsum[j].replace(/\\/g, '/')
      newsum[j] = newsum[j].replace(`plugins/${appname}` , '')
      apps[name[j]] = (await import(`..${newsum[j]}`))[name[j]]
    }
    return apps
  }
}
export default new index()