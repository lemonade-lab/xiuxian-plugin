import fs from 'node:fs'
import { appname } from './main.js'
import BoxFs from './boxfs.js'
class filecp {
  constructor() {
    this.defsetpath = `./plugins/${appname}/resources/defSet/`
    this.configpath = `./plugins/${appname}/config/`
    this.configarr = ['xiuxian', 'task', 'Help', 'Admin']
    const path = ['help', 'map', 'toplist', 'updata', 'user/bag', 'user/equipment', 'user/head', 'user/head', 'user/information']
    const name = ['help.png', 'icon.png','map.png','toplist.png','update-buttom.png','bag.png','equipment.png','head.png','information.png','left.png','right.png']
    this.help(path, name)
    this.file()
  }
  Pluginfile = (name, config) => {
    const defsetpath = `./plugins/${appname}/plugins/${name}/defSet/`
    const path = BoxFs.returnMenu(defsetpath)
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
  upfile = () => {
    const path = BoxFs.returnMenu(this.defsetpath)
    path.forEach((itempath) => {
      this.configarr.forEach((itemconfig) => {
        let x = `${this.configpath}${itempath}/${itemconfig}.yaml`
        let y = `${this.defsetpath}${itempath}/${itemconfig}.yaml`
        //存在就复制,需要替换原文件
        if (fs.existsSync(y)) {
          fs.cp(y, x, (err) => {
            if (err) { }
          })
        }
      })
    })
    return
  }
  file = () => {
    const path = BoxFs.returnMenu(this.defsetpath)
    path.forEach((itempath) => {
      this.configarr.forEach((itemconfig) => {
        let x = `${this.configpath}${itempath}/${itemconfig}.yaml`
        let y = `${this.defsetpath}${itempath}/${itemconfig}.yaml`
        //不存在就复制
        if (!fs.existsSync(x)) {
          fs.cp(y, x, (err) => {
            if (err) { }
          })
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
}
export default new filecp()