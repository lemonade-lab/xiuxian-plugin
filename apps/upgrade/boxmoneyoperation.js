import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
import { BotApi } from '../../model/robot/api/botapi.js'
export class boxmoneyoperation extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#赠送灵石.*$',
                fnc: 'giveMoney'
            },
            {
                reg: '^#联盟报到$',
                fnc: 'userCheckin'
            }
        ]))
    }
    userCheckin = async (e) => {
        if (!e.isGroup) {
            return
        }
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const { MSG } = await gameApi.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const UID = e.user_id
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '联盟'
        const map = await gameApi.mapExistence({ action, addressName: address_name })
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        const level = await gameApi.userMsgAction({ NAME: UID, CHOICE: "user_level" })
        if (level.level_id != 1) {
            e.reply('[修仙联盟]方正\n前辈莫要开玩笑')
            return
        }
        if (action.newnoe != 1) {
            e.reply('[修仙联盟]方正\n道友要不仔细看看自己的储物袋')
            return
        }
        action.newnoe = 0
        await gameApi.userMsgAction({ NAME: UID, CHOICE: "user_action", DATA: action })
        const randomthing = await gameApi.randomThing()
        await gameApi.userBag({ UID, name: randomthing.name, ACCOUNT: randomthing.acount })
        await gameApi.userBag({ UID, name: '下品灵石', ACCOUNT: Number(10) })
        e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧\n还有${Number(10)}颗下品灵石\n可在必要的时候用到`)
        e.reply(`你对此高兴万分\n并放进了#储物袋`)
        return
    }
    giveMoney = async (e) => {
        if (!e.isGroup) {
            return
        }
        const existA = await gameApi.existUserSatus({ UID: e.user_id })
        if (!existA) {
            e.reply('已死亡')
            return
        }
        const { MSG } = await gameApi.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const A = e.user_id
        const B = await BotApi.User.at({ e })
        if (!B) {
            return
        }
        const existB = await gameApi.existUserSatus({ UID: B })
        if (!existB) {
            e.reply('已死亡')
            return
        }
        if (!B || B == A) {
            return
        }
        let islingshi = e.msg.replace('#赠送灵石', '')
        const lingshi = await gameApi.leastOne({ value: islingshi })
        const money = await gameApi.userBagSearch({ UID: A, name: '下品灵石' })
        if (!money || thing.acount < lingshi) {
            e.reply(`似乎没有${lingshi}下品灵石`)
            return
        }
        const CDTime = gameApi.getConfig({ app: 'parameter', name: 'cooling' }).CD.Transfer
        const CDID = '5'
        const now_time = new Date().getTime()
        const { CDMSG } = await gameApi.cooling({ UID: A, CDID })
        if (CDMSG) {
            e.reply(CDMSG)
            return
        }
        await redis.set(`xiuxian:player:${A}:${CDID}`, now_time)
        await redis.expire(`xiuxian:player:${A}:${CDID}`, CDTime * 60)
        await gameApi.userBag({ UID: A, name: '下品灵石', ACCOUNT: -lingshi })
        await gameApi.userBag({ UID: B, name: '下品灵石', ACCOUNT: lingshi })
        e.reply([BotApi.segment.at(B), `你获得了由 ${A}赠送的${lingshi}下品灵石`])
        return
    }
}
