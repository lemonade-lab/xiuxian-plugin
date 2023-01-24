import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { BotApi } from '../../model/robot/api/botapi.js'
import gameApi from '../../model/api/api.js'
export class boxhelp extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙(帮助|菜单|help|列表)$',
                fnc: 'boxhelp'
            },
            {
                reg: '^#修仙管理$',
                fnc: 'adminSuper',
            }
        ]))
    }
    boxhelp = async (e) => {
        if (!await gameApi.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const data = await BotApi.Help.getboxhelp({ name: 'help' })
        if (!data) {
            return
        }
        const isreply = await e.reply(await BotApi.Cache.helpcache({ i: 1, data }))
        await BotApi.User.surveySet({ e, isreply })
    }
    adminSuper = async (e) => {
        if (!await gameApi.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const data = await BotApi.Help.getboxhelp({ name: 'admin' })
        if (!data) {
            return
        }
        const isreply = await e.reply(await BotApi.Cache.helpcache({ i: 0, data }))
        await BotApi.User.surveySet({ e, isreply })
    }
}