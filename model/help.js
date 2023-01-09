import xiuxianCfg from './Config.js';
const appname = 'Xiuxian-Plugin-Box'
const dirname = `plugins/${appname}/resources`
class Help {
  constructor() {
    this._path = process.cwd().replace(/\\/g, '/')  //插件位置 
  }
  gethelp = async (e, folename) => {
    const helpData = xiuxianCfg.getConfig('help', folename);
    return {
      saveId: 'help',//这里其实是文件名
      //模板html路径  
      tplFile: `./${dirname}/html/help/help.html`,
      /** 绝对路径 */
      pluResPath: `${this._path}/${dirname}/`,
      /** 版本 */
      version: "v2.0",
      /** 数据 */
      helpData
    }
  }
  getboxhelp = async (folename) => {
    const helpData = xiuxianCfg.getConfig('help', folename);
    return {
      saveId: 'help',//这里其实是文件名
      //模板html路径  
      tplFile: `./${dirname}/html/help/help.html`,
      /** 绝对路径 */
      pluResPath: `${this._path}/${dirname}/`,
      /** 版本 */
      version: "v2.0",
      /** 数据 */
      helpData
    }
  }
}
export default new Help()