import robotapi from "../../model/robotapi.js"
import config from '../../model/config.js'
import { superIndex } from "../../model/robotapi.js"
import { segment } from 'oicq'
import {
    Read_action,
    point_map,
    Read_level,
    Read_najie,
    Go,
    Add_najie_thing,
    Write_najie,
    Numbers,
    addAll,
    At,
    GenerateCD,
    exist_najie_thing_name,
    Write_action,
    randomThing
} from '../../model/public.js'
export class boxmoneyoperation extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#赠送灵石.*$',
                fnc: 'Give_lingshi'
            },
            {
                reg: '^#联盟报到$',
                fnc: 'New_lingshi'
            }
        ]))
        this.xiuxianconfigData = config.getconfig('xiuxian', 'xiuxian')
    }
    New_lingshi = async (e) => {
        if (!e.isGroup) {
            return
        }
        const good = await Go(e)
        if (!good) {
            return
        }
        const uid = e.user_id
        const action = await Read_action(uid)
        const address_name = '联盟'
        const map = await point_map(action, address_name)
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        const level = await Read_level(uid)
        if (level.level_id != 1) {
            return
        }
        if (action.newnoe != 1) {
            return
        }
        action.newnoe = 0
        await Write_action(uid, action)
        const randomthing = await randomThing()
        let najie = await Read_najie(uid)
        najie = await Add_najie_thing(najie, randomthing, Number(1))
        await Write_najie(uid, najie)
        await addAll(uid, Number(10))
        e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你一把[${randomthing.name}]吧\n还有这${Number(10)}灵石\n可在必要的时候用到`)
        e.reply(`你对此高兴万分\n还放进了#储物袋`)
        return
    }
    Give_lingshi = async (e) => {
        if (!e.isGroup) {
            return
        }
        const good = await Go(e)
        if (!good) {
            return
        }
        const A = e.user_id
        const B = await At(e)
        if (B == 0 || B == A) {
            return
        }
        let islingshi = e.msg.replace('#赠送灵石', '')
        const lingshi = await Numbers(islingshi)
        let thing = await exist_najie_thing_name(A, '下品灵石')
        if (thing == 1 || thing.acount < lingshi) {
            e.reply([segment.at(A), `似乎没有${lingshi}下品灵石`])
            return
        }
        const CDTime = this.xiuxianconfigData.CD.Transfer
        const CDid = '5'
        const now_time = new Date().getTime()
        const CD = await GenerateCD(A, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        await redis.set(`xiuxian:player:${A}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${A}:${CDid}`, CDTime * 60)
        await addAll(A, -lingshi)   
        await addAll(B, lingshi)        
        e.reply([segment.at(B), `你获得了由 ${A}赠送的${lingshi}下品灵石`])
        return
    }
}
