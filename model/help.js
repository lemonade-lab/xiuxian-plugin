import base from './base.js';
import xiuxianCfg from './Config.js';
export default class Help extends base {
  constructor(e) {
    super(e);
    this.model0 = 'help';
    this.model = 'help';
    this.versionData = xiuxianCfg.getdefSet('version', 'version');
  };
  database = async (data1, data2) => {
    let helpData = xiuxianCfg.getConfig(data1, data2);
    const version = this.versionData[0].version;
    return {
      ...this.screenData,
      saveId: 'help',
      version: version,
      helpData,
    };
  };
  static gethelp = async (e, helpaddress) => {
    let html = new Help(e);
    return await html.database('help', helpaddress);
  };
};