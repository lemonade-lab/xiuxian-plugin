import robotapi from "../../../model/robot/api/api.js"
import { superIndex } from "../../../model/robot/api/api.js"
import { GameApi } from '../../../model/api/gameapi.js'
import { BotApi } from '../../../model/api/botapi.js'
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
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (!await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const { path, name, data } = await GameApi.Information.userDataShow({ UID: e.user_id })
        const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
    showQquipment = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (!await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const { path, name, data } = await GameApi.Information.userEquipmentShow({ UID: e.user_id })
        const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
}