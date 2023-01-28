import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
import { BotApi } from '../../model/robot/api/botapi.js'
export class boxuserstart extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#降临世界$',
                fnc: 'createMsg'
            },
            {
                reg: '^#再入仙途$',
                fnc: 'reCreateMsg'
            }
        ]))
        this.task = {
            cron: gameApi.getConfig({ app: 'task', name: 'task' }).LifeTask,
            name: 'LifeTask',
            fnc: () => { gameApi.startLife() }
        }
    }
    createMsg = async (e) => {
        if (!e.isGroup || e.user_id == 80000000) {
            return
        }
        if (! await gameApi.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { path, name, data } = await gameApi.userDataShow({ UID: e.user_id })
        const isreply = await e.reply(await BotApi.Imgindex.showPuppeteer({ path, name, data }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
    reCreateMsg = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        const CDTime = gameApi.getConfig({ app: 'parameter', name: 'cooling' }).CD.Reborn
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
        let life = await gameApi.listActionArr({ NAME: 'life', CHOICE: 'user_life' })
        life = await life.filter(item => item.qq != UID)
        await gameApi.userMsgAction({ NAME: 'life', CHOICE: 'user_life', DATA: life })
        await gameApi.createBoxPlayer({ UID: e.user_id })
        const { path, name, data } = await gameApi.userDataShow({ UID: e.user_id })
        const isreply = await e.reply(await BotApi.Imgindex.showPuppeteer({ path, name, data }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
}
// Bot.on("notice.group.increase", async (e) => {
//     const UID = e.user_id
//     Bot.on("message", async (e) => {
//         if (!await gameApi.existUserSatus({ UID })) {
//             e.reply([BotApi.segment.at(UID), '降临失败...\n天道:请降临者[#再入仙途]后步入轮回!'])
//             return
//         }
//         e.reply([BotApi.segment.at(UID), '降临成功...\n天道:欢迎降临修仙世界\n请降临者[#寻找NPC]以获得\n仙缘与《凡人是如何修仙成功的之修仙生存手册之先抱大腿》'])
//     })
// })