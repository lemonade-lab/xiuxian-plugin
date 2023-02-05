import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { BotApi } from '../../model/robot/api/botapi.js'
import { GameApi } from '../../model/api/gameapi.js'
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
        const data = await BotApi.ImgHelp.getboxhelp({ name: 'help' })
        if (!data) {
            return
        }
        const isreply = await e.reply(await BotApi.ImgCache.helpcache({ i: 1, data }))
        await BotApi.User.surveySet({ e, isreply })
    }
    adminSuper = async (e) => {
        if (!e.isMaster) {
            return
        }
        const data = await BotApi.ImgHelp.getboxhelp({ name: 'admin' })
        if (!data) {
            return
        }
        const isreply = await e.reply(await BotApi.ImgCache.helpcache({ i: 0, data }))
        await BotApi.User.surveySet({ e, isreply })
    }
}