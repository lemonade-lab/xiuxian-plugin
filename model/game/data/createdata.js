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

let defsetpath = `${MyDirPath}/resources/defset`

let configpath = `${MyDirPath}/config`

class CreateData {
  /**
   * @returns
   */
  moveConfig = () => {
    const path = algorithm.returnMenu(defsetpath)
    for (let itempath of path) {
      for (let itemconfig of configarr) {
        let x = `${configpath}/${itempath}/${itemconfig}`
        let y = `${defsetpath}/${itempath}/${itemconfig}`
        //发现配置不存在
        if (!fs.existsSync(x)) {
          //补缺配置
          if (fs.existsSync(y)) {
            fs.cp(y, x, (err) => {
              if (err) {
                console.log(err)
              }
            })
          }
        }
      }
    }
    /**
     * 检测配置更新
     */
    this.startConfigUpdata()
    /**
     * 启动备份
     */
    this.startVersion()
    return
  }


  /**
   * 重置配置
   */
  removeConfig = () => {
    const path = algorithm.returnMenu(defsetpath)
    for (let itempath of path) {
      for (let itemconfig of configarr) {
        let x = `${configpath}/${itempath}/${itemconfig}`
        let y = `${defsetpath}/${itempath}/${itemconfig}`
        //直接复制
        if (fs.existsSync(y)) {
          fs.cp(y, x, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }
      }
    }
  }

  removeConfigByArr = (arr) => {
    const path = algorithm.returnMenu(defsetpath)
    for (let itempath of path) {
      for (let itemconfig of arr) {
        let x = `${configpath}/${itempath}/${itemconfig}`
        let y = `${defsetpath}/${itempath}/${itemconfig}`
        //直接复制
        if (fs.existsSync(y)) {
          fs.cp(y, x, (err) => {
            if (err) {
              console.log(err)
            }
          })
        }
      }
    }
  }


  /**
   * 检测配置更新
   */
  startConfigUpdata = () => {
    let init = 0
    setTimeout(() => {
      if (init == 0) {
        const Nconfig = defset.getConfig({ app: 'version', name: 'time' })
        const Vconfig = defset.getDefset({ app: 'version', name: 'time' })
        if (Nconfig['time'] != Vconfig['time']) {
          console.log('[xiuxian@2.0.0]配置版本不匹配...')
          console.log('[xiuxian@2.0.0]准备重置配置...')
          const arr = configarr.filter(item => item != 'namelist.yaml')
          this.removeConfigByArr(arr)
          console.log('[xiuxian@2.0.0]配置重置完成')
        }
      }
      init = 1
    }, 20000)
  }

  /**
   * 启动备份
   */
  startVersion = () => {
    let ini = 0
    setTimeout(() => {
      if (ini == 0) {
        const Test = defset.getConfig({ app: 'task', name: 'task' })
        if (Test['CopeTask']) {
          if (Test['CopeTask'] == 1) return
          schedule.scheduleJobflie({ time: Test['CopeTask'] })
        }
      }
      ini = 1
    }, 30000)
  }

}
export default new CreateData()