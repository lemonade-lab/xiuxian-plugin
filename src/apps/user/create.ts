import { type Event, plugin, define } from '../../../import.js'
import { getUserMessageByUid } from '../../model/message.js'
import component from '../../image/index.js'
import { Themes } from '../../model/base.js'
import { writeArchiveData } from '../../model/data.js'
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
        },
        {
          reg: /^(#|\/)更换主题/,
          fnc: 'setTheme'
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

  async setTheme(e: Event) {
    // 获取账号
    const uid = e.user_id
    // 尝试读取数据，如果没有数据将自动创建
    const data = getUserMessageByUid(uid)

    // 得到配置
    const index = Themes.indexOf(data.theme)

    // 如果存在
    if (Themes[index + 1]) {
      // 切换
      data.theme = Themes[index + 1]
      // 保存
    } else {
      // 不存在。返回第一个
      data.theme = Themes[0]
      writeArchiveData('player', uid, data)
    }

    if (data.name === '柠檬冲水') {
      data.name = e.sender.nickname
    }
    // 数据植入组件
    component.message(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
  }
}
