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
    Level_up = async (e) => {
        const exist = await gameApi.existUserSatus({ UID:e.user_id })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const { UserLevelUpMSG } = await gameApi.userLevelUp({ UID: e.user_id })
        if (UserLevelUpMSG) {
            e.reply(UserLevelUpMSG)
        }
        return
    }
    LevelMax_up = async (e) => {
        const exist = await gameApi.existUserSatus({ UID:e.user_id })
        if (!exist) {
            //如果死了，就直接返回
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