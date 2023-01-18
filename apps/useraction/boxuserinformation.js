import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import {
    get_equipment_img,
    get_player_img
} from '../../model/showdata.js'
import gameApi from '../../model/api/api.js'
export class boxuserinformation extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#基础信息$',
                fnc: 'Show_player'
            },
            {
                reg: '^#面板信息$',
                fnc: 'show_equipment',
            },
            {
                reg: '^#功法信息$',
                fnc: 'show_gongfa',
            }
        ]))
    }
    Show_player = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const img = await get_player_img(e.user_id)
        e.reply(img)
        return
    }
    show_equipment = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const img = await get_equipment_img(e.user_id)
        e.reply(img)
        return
    }
}