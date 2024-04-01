import { type Event, plugin, define } from '../../../import.js'
import component from '../../image/index.js'
import Level from '../../system/level.js'
export class level extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)突破/,
          fnc: 'levelUp'
        }
      ]
    })
  }
  /**
   * 踏入仙途
   * @param e
   * @returns
   */
  async levelUp(e: Event) {
    // 获取账号
    const uid = e.user_id
    const data = Level.up(uid)
    // 数据植入组件
    component.message(data).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }
}
