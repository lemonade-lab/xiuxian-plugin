import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import { Go,GenerateCD,__PATH,At } from '../Xiuxian/Xiuxian.js'

/**
 * 战斗类
 */
export class Battle extends plugin {
    constructor() {
        super({
            name: 'Battle',
            dsc: 'Battle',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#打劫$',
                    fnc: 'Dajie'
                },
                {
                    reg: '^#攻击$',
                    fnc: 'Dajie'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    //打劫
    async Dajie(e) {
        let good=await Go(e);
        if (!good) {
            return;
        }
        let A = e.user_id;
        let B = await At(e);
        if(B==0||B==A){
            return;
        }
        let ClassCD = ":Dajie";
        let now_time = new Date().getTime();
        let CDTime = 15;
        let CD = await GenerateCD(A, ClassCD, now_time, CDTime);
        if(CD != 0) {
            e.reply(CD);
            return;
        }
        e.reply("待重写")
        return;
    }

}




