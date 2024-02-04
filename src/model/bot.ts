import { Message, common } from '../../import'

/**
 * 推送消息，群消息推送群，或者推送私人
 * @param id
 * @param is_group
 * @return  falses {Promise<void>}
 */
export async function pushInfo(id: number, is_group: boolean, msg: any) {
  if (is_group) {
    return Bot.pickGroup(id)
      .sendMsg(msg)
      .catch((err) => {
        console.error(err)
      })
  } else {
    return common.relpyPrivate(id, msg)
  }
}

/**
 * 转发消息伪造
 * 输入data一个数组,元素是字符串,每一个元素都是一条消息
 * @param e
 * @param data
 * @returns
 */
export async function ForwardMsg(e: Message, data: any[]) {
  const msgList = data.map((item) => ({
    message: item,
    nickname: Bot.nickname,
    user_id: Bot.uin
  }))
  if (msgList.length == 1) {
    return e.reply(msgList[0].message)
  }
  return Bot.makeForwardMsg(msgList).then((res) => {
    e.reply(res)
  })
}
