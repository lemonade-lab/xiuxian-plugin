import { type Event, plugin, define } from '../../../import'
import { getUserMessageByUid } from '../../model/message'
import { getUserName } from '../../model/utils'

import component from '../../image/index.js'
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
    // 获取账号
    const uid = e.user_id
    // 尝试读取数据，如果没有数据将自动创建
    const data = getUserMessageByUid(uid)
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.kill(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
  }

  async getEquitmentMessage(e: Event) {
    // 获取账号
    const uid = e.user_id
    // 尝试读取数据，如果没有数据将自动创建
    const data = getUserMessageByUid(uid)
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.equipment(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
  }
}
