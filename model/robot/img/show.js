import { appname } from "../../main.js"
class Show {
  /**
   * @param {地址} path 
   * @param {文件名} name 
   * @param {数据} myData 
   * @returns 
   */
  get_Data = async (path, name, myData) => {
    return {
      /** 文件名 */
      saveId: name,
      /** 相对路径 */
      tplFile: `./plugins/${appname}/resources/html/${path}/${htmlname}.html`,
      /** 绝对路径 */
      pluResPath: `${process.cwd().replace(/\\/g, '/')}/plugins/${appname}/resources/`,
      /** 数据 */
      ...myData,
    }
  }
}
export default new Show()