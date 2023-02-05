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
        const cf = await GameApi.DefsetUpdata.getConfig({
            app: 'parameter',
            name: 'cooling'
        })
        const Ttwist = cf['switch'] ? cf['switch']['twist'] : true
        const Tcome = cf['switch'] ? cf['switch']['come'] : true
        const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({
            path: 'config', name: 'config', data: {
                ...cf,
                Ttwist: Ttwist ? '开启' : '关闭',
                Tcome: Tcome ? '开启' : '关闭'
            }
        }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
}