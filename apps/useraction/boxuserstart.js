import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { get_player_img } from '../../model/showdata.js'
import gameApi from '../../model/api/api.js'
export class boxuserstart extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#降临世界$',
                fnc: 'Create_player'
            },
            {
                reg: '^#再入仙途$',
                fnc: 'reCreate_player'
            }
        ]))
    }
    Create_player = async (e) => {
        if (!e.isGroup || e.user_id == 80000000) {
            return
        }
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const img = await get_player_img(e.user_id)
        e.reply(img)
        return
    }
    reCreate_player = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        const CDTime = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.Reborn
        const CDID = '8'
        const now_time = new Date().getTime()
        const { CDMSG } = await gameApi.cooling({ UID, CDID })
        if (CDMSG) {
            e.reply(CDMSG)
            return
        }
        await redis.set(`xiuxian:player:${UID}:${CDID}`, now_time)
        await redis.expire(`xiuxian:player:${UID}:${CDID}`, CDTime * 60)
        await gameApi.offAction(UID)
        let life = await gameApi.userMsgAction({ NAME: 'life', CHOICE: 'user_lige' })
        life = await life.filter(item => item.qq != UID)
        await gameApi.userMsgAction({ NAME: 'life', CHOICE: 'user_lige', DATA: life })
        await gameApi.createBoxPlayer({ UID: e.user_id })
        const img = await get_player_img(e.user_id)
        e.reply(img)
        return
    }
}