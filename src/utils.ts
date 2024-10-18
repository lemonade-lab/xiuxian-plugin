import { MessageElem } from 'icqq'
import { EventType, Bot } from 'yunzaijs'
class Utils {
  /**
   *
   * @param data
   * @returns
   */
  makeMsg = (data: string[]) => {
    const msgList: {
      message: string
      /*我的昵称*/
      nickname: string
      /*我的账号*/
      user_id: number
    }[] = []
    for (const item of data) {
      msgList.push({
        message: item,
        /*我的昵称*/
        nickname: Bot.nickname,
        /*我的账号*/
        user_id: Bot.uin
      })
    }
    return msgList
  }

  /**
   *
   * @param e
   * @param data
   * @returns
   */
  forwardMsg = async (e: EventType, data: string[]) => {
    if (data.length == 1) {
      await e.reply(data[0])
      return
    }
    /*制作合并转发消息以备发送*/
    try {
      await e.reply(await Bot.makeForwardMsg(this.makeMsg(data)))
    } catch {
      console.log('出错', data)
    }
    return
  }

  /**
   *
   * @param e
   * @param data
   * @returns
   */
  forwardMsgSurveySet = async (e: EventType, data: string[]) => {
    if (data.length == 1) {
      const isreply = await e.reply(data[0])
      this.surveySet(e, isreply)
      return
    }
    const isreply = await e.reply(await Bot.makeForwardMsg(this.makeMsg(data)))
    this.surveySet(e, isreply)
    return
  }

  /**
   *
   * @param e
   * @param isreply
   * @returns
   */
  surveySet = async (e: EventType, isreply) => {
    if (!e.group) return
    // ?
    const timeout = 60
    if (timeout > 15 && isreply && isreply.message_id) {
      setTimeout(async () => {
        await e.group.recallMsg(isreply.message_id)
      }, timeout * 1000)
    }
  }

  /**
   * 得到at的qq
   * @param e
   * @returns
   */
  at = (e: EventType) => {
    const val = e.message.find((value: MessageElem) => value.type === 'at')
    if (val && val.type == 'at' && val.qq !== 'all') return val.qq
    return false
  }

  /**
   * 私聊发送消息
   * @param UID
   * @param msg
   * @returns
   */
  privateChat = (UID: number, msg) => {
    Bot.pickUser(UID).sendMsg(msg)
    return
  }
}
export default new Utils()
/**
 * pickGroup()	得到一个群对象
 * pickFriend()	得到一个好友对象
 * pickMember()	得到一个群员对象
 * pickUser() 得到一个用户对象
 */
