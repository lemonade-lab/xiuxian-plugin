import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { BotApi } from '../../model/robot/api/botapi.js'
import gameApi from '../../model/api/api.js'
export class boxshowall extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙地图$',
                fnc: 'showMap',
            },
            {
                reg: '^#修仙配置$',
                fnc: 'showConfig',
            }
        ]))
    }
    showMap = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await gameApi.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const isreply = await e.reply(await BotApi.Imgindex.showPuppeteer({ path: 'map', name: 'map' }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
    showConfig = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await gameApi.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const isreply = await e.reply(await BotApi.Imgindex.showPuppeteer({
            path: 'config', name: 'config', data: {
                xiuxain: await gameApi.getConfig({
                    app: 'parameter',
                    name: 'cooling'
                })
            }
        }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
}