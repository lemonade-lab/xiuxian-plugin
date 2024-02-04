import base from './base.js'
import { getConfig } from '../Config.js'
export default class Help extends base {
  constructor() {
    super()
    this.model = 'help'
  }

  static get() {
    return new Help().getData()
  }

  static gethelpcopy() {
    return new Help().getDatahelpcopy()
  }

  static setup() {
    return new Help().Getset()
  }

  static Association() {
    return new Help().GetAssociationt()
  }

  getDATA(name: string) {
    return {
      ...this.screenData,
      saveId: 'help',
      version: '1.4.0',
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
