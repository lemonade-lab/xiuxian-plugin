import { type Event, plugin, define } from '../../../import'
export class message extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?功法信息$/,
          fnc: 'getKillMessage'
        },
        {
          reg: /^(#|\/)?装备信息$/,
          fnc: 'getEquitmentMessage'
        }
      ]
    })
  }

  /**
   * @param e
   * @returns
   */
  async getKillMessage(e: Event) {
    e.reply('待更新')
  }

  async getEquitmentMessage(e: Event) {
    e.reply('待更新')
  }
}
