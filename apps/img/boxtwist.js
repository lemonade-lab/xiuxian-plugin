import { BotApi, GameApi, plugin } from '../../model/api/api.js'
export class BoxtWist extends plugin {
    constructor() {
        super(BotApi.SuperIndex.getUser({
            event: 'notice.group.poke',
            priority: 99999,
            rule: [
                {
                    fnc: 'helpWist'
                }
            ]
        }))
    }
    helpWist = async (e) => {
        console.log(e)
        if (!e.isGroup || e.self_id != e.target_id) {
            return false
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
        return false
    }
}