import plugin from '../../../../lib/plugins/plugin.js'
import { Go,GenerateCD,__PATH,At } from '../Xiuxian/Xiuxian.js'
export class Battle extends plugin {
    constructor() {
        super({
            name: 'Battle',
            dsc: 'Battle',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#攻击.*$',
                    fnc: 'Attack'
                }
            ]
        })
    }

    //攻击
    async Attack(e) {
        let good=await Go(e);
        if (!good) {
            return;
        }
        let A = e.user_id;
        let B = await At(e);
        if(B==0||B==A){
            return;
        }
        let CDid = "0";
        let now_time = new Date().getTime();
        let CDTime = 5;
        let CD = await GenerateCD(A, CDid);
        if(CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ':'+CDid, now_time);
        await redis.expire("xiuxian:player:" + usr_qq +':'+ CDid, CDTime*60);
        e.reply("待重写")
        return;
    }

}




