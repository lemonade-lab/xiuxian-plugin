import { plugin } from "../../../model/robot/api/api.js"
import { GameApi } from '../../../model/api/gameapi.js'
import { BotApi } from '../../../model/api/botapi.js'
export class boxuserinstall extends plugin {
    constructor() {
        super(BotApi.SuperIndex.getUser({
            event: 'notice.group.increase',
            priority: 99999,
            rule: [
                {
                    fnc: 'createinstall'
                }
            ]
        }))
    }
    createinstall = async (e) => {
        if (!e.isGroup) {
            return
        }
        const cf = await GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' })
        const T = cf['switch'] ? cf['switch']['come'] : true
        if (!T) {
            return
        }
        const UID = e.user_id
        if (! await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply([BotApi.segment.at(UID), '降临失败...\n请降临者[#再入仙途]后步入轮回!'])
            return
        }
        e.reply([BotApi.segment.at(UID), '降临成功...\n欢迎降临修仙世界\n请降临者[#修仙帮助]以获得\n《凡人是如何修仙成功的之修仙生存手册之先抱大腿》'])
        return
    }
}