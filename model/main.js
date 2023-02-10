import path from 'path'
/**插件名*/
export const appname = 'xiuxian-plugin'
/*插件绝对路径 */
export const __dirname = `${path.resolve().replace(/\\/g, '/')}/plugins/${appname}`
/* 打印插件名 */
logger.info(`${appname}[2023-2-1]`);