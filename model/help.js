import xiuxianCfg from './config.js'
import { appname } from './main.js'
const dirname = `plugins/${appname}/resources`
class Help {
  gethelp = async (e, filename) => {
    const helpData = xiuxianCfg.getconfig('help', filename)
    return {
      saveId: 'help',//这里其实是文件名
      //模板html路径  
      tplFile: `./${dirname}/html/help/help.html`,
      /** 绝对路径 */
      pluResPath: `${process.cwd().replace(/\\/g, '/')}/${dirname}/`,
      /** 版本 */
      version: "v2.0",
      /** 数据 */
      helpData
    }
  }
  getboxhelp = async (filename) => {
    const helpData = xiuxianCfg.getconfig('help', filename)
    return {
      saveId: 'help',//这里其实是文件名
      //模板html路径  
      tplFile: `./${dirname}/html/help/help.html`,
      /** 绝对路径 */
      pluResPath: `${process.cwd().replace(/\\/g, '/')}/${dirname}/`,
      /** 版本 */
      version: "v2.0",
      /** 数据 */
      helpData
    }
  }
}
export default new Help()