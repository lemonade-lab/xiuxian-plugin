import plugin from '../../../../../lib/plugins/plugin.js';
import Help from '../../../model/help.js';
import Cache from '../../../model/cache.js';
import plugins from '../model/plugins.js';
plugins.start();//激活
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
                }
            ]
        });
    };
    Pluginhelp = async(e)=>{
        const data = await Help.gethelp(e, 'Plugin');
        if (!data) {
            return
        };
        const img = await Cache.helpcache(data, 2);
        await e.reply(img);
        return;
    }
};