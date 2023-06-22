import { getConfig } from './defset.js'
import { DirPath } from '../../app.config.js'
/** 生成帮助图 */
export function getboxhelp(name) {
  const data = getConfig(name)
  return {
    /** heml路径 */
    tplFile: `${DirPath}/resources/html/help/help.html`,
    /* 需要转义 */
    pluResPath: `${DirPath.replace(/\\/g, '/')}`,
    /** 版本 */
    version: 'v2.0',
    /** 数据 */
    data
  }
}
