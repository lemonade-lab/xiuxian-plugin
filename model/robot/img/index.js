import puppeteer from "../../../../../lib/puppeteer/puppeteer.js"
import { appname } from "../../main.js"
/**中间返回show与yunzai的图片方法进行对接*/
class ImgIndex {
    /**
     * @param { path, name, data } param0 
     * @returns 
     */
    showPuppeteer = async ({ path, name, data }) => {
        const img = await puppeteer.screenshot(name, {
            /** 文件名 */
            saveId: name,
            /** 相对路径 */
            tplFile: `./plugins/${appname}/resources/html/${path}/${name}.html`,
            /** 绝对路径 */
            pluResPath: `${process.cwd().replace(/\\/g, '/')}/plugins/${appname}/resources/`,
            /** 数据 */
            ...data,
        })
        return img
    }
}
export default new ImgIndex()