import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gamepublic from '../../model/game/public/public.js'
import useraction from '../../model/game/user/user.js'
export class boxadmindelete extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙删除数据$',
                fnc: 'deleteredis'
            },
            {
                reg: '^#修仙删除世界$',
                fnc: 'deleteallusers'
            }
        ]))
    }
    deleteredis = async (e) => {
        if (!e.isMaster) {
            return
        }
        await gamepublic.deleteReids()
        e.reply('删除完成')
        return
    }
    deleteallusers = async (e) => {
        if (!e.isMaster) {
            return
        }
        await useraction.userMsgAction({ NAME: 'life', CHOICE: 'user_life', DATA: [] })
        await gamepublic.deleteReids()
        e.reply('删除完成')
        return
    }
}