import robotapi from "../../model/robotapi.js"
import config from '../../model/config.js'
import { superIndex } from "../../model/robotapi.js"
import {
    addLingshi,
    existplayer,
    point_map,
    Read_action,
    Read_najie,
    Write_najie
} from '../../model/public.js'
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
        this.xiuxianconfigData = config.getconfig('xiuxian', 'xiuxian')
    }
    OneKey_all = async (e) => {
        if (!e.isGroup) {
            return
        }
        const uid = e.user_id
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const action = await Read_action(uid)
        const address_name = '万宝楼'
        const map = await point_map(action, address_name)
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        let najie = await Read_najie(uid)
        let money = 0
        najie.thing.forEach((item) => {
            money += item.acount * item.price
        });
        najie.thing = []
        await Write_najie(uid, najie)
        //先把物品都清除了,再兑换成下品灵石
        await addLingshi(uid, money)
        e.reply(`[蜀山派]叶铭\n这是${money}下品灵石,道友慢走`)
        return
    }
    OneKey_type = async (e) => {
        if (!e.isGroup) {
            return
        }
        const uid = e.user_id
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const action = await Read_action(uid)
        const address_name = '万宝楼'
        const map = await point_map(action, address_name)
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