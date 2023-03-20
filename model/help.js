import base from "./base.js";
import xiuxianCfg from "./config.js";
export default class Help extends base {
  constructor(e) {
    super(e);
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

  static async Association(e) {
    let html = new Help(e);
    return await html.GetAssociationt();
  }

  async getDatahelpcopy() {
    let helpData = xiuxianCfg.getconfig("help", "helpcopy");
    let versionData = xiuxianCfg.getdefSet("version", "version");
    const version = (versionData && versionData.length && versionData[0].version) || "1.0.4";
    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }




  async getData() {
    let helpData = xiuxianCfg.getconfig("help", "help");

    let versionData = xiuxianCfg.getdefSet("version", "version");
    const version = (versionData && versionData.length && versionData[0].version) || "1.0.4";

    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }

  async Getset() {
    let helpData = xiuxianCfg.getconfig("help", "set");
    let versionData = xiuxianCfg.getdefSet("version", "version");
    const version = (versionData && versionData.length && versionData[0].version) || "1.0.4";
    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }

  async GetAssociationt() {
    let helpData = xiuxianCfg.getconfig("help", "Association");
    let versionData = xiuxianCfg.getdefSet("version", "version");
    const version = (versionData && versionData.length && versionData[0].version) || "1.0.4";
    return {
      ...this.screenData,
      saveId: "help",
      version: version,
      helpData,
    };
  }

}
