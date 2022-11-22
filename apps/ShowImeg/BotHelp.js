import plugin from '../../../../lib/plugins/plugin.js';
import Help from '../../model/help.js';
import Cache from '../../model/cache.js';
export class BotHelp extends plugin {
    constructor() {
        super({
            name: 'BotHelp',
            dsc: 'BotHelp',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#修仙帮助$',
                    fnc: 'Xiuxianhelp1'
                },
                {
                    reg: '^#修仙管理$',
                    fnc: 'adminsuper',
                }
            ]
        });
    };
    Xiuxianhelp1 = async (e) => {
        const data = await Help.gethelp(e, 'Help');
        if (!data) {
            return
        };
        const img = await Cache.helpcache(data, 1);
        await e.reply(img);
    };
    adminsuper = async (e) => {
        const data = await Help.gethelp(e, 'Admin');
        if (!data) {
            return
        };
        const img = await Cache.helpcache(data, 0);
        await e.reply(img);
    };
};