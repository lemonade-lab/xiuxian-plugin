import fs from 'node:fs'
import { MyDirPath } from '../../../app.config.js'
import algorithm from './algorithm.js'
/** 自定义配置*/
const configarr = [
  'cooling.yaml',
  'namelist.yaml',
  'task.yaml',
  'help.yaml',
  'darkhelp.yaml',
  'admin.yaml'
]
class CreateData {
  constructor() {
    this.resources = `${MyDirPath}/resources`
    this.defsetpath = `${MyDirPath}/resources/defset`
    this.configpath = `${MyDirPath}/config`
  }
  /**
   * @param { name } param0
   * @returns
   */
  moveConfig = ({ name }) => {
    const path = algorithm.returnMenu(this.defsetpath)
    path.forEach((itempath) => {
      configarr.forEach((itemconfig) => {
        let x = `${this.configpath}/${itempath}/${itemconfig}`
        let y = `${this.defsetpath}/${itempath}/${itemconfig}`
        //刷新控制
        if (name) {
          //直接复制
          fs.cp(y, x, (err) => {
            if (err) {
            }
          })
        } else {
          //不存在就复制
          if (!fs.existsSync(x)) {
            fs.cp(y, x, (err) => {
              if (err) {
              }
            })
          }
        }
      })
    })
    return
  }
  /**
   * 循环创建指定目录
   * @param {arr} arr
   * @returns
   */
  generateDirectory = (arr) => {
    for (let item in arr) {
      if (!fs.existsSync(item)) {
        fs.mkdir(item, (err) => {})
      }
    }
    return true
  }
}
export default new CreateData()
