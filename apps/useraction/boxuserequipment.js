import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { GameApi } from '../../model/api/gameapi.js'
export class boxuserequipment extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#装备.*$',
                fnc: 'addEquipment'
            },
            {
                reg: '^#卸下.*$',
                fnc: 'deleteEquipment'
            }
        ]))
    }
    addEquipment = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (!await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const thing_name = e.msg.replace('#装备', '')
        const najie_thing = await GameApi.GameUser.userBagSearch({ UID, name: thing_name })
        if (!najie_thing) {
            e.reply(`没有${thing_name}`)
            return
        }
        const equipment = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_equipment' })
        if (equipment.length >= GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' }).myconfig.equipment) {
            return
        }
        equipment.push(najie_thing)
        await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_equipment', DATA: equipment })
        await GameApi.GameUser.userBag({ UID, name: thing_name, ACCOUNT: -1 })
        await  GameApi.GameUser.readPanel({ UID })
        e.reply(`装备${thing_name}`)
        return
    }
    deleteEquipment = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (! await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const thing_name = e.msg.replace('#卸下', '')
        let equipment = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_equipment' })
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
        await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_equipment', DATA: equipment })
        await GameApi.GameUser.userBag({ UID, name: thing_name, ACCOUNT: 1 })
        await GameApi.GameUser.readPanel({ UID })
        e.reply(`已卸下${thing_name}`)
        return
    }
}