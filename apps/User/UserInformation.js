import plugin from '../../../../lib/plugins/plugin.js';
import { get_equipment_img, get_player_img } from '../ShowImeg/showData.js';
import { existplayer } from '../Xiuxian/Xiuxian.js';
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
                    reg: '^#面板信息$',
                    fnc: 'show_equipment',
                },
                {
                    reg: '^#功法信息$',
                    fnc: 'show_gongfa',
                }
            ]
        });
    };
    Show_player = async (e) => {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const img = await get_player_img(e);
        e.reply(img);
        return;
    };
    show_equipment = async (e) => {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const img = await get_equipment_img(e);
        e.reply(img);
        return;
    };
};