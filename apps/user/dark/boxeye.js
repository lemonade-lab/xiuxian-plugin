import { BotApi, GameApi, plugin } from '../../../model/api/api.js'
export class BoxEye extends plugin {
    constructor() {
        super(BotApi.SuperIndex.getUser({
            rule: [
                {
                    reg: '^#虚空眼.*$',
                    fnc: 'darkEye'
                }
            ]
        }))
    }
    darkEye = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (!await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const name = e.msg.replace('#虚空眼', '')
        const HistoryList = await GameApi.UserData.listActionInitial({ NAME: 'history', CHOICE: 'fixed_history', INITIAL: {} })
        if (HistoryList.hasOwnProperty(name)) {
            e.reply(HistoryList[name])
            return
        }
        e.reply('查无此项')
        return
    }
}