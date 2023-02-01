import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { GameApi } from '../../model/api/gameapi.js'
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
            cron: GameApi.DefsetUpdata.getConfig({ app: 'task', name: 'task' }).LifeTask,
            name: 'LifeTask',
            fnc: () => {  GameApi.GameUser.startLife() }
        }
    }
    createMsg = async (e) => {
        if (!e.isGroup || e.user_id == 80000000) {
            return
        }
        if (! await GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { path, name, data } = await GameApi.Information.userDataShow({ UID: e.user_id })
        const isreply = await e.reply(await BotApi.Imgindex.showPuppeteer({ path, name, data }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
    reCreateMsg = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        const cf = GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' })
        const CDTime = cf['CD']['Reborn'] ? cf['CD']['Reborn'] : 850
        const CDID = '8'
        const now_time = new Date().getTime()
        const { CDMSG } = await GameApi.GamePublic.cooling({ UID, CDID })
        if (CDMSG) {
            e.reply(CDMSG)
            return
        }
        await redis.set(`xiuxian:player:${UID}:${CDID}`, now_time)
        await redis.expire(`xiuxian:player:${UID}:${CDID}`, CDTime * 60)
        await GameApi.GamePublic.offAction(UID)
        let life = await GameApi.UserData.listActionArr({ NAME: 'life', CHOICE: 'user_life' })
        life = await life.filter(item => item.qq != UID)
        await GameApi.GameUser.userMsgAction({ NAME: 'life', CHOICE: 'user_life', DATA: life })
        await GameApi.GameUser.createBoxPlayer({ UID: e.user_id })
        const { path, name, data } = await GameApi.Information.userDataShow({ UID: e.user_id })
        const isreply = await e.reply(await BotApi.Imgindex.showPuppeteer({ path, name, data }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
}
// Bot.on("notice.group.increase", async (e) => {
//     const UID = e.user_id
//     Bot.on("message", async (e) => {
//         if (!await GameApi.GameUser.existUserSatus({ UID })) {
//             e.reply([BotApi.segment.at(UID), '降临失败...\n天道:请降临者[#再入仙途]后步入轮回!'])
//             return
//         }
//         e.reply([BotApi.segment.at(UID), '降临成功...\n天道:欢迎降临修仙世界\n请降临者[#寻找NPC]以获得\n仙缘与《凡人是如何修仙成功的之修仙生存手册之先抱大腿》'])
//     })
// })