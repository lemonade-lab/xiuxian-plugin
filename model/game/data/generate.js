import { writeFileSync, readdirSync, statSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
/** 游戏index数据生成 */
class GenerateData {
  /**
   * @param {地址} path
   * @param {表名} name
   * @param {数据} sum
   */
  createList(PATH, name, sum) {
    const dir = join(PATH, `${name}.json`)
    const theARR = JSON.stringify(sum, '', '\t')
    writeFileSync(dir, theARR, 'utf8')
  }

  /**
   * 得到该目录的所有指定类型文件
   * @param {地址} PATH
   * @param {检索条件} type
   */
  getlist(PATH, type) {
    const newsum = []
    const data = []
    const travel = (dir, callback) => {
      readdirSync(dir).forEach((file) => {
        var pathname = join(dir, file)
        if (statSync(pathname).isDirectory()) {
          travel(pathname, callback)
        } else {
          callback(pathname)
        }
      })
    }
    travel(PATH, (pathname) => {
      let temporary = pathname.search(type)
      if (temporary != -1) {
        newsum.push(pathname)
      }
    })
    newsum.forEach((file) => {
      data.push(...JSON.parse(readFileSync(file)))
    })
    return data
  }
}
export default new GenerateData()
