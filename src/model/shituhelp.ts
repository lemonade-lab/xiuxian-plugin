import base from './base.js'
import { getConfig } from './Config.js'
export default class Help2 extends base {
  versionData = null
  model = null
  constructor() {
    super()
    this.model = 'shituhelp'
    this.versionData = getConfig('version', 'version')
  }
  static shituhelp() {
    return new Help2().shituhelp()
  }
  shituhelp() {
    return {
      ...this.screenData,
      saveId: 'help',
      version: this.versionData.version,
      helpData: getConfig('help', 'shituhelp')
    }
  }
}
