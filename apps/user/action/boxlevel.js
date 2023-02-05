import { plugin } from "../../../model/robot/api/api.js"
import { GameApi } from '../../../model/api/gameapi.js'
import { BotApi } from "../../../model/api/botapi.js"
export class boxlevel extends plugin {
    constructor() {
        super(BotApi.SuperIndex.getUser({
            rule: [
                {
                    reg: '^#突破$',
                    fnc: 'levelUp'
                },
                {
                    reg: '^#破体$',
                    fnc: 'levelMaxUp'
                }
            ]
        }))
    }
    levelUp = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { UserLevelUpMSG } = await GameApi.UserAction.userLevelUp({ UID: e.user_id })
        if (UserLevelUpMSG) {
            e.reply(UserLevelUpMSG)
        }
        return
    }
    levelMaxUp = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { UserLevelUpMSG } = await GameApi.UserAction.userLevelUp({
            UID: e.user_id,
            choise: 'max'
        })
        if (UserLevelUpMSG) {
            e.reply(UserLevelUpMSG)
        }
        return
    }
}