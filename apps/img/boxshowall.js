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
                reg: '^#修仙版本$',
                fnc: 'showEdition',
            },
            {
                reg: '^#修仙配置$',
                fnc: 'showConfig',
            }
        ]))
    }
    showMap = async (e) => {
        if (!await gameApi.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        e.reply(await BotApi.Imgindex.showPuppeteer({ path: 'map', name: 'map' }))
        return
    }
    showEdition = async (e) => {
        if (!await gameApi.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        e.reply(await BotApi.Imgindex.showPuppeteer({
            path: 'updata', name: 'updata', data: {
                version: await gameApi.getConfig({
                    app: 'version',
                    name: 'version'
                })
            }
        }))
        return
    }
    showConfig = async (e) => {
        if (!await gameApi.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        e.reply(await BotApi.Imgindex.showPuppeteer({
            path: 'config', name: 'config', data: {
                xiuxain: await gameApi.getConfig({
                    app: 'parameter',
                    name: 'cooling'
                })
            }
        }))
        return
    }
}