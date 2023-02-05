import config from '../data/defset/updata.js'
import { __dirname } from '../../main.js'
/** 生成帮助图*/
class Help {
  getboxhelp = async ({ name }) => {
    const helpData = config.getConfig({ app: 'help', name })
    return {
      /** heml路径 */
      tplFile: `${__dirname}/resources/html/help/help.html`,
      /*需要转义 */
      pluResPath: `${__dirname.replace(/\\/g, '/')}`,
      /** 版本 */
      version: "v2.0",
      /** 数据 */
      helpData
    }
  }
}
export default new Help()