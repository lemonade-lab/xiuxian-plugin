import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fs from "fs"
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
                    reg: '^#发测试福利.*$',
                    fnc: 'ceshi'
                },
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
                    reg: '^#发福利.*$',
                    fnc: 'Allfuli'
                },
                {
                    reg: '^#发补偿.*$',
                    fnc: 'Fuli'
                },
                {
                    reg: '^#扣除.*$',
                    fnc: 'Deduction'
                },
                {
                    reg: '#交税.*$',
                    fnc: 'MoneyWord'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    async ceshi(e) {
        if (!e.isGroup) {
            return;
        }
        if (!e.isMaster) {
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("发测试", "");
        lingshi = lingshi.replace("福利", "");
        if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) > 0) {
            lingshi = parseInt(lingshi);
        }
        else {
            lingshi = 100;
        }
        let playerList = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            await Xiuxian.Add_lingshi(player_id, lingshi);
        }
        e.reply(`福利发放成功,每人增加${lingshi}灵石`);
        return;
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
            e.reply("醒醒，你没有那么多");
            return;
        }
        await Xiuxian.Add_lingshi(usr_qq, -lingshi);
        await Xiuxian.Worldwealth(lingshi);
        e.reply("成功交税" + lingshi);
        return;
    }

    async Deduction(e) {
        if (!e.isGroup) {
            return;
        }
        if (!e.isMaster) {
            return;
        }
        let B = await Xiuxian.At(e);
        if(B==0){
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("扣除", "");
        lingshi = await Xiuxian.Numbers(lingshi);

        let player = await Xiuxian.Read_player(B);
        if (player.lingshi < lingshi) {
            e.reply("他并没有这么多");
            return;
        }
        if (player.lingshi == lingshi) {
            lingshi = lingshi - 1;
        }
        await Xiuxian.Add_lingshi(B, -lingshi);
        await Xiuxian.Worldwealth(lingshi);
        e.reply("已强行扣除灵石" + lingshi);
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

        await Xiuxian.Add_lingshi(usr_qq, addlingshi);

        e.reply(player.name + "抢到一个" + addlingshi + "灵石的红包！");

        await redis.set("xiuxian:player:" + usr_qq + ":last_getbung_time", now_time);

        return;
    }


    //发福利
    async Allfuli(e) {
        if (!e.isGroup) {
            return;
        }
        if (!e.isMaster) {
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("发", "");
        lingshi = lingshi.replace("福利", "");

        lingshi =await Xiuxian.Numbers(lingshi);

        if(lingshi<1000){
            return;
        }

        let File = fs.readdirSync(Xiuxian.__PATH.player);
        File = File.filter(file => file.endsWith(".json"));
        let File_length = File.length;
        for (var i = 0; i < File_length; i++) {
            let B = File[i].replace(".json", '');
            await Xiuxian.Add_lingshi(B, lingshi);
        }
        
        await Xiuxian.Worldwealth(- lingshi * File_length);

        e.reply(`福利发放成功,${File_length}个玩家,每人增加${lingshi}灵石`);

        return;
    }




    //发补偿
    async Fuli(e) {
        if (!e.isGroup) {
            return;
        }
        if (!e.isMaster) {
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("发", "");
        lingshi = lingshi.replace("补偿", "");

        lingshi =await Xiuxian.Numbers(lingshi);
        if(lingshi<1000){
            return;
        }


        let B = await Xiuxian.At(e);
        if(B==0){
            return;
        }

        let Worldmoney = await redis.get("Xiuxian:Worldmoney");
        Worldmoney = await Xiuxian.Numbers(Worldmoney);
        if (Worldmoney <= lingshi) {
            e.reply("世界财富不足！");
            return;
        }

        await Xiuxian.Worldwealth(- lingshi);

        await Xiuxian.Add_lingshi(B, lingshi);

        e.reply(`${B}获得${lingshi}灵石的补偿`);

        return;
    }

}
