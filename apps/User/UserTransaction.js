import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import { Numbers,Read_wealth,Add_lingshi,exist_najie_thing,Add_najie_thing,
    search_thing_name,existplayer,ForwardMsg,__PATH,Read_najie,Write_najie } from '../Xiuxian/Xiuxian.js'

export class UserTransaction extends plugin {
    constructor() {
        super({
            name: 'UserTransaction',
            dsc: 'UserTransaction',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#购买.*$',
                    fnc: 'Buy_comodities'
                },
                {
                    reg: '^#出售.*$',
                    fnc: 'Sell_comodities'
                },
                {
                    reg: "^#凡仙堂$",
                    fnc: "ningmenghome",
                },
            ]
        })
    }

    async ningmenghome(e) {
        let usr_qq = e.user_id;
        let ifexistplay = data.existData("player", usr_qq);
        if (!ifexistplay) {
            return;
        }
        let msg = [
            "___[凡仙堂]___\n#购买+物品名"
        ];
        let commodities_list = data.commodities_list;
        commodities_list.forEach((item) => {
            msg.push(
                "物品：" + item.name +
                "\n攻击：+" + item.attack  +
                "\n防御：+" + item.defense +
                "\n血量：+" + item.blood +
                "\n敏捷：+" + item.speed+
                "\n暴击：+" + item.burst+"%"+
                "\n暴伤：+" + item.burstmax+"%"+
                "\n天赋：+" + item.size+"%"+
                "\n修为：+" + item.experience+"%"+
                "\n气血：+" + item.experiencemax+"%"+
                "\n价格：" + item.price);
        });
        await ForwardMsg(e, msg);
        return;

    }

    //购买商品
    async Buy_comodities(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
        if (game_action == 0) {
            e.reply("游戏进行中...");
            return;
        }
        let thing = e.msg.replace("#购买", '');
        let code = thing.split("\*");
        let thing_name = code[0];//物品
        let thing_acount = code[1];//数量
        let quantity = await Numbers(thing_acount);
        if (quantity > 99) {
            quantity = 99;
        }
        let ifexist = data.commodities_list.find(item => item.name == thing_name);
        if (!ifexist) {
            e.reply(`不卖:${thing_name}`);
            return;
        }
        let player = await Read_wealth(usr_qq);
        let lingshi = player.lingshi;
        let commodities_price = ifexist.price * quantity;
        if (lingshi < commodities_price) {
            e.reply(`灵石不足`);
            return;
        }
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie,ifexist,quantity);
        await Write_najie(usr_qq, najie);
        await Add_lingshi(usr_qq, -commodities_price);
        e.reply(`花[${commodities_price}]灵石购买了[${thing_name}]*${quantity},`);
        return;
    }

    //出售商品
    async Sell_comodities(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
        if (game_action == 0) {
            e.reply("游戏进行中...");
            return;
        }
        let thing = e.msg.replace("#出售", '');
        let code = thing.split("\*");
        let thing_name = code[0];//物品
        let thing_acount = code[1];//数量
        let quantity = await Numbers(thing_acount);
        if (quantity > 99) {
            quantity = 99;
        }
        let searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        }

        let najie_thing = await exist_najie_thing(usr_qq, searchsthing.id);
        if (najie_thing == 1) {
            e.reply(`你没有[${thing_name}]`);
            return;
        }
        if (najie_thing.acount < quantity) {
            e.reply("数量不足");
            return;
        }
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie,searchsthing,-quantity);
        await Write_najie(usr_qq, najie);
        let commodities_price = searchsthing.price * quantity;
        await Add_lingshi(usr_qq, commodities_price);
        e.reply(`出售得${commodities_price}灵石 `);
        return;
    }
}


