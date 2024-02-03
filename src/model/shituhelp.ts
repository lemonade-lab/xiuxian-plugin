import base from './image/base.js'
import { getConfig } from './Config.js'
export default class Help2 extends base {
  model = null
  constructor() {
    super()
    this.model = 'shituhelp'
  }
  static shituhelp() {
    return new Help2().shituhelp()
  }
  shituhelp() {
    return {
      ...this.screenData,
      saveId: 'help',
      version: '1.4.0',
      helpData: getConfig('help', 'shituhelp')
    }
  }
}
