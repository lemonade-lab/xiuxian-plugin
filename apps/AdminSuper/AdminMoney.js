import robotapi from "../../model/robotapi.js"
import {
    At,
    Numbers,
    addLingshi,
    search_thing_name,
    exist_najie_thing_name,
    Read_najie,
    Add_najie_thing,
    Write_najie
} from '../../model/public.js'
import { superIndex } from "../../model/robotapi.js"
export class AdminMoney extends robotapi {
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
        const B = await At(e)
        if (B == 0) {
            return
        }
        const thing_name = e.msg.replace('#修仙馈赠', '')
        const code = thing_name.split('\*')
        const [name, acount] = code
        const searchsthing = await search_thing_name(name)
        if (searchsthing == 1) {
            e.reply(`世界没有${name}`)
            return
        }
        const quantity = await Numbers(acount)
        let najie = await Read_najie(B)
        najie = await Add_najie_thing(najie, searchsthing, quantity)
        await Write_najie(B, najie)
        e.reply(`${B}获得馈赠:${name}`)
        return
    }
    Deduction = async (e) => {
        if (!e.isMaster) {
            return
        }
        const uid = await At(e)
        if (uid == 0) {
            return
        }
        let lingshi = e.msg.replace('#修仙扣除', '')
        lingshi = await Numbers(lingshi)
        let thing = await exist_najie_thing_name(uid, '下品灵石')
        if (thing == 1 || thing.acount < lingshi) {
            e.reply('他好穷的')
            return
        }
        await addLingshi(uid, -lingshi)
        e.reply(`已扣除灵石${lingshi}`)
        return
    }
}