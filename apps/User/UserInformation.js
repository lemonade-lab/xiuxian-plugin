
import plugin from '../../../../lib/plugins/plugin.js'
import {get_equipment_img,get_player_img} from '../ShowImeg/showData.js'
import {existplayer } from '../Xiuxian/Xiuxian.js'
/**
 * 信息模块
 */
export class UserInformation extends plugin {
    constructor() {
        super({
            name: 'UserInformation',
            dsc: 'UserInformation',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#基础信息$',
                    fnc: 'Show_player'
                },
                {
                    reg: "^#面板信息$",
                    fnc: "show_equipment",
                }
            ]
        })
    }


    //#我的练气
    async Show_player(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let img = await get_player_img(e);
        e.reply(img);
        return;
    }


    //修仙面板
    async show_equipment(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let img = await get_equipment_img(e);
        e.reply(img);
        return;
    }

}