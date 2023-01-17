import fs from 'node:fs'
import { appname } from '../../main.js'
import Algorithm from './algorithm.js'
class CreateData {
  constructor() {
    this.defsetpath = `./plugins/${appname}/resources/defset/`
    this.configpath = `./plugins/${appname}/config/`
    this.configarr = ['xiuxian', 'task', 'Help', 'Admin']
  }
  Pluginfile = (name, config) => {
    const defsetpath = `./plugins/${appname}/plugins/${name}/defset/`
    const path = Algorithm.returnMenu(defsetpath)
    path.forEach((itempath) => {
      config.forEach((itemconfig) => {
        let x = `${this.configpath}${itempath}/${itemconfig}.yaml`
        let y = `${defsetpath}${itempath}/${itemconfig}.yaml`
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
    path.forEach((itempath) => {
      this.configarr.forEach((itemconfig) => {
        let x = `${this.configpath}${itempath}/${itemconfig}.yaml`
        let y = `${this.defsetpath}${itempath}/${itemconfig}.yaml`
        //刷新控制
        if (parameter) {
          //存在就复制,需要替换原文件
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
  help = (path, name) => {
    path.forEach((itempath) => {
      name.forEach((itemname) => {
        let x = `./plugins/${appname}/resources/img/${itempath}/${itemname}`
        if (!fs.existsSync(x)) {
          let y = `./plugins/${appname}/resources/html/allimg/${itempath}/${itemname}`
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