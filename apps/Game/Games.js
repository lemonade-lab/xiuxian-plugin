import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import { Go,__PATH } from '../Xiuxian/Xiuxian.js'
/**
* 修仙游戏模块
*/
export class Games extends plugin {
    constructor() {
        super({
            name: 'Games',
            dsc: 'Games',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#双修$',
                    fnc: 'Couple'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    //双修
    async Couple(e) {
        let gameswitch = this.xiuxianConfigData.switch.couple;
        if (gameswitch != true) {
            return;
        }
        let good = await Go(e);
        if (!good) {
            return;
        }
        e.reply("待更新");
        return;
    }
}


