import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import {Go,Numbers,Add_lingshi,At,GenerateCD, Read_wealth} from '../Xiuxian/Xiuxian.js'
import { segment } from "oicq"
/**
 * 货币与物品操作模块
 */
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
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }
    
    async Give_lingshi(e) {
        let good=await Go(e);
        if (!good) {
            return;
        }
        let A = e.user_id;
        let B = await At(e);
        if(B==0||B==A){
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("赠送灵石", "");
        lingshi = await Numbers(lingshi);
        if(lingshi<1000){
            lingshi=1000;
        }
        let A_player = await  Read_wealth(A);
        let B_player = await  Read_wealth(B);
        var cost = this.xiuxianConfigData.percentage.cost;
        let lastlingshi = await Numbers(lingshi*(1+cost));
        if (A_player.lingshi < lastlingshi) {
            e.reply([segment.at(A), `你身上似乎没有${lastlingshi}灵石`]);
            return;
        }
        let CDTime = 60 ;
        let ClassCD = ":last_getbung_time";
        let now_time = new Date().getTime();
        let CD = await GenerateCD(A, ClassCD, now_time, CDTime);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + A + ClassCD, now_time);
        await redis.expire("xiuxian:player:" + A + ClassCD, CDTime*60);
        await Add_lingshi(A, -lastlingshi);
        await Add_lingshi(B, lingshi);
        e.reply([segment.at(A), segment.at(B), `${B_player.name} 获得了由 ${A_player.name}赠送的${lingshi}灵石`])
        return;
    }
}
