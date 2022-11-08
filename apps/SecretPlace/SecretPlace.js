//插件加载
import plugin from '../../../../lib/plugins/plugin.js'
import {Go} from '../Xiuxian/Xiuxian.js'
export class SecretPlace extends plugin {
    constructor() {
        super({
            name: 'SecretPlace',
            dsc: 'SecretPlace',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#修仙状态$',
                    fnc: 'Xiuxianstate'
                },
                {
                    reg: '^#击杀$',
                    fnc: 'Kill'
                },
                {
                    reg: '^#前往.*$',
                    fnc: 'move'
                }
            ]
        })
    }

    async Xiuxianstate(e) {
        await Go(e);
        return;
    }

    async Kill(e) {
        e.reply("待更新");
        return;
    }
    
    async move(e) {
        e.reply("待更新");
        return;
    }

}
