import plugin from '../../../../lib/plugins/plugin.js';
import { get_map_img,get_updata_img,get_bulletin_img,get_config_img } from '../ShowImeg/showData.js';
export class showall extends plugin {
    constructor() {
        super({
            name: 'showall',
            dsc: 'showall',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#修仙地图$',
                    fnc: 'show_map',
                },
                {
                    reg: '^#修仙公告$',
                    fnc: 'show_bulletin',
                },
                {
                    reg: '^#修仙版本$',
                    fnc: 'show_updata',
                },
                {
                    reg: '^#修仙配置$',
                    fnc: 'show_config',
                }
            ]
        });
    };
    show_map = async (e) => {
        const img = await get_map_img(e);
        e.reply(img);
        return;
    };
    show_updata = async (e) => {
        const img = await get_updata_img(e);
        e.reply(img);
        return;
    };
    show_config = async (e) => {
        const img = await get_config_img(e);
        e.reply(img);
        return;
    };
    show_bulletin = async (e) => {
        const img = await get_bulletin_img(e);
        e.reply(img);
        return;
    };
};