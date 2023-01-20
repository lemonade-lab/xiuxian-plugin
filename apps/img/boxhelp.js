import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import botApi from '../../model/robot/api/botapi.js'
import gameApi from '../../model/api/api.js'
export class boxhelp extends robotapi {
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
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const data = await botApi.getHelp({ name: 'help' })
        if (!data) {
            return
        }
        const img = await botApi.cacheHelp({ i: 1, data })
        await e.reply(img)
    }
    adminsuper = async (e) => {
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const data = await botApi.getHelp({ name: 'admin' })
        if (!data) {
            return
        }
        const img = await botApi.cacheHelp({ i: 0, data })
        await e.reply(img)
    }
}