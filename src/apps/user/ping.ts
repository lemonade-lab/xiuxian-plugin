import { type Event, plugin, define } from '../../../import'
import { writeArchiveData } from '../../model/data'
import { getUserMessageByUid } from '../../model/message'
import RedisClient from '../../model/redis'
import { getUserName } from '../../model/utils'
import component from '../../image/index'
export class ping extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?闭关$/,
          fnc: 'doorOpen'
        },
        {
          reg: /^(#|\/)?出关$/,
          fnc: 'doorClose'
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
  async doorOpen(e: Event) {
    const uid = e.user_id
    const message = await RedisClient.get('biguan', uid)
    if (message.type) {
      e.reply(message.msg)
      return
    }
    RedisClient.set('biguan', uid, '闭关中...', {
      time: Date.now()
    })
    e.reply('开始长期闭关')
    return false
  }

  /**
   * 出关
   * @param e
   * @returns
   */
  async doorClose(e: Event) {
    const uid = e.user_id
    const data = getUserMessageByUid(uid)
    const message = await RedisClient.get('biguan', uid)
    if (!message.type) {
      e.reply('不在闭关')
      return
    }
    const time = message.data.time
    const Now = Date.now()
    // 30 s 一次
    const size = Math.floor((Now - time) / (1000 * 30))
    RedisClient.del('biguan', uid)
    if (size >= 1) {
      const blool = size * 100
      const cur = data.blood + blool
      const max = data.base.blood + data.equipment.blood + data.level.blood
      data.blood = cur > max ? max : cur
      const baseBlood = Math.floor((Now - time) / (1000 * 60))
      data.base.blood += baseBlood
      writeArchiveData('player', uid, data)
    }
    // 修正名字
    data.name = getUserName(data.name, e.sender.nickname)
    // 闭关也能加 base血量。但是很低
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
  async shoping(e: Event) {
    e.reply('待更新')
    return false
  }
}
