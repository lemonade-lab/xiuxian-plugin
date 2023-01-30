import config from '../data/defset/updata.js'
class UserAction {
    /**
     * @param { e, data } param0 
     * @returns 
     */
    forwardMsg = async ({ e, data }) => {
        if (data.length == 1) {
            await e.reply(data[0])
            return
        }
        const msgList = []
        for (let item of data) {
            msgList.push({
                message: item,
                nickname: Bot.nickname,
                user_id: Bot.uin,
            })
        }
        await e.reply(await Bot.makeForwardMsg(msgList))
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
        const msgList = []
        for (let item of data) {
            msgList.push({
                message: item,
                nickname: Bot.nickname,
                user_id: Bot.uin,
            })
        }
        const isreply = await e.reply(await Bot.makeForwardMsg(msgList))
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
}
export default new UserAction()