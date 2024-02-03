import base from './base.js'
import { getConfig } from './Config.js'
export default class Help extends base {
  versionData = null
  constructor(e) {
    super()
    this.model = 'help'
    this.versionData = getConfig('version', 'version')
  }

  static get(e) {
    return new Help(e).getData()
  }

  static gethelpcopy(e) {
    return new Help(e).getDatahelpcopy()
  }

  static setup(e) {
    return new Help(e).Getset()
  }

  static Association(e) {
    return new Help(e).GetAssociationt()
  }

  getDATA(name: string) {
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData: getConfig('help', name)
    }
  }

  getDatahelpcopy() {
    return this.getDATA('helpcopy')
  }

  getData() {
    return this.getDATA('help')
  }

  Getset() {
    return this.getDATA('set')
  }

  GetAssociationt() {
    return this.getDATA('Association')
  }
}
