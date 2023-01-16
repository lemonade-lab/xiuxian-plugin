import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import config from '../../model/config.js'
import {
    existplayer,
    exist_najie_thing_name,
    Read_najie,
    Read_equipment,
    Write_equipment,
    Write_najie,
    Add_najie_thing
} from '../../model/public.js'
export class boxuserequipment extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#装备.*$',
                fnc: 'add_equipment'
            },
            {
                reg: '^#卸下.*$',
                fnc: 'delete_equipment'
            }
        ]))
        this.xiuxianconfigData = config.getconfig('xiuxian', 'xiuxian')
    }
    add_equipment = async (e) => {
        const uid = e.user_id
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const thing_name = e.msg.replace('#装备', '')
        const najie_thing = await exist_najie_thing_name(uid, thing_name)
        if (najie_thing == 1) {
            e.reply(`没有${thing_name}`)
            return
        }
        const equipment = await Read_equipment(uid)
        if (equipment.length >= this.xiuxianconfigData.myconfig.equipment) {
            return
        }
        equipment.push(najie_thing)
        await Write_equipment(uid, equipment)
        let najie = await Read_najie(uid)
        najie = await Add_najie_thing(najie, najie_thing, -1)
        await Write_najie(uid, najie)
        e.reply(`装备${thing_name}`)
        return
    }
    delete_equipment = async (e) => {
        const uid = e.user_id
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const thing_name = e.msg.replace('#卸下', '')
        let equipment = await Read_equipment(uid)
        const islearned = equipment.find(item => item.name == thing_name)
        if (!islearned) {
            return
        }
        const q = {
            "x": 0
        }
        equipment.forEach((item, index, arr) => {
            if (item.name == thing_name && q.x == 0) {
                q.x = 1
                arr.splice(index, 1)
            }
        })
        await Write_equipment(uid, equipment)
        let najie = await Read_najie(uid)
        najie = await Add_najie_thing(najie, islearned, 1)
        await Write_najie(uid, najie)
        e.reply(`已卸下${thing_name}`)
        return
    }
}