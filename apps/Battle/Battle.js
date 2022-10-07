import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
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
                    reg: '^打劫$',
                    fnc: 'Dajie'
                },
                {
                    reg: '^切磋$',
                    fnc: 'biwu'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }
    //打劫
    async Dajie(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        return;
    }


    //切磋
    async biwu(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let A = e.user_id;
        let B = await Xiuxian.At(e);
        if(B==0||B==A){
            return;
        }
        let Data_battle = await Xiuxian.battle(A,B);
        let msg = Data_battle.msg;
        if (msg.length > 30) {
            e.reply("战斗过程略...");
        } else {
            await Xiuxian.ForwardMsg(e, msg);
        }
        if(Data_battle.victory==A){
            e.reply("你击败了对手");
        }else{
            e.reply("你被对方打败了");
        }
        return;
    }

}




