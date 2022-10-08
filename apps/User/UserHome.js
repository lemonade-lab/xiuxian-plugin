//插件加载
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'

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
                    reg: '^#装备.*$',
                    fnc: 'Player_use_equipment'
                },
                {
                    reg: '^#服用.*$',
                    fnc: 'Player_use_danyao'
                },
                {
                    reg: '^#学习.*$',
                    fnc: 'Player_use_gonfa'
                },
                {
                    reg: '^#消耗.*$',
                    fnc: 'Player_use_daoju'
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

    async Player_use_equipment(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#装备", '');
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
        await Xiuxian.instead_equipment(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type);
        e.reply("成功装备！"+thing_name);
        return;
    }

    async Player_use_danyao(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#学习", '');
        let code = thing_name.split("\*");

        thing_name=code[0];
        let thing_acount=code[1];
        thing_acount = await Xiuxian.Numbers(thing_acount);

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

        if (najie_thing.acount < thing_acount) {
            e.reply("数量不足，你只有" + najie_thing.acount);
            return;
        }

        if (searchsthing.type == 1) {
            let blood = parseInt(thing_acount * searchsthing.HP);
            await Xiuxian.Add_HP(usr_qq, blood);
            e.reply(`血量恢复${blood} `);
        }

        if (searchsthing.type == 2) {
            let experience = parseInt(searchsthing.exp);
            await Xiuxian.Add_experience(usr_qq, thing_acount * experience);
            e.reply(`修为增加${thing_acount * this_danyao.exp}`);
        }

        await Xiuxian.Add_najie_thing(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type, -thing_acount);
        
        return;
    }

    async Player_use_gonfa(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#学习", '');
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
        let player = await Xiuxian.Read_player(usr_qq);
        let islearned = player.AllSorcery.find(item => item == searchsthing.id);
        if (islearned) {
            e.reply("学过了");
            return;
        }
        //添加功法
        await Xiuxian.Add_player_AllSorcery(usr_qq, searchsthing.id);
        await Xiuxian.player_efficiency(usr_qq);
        e.reply("学习成功"+thing_name);

        await Xiuxian.Add_najie_thing(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type, -1);
        
        return;
    }


    async Player_use_daoju(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#学习", '');
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
        let player = await Xiuxian.Read_player(usr_qq);
        let islearned = player.AllSorcery.find(item => item == searchsthing.id);
        if (islearned) {
            e.reply("学过了");
            return;
        }

        //隐身水
        if (searchsthing.type == 1) {
            e.reply("无法在储物袋中消耗");
            return;
        }
        //洗根水
        if (searchsthing.type == 2) {
            if (await player.linggenshow != 0) {
                e.reply("未显灵根，无法洗髓");
                return;
            }
            let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
            if (now_level_id > 21) {
                e.reply( "灵根已定，不可洗髓");
                return;
            }
            let newtalent = await Xiuxian.get_talent();
            player.talent = newtalent;
            await Xiuxian.Write_player(usr_qq, player);
            /**
             * 重计算天赋
             */
            await Xiuxian.player_efficiency(usr_qq);
            e.reply("使用成功");
        }
        //望灵珠
        if (searchsthing.type == 3) {
            player.talentshow = 0;
            await Xiuxian.Write_player(usr_qq, player);
            e.reply("显示成功");
        }
        await Xiuxian.Add_najie_thing(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type, -1);
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
        let quantity = await Xiuxian.Numbers(code[1]);
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
        e.reply(`你花[${commodities_price}]灵石购买了[${thing_name}]*${quantity},`);
        
        let commodities = ifexist.price * 1.2 * quantity;


        await Xiuxian.Add_najie_thing(usr_qq, ifexist.id, ifexist.class, ifexist.type, quantity);

        await Xiuxian.Add_lingshi(usr_qq, -commodities_price);
        await Xiuxian.Worldwealth(commodities);
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
        let quantity  = await Xiuxian.Numbers(code[1]);
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
