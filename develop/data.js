import path from 'path'
import puppeteer from './puppeteer/puppeteer.js'
import { getConfig } from './defset/defset.js'
export const getData = () => {
    const data = getConfig({ app: 'help', name: 'help' })
    return puppeteer.dealTpl('help', {
        /** heml路径 */
        tplFile: `${path.resolve().replace(/\\/g, '/')}/resources/html/help/help.html`,
        /** css路径 */
        pluResPath: ``,
        /** 版本 */
        version: "V2.0",
        /** 数据 */
        data
    })
}