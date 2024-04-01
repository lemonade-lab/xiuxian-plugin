import { type Event, plugin, define } from '../../../import.js'
import { getUserMessageByUid } from '../../model/message.js'
import component from '../../image/index.js'
export class user extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)(个人信息|踏入仙途)/,
          fnc: 'createData'
        },
        {
          reg: /^(#|\/)更改道号/,
          fnc: 'updateUserName'
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
    if (data.name === '柠檬冲水') {
      data.name = e.sender.nickname
    }
    // 数据植入组件
    component.message(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }

  /**
   *
   * @param e
   * @returns
   */
  async updateUserName(e: Event) {
    // 获取账号
    const uid = e.user_id
    e.reply('待更新')
    return false
  }
}
