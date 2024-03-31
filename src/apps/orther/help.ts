import { type Event, plugin, define } from '../../../import.js'
import component from '../../image/index.js'
export class help extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)修仙帮助/,
          fnc: 'xiuxianHelp'
        }
      ]
    })
  }
  /**
   * 修仙帮助
   * @param e
   * @returns
   */
  async xiuxianHelp(e: Event) {
    component.hello().then((img) => {
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }
}
