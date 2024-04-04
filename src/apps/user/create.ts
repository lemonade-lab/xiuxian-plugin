import { type Event, plugin, define } from '../../../import.js'
import {
  getReStartUserMessageByUid,
  getUserMessageByUid
} from '../../model/message.js'
import component from '../../image/index.js'
import { Themes } from '../../model/base.js'
import { writeArchiveData } from '../../model/data.js'
import { getUserName } from '../../model/utils.js'
export class user extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?(个人信息|踏入仙途)$/,
          fnc: 'createData'
        },
        {
          reg: /^(#|\/)?再入仙途$/,
          fnc: 'reCreate'
        },
        {
          reg: /^(#|\/)?改名/,
          fnc: 'updateUserName'
        },
        {
          reg: /^(#|\/)?签名/,
          fnc: 'updateUserAutograph'
        },
        {
          reg: /^(#|\/)?更换主题$/,
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
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.message(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }

  /**
   * 载入仙途
   * @param e
   * @returns
   */
  async reCreate(e: Event) {
    // 获取账号
    const uid = e.user_id
    // 尝试读取数据，如果没有数据将自动创建
    const data = getReStartUserMessageByUid(uid)
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.message(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }

  /**
   * 更换主题
   * @param e
   */
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
    }
    writeArchiveData('player', uid, data)
    data.name = getUserName(data.name, e.sender.nickname)
    // 数据植入组件
    component.message(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
  }

  /**
   * 改名
   * @param e
   * @returns
   */
  async updateUserName(e: Event) {
    const uid = e.user_id
    const nickname = e.msg
      .replace(/^(#|\/)?改名/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    if (nickname.length < 1) {
      e.reply('名字不符合要求哦')
      return
    }
    // 尝试读取数据，如果没有数据将自动创建
    const data = getUserMessageByUid(uid)
    if (data.name !== nickname) {
      data.name = nickname
      // 写入
      writeArchiveData('player', uid, data)
    }
    // 数据植入组件
    component.message(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }

  /**
   * 签名
   * @param e
   * @returns
   */
  async updateUserAutograph(e: Event) {
    const uid = e.user_id
    const autograph = e.msg
      .replace(/^(#|\/)?签名/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    if (autograph.length < 1) {
      e.reply('名字不符合要求哦')
      return
    }
    // 尝试读取数据，如果没有数据将自动创建
    const data = getUserMessageByUid(uid)
    data.autograph = autograph
    // 写入
    writeArchiveData('player', uid, data)
    // 数据植入组件
    component.message(data, uid).then((img) => {
      // 获取到图片后发送
      if (typeof img !== 'boolean') e.reply(segment.image(img))
    })
    return false
  }
}
