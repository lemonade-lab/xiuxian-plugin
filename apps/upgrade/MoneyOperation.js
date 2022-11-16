import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import {Go,Numbers,Add_lingshi,At,GenerateCD, Read_wealth} from '../Xiuxian/Xiuxian.js'
import { segment } from "oicq"
export class MoneyOperation extends plugin {
    constructor() {
        super({
            name: 'MoneyOperation',
            dsc: 'MoneyOperation',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^赠送灵石.*$',
                    fnc: 'Give_lingshi'
                }
            ]
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian") ;
    }
    async Give_lingshi(e) {
        const good=await Go(e);
        if (!good) {
            return;
        }
        let A = e.user_id;
        let B = await At(e);
        if(B==0||B==A){
            return;
        };
        let lingshi = e.msg.replace("#赠送灵石", "");
        lingshi = await Numbers(lingshi);
        if(lingshi<1000){
            lingshi=1000;
        }
        let A_player = await  Read_wealth(A);
        if (A_player.lingshi < lingshi) {
            e.reply([segment.at(A), `你身上似乎没有${lingshi}灵石`]);
            return;
        }
        let CDTime = this.xiuxianConfigData.CD.transfer;
        let CDid = "5";
        let now_time = new Date().getTime();
        let CD = await GenerateCD(A, CDid);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + A +':'+ CDid, now_time);
        await redis.expire("xiuxian:player:" + A +':'+ CDid, CDTime*60);
        await Add_lingshi(A, -lingshi);
        await Add_lingshi(B, lingshi);
        e.reply([segment.at(B), `你获得了由 ${A_player.name}赠送的${lingshi}灵石`])
        return;
    }
}
