import { type Message, plugin, define } from '../../../import.js'
import { getUserMessageByUid } from '../../model/message.js'
import component from '../../image/index.js'
export class user extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)踏入仙途/,
          fnc: 'createData'
        }
      ]
    })
  }
  /**
   * 踏入仙途
   * @param e
   * @returns
   */
  async createData(e: Message) {
    const data = getUserMessageByUid(e.user_id)
    component.message(data).then((img) => {
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }
}
