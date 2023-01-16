import puppeteer from "../../../../lib/puppeteer/puppeteer.js"
import { dirname } from "../main.js"
/**
 * 
 */
class Show {
  /**
   * @param {地址} path 
   * @param {文件名} name 
   * @param {数据} myData 
   * @param {UID} UID
   * @returns 
   */
  get_Data = async (path, name, myData, UID) => {
    const userId = UID  //用户id
    const htmlname=name = name//文件名
    return {
      //html保存id
      saveId: userId,
      //模板html路径  
      tplFile: `./${dirname}/html/${path}/${htmlname}.html`,
      /** 绝对路径 */
      pluResPath: `${process.cwd().replace(/\\/g, '/')}/${dirname}/`,
      /** 数据 */
      ...myData,
    }
  }
}
export default new Show()
export const showPuppeteer = async (path, name, data) => {
  const mydata = await Show.get_Data(path, name, data)
  const img = await puppeteer.screenshot(name, {
      ...mydata,
  })
  return img
}