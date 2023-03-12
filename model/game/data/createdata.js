import fs from 'node:fs'
import { __dirname } from '../../main.js'
import algorithm from './algorithm.js'
/* 默认重置的图片 */
const ImgPath = ['help', 'map', 'toplist', 'updata', 'user/bag', 'user/equipment', 'user/head', 'user/head', 'user/information']
const ImgName = ['help.png', 'icon.png', 'map.png', 'toplist.png', 'update-buttom.png', 'update-head.png', 'update-top.png', 'bag.png', 'equipment.png', 'head.png', 'information.png', 'left.png', 'right.png']
/** 自定义配置*/
const configarr = ['cooling.yaml', 'task.yaml', 'help.yaml', 'darkhelp.yaml', 'admin.yaml']
class CreateData {
  constructor() {
    this.resources = `${__dirname}/resources`
    this.defsetpath = `${__dirname}/resources/defset`
    this.configpath = `${__dirname}/config`
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
            if (err) { }
          })
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
  /**
   * @param { path, name } param0 
   * @returns 
   */
  generateImg = () => {
    ImgPath.forEach((itempath) => {
      ImgName.forEach((itemname) => {
        let x = `${this.resources}/img/${itempath}/${itemname}`
        if (!fs.existsSync(x)) {
          let y = `${this.resources}/html/allimg/${itempath}/${itemname}`
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
   * @param { path, name } param0 
   * @returns 
   */
  reImg = ({ path, name }) => {
    path.forEach((itempath) => {
      name.forEach((itemname) => {
        let x = `${this.resources}/img/${itempath}/${itemname}`
        if (fs.existsSync(x)) {
          let y = `${this.resources}/html/allimg/${itempath}/${itemname}`
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
   * @param {arr} arr 
   * @returns 
   */
  generateDirectory = (arr) => {
    for (let item in arr) {
      if (!fs.existsSync(item)) {
        fs.mkdir(item, (err) => { })
      }
    }
    return true
  }
}
export default new CreateData()