import base from "./base.js";
import xiuxianCfg from "./Config.js";

export default class Help extends base {
  constructor(e) {
    super(e);
    this.model0 = "help";
    this.model = "help";
    this.versionData = xiuxianCfg.getdefSet("version", "version");
  }

  async database(data1, data2) {
    let helpData = xiuxianCfg.getConfig(data1, data2);
    const version = this.versionData[0].version;
    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }

  static async gethelp1(e) {
    let html = new Help(e);
    return await html.database("help", "Help1");
  }

  static async gethelp2(e) {
    let html = new Help(e);
    return await html.database("help", "Help2");
  }

  static async getadmin(e) {
    let html = new Help(e);
    return await html.database("help", "Admin");
  }

  static async getassociation(e) {
    let html = new Help(e);
    return await html.database("help", "Association");
  }

}
