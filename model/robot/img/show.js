import { appname } from "../../main.js"
class Show {
  /**
   * @param {地址} path 
   * @param {文件名} name 
   * @param {数据} data 
   * @returns 
   */
  getData = async (parameter) => {
    const { path, name, data } = parameter
    return {
      /** 文件名 */
      saveId: name,
      /** 相对路径 */
      tplFile: `./plugins/${appname}/resources/html/${path}/${name}.html`,
      /** 绝对路径 */
      pluResPath: `${process.cwd().replace(/\\/g, '/')}/plugins/${appname}/resources/`,
      /** 数据 */
      ...data,
    }
  }
}
export default new Show()