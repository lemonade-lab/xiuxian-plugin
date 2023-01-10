import Robotapi from "../../model/robotapi.js";
import { get_map_img,get_updata_img,get_config_img } from '../../model/showdata.js';
export class showall extends Robotapi {
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
        const img = await get_map_img();
        e.reply(img);
        return;
    };
    show_updata = async (e) => {
        const img = await get_updata_img();
        e.reply(img);
        return;
    };
    show_config = async (e) => {
        const img = await get_config_img();
        e.reply(img);
        return;
    };
};