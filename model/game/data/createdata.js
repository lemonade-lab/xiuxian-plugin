import fs from 'node:fs'
import { MyDirPath } from '../../../app.config.js'

/** 自定义配置 */
const configarr = [
  'cooling.yaml',
  'namelist.yaml',
  'task.yaml',
  'help.yaml',
  'darkhelp.yaml',
  'admin.yaml',
  'time.yaml',
  'home_help.yaml',
  'home_admin.yaml',
  'ass_admin.yaml',
  'ass_help.yaml'
]

let defsetpath = `${MyDirPath}/resources/defset`

let configpath = `${MyDirPath}/config`

class CreateData {
  /**
   * @returns
   */
  createConfig() {
    for (let itemconfig of configarr) {
      let x = `${configpath}/${itemconfig}`
      let y = `${defsetpath}/${itemconfig}`
      // 发现配置不存在
      if (!fs.existsSync(x)) {
        // 补缺配置
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
   * 重置配置
   */
  recreateConfig() {
    for (let itemconfig of configarr) {
      let x = `${configpath}/${itemconfig}`
      let y = `${defsetpath}/${itemconfig}`
      // 直接复制
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
export default new CreateData()
