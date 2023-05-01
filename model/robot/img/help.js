import config from '../data/defset.js'
import { MyDirPath } from '../../../app.config.js'
/** 生成帮助图*/
class Help {
  getboxhelp = async ({ name }) => {
    const data = config.getConfig({ app: 'help', name })
    return {
      /** heml路径 */
      tplFile: `${MyDirPath}/resources/html/help/help.html`,
      /*需要转义 */
      pluResPath: `${MyDirPath.replace(/\\/g, '/')}`,
      /** 版本 */
      version: 'v2.0',
      /** 数据 */
      data
    }
  }
}
export default new Help()
