//插件加载
import plugin from '../../../../lib/plugins/plugin.js'
import {Gomini} from '../Xiuxian/Xiuxian.js'
export class BattleSite extends plugin {
    constructor() {
        super({
            name: 'BattleSite',
            dsc: 'BattleSite',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#击杀$',
                    fnc: 'Kill'
                },
                {
                    reg: '^#探索怪物$',
                    fnc: 'Exploremonsters'
                }
            ]
        })
    }
    
    async Kill(e) {
        //击杀需要判断状态
        const good = await Gomini(e);
        if (!good) {
            return;
        };
        e.reply("待更新");
        return;
    }

        
    async Exploremonsters(e) {
        const good = await Gomini(e);
        if (!good) {
            return;
        };
        e.reply("待更新");
        return;
    }

    
    

}
