import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
export class boxadmindelete extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙删除数据$',
                fnc: 'deleteRedis'
            },
            {
                reg: '^#修仙删除世界$',
                fnc: 'deleteAllusers'
            }
        ]))
    }
    deleteRedis = async (e) => {
        if (!e.isMaster) {
            return
        }
        await gameApi.deleteReids()
        e.reply('删除完成')
        return
    }
    deleteAllusers = async (e) => {
        if (!e.isMaster) {
            return
        }
        await gameApi.userMsgAction({ NAME: 'life', CHOICE: 'user_life', DATA: [] })
        await gameApi.deleteReids()
        e.reply('删除完成')
        return
    }
}