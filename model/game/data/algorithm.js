import fs from 'node:fs'
import path from 'node:path'
import { MyDirPath, ThePath } from '../../../app.config.js'
/**fs算法*/
class Algorithm {
  /* 判断指定插件是否存在 */
  isPlugin = (name) => {
    if (fs.existsSync(`${path.resolve().replace(/\\/g, '/')}/plugins/${name}`)) {
      return true
    }
    return false
  }
  /**
   * @param {地址} path
   * @returns 该地址的子目录数组
   */
  returnMenu = (path) => {
    const files = fs.readdirSync(path)
    const shield = ['.git']
    const sum = []
    files.forEach((item) => {
      const newpath = `${path}/${item}`
      const stat = fs.statSync(newpath)
      //不是文件？
      if (!stat.isFile()) {
        //是目录名
        const file = newpath.replace(`${path}/`, '')
        shield.forEach((item) => {
          if (item != file) {
            sum.push(file)
          }
        })
      }
    })
    return sum
  }
  /**
   * @param {*} menupath
   * @param {类型} type
   * @returns
   */
  returnfilepath = (menupath, type) => {
    const newsum = []
    const travel = (dir, callback) => {
      fs.readdirSync(dir).forEach((file) => {
        var pathname = path.join(dir, file)
        if (fs.statSync(pathname).isDirectory()) {
          travel(pathname, callback)
        } else {
          callback(pathname)
        }
      })
    }
    travel(menupath, (pathname) => {
      let temporary = pathname.search(type)
      if (temporary != -1) {
        newsum.push(pathname)
      }
    })
    return newsum
  }
  /**
   *
   * @param { NAME, PATH, DATA } parameter
   * @returns 若存在不存在数据参数则是读取操作
   */
  dataAction = async ({ NAME, PATH, DATA }) => {
    const DIR = path.join(`${PATH}/${NAME}.json`)
    if (DATA) {
      fs.writeFileSync(DIR, JSON.stringify(DATA, '', '\t'), 'utf8', (err) => {})
      return
    }
    const data = JSON.parse(
      fs.readFileSync(DIR, 'utf8', (err, data) => {
        if (err) {
          return 'error'
        }
        return data
      })
    )
    return data
  }
  /**
   * 存在数据传入则为读写操作
   * 读取操作时文件不存在则返回false
   * @param { NAME, PATH, DATA } parameter
   * @returns
   */
  dataActionNew = async ({ NAME, PATH, DATA }) => {
    const DIR = path.join(`${PATH}/${NAME}.json`)
    if (DATA) {
      fs.writeFileSync(DIR, JSON.stringify(DATA, '', '\t'), 'utf8', (err) => {})
      return
    }
    try {
      const data = JSON.parse(
        fs.readFileSync(DIR, 'utf8', (err, data) => {
          if (err) {
            return 'error'
          }
          return data
        })
      )
      return data
    } catch {
      return false
    }
  }
  /* 输入需要初始化目录的地址 */
  ctrateFile = (req) => {
    let name = req.split('/')
    let newname = MyDirPath
    name.forEach((item) => {
      newname += `${item}/`
      if (!fs.existsSync(`${newname}`)) {
        fs.mkdirSync(`${newname}`)
      }
    })
  }

  ctrateFilePath = (req) => {
    let name = req.split('/')
    let newname = ThePath
    name.forEach((item) => {
      newname += `${item}/`
      if (!fs.existsSync(`${newname}`)) {
        fs.mkdirSync(`${newname}`)
      }
    })
  }

  /**得到该路径的完整路径*/
  getReq = (req) => {
    /* 根据目录初始化地址 */
    this.ctrateFile(req)
    return path.join(MyDirPath, req)
  }

  /**得到该路径的完整路径*/
  getFliePath = (req) => {
    /* 根据目录初始化地址 */
    this.ctrateFilePath(req)
    return path.join(ThePath, req)
  }
}
export default new Algorithm()
