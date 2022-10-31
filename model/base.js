
export default class base {
  constructor(e = {}) {
    this.e = e;
    this.userId = e?.user_id;
    this.model = "xiuxian-emulator-plugin";
    this._path = process.cwd().replace(/\\/g, "/");
  }
  get prefix() {
    return `Yz:xiuxian-emulator-plugin:${this.model}:`;
  }
  /**
   * 截图默认数据
   * @param saveId html保存id
   * @param tplFile 模板html路径
   * @param pluResPath 插件资源路径
   */
  get screenData() {
    return {
      saveId: this.userId,
      tplFile: `./plugins/xiuxian-emulator-plugin/resources/html/${this.model0}/${this.model}.html`,
      /** 绝对路径 */
      pluResPath: `${this._path}/plugins/xiuxian-emulator-plugin/resources/`,
    };
  }
}
