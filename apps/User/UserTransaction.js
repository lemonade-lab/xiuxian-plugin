import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'

import {Numbers} from '../Xiuxian/Xiuxian.js'
import {Read_player} from '../Xiuxian/Xiuxian.js'
import {Add_lingshi} from '../Xiuxian/Xiuxian.js'
import {exist_najie_thing} from '../Xiuxian/Xiuxian.js'
import {search_thing} from '../Xiuxian/Xiuxian.js'
import {existplayer} from '../Xiuxian/Xiuxian.js'
import {Read_najie} from '../Xiuxian/Xiuxian.js'
import {Write_najie} from '../Xiuxian/Xiuxian.js'

import {Add_najie_thing_ring} from '../Xiuxian/Xiuxian.js'
import {Add_najie_thing_daoju} from '../Xiuxian/Xiuxian.js'
import {Add_najie_thing_danyao} from '../Xiuxian/Xiuxian.js'
import {Add_najie_thing_fabao} from '../Xiuxian/Xiuxian.js'
import {Add_najie_thing_huju} from '../Xiuxian/Xiuxian.js'
import {Add_najie_thing_arms} from '../Xiuxian/Xiuxian.js'
import {Add_najie_thing_gonfa} from '../Xiuxian/Xiuxian.js'



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
        let ifexistplay = await existplayer(usr_qq);
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
        let acount=code[1];
        let quantity = await Numbers(acount);
        if (quantity > 99) {
            quantity = 99;
        }
        let ifexist = data.commodities_list.find(item => item.name == thing_name);
        if (!ifexist) {
            e.reply(`柠檬堂不卖:${thing_name}`);
            return;
        }
        let player = await Read_player(usr_qq);
        let lingshi = player.lingshi;
        let commodities_price = ifexist.price * quantity;
        if (lingshi < commodities_price) {
            e.reply(`灵石不足`);
            return;
        }
        let najie = await Read_najie(usr_qq);
        if(ifexist.class==1){ 
            najie=await Add_najie_thing_arms(najie, ifexist, quantity);
        }
        else if(ifexist.class==2){ 
            najie=await Add_najie_thing_huju(najie, ifexist, quantity);
        }
        else if(ifexist.class==3){ 
            najie=await Add_najie_thing_fabao(najie, ifexist, quantity);
        }
        else if(ifexist.class==4){ 
            najie=await Add_najie_thing_danyao(najie,ifexist, quantity);
        }
        else if(ifexist.class==5){ 
            najie=await Add_najie_thing_gonfa(najie,ifexist, quantity);
        }
        else if(ifexist.class==6){ 
            najie=await Add_najie_thing_daoju(najie,ifexist, quantity);
        }
        else if(ifexist.class==7){ 
            najie=await Add_najie_thing_ring(najie, ifexist, quantity);
        }
        await Add_lingshi(usr_qq, -commodities_price);
        await Write_najie(usr_qq, najie);
        e.reply(`你花[${commodities_price}]灵石购买了[${thing_name}]*${quantity},`);
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
        let thing = e.msg.replace("#", '');
        thing = thing.replace("出售", '');
        let code = thing.split("\*");
        let thing_name = code[0];
        let quantity  = await Numbers(code[1]);
        if (quantity > 99) {
            quantity = 99;
        }
        let searchsthing = await search_thing(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        }
        let najie_thing = await exist_najie_thing(usr_qq, searchsthing.id, searchsthing.class);
        if (najie_thing == 1) {
            e.reply(`你没有[${thing_name}]`);
            return;
        }
        if (najie_thing.acount < quantity) {
            e.reply("数量不足，你只有" + najie_thing.acount);
            return;
        }
        let najie = await Read_najie(usr_qq);
        if(najie_thing.class==1){ 
            najie=await Add_najie_thing_arms(najie, najie_thing, -quantity);
        }
        else if(najie_thing.class==2){ 
            najie=await Add_najie_thing_huju(najie, najie_thing, -quantity);
        }
        else if(najie_thing.class==3){ 
            najie=await Add_najie_thing_fabao(najie, najie_thing, -quantity);
        }
        else if(najie_thing.class==4){ 
            najie=await Add_najie_thing_danyao(najie, najie_thing, -quantity);
        }
        else if(najie_thing.class==5){ 
            najie=await Add_najie_thing_gonfa(najie, najie_thing, -quantity);
        }
        else if(najie_thing.class==6){ 
            najie=await Add_najie_thing_daoju(najie, najie_thing, -quantity);
        }
        else if(najie_thing.class==7){ 
            najie=await Add_najie_thing_ring(najie, najie_thing, -quantity);
        }
        await Write_najie(usr_qq, najie);
        let commodities_price = searchsthing.price * quantity;
        await Add_lingshi(usr_qq, commodities_price);
        e.reply(`出售得${commodities_price}灵石 `);
        return;
    }
}
