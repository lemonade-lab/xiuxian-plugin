import { BotApi, GameApi, plugin } from '../../../model/api/api.js'
export class boxuserstart extends plugin {
    constructor() {
        super(BotApi.SuperIndex.getUser({
            rule: [
                {
                    reg: '^#降临世界$',
                    fnc: 'createMsg'
                },
                {
                    reg: '^#再入仙途$',
                    fnc: 'reCreateMsg'
                }
            ]
        }))
        this.task = {
            cron: GameApi.DefsetUpdata.getConfig({ app: 'task', name: 'task' }).LifeTask,
            name: 'LifeTask',
            fnc: () => { GameApi.GameUser.startLife() }
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
        const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
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
        const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
}