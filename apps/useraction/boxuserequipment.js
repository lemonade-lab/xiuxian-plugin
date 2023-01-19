import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
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
    }
    add_equipment = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const thing_name = e.msg.replace('#装备', '')
        const najie_thing = await gameApi.userBagSearch({ UID, name: thing_name })
        if (!najie_thing) {
            e.reply(`没有${thing_name}`)
            return
        }
        const equipment = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_equipment' })
        if (equipment.length >= gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).myconfig.equipment) {
            return
        }
        equipment.push(najie_thing)
        await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_equipment', DATA: equipment })
        await gameApi.userBag({ UID, name: thing_name, ACCOUNT: -1 })
        await gameApi.readPanel({ UID })
        e.reply(`装备${thing_name}`)
        return
    }
    delete_equipment = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const thing_name = e.msg.replace('#卸下', '')
        let equipment = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_equipment' })
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
        await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_equipment', DATA: equipment })
        await gameApi.userBag({ UID, name: thing_name, ACCOUNT: 1 })
        await gameApi.readPanel({ UID })
        e.reply(`已卸下${thing_name}`)
        return
    }
}