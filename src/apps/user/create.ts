import { type Event, plugin, define } from '../../../import.js'
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
  async createData(e: Event) {
    // 获取账号
    const uid = e.user_id
    // 尝试读取数据，如果没有数据将自动创建
    const data = getUserMessageByUid(uid)
    // 数据植入组件
    component.message(data).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }
}
