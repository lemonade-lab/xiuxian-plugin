import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import assUtil from '../../model/assUtil.js'
import config from "../../model/Config.js"
import fs from "fs"
import {
    Read_najie,
    Write_najie,isNotNull,ForwardMsg,Go,Add_experience, Add_lingshi} from "../Xiuxian/Xiuxian.js";
import { segment } from "oicq"


//要DIY的话，确保这两个数组长度相等

/**
 * 宗门
 */

export class AssUncharted extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'AssUncharted',
            /** 功能描述 */
            dsc: '宗门模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                // {
                //     reg: '^#宗门秘境列表$',
                //     fnc: 'List_AssUncharted'
                // },
                // {
                //     reg: '^#探索宗门秘境.*$',
                //     fnc: 'Go_Guild_Secrets'
                // },
                // {
                //     reg: '^#设置宗门秘境价格.*$',
                //     fnc: 'Set_AssUncharted_Price'
                // },
                // {
                //     reg: '^#设置宗门秘境修为.*',
                //     fnc: 'Set_AssUncharted_Experience'
                // },
                // {
                //     reg: '^#宗门秘境放入.*$',
                //     fnc: 'AssUncharted_Put'
                // },
                // {
                //     reg: '^#宗门秘境取出.*$',
                //     fnc: 'AssUncharted_Remove'
                // },
                // {
                //     reg: '^#宗门秘境更名.*$',
                //     fnc: 'Rename_AssUncharted'
                // }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    async List_AssUncharted(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = data.existData("player", usr_qq);
        if (!ifexistplay) {
            return;
        }
        let addres="宗门秘境";
        let weizhi = [];
        for(var i=0;i<assUtil.assRelationList.length;i++){
            let assUncharted = assUtil.getAssOrPlayer(3,assUtil.assRelationList[i].id);
            weizhi.push(assUncharted);
        }
        await GoAssUncharted(e, weizhi, addres);
    }




    async Go_Guild_Secrets(e) {
        let go =await Go(e);
        if (!go) {
            return;
        }
        let usr_qq = e.user_id;
        var didian = await e.msg.replace("#探索宗门秘境", '');
        didian = didian.trim();
        let weizhi = await assUtil.assRelationList.find(item => item.unchartedName == didian);
        if(!isNotNull(weizhi)){
            return ;
        }
        let uncharted = await assUtil.getAssOrPlayer(3,weizhi.id);
        let ass = await assUtil.getAssOrPlayer(2,weizhi.id);
        if(ass.facility[2].status == 0){
            e.reply(`该秘境暂未开放使用！`);
            return ;
        }
        if(ass.spiritStoneAns < Math.trunc(uncharted.Price + uncharted.experience)){
            e.reply(`宗门灵石不足以支撑秘境的运转！！！`);
            return ;
        }

        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);

        if (isNotNull(assPlayer)) {
            if(assPlayer.assName == weizhi.id){
                uncharted.Price = Math.trunc(uncharted.Price * 0.9);
                uncharted.experience = Math.trunc(uncharted.experience * 0.9);
            }
        }

        let baseUncharted = assUtil.baseUnchartedList[Math.ceil(ass.level / 3) - 1];
        uncharted.one.push(...baseUncharted.one);
        uncharted.two.push(...baseUncharted.two);
        uncharted.three.push(...baseUncharted.three);
        let level_id=3;
        let name=weizhi.unchartedName;
        let time=5;
        await practice(e,uncharted,level_id,name,time);
        return;
    }


    async Set_AssUncharted_Price(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = data.existData("player", usr_qq);
        if (!ifexistplay) {
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if (isNotNull(assPlayer)) {
            if(assPlayer.assName == 0){
                return;
            }
        }else {
            return;
        }
        if(assPlayer.assJob !="master"){
            if(assPlayer.assJob!="elder"){
                e.reply(`权限不足`);
                return ;
            }
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        if(ass.facility[2].status == 0){
            e.reply(`宗门秘境未建设好！`);
            return ;
        }
        let assUncharted = assUtil.getAssOrPlayer(3,assPlayer.assName);
        let priceNum = e.msg.replace("#设置宗门秘境价格", '');
        priceNum=isNaN(Number(priceNum)) ? 1:priceNum;
        if(priceNum < 0){
            return ;
        }
        assUncharted.Price = priceNum;
        if(await legalityCheck(assUncharted)){
            await assUtil.setAssOrPlayer("",assUncharted.id,assUncharted);
            e.reply(`成功设置宗门秘境价格为${priceNum}`);
            return ;
        }else {
            e.reply(`请输入正确的价格！！!`);
            return ;
        }
    }


    async Set_AssUncharted_Experience(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = data.existData("player", usr_qq);
        if (!ifexistplay) {
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if (isNotNull(assPlayer)) {
            if(assPlayer.assName == 0){
                return;
            }
        }else {
            return;
        }
        if(assPlayer.assJob !="master"){
            if(assPlayer.assJob!="elder"){
                e.reply(`权限不足`);
                return ;
            }
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        if(ass.facility[2].status == 0){
            e.reply(`宗门秘境未建设好！`);
            return ;
        }
        let assUncharted = assUtil.getAssOrPlayer(3,assPlayer.assName);
        let priceNum = e.msg.replace("#设置宗门秘境修为", '');
        priceNum=isNaN(Number(priceNum)) ? 1:priceNum;
        if(priceNum < 0){
            return ;
        }
        assUncharted.experience = priceNum;
        if(await legalityCheck(assUncharted)){
            await assUtil.setAssOrPlayer("",assUncharted.id,assUncharted);
            e.reply(`成功设置宗门秘境所需修为:${priceNum}`);
            return ;
        }else {
            e.reply(`请输入正确的价格！！!`);
            return ;
        }
    }


    async AssUncharted_Put(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = data.existData("player", usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = data.getData("player",usr_qq);
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if (isNotNull(assPlayer)) {
            if(assPlayer.assName == 0){
                return;
            }
        }else {
            return;
        }
        if(assPlayer.assJob !="master"){
            e.reply(`权限不足`);
            return ;
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        if(ass.facility[2].status == 0){
            e.reply(`宗门秘境未建设好！`);
            return ;
        }
        let setMsg = e.msg.replace("#宗门秘境放入", '');
        let code = setMsg.split("\*");
        if(code.length != 3){
            return ;
        }
        if(code[2] !=1 && code[2] !=2 && code[2] !=3){
            return ;
        }
        let position = "";
        switch (code[2]) {
            case 1 :
                position ="one";
                break;
            case 2:
                position="two";
                break;
            case 3:
                position="three";
                break;
            default:
                position="three";
                break;
        }

        let addThing =await search_thing(code[1]);
        if(addThing == 1){
            return ;
        }
        if(addThing.price == 1){
            return ;
        }
        var promise = await exist_najie_thing(usr_qq,addThing.id,addThing.class);
        if(promise == 1){
            return ;
        }
        let assUncharted = assUtil.getAssOrPlayer(3,assPlayer.assName);
        if(await exist_thing_assUncharted(addThing,assUncharted)){
            e.reply(`秘境中已经存在这样的东西了`);
            return ;
        }
        assUncharted[position].push(addThing);

        if(!await legalityCheck(assUncharted)){
            e.reply(`放这么好的东西，门票这么便宜，你也太良心辣！先提高门票价格再放吧。`)
            return ;
        }

        await Add_najie_things(addThing,usr_qq,-1);
        await assUtil.setAssOrPlayer("assUncharted",assPlayer.assName,assUncharted);
        e.reply(`已成功向秘境第${position}层加入${addThing.name}!!!`);
        return ;
    }


    async AssUncharted_Remove(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = data.existData("player", usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = data.getData("player",usr_qq);
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if (isNotNull(assPlayer)) {
            if(assPlayer.assName == 0){
                return;
            }
        }else {
            return;
        }
        if(assPlayer.assJob !="master"){
            e.reply(`权限不足`);
            return ;

        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        if(ass.facility[2].status == 0){
            e.reply(`宗门秘境未建设好！`);
            return ;
        }
        let thingName = e.msg.replace("#宗门秘境取出", '');
        let removeThing =await search_thing(thingName);
        if(removeThing == 1){
            return ;
        }

        let assUncharted = assUtil.getAssOrPlayer(3,assPlayer.assName);

        if(assUncharted.one.length <= 3 || assUncharted.two.length <= 3 ||assUncharted.three.length <=2){
            e.reply(`秘境剩余物品种类不足,不能取走`);
            return;
        }
        if(!await exist_thing_assUncharted(removeThing,assUncharted)){
            return ;
        }
        assUncharted =  await remove_thing_assUncharted(removeThing,assUncharted);
        await Add_najie_things(removeThing,usr_qq,1);
        await assUtil.setAssOrPlayer("assUncharted",assPlayer.assName,assUncharted);
        e.reply(`已成功从秘境中取出${removeThing.name},后续秘境中不会再出现该物品！`);
        return ;
    }


    async Rename_AssUncharted(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = data.existData("player", usr_qq);
        if (!ifexistplay) {
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if (isNotNull(assPlayer)) {
            if(assPlayer.assName == 0){
                return;
            }
        }else {
            return;
        }
        if(assPlayer.assJob !="master"){
            if(assPlayer.assJob!="elder"){
                e.reply(`权限不足`);
                return ;
            }
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        if(ass.facility[2].status == 0){
            e.reply(`宗门秘境未建设好！`);
            return ;
        }

        let newName = e.msg.replace("#宗门秘境更名", '');
        await assUtil.assRename(assPlayer.assName,2,newName);
        e.reply(`宗门秘境已成功更名为${newName}`);
        return ;
    }



}


/**
 * 地点查询
 */
async function GoAssUncharted(e, weizhi, addres) {
    let adr = addres;
    let msg = [
        "***" + adr + "***"
    ];
    for (var i = 0; i < weizhi.length; i++) {
        var find = assUtil.assRelationList.find(item => item.id ==  weizhi[i].id);
        msg.push(find.unchartedName + "\n" + "归属宗门：" + find.name + "\n" + "修为：" + weizhi[i].experience + "\n" +"灵石：" + weizhi[i].Price);
    }
    await ForwardMsg(e, msg);
}



async function legalityCheck(place) {
    let priceAns = place.Price + place.experience;
    let maxNumA=0;
    let maxNumB=0;
    let maxNumC=0;
    let ass = assUtil.getAssOrPlayer(2,place.id);
    let baseUncharted = assUtil.baseUnchartedList[Math.ceil(ass.level / 3) - 1];
    place.one.push(...baseUncharted.one);
    place.two.push(...baseUncharted.two);
    place.three.push(...baseUncharted.three);
    place.one.forEach(item => maxNumA = item.price > maxNumA ? item : maxNumA);
    place.two.forEach(item => maxNumA = item.price > maxNumA ? item : maxNumA);
    place.three.forEach(item => maxNumA = item.price > maxNumA ? item : maxNumA);

    if(priceAns*0.8 < maxNumA){
        return false;
    }
    if(priceAns*1.2 < maxNumB){
        return false;
    }
    if(priceAns*2 < maxNumC){
        return false;
    }
    return true;
}

async function Add_najie_things(thing ,user_qq, account) {
    let najie = await Read_najie(user_qq);
    switch (parseInt(thing.class)) {
        case 1:
            najie = await Add_najie_thing_arms(najie,thing,account);
            break;
        case 2:
            najie = await Add_najie_thing_huju(najie,thing,account);
            break;
        case 3:
            najie = await Add_najie_thing_fabao(najie,thing,account);
            break;
        case 4:
            najie = await Add_najie_thing_danyao(najie,thing,account);
            break;
        case 5:
            najie = await Add_najie_thing_gonfa(najie,thing,account);
            break;
        case 6:
            najie = await Add_najie_thing_daoju(najie,thing,account);
            break;
        case 7:
            najie = await Add_najie_thing_ring(najie,thing,account);
            break;
        default:
            break;
    }
    await Write_najie(user_qq,najie);
}

async function exist_thing_assUncharted(thing,assUncharted) {
    let thingA = assUncharted.one.findIndex(item => item.id==thing.id);
    let thingB = assUncharted.two.findIndex(item => item.id==thing.id);
    let thingC = assUncharted.three.findIndex(item => item.id==thing.id);
    if(thingA == -1){
        if (thingB == -1){
            if(thingC == -1){
                return false;
            }
        }
    }
    return true;
}

async function remove_thing_assUncharted(removeThing,assUncharted) {
    let thingA = assUncharted.one.findIndex(item => item.id==thing.id);
    let thingB = assUncharted.two.findIndex(item => item.id==thing.id);
    let thingC = assUncharted.three.findIndex(item => item.id==thing.id);
    if(thingA != -1){
        assUncharted.one = assUncharted.one.filter(item => item.id == removeThing.id);
    }
    if(thingB != -1){
        assUncharted.two = assUncharted.two.filter(item => item.id == removeThing.id);
    }
    if(thingC != -1){
        assUncharted.three = assUncharted.three.filter(item => item.id == removeThing.id);
    }
    return assUncharted;

}

async function practice(e,weizhi,level_id,name,time) {

    let usr_qq = e.user_id;

    let player = await data.getData("player",usr_qq);

    let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;

    if (now_level_id <= level_id) {
        e.reply("境界不足");
        return ;
    }

    if (!isNotNull(weizhi)) {
        return ;
    }

    if (player.lingshi < weizhi.Price) {
        e.reply("没有灵石寸步难行,攒到" + weizhi.Price + "灵石才够哦~");
        return ;
    }

    if (player.experience < weizhi.experience) {
        e.reply("你需要积累" + weizhi.experience + "修为才能抵御世界之力");
        return ;
    }

    let Price = weizhi.Price;
    let experience = weizhi.experience;
    let ass = assUtil.getAssOrPlayer(2,weizhi.id);
    ass.facility[2].buildNum -= Math.ceil(ass.level / 3);
    ass.spiritStoneAns += Price;
    await assUtil.checkFacility(ass);
    await Add_lingshi(usr_qq, -Price);
    await Add_experience(usr_qq, -experience);
    let action_time = 60000 * time;//持续时间，单位毫秒
    let arr = {
        //动作
        "action": name,
        //结束时间
        "end_time": new Date().getTime() + action_time,
        //持续时间
        "time": action_time,
        //闭关
        "shutup": "1",
        //降妖
        "working": "1",
        //秘境状态---开启
        "Place_action": "1",
        "Ass_Uncharted_Action": "0",
        //渡劫状态--关闭
        "power_up": "1",
        //地点
        "Place_address": weizhi,
    };

    if (e.isGroup) {
        arr.group_id = e.group_id
    }

    await redis.set("xiuxian:player:" + usr_qq + ":association:unchartedAction", JSON.stringify(arr));

    e.reply(name + "..." + time + "分钟后归来!");

    return 0;
}

