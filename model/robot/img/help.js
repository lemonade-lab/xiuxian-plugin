import config from '../data/defset/updata.js'
import { appname } from '../../main.js'
/** 生成帮助图*/
class Help {
  getboxhelp = async ({ name }) => {
    const helpData = config.getConfig({ app: 'help', name })
    return {
      /** 文件名 */
      saveId: 'help',
      /** 相对路径 */
      tplFile: `./plugins/${appname}/resources/html/help/help.html`,
      /** 绝对路径 */
      pluResPath: `${process.cwd().replace(/\\/g, '/')}/plugins/${appname}/resources/`,
      /** 版本 */
      version: "v2.0",
      /** 数据 */
      helpData
    }
  }
}
export default new Help()