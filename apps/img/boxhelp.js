import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import botapi from '../../model/robot/api/botapi.js'
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
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const data = await botapi.getHelp({ name: 'Help' })
        if (!data) {
            return
        }
        const img = await botapi.cacheHelp({ i: 1, data })
        await e.reply(img)
    }
    adminsuper = async (e) => {
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const data = await botapi.getHelp({ name: 'Admin' })
        if (!data) {
            return
        }
        const img = await botapi.cacheHelp({ i: 0, data })
        await e.reply(img)
    }
}