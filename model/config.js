import YAML from "yaml";
import fs from "fs";
import chokidar from "chokidar";
import lodash from "lodash";
import { AppName } from "../app.config.js";

class config {
  constructor() {
    /** 默认配置文件路径 */
    this.defsetPath = `./plugins/${AppName}/defset/`;
    this.defset = {};
    /** 用户自己配置的配置文件路径 */
    this.configPath = `./plugins/${AppName}/config/`;
    this.config = {};
    /** 监听文件 */
    this.watcher = { config: {}, defset: {} };
  }

  /**
   * 获取默认配置文件信息
   * @param app
   * @param name
   * @returns {*}
   */
  getdefset(app, name) {
    return this.getYaml(app, name, "defset");
  }

  /**
   * 获取用户自己配置的配置文件信息
   * @param app
   * @param name
   * @returns {{[p: string]: *}|*}
   */
  getconfig(app, name) {
    let ignore = [];

    if (ignore.includes(`${app}.${name}`)) {
      return this.getYaml(app, name, "config");
    }

    return {
      ...this.getdefset(app, name),
      ...this.getYaml(app, name, "config"),
    };
  }

  /**
   * 获取配置yaml配置文件
   * @param app 功能
   * @param name 名称
   * @param type 默认跑配置-defset，用户配置-config
   */
  getYaml(app, name, type) {
    let file = this.getFilePath(app, name, type);
    let key = `${app}.${name}`;

    if (this[type][key]) return this[type][key];

    this[type][key] = YAML.parse(fs.readFileSync(file, "utf8"));

    this.watch(file, app, name, type);

    return this[type][key];
  }

  /**
   * 获取文件路径
   * @param app 根目录下级目录，不写就是直接在根目录下查找
   * @param name文件名
   * @param type文件类型,默认查找config文件夹下的
   * @returns {string}
   */
  getFilePath(app, name, type) {
    //如果type=defset，返回默认配置文件的路径,路径为根目录
    if (type == "defset") return `${this.defsetPath}${app}/${name}.yaml`;
    else return `${this.configPath}${app}/${name}.yaml`;
  }

  /** 监听配置文件 */
  watch(file, app, name, type = "defset") {
    let key = `${app}.${name}`;

    if (this.watcher[type][key]) return;

    const watcher = chokidar.watch(file);
    watcher.on("change", (path) => {
      delete this[type][key];
      logger.mark(`[修改配置文件][${type}][${app}][${name}]`);
      if (this[`change_${app}${name}`]) {
        this[`change_${app}${name}`]();
      }
    });

    this.watcher[type][key] = watcher;
  }

  saveSet(app, name, type, data) {
    let file = this.getFilePath(app, name, type);
    if (lodash.isEmpty(data)) {
      fs.existsSync(file) && fs.unlinkSync(file);
    } else {
      let yaml = YAML.stringify(data);
      fs.writeFileSync(file, yaml, "utf8");
    }
  }
}

export default new config();
