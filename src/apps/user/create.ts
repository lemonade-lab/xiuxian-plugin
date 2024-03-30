import { type Message, plugin } from '../../../import.js'
import { getUserMessageByUid } from '../../model/message.js'
import component from '../../image/index.js'
export class user extends plugin {
  constructor() {
    super({
      name: '用户注册',
      dsc: '用户注册',
      event: 'message',
      priority: 400,
      rule: [
        {
          reg: /^(#|\/)踏入仙途/,
          fnc: 'createData'
        }
      ]
    })
  }

  async createData(e: Message) {
    const data = getUserMessageByUid(e.user_id)
    component.message(data).then((img) => {
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }
}
