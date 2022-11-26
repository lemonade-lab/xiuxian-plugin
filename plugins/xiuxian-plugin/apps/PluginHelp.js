import plugin from '../../../../../lib/plugins/plugin.js';
import Help from '../../../model/help.js';
import Cache from '../../../model/cache.js';
import filecp from '../../../model/filecp.js';
filecp.Pluginfile('xiuxian-plugin', ['Plugin']);
export class PluginHelp extends plugin {
    constructor() {
        super({
            name: 'PluginHelp',
            dsc: 'PluginHelp',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#修仙扩展$',
                    fnc: 'Pluginhelp'
                },
                {
                    reg: '^#重置修仙扩展$',
                    fnc: 'PluginhelpBack'
                }
            ]
        });
    };
    PluginhelpBack = async (e) => {
        e.reply('Updata...');
        return;
    };
    Pluginhelp = async (e) => {
        const data = await Help.gethelp(e, 'Plugin');
        if (!data) {
            return
        };
        const img = await Cache.helpcache(data, 2);
        await e.reply(img);
        return;
    };
};