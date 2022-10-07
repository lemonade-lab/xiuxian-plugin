
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import fs from "fs"
import path from "path"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
/**
 * 全局变量
 */
/**
 * 交易系统
 */
export class Exchange extends plugin {
    constructor() {
        super({
            name: 'Exchange',
            dsc: '交易模块',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#冲水堂$',
                    fnc: 'supermarket'
                },
                {
                    reg: '^#上架.*$',
                    fnc: 'onsell'
                },
                {
                    reg: '^#下架.*$',
                    fnc: 'Offsell'
                },
                {
                    reg: '^#选购.*$',
                    fnc: 'purchase'
                }
            ]
        })
    }

    async Offsell(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;


        let Ex = await redis.get("xiuxian:player:" + usr_qq + ":Exchange");
        if (Ex != 1) {
            e.reply("没有上架物品！");
            return;
        }
        var time0 = 2;
        let now_time = new Date().getTime();
        let ExchangeCD = await redis.get("xiuxian:player:" + usr_qq + ":ExchangeCD");
        ExchangeCD = parseInt(ExchangeCD);
        let transferTimeout = parseInt(60000 * time0)
        if (now_time < ExchangeCD + transferTimeout) {
            let ExchangeCDm = Math.trunc((ExchangeCD + transferTimeout - now_time) / 60 / 1000);
            let ExchangeCDs = Math.trunc(((ExchangeCD + transferTimeout - now_time) % 60000) / 1000);
            e.reply(`每${transferTimeout / 1000 / 60}操作一次，` + `CD: ${ExchangeCDm}分${ExchangeCDs}秒`);
            return;
        }


        await redis.set("xiuxian:player:" + usr_qq + ":ExchangeCD", now_time);
        let player = await Xiuxian.Read_player(usr_qq);
        let now_level_id;
        now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 9) {
            e.reply("境界过低！");
            return;
        }


        let thingqq = e.msg.replace("#", '');
        thingqq = thingqq.replace("下架", '');
        if (thingqq == "") {
            return;
        }

        let x = 888888888;
        let Exchange;
        try {
            Exchange = await Read_Exchange();
        }
        catch {
            await Write_Exchange([]);
            Exchange = await Read_Exchange();
        }
        for (var i = 0; i < Exchange.length; i++) {
            if (Exchange[i].qq == thingqq) {
                x = i;
                break;
            }
        }

        if (x == 888888888) {
            e.reply("找不到该商品编号！");
            return;
        }


        let nowtime = new Date().getTime();
        let end_time = Exchange[x].end_time;
        let time = (end_time - nowtime) / 60000;
        time = Math.trunc(time);

        if (time <= 0) {
            if (thingqq != usr_qq) {
                return;
            }

            if (player.lingshi <= 50000) {
                e.reply("下架物品至少上交1w");
                return;
            }


            let thing_name = Exchange[x].name.name;
            let thing_class = Exchange[x].name.class;
            let thing_aconut = Exchange[x].aconut;
            await Xiuxian.Add_najie_thing(usr_qq, thing_name, thing_class, thing_aconut);
            Exchange = Exchange.filter(item => item.qq != thingqq);
            await Write_Exchange(Exchange);

            await Xiuxian.Add_lingshi(usr_qq, -50000);
            await redis.set("xiuxian:player:" + thingqq + ":Exchange", 0);
            e.reply(player.name + "赔10W保金！并下架" + thingqq + "成功！");
            let addWorldmoney = 50000;

            let Worldmoney = await redis.get("Xiuxian:Worldmoney");
            if (Worldmoney == null || Worldmoney == undefined || Worldmoney <= 0 || Worldmoney == NaN) {
                Worldmoney = 1;
            }

            Worldmoney = Number(Worldmoney);
            Worldmoney = Worldmoney + addWorldmoney;
            Worldmoney = Number(Worldmoney);
            await redis.set("Xiuxian:Worldmoney", Worldmoney);
        }
        else {
            e.reply("物品冷却中...");
        }
        return;
    }

    //上架
    async onsell(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let Ex = await redis.get("xiuxian:player:" + usr_qq + ":Exchange");
        if (Ex == 1) {
            e.reply("已有上架物品");
            return;
        }
        let thing = e.msg.replace("#", '');
        thing = thing.replace("上架", '');
        let code = thing.split("\*");
        let thing_name = code[0];//物品
        let thing_value = code[1];//价格
        let thing_acunot = code[2];//数量

        /**
         * 强制修正至少为1
         */
        thing_value=Xiuxian.Numbers(thing_value);
        thing_acunot=Xiuxian.Numbers(thing_acunot);
        if (thing_acunot > 99) {
            return;
        }

        var z = 0;
        let ifexist0 = data.danyao_list.find(item => item.name == thing_name);
        let ifexist1 = data.daoju_list.find(item => item.name == thing_name);
        let ifexist2 = data.gongfa_list.find(item => item.name == thing_name);
        let ifexist3 = data.equipment_list.find(item => item.name == thing_name);
        let ifexist4 = data.timegongfa_list.find(item => item.name == thing_name);
        let ifexist5 = data.timeequipmen_list.find(item => item.name == thing_name);
        let ifexist6 = data.timedanyao_list.find(item => item.name == thing_name);
        if (ifexist0) {
            ifexist0 = ifexist0;
        }
        else if (ifexist1) {
            ifexist0 = ifexist1;
            z = 1;
        }
        else if (ifexist2) {
            ifexist0 = ifexist2;
            z = 2;
        }
        else if (ifexist3) {
            ifexist0 = ifexist3;
            z = 3;
        }
        else if (ifexist4) {
            ifexist0 = ifexist4;
            z = 4;

        }
        else if (ifexist5) {
            ifexist0 = ifexist5;
            z = 5;
        }
        else if (ifexist6) {
            ifexist0 = ifexist6;
            z = 5;
        }
        else {
            e.reply(`这方世界没有[${thing_name}]`);
            return;
        }
        //判断戒指中是否存在
        let thing_quantity = await Xiuxian.exist_najie_thing(usr_qq, thing_name, ifexist0.class);
        if (!thing_quantity) {//没有
            e.reply(`你没有[${thing_name}]这样的${ifexist0.class}`);
            return;
        }
        //判断戒指中的数量
        if (thing_quantity < thing_acunot) {//不够
            e.reply(`你目前只有[${thing_name}]*${thing_quantity}`);
            return;
        }
        //修正数值非整数
        thing_value = Math.trunc(thing_value);//价格
        thing_acunot = Math.trunc(thing_acunot)//数量
        if (z >= 4) {
            if (thing_value <= 100000 && thing_value > 100000000) {
                e.reply("限定物品错误价格");
                return;
            }
        }
        else {
            if (thing_value <= ifexist0.price * 0.8) {
                e.reply("价格过低");
                return;
            }
            if (thing_value >= ifexist0.price * 3) {
                e.reply("价格过高");
                return;
            }
        }

        await Xiuxian.Add_najie_thing(usr_qq, thing_name, ifexist0.class, -thing_acunot);
        let Exchange;
        try {
            Exchange = await Read_Exchange();
        }
        catch {
            await Write_Exchange([]);
            Exchange = await Read_Exchange();
        }
        let now_time = new Date().getTime();
        let whole = thing_value * thing_acunot;
        whole = Math.trunc(whole);
        let time = 10;
        let wupin = {
            "qq": usr_qq,
            "name": ifexist0,
            "price": thing_value,
            "aconut": thing_acunot,
            "whole": whole,
            "now_time": now_time,
            "end_time": now_time + 60000 * time
        };
        Exchange.push(wupin);
        await Write_Exchange(Exchange);
        e.reply("上架成功！");
        await redis.set("xiuxian:player:" + usr_qq + ":Exchange", 1);
        return;
    }


    async supermarket(e) {
        if (!e.isGroup) {
            return;
        }
        let Exchange;
        try {
            Exchange = await Read_Exchange();
        }
        catch {
            await Write_Exchange([]);
            Exchange = await Read_Exchange();
        }

        let nowtime = new Date().getTime();
        let msg = [
            "___[冲水堂]___\n#上架+物品名*价格*数量\n#选购+编号\n#下架+编号\n不填数量，默认为1"
        ];
        for (var i = 0; i < Exchange.length; i++) {
            let time = (Exchange[i].end_time - nowtime) / 60000;
            if (time <= 0) {
                time = 0;
            }
            time = Math.trunc(time);
            msg.push(
                "编号：" + Exchange[i].qq +
                "\n物品：" + Exchange[i].name.name +
                "\n类型：" + Exchange[i].name.class +
                "\n价格：" + Exchange[i].price +
                "\n数量：" + Exchange[i].aconut +
                "\n总价：" + Exchange[i].whole +
                "\n冷却：" + time + "分钟");
        }
        await Xiuxian.ForwardMsg(e, msg);
        return;
    }


    async purchase(e) {
        let usr_qq = e.user_id;
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        var time0 = 2;
        let now_time = new Date().getTime();
        let ExchangeCD = await redis.get("xiuxian:player:" + usr_qq + ":ExchangeCD");
        ExchangeCD = parseInt(ExchangeCD);
        let transferTimeout = parseInt(60000 * time0)
        if (now_time < ExchangeCD + transferTimeout) {
            let ExchangeCDm = Math.trunc((ExchangeCD + transferTimeout - now_time) / 60 / 1000);
            let ExchangeCDs = Math.trunc(((ExchangeCD + transferTimeout - now_time) % 60000) / 1000);
            e.reply(`每${transferTimeout / 1000 / 60}操作一次，` + `CD: ${ExchangeCDm}分${ExchangeCDs}秒`);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ":ExchangeCD", now_time);
        let player = await Xiuxian.Read_player(usr_qq);
        let now_level_id;
        now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 9) {
            e.reply("境界过低");
            return;
        }
        let thingqq = e.msg.replace("#", '');
        thingqq = thingqq.replace("选购", '');
        if (thingqq == "") {
            return;
        }
        let x = 888888888;
        let Exchange;
        try {
            Exchange = await Read_Exchange();
        }
        catch {
            await Write_Exchange([]);
            Exchange = await Read_Exchange();
        }
        for (var i = 0; i < Exchange.length; i++) {
            if (Exchange[i].qq == thingqq) {
                x = i;
                break;
            }
        }
        if (x == 888888888) {
            e.reply("找不到该商品编号！");
            return;
        }
        let nowtime = new Date().getTime();
        let end_time = Exchange[x].end_time;
        let time = (end_time - nowtime) / 60000;
        time = Math.trunc(time);
        if (time <= 0) {
            let thing_name = Exchange[x].name.name;
            let thing_class = Exchange[x].name.class;
            let thing_whole = Exchange[x].whole;
            let thing_aconut = Exchange[x].aconut;
            if (player.lingshi > thing_whole) {
                await Xiuxian.Add_najie_thing(usr_qq, thing_name, thing_class, thing_aconut);
                await Xiuxian.Add_lingshi(usr_qq, -thing_whole);
                let addWorldmoney = thing_whole * 0.1;
                thing_whole = thing_whole * 0.9;
                thing_whole = Math.trunc(thing_whole);
                await Xiuxian.Add_lingshi(thingqq, thing_whole);
                Exchange = Exchange.filter(item => item.qq != thingqq);
                await Write_Exchange(Exchange);
                await redis.set("xiuxian:player:" + thingqq + ":Exchange", 0);
                e.reply(player.name + "选购" + thingqq + "成功！");
                let Worldmoney = await redis.get("Xiuxian:Worldmoney");
                if (Worldmoney == null || Worldmoney == undefined || Worldmoney <= 0 || Worldmoney == NaN) {
                    Worldmoney = 1;
                }
                Worldmoney = Number(Worldmoney);
                Worldmoney = Worldmoney + addWorldmoney;
                Worldmoney = Number(Worldmoney);
                await redis.set("Xiuxian:Worldmoney", Worldmoney);
            }
            else {
                e.reply("醒醒，你没有那么多钱！");
                return;
            }
        }
        else {
            e.reply("物品冷却中...");
        }
        return;
    }
}

//写入交易表
export async function Write_Exchange(wupin) {
    let dir = path.join(Xiuxian.__PATH.Exchange, `Exchange.json`);
    let new_ARR = JSON.stringify(wupin, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}



//读交易表
export async function Read_Exchange() {
    let dir = path.join(`${Xiuxian.__PATH.Exchange}/Exchange.json`);
    let Exchange = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    //将字符串数据转变成数组格式
    Exchange = JSON.parse(Exchange);
    return Exchange;
}

