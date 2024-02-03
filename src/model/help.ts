import base from './base.js'
import xiuxianCfg from './Config.js'
export default class Help extends base {
  versionData = null
  constructor(e) {
    super(e)
    this.model = 'help'
    this.versionData = xiuxianCfg.getConfig('version', 'version')
  }

  static async get(e) {
    let html = new Help(e)
    return await html.getData()
  }

  static async gethelpcopy(e) {
    let html = new Help(e)
    return await html.getDatahelpcopy()
  }

  static async setup(e) {
    let html = new Help(e)
    return await html.Getset()
  }

  static async Association(e) {
    let html = new Help(e)
    return await html.GetAssociationt()
  }

  async getDatahelpcopy() {
    let helpData = xiuxianCfg.getConfig('help', 'helpcopy')
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData
    }
  }

  async getData() {
    let helpData = xiuxianCfg.getConfig('help', 'help')
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData
    }
  }

  async Getset() {
    let helpData = xiuxianCfg.getConfig('help', 'set')
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData
    }
  }

  async GetAssociationt() {
    let helpData = xiuxianCfg.getConfig('help', 'Association')
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData
    }
  }
}
