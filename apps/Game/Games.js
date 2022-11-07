import plugin from '../../../../lib/plugins/plugin.js'
import { Go,__PATH } from '../Xiuxian/Xiuxian.js'
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
    }

    //双修
    async Couple(e) {
        let good = await Go(e);
        if (!good) {
            return;
        }
        e.reply("待更新");
        return;
    }
}


