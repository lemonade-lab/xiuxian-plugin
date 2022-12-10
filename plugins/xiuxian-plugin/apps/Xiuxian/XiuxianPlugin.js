import plugin from '../../../../../../lib/plugins/plugin.js';
import plugindata from '../../model/plugindata.js';
plugindata.start();
export class XiuxianPlugin extends plugin {
    constructor() {
        super({
            name: 'XiuxianPlugin',
            dsc: 'XiuxianPlugin',
            event: 'message',
            priority: 600,
            rule: [
            ]
        });
    };
};