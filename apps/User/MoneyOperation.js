import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
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
                },
                {
                    reg: '^#发红包.*$',
                    fnc: 'Give_honbao'
                },
                {
                    reg: '^#抢红包$',
                    fnc: 'uer_honbao'
                },
                {
                    reg: '#交税.*$',
                    fnc: 'MoneyWord'
                },
                {
                    reg: '#新手礼包$',
                    fnc: 'Newuser'
                },
                {
                    reg: '#境界礼包$',
                    fnc: 'userLevel'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }


    async MoneyWord(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("交税", "");
        lingshi = await Xiuxian.Numbers(lingshi);
        let player = await Xiuxian.Read_player(usr_qq);
        if (player.lingshi <= lingshi) {
            return;
        }
        await Xiuxian.Add_lingshi(usr_qq, -lingshi);
        await Xiuxian.Worldwealth(lingshi);
        e.reply("交税" + lingshi);
        return;
    }



    async Give_lingshi(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let A = e.user_id;
        let B = await Xiuxian.At(e);
        if(B==0||B==A){
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("赠送灵石", "");
        lingshi = await Xiuxian.Numbers(lingshi);
        if(lingshi<1000){
            lingshi=1000;
        }
        let A_player = await data.getData("player", A);
        let B_player = await data.getData("player", B);
        var cost = this.xiuxianConfigData.percentage.cost;
        let lastlingshi = await Xiuxian.Numbers(lingshi*(1+cost));
        if (A_player.lingshi < lastlingshi) {
            e.reply([segment.at(A), `你身上似乎没有${lastlingshi}灵石`]);
            return;
        }
        let CDTime = 60 ;
        let ClassCD = ":last_getbung_time";
        let now_time = new Date().getTime();
        let CD = await Xiuxian.GenerateCD(A, ClassCD, now_time, CDTime);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + A + ClassCD, now_time); 
        await Xiuxian.Add_lingshi(A, -lastlingshi);
        await Xiuxian.Add_lingshi(B, lingshi);
        await Xiuxian.Worldwealth(lingshi * cost);
        e.reply([segment.at(A), segment.at(B), `${B_player.name} 获得了由 ${A_player.name}赠送的${lingshi}灵石`])
        return;
    }


    //发红包
    async Give_honbao(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("发红包", "");
        let code = lingshi.split("\*");
        lingshi = code[0];
        let acount = code[1];
        lingshi = await Xiuxian.Numbers(lingshi);
        acount = await Xiuxian.Numbers(acount);
        if (lingshi <= 1 || acount < 1) {
            return;
        }
        let player = await data.getData("player", usr_qq);
        if (player.lingshi <= parseInt(lingshi * acount)) {
            return;
        }
        let getlingshi = 0;
        for (var i = 1; i <= 100; i++) {
            if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) == i * 10000) {
                getlingshi = parseInt(lingshi);
                break;
            }
        }
        if (lingshi != getlingshi) {
            e.reply(`一个红包最低为一万噢，且是万的倍数，最高可发一百万一个`);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ":honbao", getlingshi);
        await redis.set("xiuxian:player:" + usr_qq + ":honbaoacount", acount);
        await Xiuxian.Add_lingshi(usr_qq, -getlingshi * acount);
        e.reply(player.name + "发了" + acount + "个" + getlingshi + "灵石的红包！");
        return;
    }


    //抢红包
    async uer_honbao(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let A = e.user_id;

        let CDTime =2;
        let ClassCD = ":last_getbung_time";
        let now_time = new Date().getTime();
        let CD = await Xiuxian.GenerateCD(A, ClassCD, now_time, CDTime);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + A + ClassCD, now_time); 
        let B = await Xiuxian.At(e);
        if(B==0||A==B){
            return;
        }
        var acount = await redis.get("xiuxian:player:" + B + ":honbaoacount");
        acount = Number(acount);
        if (acount <= 0) {
            e.reply("他的红包被光啦！");
            return;
        }
        var lingshi = await redis.get("xiuxian:player:" + B + ":honbao");
        var addlingshi = Math.trunc(lingshi);
        acount--;
        await redis.set("xiuxian:player:" + B + ":honbaoacount", acount);
        await Xiuxian.Add_lingshi(A, addlingshi);
        await redis.set("xiuxian:player:" + A + ":last_getbung_time", now_time);
        e.reply(A+"抢到一个" + addlingshi + "灵石的红包！");
        return;
    }


}
