import { AppName } from '../../config.js'
export default class base {
  userId = null
  e = null
  model = null
  _path = null
  constructor() {
    this.model = AppName
    this._path = process.cwd().replace(/\\/g, '/')
  }

  get prefix() {
    return `Yz:${AppName}:${this.model}:`
  }

  /**
   * 截图默认数据
   * @param saveId html保存id
   * @param tplFile 模板html路径
   * @param pluResPath 插件资源路径
   */
  get screenData() {
    return {
      tplFile: `./plugins/${AppName}/resources/html/${this.model}/${this.model}.html`,
      /** 绝对路径 */
      pluResPath: `${this._path}/plugins/${AppName}/resources/`
    }
  }
}
