import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
export class boxlevel extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#突破$',
                fnc: 'Level_up'
            },
            {
                reg: '^#破体$',
                fnc: 'LevelMax_up'
            }
        ]))
    }
    LevelMax_up = async (e) => {
        const { UserLevelUpMSG } = await gameApi.userLevelUp({
            UID: e.user_id,
            choise: 'max'
        })
        if (UserLevelUpMSG) {
            e.reply(UserLevelUpMSG)
        }
        return
    }
    Level_up = async (e) => {
        const { UserLevelUpMSG } = await gameApi.userLevelUp({ UID: e.user_id })
        if (UserLevelUpMSG) {
            e.reply(UserLevelUpMSG)
        }
        return
    }
}