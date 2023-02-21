import config from '../data/defset.js'
class UserAction {
    /**
     * 折合消息
     */
    makeMsg = ({ data }) => {
        const msgList = []
        for (let item of data) {
            msgList.push({
                message: item,
                /*我的昵称*/
                nickname: Bot.nickname,
                /*我的账号*/
                user_id: Bot.uin,
            })
        }
        return msgList
    }
    /**
     * @param { e, data } param0 
     * @returns 
     */
    forwardMsg = async ({ e, data }) => {
        if (data.length == 1) {
            await e.reply(data[0])
            return
        }
        /*制作合并转发消息以备发送*/
        await e.reply(await Bot.makeForwardMsg(this.makeMsg({ data })))
        return
    }
    /**
     * @param { e, data } param0 
     * @returns 
     */
    forwardMsgSurveySet = async ({ e, data }) => {
        if (data.length == 1) {
            const isreply = await e.reply(data[0])
            this.surveySet({ e, isreply })
            return
        }
        const isreply = await e.reply(await Bot.makeForwardMsg(this.makeMsg({ data })))
        this.surveySet({ e, isreply })
        return
    }
    /**
     * @param { e, isreply } param0
     * @returns 
     */
    surveySet = async ({ e, isreply }) => {
        if (!e.group) {
            return
        }
        const cf = config.getConfig({ app: 'parameter', name: 'cooling' })
        let timeout = cf['timeout'] ? cf.timeout.size : 60
        if (timeout > 15 && isreply && isreply.message_id) {
            setTimeout(async () => {
                await e.group.recallMsg(isreply.message_id)
            }, timeout * 1000)
        }
    }
    /**
     * @param { e } param0 
     * @returns 
     */
    at = async ({ e }) => {
        if (!e.message.some((item) => item.type === 'at')) {
            return false
        }
        const atItem = e.message.filter((item) => item.type === 'at')
        if (atItem[0]['qq']) {
            return atItem[0]['qq']
        }
        return false
    }
    /**
     * 私聊发送消息
     * @param { UID, msg } param0 
     */
    privateChat = ({ UID, msg }) => {
        Bot.pickUser(UID).sendMsg(msg)
        return
    }
}
export default new UserAction()
/**
 * pickGroup()	得到一个群对象
 * pickFriend()	得到一个好友对象
 * pickMember()	得到一个群员对象
 * pickUser() 得到一个用户对象
 */