import { existsSync, cp } from 'node:fs'
import { DirPath } from '../../../app.config.js'

/** 自定义配置 */
const ConfigArr = [
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

let DefsetPath = `${DirPath}/resources/defset`

let ConfigPath = `${DirPath}/config`

class CreateData {
  /**
   * @returns
   */
  createConfig() {
    for (let itemConfig of ConfigArr) {
      let x = `${ConfigPath}/${itemConfig}`
      let y = `${DefsetPath}/${itemConfig}`
      // 发现配置不存在
      if (!existsSync(x)) {
        // 补缺配置
        if (existsSync(y)) {
          cp(y, x, (err) => {
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
    for (let itemConfig of ConfigArr) {
      let x = `${ConfigPath}/${itemConfig}`
      let y = `${DefsetPath}/${itemConfig}`
      // 直接复制
      if (existsSync(y)) {
        cp(y, x, (err) => {
          if (err) {
            console.info(err)
          }
        })
      }
    }
  }
}
export default new CreateData()
