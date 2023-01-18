class UserAction {
    forwardMsg = async (parameter) => {
        const { e, data } = parameter
        const msgList = []
        for (let i of data) {
            msgList.push({
                message: i,
                nickname: Bot.nickname,
                user_id: Bot.uin,
            })
        }
        if (msgList.length == 1) {
            await e.reply(msgList[0].message)
        } else {
            await e.reply(await Bot.makeForwardMsg(msgList))
        }
        return
    }
    /**
    * 艾特并返回QQ
    */
    at = async (parameter) => {
        const { e } = parameter
        const isat = e.message.some((item) => item.type === 'at')
        if (!isat) {
            return false
        }
        const atItem = e.message.filter((item) => item.type === 'at')
        if (atItem[0]['qq']) {
            return atItem[0]['qq']
        }
        return false
    }
}
export default new UserAction()