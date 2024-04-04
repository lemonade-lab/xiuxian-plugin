import { type Event, plugin, define } from '../../../import'
import { ReverseKillNameMap } from '../../model/base'
import { writeArchiveData } from '../../model/data'
import { getUserMessageByUid } from '../../model/message'
export class bag extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?学习/,
          fnc: 'study'
        }
      ]
    })
  }

  /**
   * 学习
   * @param e
   * @returns
   */
  async study(e: Event) {
    const uid = e.user_id
    const name = e.msg
      .replace(/^(#|\/)?学习/, '')
      .replace(/[^\u4e00-\u9fa5]/g, '')
    const ID = ReverseKillNameMap[name]
    if (!ID) {
      e.reply(`此方世界没有功法《${name}》`)
      return
    }
    const data = getUserMessageByUid(uid)
    const T = data.kills[ID]
    if (T) {
      e.reply(`已学习`)
      return
    }
    const count = data.bags.kills[ID]
    if (!count || count <= 0) {
      e.reply(`没有功法《${name}》`)
      return
    }
    data.bags.kills[ID] -= 1
    if (data.bags.kills[ID] <= 0) {
      delete data.bags.kills[ID]
    }
    data.kills[ID] = true
    // 保存
    writeArchiveData('player', uid, data)
    e.reply(`学得${name}`)
    return false
  }
}
