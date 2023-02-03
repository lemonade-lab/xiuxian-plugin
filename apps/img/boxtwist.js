import robotapi from "../../model/robot/api/api.js"
import { BotApi } from '../../model/robot/api/botapi.js'
export class BoxtWist extends robotapi {
    constructor() {
        super({
            name: 'xiuxian',
            dsc: 'BoxtWist',
            event: 'notice.group.poke',
            priority: 3000,
            rule: [
                {
                    fnc: 'helpWist'
                }
            ]
        })
    }
    helpWist = async (e) => {
        logger.info('[戳一戳生效]')
        if (!e.isGroup) {
            return
        }
        const data = await BotApi.ImgHelp.getboxhelp({ name: 'help' })
        if (!data) {
            return
        }
        const isreply = await e.reply(await BotApi.ImgCache.helpcache({ i: 1, data }))
        await BotApi.User.surveySet({ e, isreply })
    }
}