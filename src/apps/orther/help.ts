import { type Message, plugin, define } from '../../../import.js'
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
  async xiuxianHelp(e: Message) {
    component.hello().then((img) => {
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }
}
