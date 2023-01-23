import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
import { BotApi } from '../../model/robot/api/botapi.js'
export class boxuserinformation extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#基础信息$',
                fnc: 'showUserMsg'
            },
            {
                reg: '^#面板信息$',
                fnc: 'showQquipment',
            },
            {
                reg: '^#功法信息$',
                fnc: 'showTalent',
            }
        ]))
    }
    showUserMsg = async (e) => {
        const UID = e.user_id
        if (!await gameApi.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const { path, name, data } = await gameApi.userDataShow({ UID: e.user_id })
        e.reply(await BotApi.Imgindex.showPuppeteer({ path, name, data }))
        return
    }
    showQquipment = async (e) => {
        const UID = e.user_id
        if (!await gameApi.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const { path, name, data } = await gameApi.userEquipmentShow({ UID: e.user_id })
        e.reply(await BotApi.Imgindex.showPuppeteer({ path, name, data }))
        return
    }
}