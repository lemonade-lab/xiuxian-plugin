import robotapi from "../../model/robotapi.js"
import { deleteReids, userMsgAction } from "../../model/boxpublic.js"
import { superIndex } from "../../model/robotapi.js"
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
        await deleteReids()
        e.reply('删除完成')
        return
    }
    deleteallusers = async (e) => {
        if (!e.isMaster) {
            return
        }
        await userMsgAction({ NAME: 'life', CHOICE: 'user_life', DATA: [] })
        await deleteReids()
        e.reply('删除完成')
        return
    }
}