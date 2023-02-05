import robotapi from "../../model/robot/api/api.js"
import { BotApi } from '../../model/api/botapi.js'
import { GameApi } from '../../model/api/gameapi.js'
export class BoxtWist extends robotapi {
    constructor() {
        super({
            name: 'xiuxian',
            dsc: 'BoxtWist',
            event: 'notice.group.poke',
            priority: 99999,
            rule: [
                {
                    fnc: 'helpWist'
                }
            ]
        })
    }
    helpWist = async (e) => {
        if (!e.isGroup) {
            return
        }
        const cf = await GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' })
        const T = cf['switch'] ? cf['switch']['twist'] : true
        if (!T) {
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