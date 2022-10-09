
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
import * as ShowData from '../ShowImeg/showData.js'
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
                    reg: '^#我的练气$',
                    fnc: 'Show_player'
                },
                {
                    reg: "^#修仙面板$",
                    fnc: "show_equipment",
                },
                {
                    reg: "^#我的炼体$",
                    fnc: "show_power",
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }


    //#我的练气
    async Show_player(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let img = await ShowData.get_player_img(e);
        e.reply(img);
        return;
    }

    //show_power
    async show_power(e) {
        if (!e.isGroup) {
            return;
        }        
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let img = await ShowData.get_power_img(e);
        e.reply(img);
        return;
    }

    //修仙面板
    async show_equipment(e) {
        if (!e.isGroup) {
            return;
        }
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let img = await ShowData.get_equipment_img(e);
        e.reply(img);
        return;
    }

}