import path from 'path'
import { dealTpl } from './puppeteer/puppeteer.js'
import { getConfig } from './defset/defset.js'
/*数据调试*/

/* 选择调试文件并重启 */
const tplFile = `${path.resolve().replace(/\\/g, '/')}/resources/html/help/help.html`

/* 需要填充的数据 */
const data = getConfig({ app: 'help', name: 'help' })


/* 调试结束 */
export const getData = () => {
    return dealTpl({
        /** heml路径 */
        tplFile,
        /** css路径 */
        pluResPath: ``,
        /** 版本 */
        version: "V2.0",
        /** 数据 */
        data
    })
}