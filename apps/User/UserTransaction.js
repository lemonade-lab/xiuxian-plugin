import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import * as Xiuxian from '../Xiuxian/Xiuxian.js'

export class UserTransaction extends plugin {
    constructor() {
        super({
            name: 'UserTransaction',
            dsc: 'UserTransaction',
            event: 'message',
            priority: 600,
            rule: [
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

        if(ifexist.clas==1){ 
            await Xiuxian.Add_najie_thing_arms(usr_qq, ifexist.id, ifexist.class, ifexist.type, quantity);
        }
        else if(ifexist.clas==2){ 
            await Xiuxian.Add_najie_thing_huju(usr_qq, ifexist.id, ifexist.class, ifexist.type, quantity);
        }
        else if(ifexist.clas==3){ 
            await Xiuxian.Add_najie_thing_fabao(usr_qq, ifexist.id, ifexist.class, ifexist.type, quantity);
        }
        else if(ifexist.clas==4){ 
            await Xiuxian.Add_najie_thing_danyao(usr_qq, ifexist.id, ifexist.class, ifexist.type, quantity);
        }
        else if(ifexist.clas==5){ 
            await Xiuxian.Add_najie_thing_gonfa(usr_qq, ifexist.id, ifexist.class, ifexist.type, quantity);
        }
        else if(ifexist.clas==6){ 
            await Xiuxian.Add_najie_thing_daoju(usr_qq, ifexist.id, ifexist.class, ifexist.type, quantity);
        }
        else if(ifexist.clas==7){ 
            await Xiuxian.Add_najie_thing_ring(usr_qq, ifexist.id, ifexist.class, ifexist.type, quantity);
        }


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

        if(ifexist.clas==1){ 
            await Xiuxian.Add_najie_thing_arms(usr_qq, ifexist.id, ifexist.class, ifexist.type, -quantity);
        }
        else if(ifexist.clas==2){ 
            await Xiuxian.Add_najie_thing_huju(usr_qq, ifexist.id, ifexist.class, ifexist.type, -quantity);
        }
        else if(ifexist.clas==3){ 
            await Xiuxian.Add_najie_thing_fabao(usr_qq, ifexist.id, ifexist.class, ifexist.type, -quantity);
        }
        else if(ifexist.clas==4){ 
            await Xiuxian.Add_najie_thing_danyao(usr_qq, ifexist.id, ifexist.class, ifexist.type, -quantity);
        }
        else if(ifexist.clas==5){ 
            await Xiuxian.Add_najie_thing_gonfa(usr_qq, ifexist.id, ifexist.class, ifexist.type, -quantity);
        }
        else if(ifexist.clas==6){ 
            await Xiuxian.Add_najie_thing_daoju(usr_qq, ifexist.id, ifexist.class, ifexist.type, -quantity);
        }
        else if(ifexist.clas==7){ 
            await Xiuxian.Add_najie_thing_ring(usr_qq, ifexist.id, ifexist.class, ifexist.type, -quantity);
        }
        let commodities_price = searchsthing.price * quantity;
        await Xiuxian.Add_lingshi(usr_qq, commodities_price);
        e.reply(`出售得${commodities_price}灵石 `);
        return;
    }
}
