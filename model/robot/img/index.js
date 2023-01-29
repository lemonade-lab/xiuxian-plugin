import puppeteer from "../../../../../lib/puppeteer/puppeteer.js"
import { appname } from "../../main.js"
/**
 * 中间返回show与yunzai的图片方法进行对接
 */
class ImgIndex {
    showPuppeteer = async ({ path, name, data }) => {
        const mydata = {
            /** 文件名 */
            saveId: name,
            /** 相对路径 */
            tplFile: `./plugins/${appname}/resources/html/${path}/${name}.html`,
            /** 绝对路径 */
            pluResPath: `${process.cwd().replace(/\\/g, '/')}/plugins/${appname}/resources/`,
            /** 数据 */
            ...data,
        }
        const img = await puppeteer.screenshot(name, {
            ...mydata,
        })
        return img
    }
}
export default new ImgIndex()