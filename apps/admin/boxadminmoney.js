import robotapi from "../../model/robotapi.js"
import { superIndex } from "../../model/robotapi.js"
import {
    leastOne,
    userBagSearch,
    userAt,
    userBag
} from "../../model/boxpublic.js"
export class boxadminmoney extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙扣除.*$',
                fnc: 'Deduction'
            },
            {
                reg: '^#修仙馈赠.*$',
                fnc: 'gifts'
            }
        ]))
    }
    gifts = async (e) => {
        if (!e.isMaster) {
            return
        }
        const B = await userAt(e)
        if (B == 0) {
            return
        }
        const thing_name = e.msg.replace('#修仙馈赠', '')
        const [name, acount] = thing_name.split('\*')
        const quantity = await leastOne(acount)
        const bag = await userBag(B, name, quantity)
        if (bag) {
            e.reply(`${B}获得馈赠:${name}`)
        } else {
            e.reply(`馈赠[${name}]失败`)
        }
        return
    }
    Deduction = async (e) => {
        if (!e.isMaster) {
            return
        }
        const uid = await userAt(e)
        if (uid == 0) {
            return
        }
        let lingshi = e.msg.replace('#修仙扣除', '')
        lingshi = await leastOne(lingshi)
        const thing = await userBagSearch(uid, '下品灵石')
        if (!thing || thing.acount < lingshi) {
            e.reply('他好穷的')
            return
        }
        await userBag(uid, '下品灵石', -lingshi)
        e.reply(`已扣除${lingshi}下品灵石`)
        return
    }
}