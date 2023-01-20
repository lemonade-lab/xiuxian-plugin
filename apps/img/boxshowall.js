import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import botApi from '../../model/robot/api/botapi.js'
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
        const exist = await gameApi.existUserSatus({ UID:e.user_id })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const img = await botApi.showPuppeteer({ path: 'map', name: 'map' })
        e.reply(img)
        return
    }
    showEdition = async (e) => {
        const exist = await gameApi.existUserSatus({ UID:e.user_id })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const data = {
            version: await gameApi.getConfig({
                app: 'version',
                name: 'version'
            })
        }
        const img = await botApi.showPuppeteer({ path: 'updata', name: 'updata', data })
        e.reply(img)
        return
    }
    showConfig = async (e) => {
        const exist = await gameApi.existUserSatus({ UID:e.user_id })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const data = {
            xiuxain: await gameApi.getConfig({
                app: 'parameter',
                name: 'cooling'
            })
        }
        const img = await botApi.showPuppeteer({ path: 'config', name: 'config', data })
        e.reply(img)
        return
    }
}