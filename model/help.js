import base from "./base.js";
import xiuxianCfg from "./Config.js";

export default class Help extends base {
  constructor(e) {
    super(e);
    this.model0 = "help";
    this.model = "help";
    this.versionData = xiuxianCfg.getdefSet("version", "version");
  }

  static async get(e) {
    let html = new Help(e);
    return await html.getData();
  }

  static async gethelpcopy(e) {
    let html = new Help(e);
    return await html.getDatahelpcopy();
  }

  static async setup(e) {
    let html = new Help(e);
    return await html.Getset();
  }

  async getDatahelpcopy() {
    let helpData = xiuxianCfg.getConfig("help", "helpcopy");
    const version =  this.versionData[0].version;
    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }

  async getData() {
    let helpData = xiuxianCfg.getConfig("help", "help");
    const version =  this.versionData[0].version ;

    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }

  async Getset() {
    let helpData = xiuxianCfg.getConfig("help", "set");
    const version =  this.versionData[0].version ;
    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }

}
