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
        const img = await botApi.showPuppeteer({ path: 'map', name: 'map' })
        e.reply(img)
        return
    }
    show_updata = async (e) => {
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