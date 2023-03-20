import base from './base.js';
import xiuxianCfg from './Config.js';

export default class Help2 extends base {
  constructor(e) {
    super(e);
    this.model = 'shituhelp';
  }

  static async shituhelp(e) {
    let html = new Help2(e);
    return await html.shituhelp();
  }

  async shituhelp() {
    let helpData = xiuxianCfg.getdefSet('help', 'shituhelp');
    let versionData = xiuxianCfg.getdefSet('version', 'version');
    const version =
      (versionData && versionData.length && versionData[0].version) || '1.0.4';
    return {
      ...this.screenData,
      saveId: 'help',
      version: version,
      helpData,
    };
  }
}
