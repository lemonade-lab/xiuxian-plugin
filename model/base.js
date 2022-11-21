
export default class base {
  constructor(e = {}) {
    this.e = e;
    this.userId = e?.user_id;
    this.model = 'xiuxian-emulator-plugin';
    this._path = process.cwd().replace(/\\/g, '/');
  };
  get prefix() {
    return `Yz:xiuxian-emulator-plugin:${this.model}:`;
  };
  get screenData() {
    return {
      //html保存id
      saveId: this.userId,
      //模板html路径
      tplFile: `./plugins/xiuxian-emulator-plugin/resources/html/${this.model0}/${this.model}.html`,
      /** 绝对路径 */
      //插件资源路径
      pluResPath: `${this._path}/plugins/xiuxian-emulator-plugin/resources/`,
    };
  };
};