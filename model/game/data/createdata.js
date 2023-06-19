import fs from 'node:fs'
import { MyDirPath } from '../../../app.config.js'

/** 自定义配置 */
const Configarr = [
  'cooling.yaml',
  'namelist.yaml',
  'task.yaml',
  'help.yaml',
  'admin.yaml',
  'dark_help.yaml',
  'dark_admin.yaml',
  'home_help.yaml',
  'home_admin.yaml',
  'ass_help.yaml',
  'ass_admin.yaml'
]

let defsetpath = `${MyDirPath}/resources/defset`

let Configpath = `${MyDirPath}/config`

class CreateData {
  /**
   * @returns
   */
  createConfig() {
    for (let itemConfig of Configarr) {
      let x = `${Configpath}/${itemConfig}`
      let y = `${defsetpath}/${itemConfig}`
      // 发现配置不存在
      if (!fs.existsSync(x)) {
        // 补缺配置
        if (fs.existsSync(y)) {
          fs.cp(y, x, (err) => {
            if (err) {
              console.info(err)
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
    for (let itemConfig of Configarr) {
      let x = `${Configpath}/${itemConfig}`
      let y = `${defsetpath}/${itemConfig}`
      // 直接复制
      if (fs.existsSync(y)) {
        fs.cp(y, x, (err) => {
          if (err) {
            console.info(err)
          }
        })
      }
    }
  }
}
export default new CreateData()
