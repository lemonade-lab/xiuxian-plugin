import Robotapi from "../../model/robotapi.js";
import Help from '../../model/help.js';
import Cache from '../../model/cache.js';
export class BotHelp extends Robotapi {
    constructor() {
        super({
            name: 'BotHelp',
            dsc: 'BotHelp',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#(修仙帮助|帮助)$',
                    fnc: 'Xiuxianhelp'
                },
                {
                    reg: '^#修仙管理$',
                    fnc: 'adminsuper',
                }
            ]
        });
    };
    Xiuxianhelp = async (e) => {
        const data = await Help.getboxhelp('Help');
        if (!data) {
            return
        };
        const img = await Cache.helpcache(data, 1);
        await e.reply(img);
    };
    adminsuper = async (e) => {
        const data = await Help.getboxhelp('Admin');
        if (!data) {
            return
        };
        const img = await Cache.helpcache(data, 0);
        await e.reply(img);
    };
};