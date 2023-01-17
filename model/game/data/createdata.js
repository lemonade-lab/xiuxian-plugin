import fs from 'node:fs'
import { __dirname } from '../../main.js'
import Algorithm from './algorithm.js'
class CreateData {
  constructor() {
    this.defsetpath = `${__dirname}/resources/defset/`
    this.configpath = `${__dirname}/config/`
  }
  /**
   * 路径是绝对路径地址 {appname}/defset/help/help.yaml
   * 配置的路径和要配置的文件名数组 如darkhelp.yaml
   * 需要带上后缀,支持多样的配置文件
   * @param {PATH,CONFIG} parameter 
   * @returns 
   */
  movePluginConfig = (parameter) => {
    const { PATH, CONFIG } = parameter
    const path = Algorithm.returnMenu(PATH)
    path.forEach((itempath) => {
      CONFIG.forEach((itemconfig) => {
        let x = `${this.configpath}${itempath}/${itemconfig}`
        let y = `${PATH}${itempath}/${itemconfig}`
        if (!fs.existsSync(x)) {
          fs.cp(y, x, (err) => {
            if (err) { }
          })
        } else {
          fs.rmSync(`${x}`)
          fs.cp(y, x, (err) => {
            if (err) { }
          })
        }
      })
    })
    return
  }
  moveConfig = (parameter) => {
    const path = Algorithm.returnMenu(this.defsetpath)
    const configarr = ['xiuxian.yaml', 'task.yaml', 'Help.yaml', 'Admin.yaml']
    path.forEach((itempath) => {
      configarr.forEach((itemconfig) => {
        let x = `${this.configpath}${itempath}/${itemconfig}`
        let y = `${this.defsetpath}${itempath}/${itemconfig}`
        //刷新控制
        if (parameter) {
          //存在就复制,需要替换原文件,已达到更新的目的
          if (fs.existsSync(y)) {
            fs.cp(y, x, (err) => {
              if (err) { }
            })
          }
        } else {
          //不存在就复制
          if (!fs.existsSync(x)) {
            fs.cp(y, x, (err) => {
              if (err) { }
            })
          }
        }
      })
    })
    return
  }
  //复制两个文件
  generateImg = (path, name) => {
    path.forEach((itempath) => {
      name.forEach((itemname) => {
        let x = `${__dirname}/resources/img/${itempath}/${itemname}`
        if (!fs.existsSync(x)) {
          let y = `${__dirname}/resources/html/allimg/${itempath}/${itemname}`
          fs.cp(y, x,
            (err) => {
              if (err) { }
            })
        }
      })
    })
    return
  }
  /**
   * 循环创建指定目录
   * @param {*} arr 
   * @returns 
   */
  generateDirectory = (arr) => {
    for (let item in arr) {
      if (!fs.existsSync(item)) {
        fs.mkdir(item, (err) => {
          console.log(err)
        })
      }
    }
    return true
  }
}
export default new CreateData()