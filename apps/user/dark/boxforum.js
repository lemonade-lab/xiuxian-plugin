import { BotApi, GameApi, plugin } from '../../../model/api/api.js'
export class BoxForum extends plugin {
    constructor() {
        super(BotApi.SuperIndex.getUser({
            rule: [
                {
                    reg: '^#虚空栈$',
                    fnc: 'searchForum'
                },
                {
                    reg: '^#喇叭.*$',
                    fnc: 'pushForum'
                }
            ]
        }))
    }
    searchForum = async (e) => {
        if (!e.isGroup) {
            return
        }
        const msg = []
        const Forum = await GameApi.UserData.listActionInitial({ NAME: 'forum', CHOICE: 'generate_forum', INITIAL: [] })
        Forum.forEach((item) => {
            msg.push(`[${item.UID}]\n${item.content}`)
        })
        await BotApi.User.forwardMsgSurveySet({ e, data: msg })
        return
    }
    pushForum = async (e) => {
        const UID = e.user_id
        if (!await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }   
        const content = e.msg.replace('#喇叭', '')
        if (content == undefined || content == '' || content.length > 50) {
            e.reply('内容最多50个字!')
            return
        }
        const TheDate = new Date()
        const Forum = await GameApi.UserData.listActionInitial({ NAME: 'forum', CHOICE: 'generate_forum', INITIAL: [] })
        Forum.unshift({
            UID,
            content,
            number: TheDate.getTime()
        })
        if (Forum.length >= 5) {
            Forum.pop()
        }
        await GameApi.UserData.listActionInitial({ NAME: 'forum', CHOICE: 'generate_forum', DATA: Forum, INITIAL: [] })
        this.searchForum(e)
        return
    }
}