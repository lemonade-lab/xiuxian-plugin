import puppeteer from "../puppeteer/puppeteer.js"
import { __dirname } from "../../main.js"
/**中间返回show与yunzai的图片方法进行对接*/
class ImgIndex {
    /**
     * @param { path, name, data } param0 
     * @returns 
     */
    showPuppeteer = async ({ path, name, data }) => {
        const img = await puppeteer.screenshot(name, {
            /** heml路径 */
            tplFile: `${__dirname}/resources/html/${path}/${name}.html`,
            /** css路径 */
            pluResPath: `${__dirname.replace(/\\/g, '/')}`,
            /** 版本 */
            version: "v2.0",
            /** 数据 */
            ...data,
        })
        return img
    }
}
export default new ImgIndex()