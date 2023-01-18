import fs from 'node:fs'
import path from 'path'
import { appname } from '../main.js'
/**
 * 机器人入口
 */
class index {
  toindex = async (parameter) => {
    const { indexName } = parameter
    let filepath = `./plugins/${appname}/${indexName}`
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
      //屏蔽非js文件的目录
      let temporary = pathname.search('.js')
      if (temporary != -1) {
        //收集目录
        newsum.push(pathname)
      }
    })
    //合成引入
    for (let j = 0; j < newsum.length; j++) {
      //替换\\为/
      newsum[j] = newsum[j].replace(/\\/g, '/')
      //替换前缀
      newsum[j] = newsum[j].replace(`plugins/${appname}`, '')
      //随深度的增加而增加
      apps[name[j]] = (await import(`../..${newsum[j]}`))[name[j]]
    }
    return apps
  }
}
export default new index()