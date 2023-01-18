import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
export class boxuseronekey extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#置换所有物品$',
                fnc: 'OneKey_all'
            },
            {
                reg: '^#一键出售.*$',
                fnc: 'OneKey_type'
            }
        ]))
    }
    OneKey_all = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '万宝楼'
        const map = await gameApi.mapExistence({action, addressName:address_name})
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        let najie = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag' })
        let money = 0
        najie.thing.forEach((item) => {
            money += item.acount * item.price
        });
        najie.thing = []
        await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag', DATA: najie })
        //先把物品都清除了,再兑换成下品灵石
        await gameApi.userBag({ UID, name: '下品灵石', ACCOUNT: money })
        e.reply(`[蜀山派]叶铭\n这是${money}下品灵石,道友慢走`)
        return
    }
    OneKey_type = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '万宝楼'
        const map = await gameApi.mapExistence({action, addressName:address_name})
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
        }
        return
    }
}