import fs from 'node:fs'
import { appname } from './main.js'
import BoxFs from './boxfs.js'
class filecp {
  constructor() {
    this.defsetpath = `./plugins/${appname}/defSet/`
    this.configpath = `./plugins/${appname}/config/`
    this.file(['xiuxian', 'task', 'Help', 'Admin'])
    this.help(['help'], ['help.jpg'])
  }
  Pluginfile = (name, config) => {

    const defsetpath = `./plugins/${appname}/plugins/${name}/defSet/`

    const path = BoxFs.returnMenu(defsetpath)
    for (var j = 0; j < path.length; j++) {
      for (var i = 0; i < config.length; i++) {
        let x = `${this.configpath}${path[j]}/${config[i]}.yaml`
        let y = `${defsetpath}${path[j]}/${config[i]}.yaml`
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
      }
    }
    return
  }
  upfile = () => {
    const config = ['xiuxian', 'task', 'Help', 'Admin']
    const path = BoxFs.returnMenu(this.defsetpath)
    for (var j = 0; j < path.length; j++) {
      for (var i = 0; i < config.length; i++) {
        let x = `${this.configpath}${path[j]}/${config[i]}.yaml`
        let y = `${this.defsetpath}${path[j]}/${config[i]}.yaml`
        //是
        if (fs.existsSync(y)) {
          fs.cp(y, x, (err) => {
            if (err) { }
          })
        }
      }
    }
    return
  }
  file = (config) => {
    const path = BoxFs.returnMenu(this.defsetpath)
    for (var j = 0; j < path.length; j++) {
      for (var i = 0; i < config.length; i++) {
        let x = `${this.configpath}${path[j]}/${config[i]}.yaml`
        let y = `${this.defsetpath}${path[j]}/${config[i]}.yaml`
        //非
        if (!fs.existsSync(x)) {
          fs.cp(y, x, (err) => {
            if (err) { }
          })
        }
      }
    }
    return
  }
  //复制两个文件
  help = (path, name) => {
    for (var i = 0; i < path.length; i++) {
      let x = `./plugins/${appname}/resources/${path[i]}/${name[i]}`
      if (!fs.existsSync(x)) {
        let y = `./plugins/${appname}/resources/img/${path[i]}/${name[i]}`
        fs.cp(y, x,
          (err) => {
            if (err) { }
          })
      }
    }
    return
  }
}
export default new filecp()