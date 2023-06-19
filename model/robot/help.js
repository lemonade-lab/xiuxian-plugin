import { getConfig } from './defset.js'
import { MyDirPath } from '../../app.Config.js'
/** 生成帮助图 */
export function getboxhelp({ name }) {
  const data = getConfig({ name })
  return {
    /** heml路径 */
    tplFile: `${MyDirPath}/resources/html/help/help.html`,
    /* 需要转义 */
    pluResPath: `${MyDirPath.replace(/\\/g, '/')}`,
    /** 版本 */
    version: 'v2.0',
    /** 数据 */
    data
  }
}
