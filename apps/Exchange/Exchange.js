
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
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


    async supermarket(e) {
        if (!e.isGroup) {
            return;
        }
        let Exchange = await Xiuxian.Read_Exchange();
        let nowtime = new Date().getTime();
        let msg = [
            "___[冲水堂]___\n#上架+物品名*价格*数量\n#选购+编号\n#下架+编号\n不填数量，默认为1"
        ];
        for (var i = 0; i < Exchange.length; i++) {
            let time = (Exchange[i].end_time - nowtime) / 60000;
            if (time <= 0) {
                time = 0;
            }
            let classname = await Xiuxian.classname(Exchange[i].class);
            time = Math.trunc(time);
            msg.push(
                "编号：" + Exchange[i].qq +
                "\n物品：" + Exchange[i].name +
                "\n类型：" + classname +
                "\n价格：" + Exchange[i].price +
                "\n数量：" + Exchange[i].aconut +
                "\n总价：" + Exchange[i].whole +
                "\n冷却：" + time + "分钟");
        }
        await Xiuxian.ForwardMsg(e, msg);
        return;
    }

   
    //上架
    async onsell(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let ClassCD = ":ExchangeCD";
        let now_time = new Date().getTime();
        let CDTime = 2;
        let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if(CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);
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
        thing_value = await Xiuxian.Numbers(thing_value);
        thing_acunot = await Xiuxian.Numbers(thing_acunot);
        if ( thing_acunot < 1 || thing_acunot > 99) {
            thing_acunot=1;
        }
        let searchsthing = await Xiuxian.search_thing(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        }
        let najie_thing = await Xiuxian.exist_najie_thing(usr_qq, searchsthing.id, searchsthing.class);
        if (najie_thing == 1) {
            e.reply(`你没有[${thing_name}]`);
            return;
        }
        if (najie_thing.acount < thing_acunot) {
            e.reply("数量不足，你只有" + najie_thing.acount);
            return;
        }
        if(najie_thing.class==1){ 
            await Xiuxian.Add_najie_thing_arms(usr_qq, najie_thing.id, najie_thing.class, najie_thing.type, -thing_acunot);
        }
        else if(najie_thing.class==2){ 
            await Xiuxian.Add_najie_thing_huju(usr_qq, najie_thing.id, najie_thing.class, najie_thing.type, -thing_acunot);
        }
        else if(najie_thing.class==3){ 
            await Xiuxian.Add_najie_thing_fabao(usr_qq, najie_thing.id, najie_thing.class, najie_thing.type, -thing_acunot);
        }
        else if(najie_thing.class==4){ 
            await Xiuxian.Add_najie_thing_danyao(usr_qq, najie_thing.id, najie_thing.class, najie_thing.type, -thing_acunot);
        }
        else if(najie_thing.class==5){ 
            await Xiuxian.Add_najie_thing_gonfa(usr_qq, najie_thing.id, najie_thing.class, najie_thing.type, -thing_acunot);
        }
        else if(najie_thing.class==6){ 
            await Xiuxian.Add_najie_thing_daoju(usr_qq, najie_thing.id, najie_thing.class, najie_thing.type, -thing_acunot);
        }
        else if(najie_thing.class==7){ 
            await Xiuxian.Add_najie_thing_ring(usr_qq, najie_thing.id, najie_thing.class, najie_thing.type, -thing_acunot);
        }
        let Exchange = await Xiuxian.Read_Exchange();
        let whole = thing_value * thing_acunot;
        whole = await Xiuxian.Numbers(whole);
        let time = 10;
        let wupin = {
            "qq": usr_qq,
            "name": searchsthing.name,
            "id": searchsthing.id,
            "class": searchsthing.class,
            "type": searchsthing.type,
            "price": searchsthing.price,
            "aconut": thing_acunot,
            "whole": whole,
            "end_time": now_time + 60000 * time
        };
        Exchange.push(wupin);
        await Xiuxian.Write_Exchange(Exchange);
        e.reply("上架成功！");
        await redis.set("xiuxian:player:" + usr_qq + ":Exchange", 1);
        return;
    }



    async Offsell(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let ClassCD = ":ExchangeCD";
        let now_time = new Date().getTime();
        let CDTime = 2;
        let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if(CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);
        let Ex = await redis.get("xiuxian:player:" + usr_qq + ClassCD);
        if (Ex != 1) {
            e.reply("没有上架物品！");
            return;
        }
        let player = await Xiuxian.Read_player(usr_qq);
        let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 9) {
            e.reply("境界过低！");
            return;
        }
        let thingqq = e.msg.replace("#", '');
        thingqq = thingqq.replace("下架", '');
        let x = await Xiuxian.Search_Exchange(thingqq);
        if(x == -1){
            return;
        }
        let Exchange  = await Xiuxian.Read_Exchange();

        let end_time = Exchange[x].end_time;
        let time = (end_time - now_time) / 60000;
        time = Math.trunc(time);

        if (time <= 0) {
            if (thingqq != usr_qq) {
                return;
            }
            if (player.lingshi <= 20000) {
                e.reply("下架物品至少上交1w");
                return;
            }
            if(Exchange[x].class==1){ 
                await Xiuxian.Add_najie_thing_arms(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
            }
            else if(Exchange[x].class==2){ 
                await Xiuxian.Add_najie_thing_huju(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
            }
            else if(Exchange[x].class==3){ 
                await Xiuxian.Add_najie_thing_fabao(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
            }
            else if(Exchange[x].class==4){ 
                await Xiuxian.Add_najie_thing_danyao(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
            }
            else if(Exchange[x].class==5){ 
                await Xiuxian.Add_najie_thing_gonfa(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
            }
            else if(Exchange[x].class==6){ 
                await Xiuxian.Add_najie_thing_daoju(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
            }
            else if(Exchange[x].class==7){ 
                await Xiuxian.Add_najie_thing_ring(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
            }
            Exchange = Exchange.filter(item => item.qq != thingqq);
            await Xiuxian.Write_Exchange(Exchange);
            await Xiuxian.Add_lingshi(usr_qq, -20000);
            await redis.set("xiuxian:player:" + thingqq + ":Exchange", 0);
            e.reply(player.name + "赔20000保金！并下架" + thingqq + "成功！");
            await Xiuxian.Worldwealth(addWorldmoney);
        }
        else {
            e.reply("物品冷却中...");
        }
        return;
    }


  


    async purchase(e) {
        let usr_qq = e.user_id;
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let ClassCD = ":ExchangeCD";
        let now_time = new Date().getTime();
        let CDTime = 2;
        let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if(CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);

        let player = await Xiuxian.Read_player(usr_qq);
        let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 9) {
            e.reply("境界过低");
            return;
        }

        let thingqq = e.msg.replace("#", '');
        thingqq = thingqq.replace("选购", '');
        let x = await Xiuxian.Search_Exchange(thingqq);
        if(x == -1){
            return;
        }
        let Exchange  = await Xiuxian.Read_Exchange();
        
        let nowtime = new Date().getTime();
        let end_time = Exchange[x].end_time;
        let time = (end_time - nowtime) / 60000;
        time = await Xiuxian.Numbers(time);

        if (time <= 0) {
            let thing_whole = Exchange[x].whole;
            if (player.lingshi > thing_whole) {
                if(Exchange[x].class==1){ 
                    await Xiuxian.Add_najie_thing_arms(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
                }
                else if(Exchange[x].class==2){ 
                    await Xiuxian.Add_najie_thing_huju(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
                }
                else if(Exchange[x].class==3){ 
                    await Xiuxian.Add_najie_thing_fabao(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
                }
                else if(Exchange[x].class==4){ 
                    await Xiuxian.Add_najie_thing_danyao(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
                }
                else if(Exchange[x].class==5){ 
                    await Xiuxian.Add_najie_thing_gonfa(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
                }
                else if(Exchange[x].class==6){ 
                    await Xiuxian.Add_najie_thing_daoju(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
                }
                else if(Exchange[x].class==7){ 
                    await Xiuxian.Add_najie_thing_ring(usr_qq, Exchange[x].id, Exchange[x].class, Exchange[x].type,Exchange[x].aconut);
                }
                await Xiuxian.Add_lingshi(usr_qq, -thing_whole);
                let addWorldmoney = thing_whole * 0.1;
                thing_whole = thing_whole * 0.9;
                thing_whole = await Xiuxian.Numbers(thing_whole)
                await Xiuxian.Add_lingshi(thingqq, thing_whole);
                Exchange = Exchange.filter(item => item.qq != thingqq);
                await Xiuxian.Write_Exchange(Exchange);
                await redis.set("xiuxian:player:" + thingqq + ":Exchange", 0);
                await Xiuxian.Worldwealth(addWorldmoney);
                e.reply(player.name + "选购" + thingqq + "成功！");
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





