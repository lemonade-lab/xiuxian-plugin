import plugin from '../../../../lib/plugins/plugin.js';
import config from "../../model/Config.js";
import {existplayer, Read_najie} from '../Xiuxian/Xiuxian.js';
export class OneKey extends plugin {
    constructor() {
        super({
            name: 'OneKey',
            dsc: 'OneKey',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#一键出售所有$',
                    fnc: 'OneKey_all'
                },
                {
                    reg: '^#一键出售武器$',
                    fnc: 'OneKey_wuqi'
                }
            ]
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    };
    async OneKey_all(e) {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        let najie=Read_najie(usr_qq);
        return;
    };
};