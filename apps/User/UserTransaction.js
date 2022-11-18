import plugin from '../../../../lib/plugins/plugin.js';
import fs from "node:fs";
import data from '../../model/XiuxianData.js';
import {Numbers, Read_wealth, Add_lingshi, exist_najie_thing_id, Add_najie_thing,search_thing_name, existplayer, ForwardMsg, __PATH, Read_najie, Write_najie} from '../Xiuxian/Xiuxian.js';
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
        });
    };
    async ningmenghome(e) {
        const usr_qq = e.user_id;
        const ifexistplay = data.existData("player", usr_qq);
        if (!ifexistplay) {
            return;
        };
        const msg = [
            "___[凡仙堂]___\n#购买+物品名"
        ];
        const commodities_list = JSON.parse(fs.readFileSync(`${data.all}/commodities.json`));
        commodities_list.forEach((item) => {
            const id = item.id.split('-');
            //丹药
            if (id[0] == 4) {
                if(id[1]==1){
                    msg.push(
                        "物品：" + item.name +
                        "\n气血：+" + item.blood + "%" +
                        "\n价格：" + item.price);
                }else{
                    msg.push(
                        "物品：" + item.name +
                        "\n修为：+" + item.experience +
                        "\n价格：" + item.price);
                }
            }
            //功法
            else if (id[0] == 5) {
                msg.push(
                    "物品：" + item.name +
                    "\n天赋：+" + item.size + "%" +
                    "\n价格：" + item.price);
            }
            //法宝
            else if (id[0] == 3) {
                msg.push(
                    "物品：" + item.name +
                    "\n暴击：+" + item.burst + "%" +
                    "\n暴伤：+" + item.burstmax + "%" +
                    "\n敏捷：+" + item.speed+
                    "\n价格：" + item.price);
            }
            //武器
            else if (id[0] == 1) {
                msg.push(
                    "物品：" + item.name +
                    "\n攻击：+" + item.attack + "%"+
                    "\n暴击：+" + item.burst + "%" +
                    "\n暴伤：+" + item.burstmax + "%" +
                    "\n敏捷：+" + item.speed+
                    "\n价格：" + item.price);
            }
            else{
                msg.push(
                    "物品：" + item.name +
                    "\n防御：+" + item.defense + "%"+
                    "\n血量：+" + item.blood + "%"+
                    "\n暴击：+" + item.burst + "%" +
                    "\n暴伤：+" + item.burstmax + "%" +
                    "\n敏捷：+" + item.speed+
                    "\n价格：" + item.price);
            };
        });
        await ForwardMsg(e, msg);
        return;
    };
    async Buy_comodities(e) {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const thing = e.msg.replace("#购买", '');
        const code = thing.split("\*");
        const thing_name = code[0];//物品
        const thing_acount = code[1];//数量
        let quantity = await Numbers(thing_acount);
        if (quantity > 99) {
            quantity = 99;
        };
        const ifexist = JSON.parse(fs.readFileSync(`${data.all}/commodities.json`)).find(item => item.name == thing_name);
        if (!ifexist) {
            e.reply(`不卖:${thing_name}`);
            return;
        };
        const player = await Read_wealth(usr_qq);
        const lingshi = player.lingshi;
        const commodities_price = ifexist.price * quantity;
        if (lingshi < commodities_price) {
            e.reply(`灵石不足`);
            return;
        };
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, ifexist, quantity);
        await Write_najie(usr_qq, najie);
        await Add_lingshi(usr_qq, -commodities_price);
        e.reply(`花[${commodities_price}]灵石购买了[${thing_name}]*${quantity},`);
        return;
    };
    async Sell_comodities(e) {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const thing = e.msg.replace("#出售", '');
        const code = thing.split("\*");
        const thing_name = code[0];//物品
        const thing_acount = code[1];//数量
        let quantity = await Numbers(thing_acount);
        if (quantity > 99) {
            quantity = 99;
        };
        const searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        };
        const najie_thing = await exist_najie_thing_id(usr_qq, searchsthing.id);
        if (najie_thing == 1) {
            e.reply(`你没有[${thing_name}]`);
            return;
        }
        if (najie_thing.acount < quantity) {
            e.reply("数量不足");
            return;
        }
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, -quantity);
        await Write_najie(usr_qq, najie);
        const commodities_price = searchsthing.price * quantity;
        await Add_lingshi(usr_qq, commodities_price);
        e.reply(`出售得${commodities_price}灵石 `);
        return;
    };
};


