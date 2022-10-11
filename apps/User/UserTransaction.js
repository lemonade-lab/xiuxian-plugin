import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import path from "path"
import fs from "fs"

import {Numbers} from '../Xiuxian/Xiuxian.js'
import {Read_player} from '../Xiuxian/Xiuxian.js'
import {Add_lingshi} from '../Xiuxian/Xiuxian.js'
import {exist_najie_thing} from '../Xiuxian/Xiuxian.js'
import {search_thing} from '../Xiuxian/Xiuxian.js'
import {existplayer} from '../Xiuxian/Xiuxian.js'

const __dirname = path.resolve() + path.sep + "plugins" + path.sep + "xiuxian-emulator-plugin";
export const __PATH = {
    najie: path.join(__dirname, "/resources/data/birth/xiuxian/najie")
}





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

//写入纳戒信息
export async function Write_najie(usr_qq, najie) {
    let dir = path.join(__PATH.najie, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(najie, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}

//读取纳戒信息
export async function Read_najie(usr_qq) {
    let dir = path.join(`${__PATH.najie}/${usr_qq}.json`);
    let najie = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    //将字符串数据转变成数组格式
    najie = JSON.parse(najie);
    return najie;
}


export async function Add_najie_thing_arms(najie, najie_thing, thing_acount) {
    let thing =  najie.arms.find(item => item.id == najie_thing.id);
    if (thing == undefined) {    
        let equipment = {
        id: najie_thing.id,
        class: najie_thing.class,
        type: najie_thing.type,
        acount: thing_acount
       }
       najie.arms.push(equipment);
       return najie;
    }
    else {
        let acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.arms =  najie.arms.filter(item => item.id != najie_thing.id);
        }else{
            najie.arms.find(item => item.id == najie_thing.id).acount = acount;
        }
        return najie;
    }
}

export async function Add_najie_thing_huju(najie, najie_thing, thing_acount) {
    let thing =  najie.huju.find(item => item.id == najie_thing.id);
    if (thing == undefined) {    
        let equipment = {
            id: najie_thing.id,
            class: najie_thing.class,
            type: najie_thing.type,
            acount: thing_acount  
            };
            najie.huju.push(equipment);
            return najie;
    }
    else {
        let acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.huju =  najie.huju.filter(item => item.id != najie_thing.id);
        }else{
            najie.huju.find(item => item.id == najie_thing.id).acount = acount;
        }
        return najie;
    }
}

export async function Add_najie_thing_fabao(najie, najie_thing, thing_acount) {
    let thing =  najie.fabao.find(item => item.id == najie_thing.id);
    if (thing == undefined) {
        let equipment = {
            id: najie_thing.id,
            class: najie_thing.class,
            type: najie_thing.type,
            acount: thing_acount
        }
        najie.fabao.push(equipment);
        return najie;
    }
    else {
        let acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.fabao =  najie.fabao.filter(item => item.id != najie_thing.id);
        }else{
            najie.fabao.find(item => item.id == najie_thing.id).acount = acount;
        }
        return najie;
    }
}

export async function Add_najie_thing_danyao(najie, najie_thing, thing_acount) {
    let thing =  najie.danyao.find(item => item.id == najie_thing.id);
    if (thing == undefined) {
        let equipment = {
            id: najie_thing.id,
            class: najie_thing.class,
            type: najie_thing.type,
            acount: thing_acount
        }
         najie.danyao.push(equipment);
         return najie;
    }
    else {
        let acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.danyao =  najie.danyao.filter(item => item.id != najie_thing.id);
        }else{
            najie.danyao.find(item => item.id == najie_thing.id).acount = acount;
        }
        return najie;
    }
}


export async function Add_najie_thing_gonfa(najie, najie_thing, thing_acount) {
    let thing =  najie.gonfa.find(item => item.id == najie_thing.id);
    if (thing == undefined) {    
        let equipment = {
            id: najie_thing.id,
            class: najie_thing.class,
            type: najie_thing.type,
            acount: thing_acount
         }
         najie.gonfa.push(equipment);
         return najie;
    }
    else {
        let acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.gonfa =  najie.gonfa.filter(item => item.id != najie_thing.id);
        }else{
            najie.gonfa.find(item => item.id == najie_thing.id).acount = acount;
        }
        return najie;
    }
}


export async function Add_najie_thing_daoju(najie, najie_thing, thing_acount) {
    let thing =  najie.daoju.find(item => item.id == najie_thing.id);
    if (thing == undefined) {    
        let equipment = {
        id: najie_thing.id,
        class: najie_thing.class,
        type: najie_thing.type,
        acount: thing_acount
        }
        najie.daoju.push(equipment); 
        return najie;
    }
    else {
        let acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.daoju =  najie.daoju.filter(item => item.id != najie_thing.id);
        }else{
            najie.daoju.find(item => item.id == najie_thing.id).acount = acount;
        }
        return najie;
    }
}

export async function Add_najie_thing_ring(najie, najie_thing, thing_acount) {
    let thing =  najie.ring.find(item => item.id == najie_thing.id);
    if (thing == undefined) {    
        let equipment = {
        id: najie_thing.id,
        class: najie_thing.class,
        type: najie_thing.type,
        acount: thing_acount
        }
        najie.ring.push(equipment);
        return najie;
    }
    else {
        let acount =  thing.acount + thing_acount;   
        if (acount < 1) {
            najie.ring =  najie.ring.filter(item => item.id != najie_thing.id);
        }else{
            najie.ring.find(item => item.id == najie_thing.id).acount = acount;
        }
        return najie;
    }
}

