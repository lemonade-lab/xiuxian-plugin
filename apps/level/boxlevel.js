import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
export class boxlevel extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#突破$',
                fnc: 'levelUp'
            },
            {
                reg: '^#破体$',
                fnc: 'levelMaxUp'
            }
        ]))
    }
    levelUp = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await gameApi.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { UserLevelUpMSG } = await gameApi.userLevelUp({ UID: e.user_id })
        if (UserLevelUpMSG) {
            e.reply(UserLevelUpMSG)
        }
        return
    }
    levelMaxUp = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await gameApi.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { UserLevelUpMSG } = await gameApi.userLevelUp({
            UID: e.user_id,
            choise: 'max'
        })
        if (UserLevelUpMSG) {
            e.reply(UserLevelUpMSG)
        }
        return
    }
}