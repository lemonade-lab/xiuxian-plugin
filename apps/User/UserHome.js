//插件加载
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
import { get_equipment_img } from '../ShowImeg/showData.js'
import { segment } from "oicq"
/**
 * 全局变量
 */
/**
 * 货币与物品操作模块
 */
export class UserHome extends plugin {
    constructor() {
        super({
            name: 'UserHome',
            dsc: 'UserHome',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#(存|取)灵石(.*)$',
                    fnc: 'Take_lingshi'
                },
                {
                    reg: '^#(装备|消耗|服用|学习)((.*)|(.*)*(.*))$',
                    fnc: 'Player_use'
                },
                {
                    reg: '^#购买((.*)|(.*)*(.*))$',
                    fnc: 'Buy_comodities'
                },
                {
                    reg: '^#出售((.*)|(.*)*(.*))$',
                    fnc: 'Sell_comodities'
                },
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }


    async Take_lingshi(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        var reg = new RegExp(/取|存/);
        let func = reg.exec(e.msg);
        let msg = e.msg.replace(reg, '');
        msg = msg.replace("#", '');
        let lingshi = msg.replace("灵石", '');
        if (lingshi == "全部") {
            let P = await Xiuxian.Read_player(usr_qq);
            lingshi = P.lingshi;

        }

        lingshi=await Xiuxian.Numbers(lingshi);

        if (func == "存") {
            let player_lingshi = await Xiuxian.Read_player(usr_qq);
            player_lingshi = player_lingshi.lingshi;
            if (player_lingshi < lingshi) {
                e.reply([segment.at(usr_qq), `灵石不足,你目前只有${player_lingshi}灵石`]);
                return;
            }
            let najie = await Xiuxian.Read_najie(usr_qq);
            if (najie.lingshimax < najie.lingshi + lingshi) {
                await Xiuxian.Add_najie_lingshi(usr_qq, najie.lingshimax - najie.lingshi);
                await Xiuxian.Add_lingshi(usr_qq, -najie.lingshimax + najie.lingshi);
                e.reply([segment.at(usr_qq), `已为您放入${najie.lingshimax - najie.lingshi}灵石,储物袋存满了`]);
                return;
            }
            await Xiuxian.Add_najie_lingshi(usr_qq, lingshi);
            await Xiuxian.Add_lingshi(usr_qq, -lingshi);
            e.reply([segment.at(usr_qq), `储存完毕,你目前还有${player_lingshi - lingshi}灵石,储物袋内有${najie.lingshi + lingshi}灵石`]);
            return;
        }

        if (func == "取") {
            let najie = await Xiuxian.Read_najie(usr_qq);
            if (najie.lingshi < lingshi) {
                e.reply([segment.at(usr_qq), `储物袋灵石不足,你目前最多取出${najie.lingshi}灵石`]);
                return;
            }
            let player_lingshi = await Xiuxian.Read_player(usr_qq);
            player_lingshi = player_lingshi.lingshi;
            await Xiuxian.Add_najie_lingshi(usr_qq, -lingshi);
            await Xiuxian.Add_lingshi(usr_qq, lingshi);
            e.reply([segment.at(usr_qq), `本次取出灵石${lingshi},你的储物袋还剩余${najie.lingshi - lingshi}灵石`]);
            return;
        }

        return;
    }

    async Player_use(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;

        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }

        let player = await Xiuxian.Read_player(usr_qq);

        var reg = new RegExp(/装备|服用|消耗|学习/);
        let func = reg.exec(e.msg);

        let msg = e.msg.replace(reg, '');
        msg = msg.replace("#", '');
        let code = msg.split("\*");
        let thing_name = code[0];
        let quantity = 0;

        if (parseInt(code[1]) != parseInt(code[1])) {
            quantity = 1;
        }
        else if (parseInt(code[1]) < 1) {
            return;
        }
        else {
            quantity = parseInt(code[1]);
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
        if (najie_thing.acount < quantity) {
            e.reply("数量不足，你只有" + najie_thing.acount);
            return;
        }

        if (func == "装备") {
            let equipmen=await Xiuxian.instead_equipment(usr_qq,searchsthing.id,searchsthing.class,searchsthing.type);
            if(equipmen==1){
                //重复装备
                return;
            }
            let img = await get_equipment_img(e);
            e.reply(img);
        }
        if (func == "服用") {
            if (searchsthing.type == 1) {
                let blood = parseInt(quantity * searchsthing.HP);
                await Xiuxian.Add_HP(usr_qq, blood);
                e.reply(`血量恢复${blood} `);
            }
            if (searchsthing.type == 2) {
                let experience = parseInt(searchsthing.exp);
                await Xiuxian.Add_experience(usr_qq, quantity * experience);
                e.reply(`修为增加${quantity * this_danyao.exp}`);
            }
        }

        if (func == "消耗") {
            //隐身水
            if (searchsthing.type == 1) {
                e.reply([segment.at(usr_qq), "无法在储物袋中消耗"]);
                return;
            }
            //洗根水
            if (searchsthing.type == 2) {
                if (await player.linggenshow != 0) {
                    e.reply([segment.at(usr_qq), "未显灵根，无法洗髓"]);
                    return;
                }
                let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
                if (now_level_id > 21) {
                    e.reply([segment.at(usr_qq), "灵根已定，不可洗髓"]);
                    return;
                }
                let newtalent = await Xiuxian.get_talent();
                player.talent = newtalent;
                await Xiuxian.Write_player(usr_qq, player);
                /**
                 * 重计算天赋
                 */
                await Xiuxian.player_efficiency(usr_qq);
                e.reply([segment.at(usr_qq), "使用成功"]);
            }
            //望灵珠
            if (searchsthing.type == 3) {
                player.talentshow = 0;
                await Xiuxian.Write_player(usr_qq, player);
                e.reply([segment.at(usr_qq), "显示成功"]);
            }
        }

        if (func == "学习") {
            let player = await Xiuxian.Read_player(usr_qq);
            let islearned = player.AllSorcery.find(item => item == searchsthing.id);
            if (islearned) {
                e.reply([segment.at(usr_qq), "学过了"]);
                return;
            }
            //添加功法
            await Xiuxian.Add_player_AllSorcery(usr_qq, searchsthing.id);
            await Xiuxian.player_efficiency(usr_qq);
            e.reply([segment.at(usr_qq), "学习成功"]);
        }
        await Xiuxian.Add_najie_thing(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type, -quantity);
        return;
    }



    //购买商品
    async Buy_comodities(e) {
        if (!e.isGroup) {
            return;
        }

        let usr_qq = e.user_id;

        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }

        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
        if (game_action == 0) {
            e.reply("游戏进行中...");
           return;
        }

        let thing = e.msg.replace("#", '');
        thing = thing.replace("购买", '');
        let code = thing.split("\*");
        let thing_name = code[0];
        let quantity = 0;

        quantity=await Xiuxian.Numbers(code[1]);

        if (quantity > 99) {
            quantity = 99;
        }

        let ifexist = data.commodities_list.find(item => item.name == thing_name);
        if (!ifexist) {
            e.reply(`柠檬堂不卖:${thing_name}`);
            return;
        }
        let player = await Xiuxian.Read_player(usr_qq);
        let lingshi = player.lingshi;
        if (lingshi <= 0) {
            e.reply(`掌柜：就你这穷酸样，也想来柠檬堂？走走走！`);
            return;
        }
        let commodities_price = ifexist.price * 1.2 * quantity;
        if (lingshi < commodities_price) {
            e.reply(`灵石不足`);
            return;
        }

        let commodities = ifexist.price * 1.2 * quantity;
        await Xiuxian.Worldwealth(commodities);
        await Xiuxian.Add_najie_thing(usr_qq, ifexist.id, ifexist.class, ifexist.type, quantity);
        await Xiuxian.Add_lingshi(usr_qq, -commodities_price);
        e.reply(`你花[${commodities_price}]灵石购买了[${thing_name}]*${quantity},`);

        
        /**
          * 一级类型
          * 武器：1  
          * 护具：2 
          * 法宝：3   
          * 丹药：4   
          * 功法：5   
          * 道具：6   
          * 戒指：7
          */
        return;
    }


    //出售商品
    async Sell_comodities(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        
        let usr_qq = e.user_id;
        let thing = e.msg.replace("#", '');
        thing = thing.replace("出售", '');
        let code = thing.split("\*");
        let thing_name = code[0];
        let quantity = 0;

        quantity=await Xiuxian.Numbers(code[1]);
        if (quantity > 99) {
            quantity = 99;
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
        if (najie_thing.acount < quantity) {
            e.reply("数量不足，你只有" + najie_thing.acount);
            return;
        }

        await Xiuxian.Add_najie_thing(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type, -quantity);
        let commodities_price = searchsthing.price * quantity;
        await Xiuxian.Add_lingshi(usr_qq, commodities_price);
        e.reply(`出售获得${commodities_price}灵石 `);
        return;
    }
}
