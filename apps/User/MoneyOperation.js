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
                    reg: '^#打开钱包$',
                    fnc: 'openwallet'
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
        lingshi = Number(lingshi);
        if (!isNaN(parseFloat(lingshi)) && isFinite(lingshi)) {
        } else {
            return;
        }
        if (lingshi <= 0) {
            return;
        }
        lingshi = Math.trunc(lingshi);
        let player = await Xiuxian.Read_player(usr_qq);
        if (player.lingshi <= lingshi) {
            e.reply("醒醒，你没有那么多");
            return;
        }
        await Xiuxian.Add_lingshi(usr_qq, -lingshi);
        let Worldmoney = await redis.get("Xiuxian:Worldmoney");
        Worldmoney = Number(Worldmoney);
        Worldmoney = Worldmoney + lingshi;
        Worldmoney = Number(Worldmoney);
        await redis.set("Xiuxian:Worldmoney", Worldmoney);
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
        if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) >= 1000) {
            lingshi = parseInt(lingshi);
        }
        else {
            return;
        }
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
        if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) >= 1000) {
            lingshi = parseInt(lingshi);
        }
        else {
            e.reply(`这么点灵石你也好拿得出手吗?起码要1000灵石,已为您修改`);
            lingshi = 1000;
        }
        let A_player = await data.getData("player", A);
        let B_player = await data.getData("player", B);
        var cost = this.xiuxianConfigData.percentage.cost;
        let lastlingshi = lingshi + Math.trunc(lingshi * cost);
        if (A_player.lingshi < lastlingshi) {
            e.reply([segment.at(A), `你身上似乎没有${lastlingshi}灵石`]);
            return;
        }
        let now = new Date();
        let nowTime = now.getTime(); //获取当前时间戳
        let lastgetbung_time = await redis.get("xiuxian:player:" + A + ":last_getbung_time");
        lastgetbung_time = parseInt(lastgetbung_time);
        let transferTimeout = parseInt(this.xiuxianConfigData.CD.transfer * 60000)
        if (nowTime < lastgetbung_time + transferTimeout) {
            let waittime_m = Math.trunc((lastgetbung_time + transferTimeout - nowTime) / 60 / 1000);
            let waittime_s = Math.trunc(((lastgetbung_time + transferTimeout - nowTime) % 60000) / 1000);
            e.reply(`每${transferTimeout / 1000 / 60}分钟赠送灵石一次，正在CD中，` + `剩余cd: ${waittime_m}分${waittime_s}秒`);
            return;
        }
        await Xiuxian.Add_lingshi(A, -lastlingshi);
        await Xiuxian.Add_lingshi(B, lingshi);
        await Xiuxian.Worldwealth(lingshi * cost);
        e.reply([segment.at(A), segment.at(B), `${B_player.name} 获得了由 ${A_player.name}赠送的${lingshi}灵石`])
        await redis.set("xiuxian:player:" + A + ":last_getbung_time", nowTime);
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
        if (!isNaN(parseFloat(lingshi)) && isFinite(lingshi)) {
        } else {
            return;
        }
        if (!isNaN(parseFloat(acount)) && isFinite(acount)) {
        } else {
            return;
        }
        lingshi = Number(lingshi);
        acount = Number(acount);
        lingshi = Math.trunc(lingshi);
        acount = Math.trunc(acount);
        if (lingshi <= 0 || acount <= 0) {
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


        /**
         * 状态
         */


        /**
         * cd
         */

        


        let player = await data.getData("player", usr_qq);
        let now_time = new Date().getTime();
        let lastgetbung_time = await redis.get("xiuxian:player:" + usr_qq + ":last_getbung_time");
        lastgetbung_time = parseInt(lastgetbung_time);
        let transferTimeout = parseInt(this.xiuxianConfigData.CD.honbao * 60000)
        if (now_time < lastgetbung_time + transferTimeout) {
            let waittime_m = Math.trunc((lastgetbung_time + transferTimeout - now_time) / 60 / 1000);
            let waittime_s = Math.trunc(((lastgetbung_time + transferTimeout - now_time) % 60000) / 1000);
            e.reply(`每${transferTimeout / 1000 / 60}分钟抢一次，正在CD中，` + `剩余cd: ${waittime_m}分${waittime_s}秒`);
            return;
        }



        let B = await Xiuxian.At(e);
        if(B==0){
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
        var pattern = new RegExp("[0-9]+");
        var str = lingshi;
        if (!pattern.test(str)) {
            e.reply(`错误福利`);
            return;
        }
        if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) > 0) {
            lingshi = parseInt(lingshi);
        }
        else {
            lingshi = 100;//没有输入正确数字或不是正数
        }
        let File = fs.readdirSync(Xiuxian.__PATH.player);
        File = File.filter(file => file.endsWith(".json"));
        let File_length = File.length;

        await Xiuxian.Worldwealth(- lingshi * File_length);

        for (var i = 0; i < File_length; i++) {
            let this_qq = File[i].replace(".json", '');
            await Xiuxian.Add_lingshi(this_qq, lingshi);
        }
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
        var pattern = new RegExp("[0-9]+");灵石
        var str = lingshi;
        if (!pattern.test(str)) {
            e.reply(`错误福利`);
            return;
        }
        if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) > 0) {
            lingshi = parseInt(lingshi);
        }
        else {
            lingshi = 100;//没有输入正确数字或不是正数
        }


        let isat = e.message.some((item) => item.type === "at");
        if (!isat) {
            return;
        }
        let atItem = e.message.filter((item) => item.type === "at");
        let this_qq = atItem[0].qq;
        let ifexistplay = await Xiuxian.existplayer(this_qq);
        if (!ifexistplay) {
            e.reply(`此人尚未踏入仙途`);
            return;
        }



        let Worldmoney = await redis.get("Xiuxian:Worldmoney");
        Worldmoney = await Xiuxian.Numbers(Worldmoney);
        if (Worldmoney <= lingshi) {
            e.reply("世界财富不足！");
            return;
        }
        await Xiuxian.Worldwealth(- lingshi);
        let player = await data.getData("player", this_qq);
        await Xiuxian.Add_lingshi(this_qq, lingshi);
        e.reply(` ${player.name} 获得${lingshi}灵石的补偿`);
        return;
    }


    async openwallet(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = await data.getData("player", usr_qq);
        let thing_name = "水脚脚的钱包"
        let acount = await Xiuxian.exist_najie_thing(usr_qq, thing_name, "装备");
        if (!acount) {
            e.reply(`你没有[${thing_name}]这样的装备`);
            return;
        }
        await Xiuxian.Add_najie_thing(usr_qq, thing_name, "装备", -1);
        var x = 0.4;
        let random1 = Math.random();
        var y = 0.3;
        let random2 = Math.random();
        var z = 0.2
        let random3 = Math.random();
        var p = 0.1
        let random4 = Math.random();
        var m = "";
        var lingshi = 0;
        if (random1 < x) {
            if (random2 < y) {
                if (random3 < z) {
                    if (random4 < p) {
                        lingshi = 1000000;
                        m = player.name + "打开了[" + thing_name + "]你很开心的得到了" + lingshi + "灵石";
                    } else {
                        lingshi = 100000;
                        m = player.name + "打开了[" + thing_name + "]你很开心的得到了" + lingshi + "灵石";
                    }
                }
                else {
                    lingshi = 10000;
                    m = player.name + "打开了[" + thing_name + "]你很开心的得到了" + lingshi + "灵石";
                }
            }
            else {
                lingshi = 1000;
                m = player.name + "打开了[" + thing_name + "]你很开心的得到了" + lingshi + "灵石";
            }
        }
        else {
            lingshi = 100;
            m = player.name + "打开了[" + thing_name + "]你很开心的得到了" + lingshi + "灵石";
        }
        await Xiuxian.Add_lingshi(usr_qq, lingshi);
        e.reply(m);
        return;
    }

}
