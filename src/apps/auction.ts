import { type Event, plugin, define } from '../import'
import component from '../image/index'
import { getUserMessageByUid } from '../model/message'
import { getUserName } from '../model/utils'

export class auction extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?拍卖行/,
          fnc: 'auction_house'
        },
        {
          reg: /^(#|\/)?购买/,
          fnc: 'buy'
        },
        {
          reg: /^(#|\/)?下架/,
          fnc: 'sold_out'
        },
        {
          reg: /^(#|\/)?上架/,
          fnc: 'grounding'
        },
        {
          reg: /^(#|\/)?赠送/,
          fnc: 'giving'
        },
        {
          reg: /^(#|\/)?直售/,
          fnc: 'Direct_sale'
        }
      ]
    })
  }

  /**
   * 拍卖行
   * @param e
   * @returns
   */
  async auction_house(e: Event) {
    // 获取账号
    const uid = e.user_id
    // 尝试读取数据，如果没有数据将自动创建
    const data = getUserMessageByUid(uid)
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.bag(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }
}
