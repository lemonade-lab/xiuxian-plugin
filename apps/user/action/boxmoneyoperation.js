import { plugin } from "../../../model/robot/api/api.js"
import { GameApi } from '../../../model/api/gameapi.js'
import { BotApi } from '../../../model/api/botapi.js'
export class boxmoneyoperation extends plugin {
    constructor() {
        super(BotApi.SuperIndex.getUser({
            rule: [
                {
                    reg: '^#赠送灵石.*$',
                    fnc: 'giveMoney'
                },
                {
                    reg: '^#联盟报到$',
                    fnc: 'userCheckin'
                }
            ]
        }))
    }
    userCheckin = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const UID = e.user_id
        const action = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '联盟'
        const map = await GameApi.GameMap.mapExistence({ action, addressName: address_name })
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        const level = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: "user_level" })
        if (level.level_id != 1) {
            e.reply('[修仙联盟]方正\n前辈莫要开玩笑')
            return
        }
        if (action.newnoe != 1) {
            e.reply('[修仙联盟]方正\n道友要不仔细看看自己的储物袋')
            return
        }
        action.newnoe = 0
        await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: "user_action", DATA: action })
        const randomthing = await GameApi.GameUser.randomThing()
        await GameApi.GameUser.userBag({ UID, name: randomthing.name, ACCOUNT: randomthing.acount })
        await GameApi.GameUser.userBag({ UID, name: '下品灵石', ACCOUNT: Number(10) })
        e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧\n还有${Number(10)}颗下品灵石\n可在必要的时候用到`)
        e.reply(`你对此高兴万分\n并放进了#储物袋`)
        return
    }
    giveMoney = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const A = e.user_id
        const B = await BotApi.User.at({ e })
        if (!B || B == A) {
            return
        }
        const existB = await GameApi.GameUser.existUserSatus({ UID: B })
        if (!existB) {
            e.reply('已死亡')
            return
        }
        let islingshi = e.msg.replace('#赠送灵石', '')
        islingshi = await GameApi.GamePublic.leastOne({ value: islingshi })
        const money = await GameApi.GameUser.userBagSearch({ UID: A, name: '下品灵石' })
        if (!money || money.acount < islingshi) {
            e.reply(`似乎没有${islingshi}下品灵石`)
            return
        }
        const cf = GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' })
        const CDTime = cf['CD']['Transfer'] ? cf['CD']['Transfer'] : 5
        const CDID = '5'
        const now_time = new Date().getTime()
        const { CDMSG } = await GameApi.GamePublic.cooling({ UID: A, CDID })
        if (CDMSG) {
            e.reply(CDMSG)
            return
        }
        await redis.set(`xiuxian:player:${A}:${CDID}`, now_time)
        await redis.expire(`xiuxian:player:${A}:${CDID}`, CDTime * 60)
        await GameApi.GameUser.userBag({ UID: A, name: '下品灵石', ACCOUNT: -islingshi })
        await GameApi.GameUser.userBag({ UID: B, name: '下品灵石', ACCOUNT: islingshi })
        e.reply([BotApi.segment.at(B), `你获得了由 ${A}赠送的${islingshi}下品灵石`])
        return
    }
}
