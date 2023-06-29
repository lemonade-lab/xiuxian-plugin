import { getConfig } from './defset.js'
class Robot {
  /**
   * 消息撤回
   * @param {*} e
   * @param {*} isreply
   * @returns
   */
  surveySet = (e, isreply) => {
    if (!e.group) return
    const cf = getConfig('cooling')
    let timeout = cf.timeout ? cf.timeout.size : 60
    if (timeout > 15 && isreply && isreply.message_id) {
      setTimeout(() => {
        e.group.recallMsg(isreply.message_id)
      }, timeout * 1000)
    }
  }

  /**
   * 艾特得到qq
   * @param {*} e
   * @returns
   */
  at = (e) => {
    /** 检查到字段:alemon */
    if (typeof e.at === 'boolean') {
      if (e.at) return e.atuid[0].id
      return false
    }
    /* 检查字段:yunzai */
    if (!e.message) return false
    if (!e.message.some((item) => item.type === 'at')) return false
    const atItem = e.message.filter((item) => item.type === 'at')
    if (atItem[0].qq) return atItem[0].qq
    return false
  }
}
export default new Robot()
