import base from './base.js';
import xiuxianCfg from './Config.js';

export default class Help2 extends base {
  constructor(e) {
    super(e);
    this.model = 'shituhelp';
    this.versionData = xiuxianCfg.getConfig('version', 'version');
  }

  static async shituhelp(e) {
    let html = new Help2(e);
    return await html.shituhelp();
  }

  async shituhelp() {
    let helpData = xiuxianCfg.getConfig('help', 'shituhelp');
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData,
    };
  }
}
