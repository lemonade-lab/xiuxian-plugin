import plugin from '../../../../../lib/plugins/plugin.js';
import Help from '../../../model/help.js';
import Cache from '../../../model/cache.js';
import filecp from '../../../model/filecp.js';
import config from '../../../model/Config.js';
//配置文件启动
filecp.Pluginfile('xiuxian-plugin', ['Plugin','plugin']);
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
        //xiuxain配置下的plugin
        this.xiuxianConfigData = config.getConfig('xiuxian', 'plugin');
    };
    PluginhelpBack = async (e) => {
        //配置生成示例
        console.log('测试'+this.xiuxianConfigData.CD.plugin);
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