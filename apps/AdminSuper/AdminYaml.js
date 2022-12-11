import plugin from '../../../../lib/plugins/plugin.js';
import XiuxianYaml from '../../model/XiuxianYaml.js';
export class AdminYaml extends plugin {
    constructor() {
        super({
            name: 'AdminYaml',
            dsc: 'AdminYaml',
            event: 'message',
            priority: 400,
            rule: [
                {
                    reg: '^#修仙配置更改.*',
                    fnc: 'configupdata',
                }
            ],
        });
    };
    configupdata=async(e)=>{
        if (!e.isMaster) {
            return;
        };
        const config = e.msg.replace('#修仙配置更改', '');
        const code = config.split('\*');
        const [name,size] = code;
        e.reply(XiuxianYaml.config(name,size));
        return;
    };
};