import plugin from '../../../../lib/plugins/plugin.js';
import { get_state_img,get_statemax_img,get_map_img,get_updata_img } from '../ShowImeg/showData.js';
export class showall extends plugin {
    constructor() {
        super({
            name: 'showall',
            dsc: 'showall',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#练气境界$',
                    fnc: 'show_Level',
                },
                {
                    reg: '^#练气境界$',
                    fnc: 'show_Level',
                },
                {
                    reg: '^#炼体境界$',
                    fnc: 'show_LevelMax',
                },
                {
                    reg: '^#修仙地图$',
                    fnc: 'show_map',
                },
                {
                    reg: '^#修仙版本$',
                    fnc: 'show_updata',
                }
            ]
        });
    };
    show_Level = async (e) => {
        const img = await get_state_img(e);
        e.reply(img);
        return;
    };
    show_LevelMax = async (e) => {
        const img = await get_statemax_img(e);
        e.reply(img);
        return;
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
};