import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { BotApi } from '../../model/robot/api/botapi.js'
import { GameApi } from '../../model/api/gameapi.js'
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
        const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path: 'map', name: 'map' }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
    showConfig = async (e) => {
        const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({
            path: 'config', name: 'config', data:
                await GameApi.DefsetUpdata.getConfig({
                    app: 'parameter',
                    name: 'cooling'
                })
        }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
}