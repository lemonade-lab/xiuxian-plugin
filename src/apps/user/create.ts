import { type Message, plugin } from '../../../import.js'
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
    e.reply('创建数据')
    return false
  }
}
