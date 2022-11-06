//插件加载
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import {Go} from '../Xiuxian/Xiuxian.js'
/**
 * 秘境模块
 */
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
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    async Xiuxianstate(e) {
        await Go(e);
        return;
    }

}
