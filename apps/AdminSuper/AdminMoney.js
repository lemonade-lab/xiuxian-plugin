import robotapi from "../../model/robotapi.js"
import {
    At,
    Numbers,
    addLingshi,
    Read_wealth,
    search_thing_name,
    Read_najie,
    Add_najie_thing,
    Write_najie,
    Write_wealth
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
                reg: '^#修仙补偿.*$',
                fnc: 'Fuli'
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
        const B = await At(e)
        if (B == 0) {
            return
        }
        let lingshi = e.msg.replace('#修仙扣除', '')
        lingshi = await Numbers(lingshi)
        const player = await Read_wealth(B)
        if (player.lingshi < lingshi) {
            e.reply('他好穷的')
            return
        }
        player.lingshi -= lingshi
        await Write_wealth(B, player)
        e.reply(`已扣除灵石${lingshi}`)
        return
    }
    Fuli = async (e) => {
        if (!e.isMaster) {
            return
        }
        let lingshi = e.msg.replace('#修仙补偿', '')
        lingshi = await Numbers(lingshi)
        const B = await At(e)
        if (B == 0) {
            return
        }
        await addLingshi(B, lingshi)
        e.reply(`${B}获得${lingshi}灵石的补偿`)
        return
    }
}