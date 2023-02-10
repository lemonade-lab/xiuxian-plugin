import { BotApi, GameApi, plugin } from '../../../model/api/api.js'
export class boxuserinformation extends plugin {
    constructor() {
        super(BotApi.SuperIndex.getUser({
            rule: [
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
            ]
        }))
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