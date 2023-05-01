import fs from 'node:fs'
import { MyDirPath } from '../../../app.config.js'
import algorithm from './algorithm.js'
import defset from './defset.js'
import schedule from './schedule.js'

/** 自定义配置*/
const configarr = [
  'cooling.yaml',
  'namelist.yaml',
  'task.yaml',
  'help.yaml',
  'darkhelp.yaml',
  'admin.yaml',
  'time.yaml'
]

let initialization = 1

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

    for (let itempath of path) {
      for (let itemconfig of configarr) {
        let x = `${this.configpath}/${itempath}/${itemconfig}`
        let y = `${this.defsetpath}/${itempath}/${itemconfig}`
        //刷新控制
        if (name) {
          //直接复制
          if (fs.existsSync(y)) {
            fs.cp(y, x, (err) => {
              if (err) {
                console.log(err)
              }
            })
          }
        } else {
          //不存在就复制
          if (!fs.existsSync(x)) {
            if (fs.existsSync(y)) {
              initialization = 0
              fs.cp(y, x, (err) => {
                if (err) {
                  console.log(err)
                }
              })
            }
          }
        }
      }
    }


    /* 版本监控 */
    setTimeout(() => {
      const Nconfig = defset.getConfig({ app: 'version', name: 'time' })
      const Vconfig = defset.getDefset({ app: 'version', name: 'time' })
      if (Nconfig['time'] != Vconfig['time']) {
        console.log('[xiuxian]当前配置版本:', Nconfig['time'])
        console.log('[xiuxian]本地配置版本:', Vconfig['time'])
        console.log('[xiuxian]版本不匹配...')
        console.log('[xiuxian]准备重置配置...')
        this.moveConfig({ name: 'updata' })
        console.log('[xiuxian]配置重置完成')
      } else {
        if (initialization == 0) {
          console.log('[xiuxian]发现配置缺失...')
          console.log('[xiuxian]准备初始哈配置...')
          this.moveConfig({ name: 'updata' })
          console.log('[xiuxian]配置初始哈完成')
          initialization = 1
        }
      }
    }, 15000)


    let ini = 0
    /* 版本监控 */
    setTimeout(() => {
      if (ini == 0) {
        const Test = defset.getConfig({ app: 'task', name: 'task' })
        if (Test['CopeTask']) {
          if (!Test['CopeTask'] == 1) {
            schedule.scheduleJobflie({ time: Test['CopeTask'] })
          }
        } else {
          //默认为1h
          schedule.scheduleJobflie({ time: '0 0 */1 * * ?' })
        }
      }
      ini = 1
    }, 15000)

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
