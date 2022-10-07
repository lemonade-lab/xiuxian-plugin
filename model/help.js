import base from "./base.js";
import xiuxianCfg from "./Config.js";

export default class Help extends base {
  constructor(e) {
    super(e);
    this.model0 = "help";
    this.model = "help";
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
    let helpData = xiuxianCfg.getdefSet("help", "helpcopy");
    let versionData = xiuxianCfg.getdefSet("version", "version");
    const version =  versionData[0].version;
    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }
  

  async getData() {
    let helpData = xiuxianCfg.getdefSet("help", "help");

    let versionData = xiuxianCfg.getdefSet("version", "version");
    const version =  versionData[0].version ;

    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }

  async Getset() {
    let helpData = xiuxianCfg.getdefSet("help", "set");
    let versionData = xiuxianCfg.getdefSet("version", "version");
    const version =  versionData[0].version ;
    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }



}
