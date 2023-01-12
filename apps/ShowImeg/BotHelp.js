import robotapi from "../../model/robotapi.js"
import Help from '../../model/help.js'
import Cache from '../../model/cache.js'
import { superIndex } from "../../model/robotapi.js"
export class BotHelp extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙(帮助|菜单|help|列表)$',
                fnc: 'Xiuxianhelp'
            },
            {
                reg: '^#修仙管理$',
                fnc: 'adminsuper',
            }
        ]))
    }
    Xiuxianhelp = async (e) => {
        const data = await Help.getboxhelp('Help')
        if (!data) {
            return
        }
        const img = await Cache.helpcache(data, 1)
        await e.reply(img)
    }
    adminsuper = async (e) => {
        const data = await Help.getboxhelp('Admin')
        if (!data) {
            return
        }
        const img = await Cache.helpcache(data, 0)
        await e.reply(img)
    }
}