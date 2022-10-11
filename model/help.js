import base from "./base.js";
import xiuxianCfg from "./Config.js";
import fs from "node:fs";

const config0=["help","help"];
const config=["help","help_config"];
for(var i=0;i<config0.length;i++){
    let x='./plugins/xiuxian-emulator-plugin/resources/'+config0[i]+'/'+config[i]+'.jpg'
    if (!fs.existsSync(x)) {
        let y='./plugins/xiuxian-emulator-plugin/resources/img/'+config0[i]+'/'+config[i]+'.jpg'
        fs.cp(y, x, 
        (err) => {
          if (err) {
            console.error(x);
          }
        });
    }
}

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
