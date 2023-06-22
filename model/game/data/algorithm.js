import {
  existsSync,
  rmSync,
  readdirSync,
  statSync,
  readFileSync,
  mkdirSync,
  writeFileSync
} from 'node:fs'
import { join } from 'node:path'
import { DirPath } from '../../../app.config.js'

/** fs算法 */
class Algorithm {
  /**
   * 判断指定json文件是否存在
   * @param filePath
   * @param fileName
   */
  existFile(filePath, fileName) {
    if (existsSync(join(`${filePath}/${fileName}.json`))) {
      return true
    }
    return false
  }

  /**
   * 如果存在则删除指定json文件
   * @param {*} path
   * @param {*} name
   */
  deleteFile(filePath, fileName) {
    const dir = `${filePath}/${fileName}.json`
    if (existsSync(join(dir))) {
      rmSync()
    }
  }

  /**
   * @param {地址} path
   * @returns 该地址的子目录数组
   */
  getMenu(path) {
    const files = readdirSync(path)
    const shield = ['.git']
    const sum = []
    for (let item of files) {
      const newpath = `${path}/${item}`
      const stat = statSync(newpath)
      // 不是文件？
      if (!stat.isFile()) {
        // 是目录名
        const file = newpath.replace(`${path}/`, '')
        for (let item of shield) {
          if (item != file) {
            sum.push(file)
          }
        }
      }
    }
    return sum
  }

  /**
   * @param {*} menupath
   * @param {类型} type
   * @returns
   */
  getfilepath(menupath, type) {
    const newsum = []
    const travel = (dir, callback) => {
      for (let file of readdirSync(dir)) {
        let pathname = join(dir, file)
        if (statSync(pathname).isDirectory()) {
          travel(pathname, callback)
        } else {
          callback(pathname)
        }
      }
    }
    travel(menupath, (pathname) => {
      let temporary = pathname.search(type)
      if (temporary != -1) newsum.push(pathname)
    })
    return newsum
  }

  /**
   * 得到数据
   * @param {*} PATH
   * @param {*} NAME
   * @returns
   */
  getData(NAME, PATH) {
    const DIR = join(`${PATH}/${NAME}.json`)
    const data = JSON.parse(readFileSync(DIR, 'utf8'))
    return data
  }

  /**
   * 推送数据
   * @param {*} NAME
   * @param {*} PATH
   * @param {*} DATA
   */
  postData(NAME, PATH, DATA) {
    const DIR = join(`${PATH}/${NAME}.json`)
    writeFileSync(DIR, JSON.stringify(DATA, '', '\t'), 'utf8')
  }

  /** 得到该路径的完整路径 */
  getPath(req) {
    /* 根据目录初始化地址 */
    this.ctratePath(req)
    return join(DirPath, req)
  }

  /**
   * 插件目录生成路径
   * @param {*} req
   */
  ctratePath(req) {
    let name = req.split('/')
    let newname = DirPath
    name.forEach((item) => {
      newname += `${item}/`
      if (!existsSync(`${newname}`)) {
        mkdirSync(`${newname}`)
      }
    })
  }

  /** 得到该路径的完整路径 */
  getProcessCwd(req) {
    /* 根据目录初始化地址 */
    this.ctrateProcessCwd(req)
    return join(process.cwd(), req)
  }

  /**
   * 执行目录生成路径
   * @param {*} req
   */
  ctrateProcessCwd(req) {
    let name = req.split('/')
    let newname = process.cwd()
    name.forEach((item) => {
      newname += `${item}/`
      if (!existsSync(`${newname}`)) {
        mkdirSync(`${newname}`)
      }
    })
  }
}
export default new Algorithm()
