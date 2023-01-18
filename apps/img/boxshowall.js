import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import botApi from '../../model/robot/api/botapi.js'
import gameApi from '../../model/api/api.js'
export class boxshowall extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙地图$',
                fnc: 'show_map',
            },
            {
                reg: '^#修仙版本$',
                fnc: 'show_updata',
            },
            {
                reg: '^#修仙配置$',
                fnc: 'show_config',
            }
        ]))
    }
    show_map = async (e) => {
        const exist = await gameApi.existUserSatus({ UID:e.user_id })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const img = await botApi.showPuppeteer({ path: 'map', name: 'map' })
        e.reply(img)
        return
    }
    show_updata = async (e) => {
        const exist = await gameApi.existUserSatus({ UID:e.user_id })
        if (!exist) {
            //如果死了，就直接返回
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
    show_config = async (e) => {
        const exist = await gameApi.existUserSatus({ UID:e.user_id })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const data = {
            xiuxain: await gameApi.getConfig({
                app: 'xiuxian',
                name: 'xiuxian'
            })
        }
        const img = await botApi.showPuppeteer({ path: 'config', name: 'config', data })
        e.reply(img)
        return
    }
}