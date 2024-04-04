import { type Event, plugin, define } from '../../../import.js'
export class ping extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?(闭关|修炼)$/,
          fnc: 'cultivation'
        },
        {
          reg: /^(#|\/)?商店$/,
          fnc: 'shoping'
        }
      ]
    })
  }
  /**
   *
   * @param e
   * @returns
   */
  async cultivation(e: Event) {
    e.reply('待更新')
    return false
  }

  /**
   *
   * @param e
   * @returns
   */
  async shoping(e: Event) {
    e.reply('待更新')
    return false
  }
}
