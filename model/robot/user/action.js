class UserAction {
    forwardMsg = async (e, data) => {
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
    userAt = async (e) => {
        const isat = e.message.some((item) => item.type === 'at')
        if (!isat) {
            return false
        }
        const atItem = e.message.filter((item) => item.type === 'at')
        //艾特对方会为对方创建游戏信息
        const exist = await existUserSatus(atItem[0]['qq'])
        if (exist) {
            return atItem[0].qq
        }
        //如果对方死了,艾特失效
        return false
    }
}
export default   new UserAction()