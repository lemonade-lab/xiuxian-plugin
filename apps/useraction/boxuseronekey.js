import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { GameApi } from '../../model/api/gameapi.js'
export class boxuseronekey extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#置换所有物品$',
                fnc: 'substitution'
            },
            {
                reg: '^#一键出售.*$',
                fnc: 'shellAllType'
            }
        ]))
    }
    substitution = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (! await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const action = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '万宝楼'
        const map = await GameApi.GameMap.mapExistence({ action, addressName: address_name })
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        let bag = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_bag' })
        let money = Number(0)
        bag.thing.forEach((item) => {
            money += item.acount * item.price
        });
        if (money == 0) {
            return
        }
        bag.thing = []
        await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_bag', DATA: bag })
        await GameApi.GameUser.userBag({ UID, name: '下品灵石', ACCOUNT: money })
        e.reply(`[蜀山派]叶铭\n这是${money}下品灵石,道友慢走`)
        return
    }
    shellAllType = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (! await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const action = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '万宝楼'
        const map = await GameApi.GameMap.mapExistence({ action, addressName: address_name })
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        const type = e.msg.replace('#一键出售', '')
        const maptype = {
            '武器': '1',
            '护具': '2',
            '法宝': '3',
            '丹药': '4',
            '功法': '5',
            '道具': '6'
        }
        if (!maptype.hasOwnProperty(type)) {
            e.reply(`[蜀山派]叶凡\n此处不收${type}`)
            return
        }
        let bag = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_bag' })
        let money = Number(0)
        const arr = []
        bag.thing.forEach((item, index) => {
            const id = item.id.split('-')
            if (id[0] == maptype[type]) {
                money += Number(item.acount * item.price)
            } else {
                arr.push(item)
            }
        });
        if (money == 0) {
            return
        }
        bag.thing = arr
        await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_bag', DATA: bag })
        await GameApi.GameUser.userBag({ UID, name: '下品灵石', ACCOUNT: money })
        e.reply(`[蜀山派]叶铭\n这是${money}下品灵石,道友慢走`)
        return
    }
}