import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import data from '../../model/XiuxianData.js'
import { segment } from "oicq"
import {
    Add_najie_thing,
    shijianc,
    Add_HP, Add_experience, Add_experiencemax,
    Read_najie, Write_najie, existplayer, Read_level, search_thing_name, exist_najie_thing_id
} from '../Xiuxian/xiuxian.js'
import assUtil from "../../model/AssUtil.js";


/**
 * 洞天福地
 */
const BeastList = ["麒麟","青龙","白虎","朱雀","玄武"];

export class TreasureCabinet extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'TreasureCabinet',
            /** 功能描述 */
            dsc: '宗门神兽模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 9999,
            rule: [
                {
                    reg: '^#召唤神兽$',
                    fnc: 'Summon_Divine_Beast'
                },
                {
                    reg: '^#喂给神兽.*$',
                    fnc: 'Feed_Beast'
                },
                {
                    reg: '^#神兽赐福$',
                    fnc: 'Beast_Bonus'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

async Summon_Divine_Beast(e){
        //6级宗门，有驻地，灵石200w
    //不开放私聊功能

    let usr_qq = e.user_id;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    }
    //不开放私聊功能
    if (!e.isGroup) {
        return;
    }
    if(!assUtil.existAss("assPlayer",usr_qq)){
        return;
    }
    let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
    if(assPlayer.assName == 0){
        e.reply("你还没有宗门");
        return;
    }

    let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);

    if(ass.resident.name==0){
        e.reply(`驻地都没有，让神兽跟你流浪啊？`);
        return ;
    }
    if(ass.facility[3].status==0){
        e.reply(`神兽道场都没建设好，神兽住哪啊？`);
        return ;
    }
    //职位不符
    if (assPlayer.assJob != "master") {
        e.reply("只有宗主可以操作");
        return;
    }
    if(ass.level <6){
        e.reply(`宗门等级不足，尚不具备召唤神兽的资格`);
        return ;
    }

    if(ass.spiritStoneAns<2000000){
        e.reply(`宗门就这点钱，还想神兽跟着你干活？`);
        return ;
    }
    if(ass.divineBeast!=0){
        e.reply(`你的宗门已经有神兽了`);
        return ;
    }
    //校验都通过了，可以召唤神兽了
    let random=Math.random()*5;
    ass.divineBeast=Math.ceil(random);

    ass.spiritStoneAns-=2000000;
    await assUtil.setAssOrPlayer("association",ass.id,ass);
    e.reply(`召唤成功，神兽${BeastList[ass.divineBeast - 1]}投下一道分身，开始守护你的宗门，要好好照顾神兽哦`);
    return ;
}

async Beast_Bonus(e){
    let usr_qq = e.user_id;
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    }
    //不开放私聊功能
    if (!e.isGroup) {
        return;
    }
    if(!assUtil.existAss("assPlayer",usr_qq)){
        return;
    }
    let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
    if(assPlayer.assName == 0){
        e.reply("你还没有宗门");
        return;
    }

    if(assPlayer.contributionPoints <= 1){
        e.reply("贡献不足");
        return;
    }

    let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
    if(ass.divineBeast==0){
        e.reply("你的宗门还没有神兽的护佑，快去召唤神兽吧");
        return;
    }
    if(ass.facility[3].status==0){
        e.reply(`神兽道场破烂不堪，承受不了赐福时的能量余波啦，去重新修建一下吧`);
        return ;
    }

    let now = new Date();
    let nowTime = now.getTime(); //获取当前日期的时间戳
    let Today = await shijianc(nowTime);
    let lastBounsTime = await shijianc(assPlayer.lastBounsTime);//获得上次宗门签到日期
    if (Today.Y == lastBounsTime.Y && Today.M == lastBounsTime.M && Today.D == lastBounsTime.D) {
        e.reply(`今日已经接受过神兽赐福了，明天再来吧`);
        return;
    }
    assPlayer.lastBounsTime = nowTime;

    let random = Math.random();
    let flag=0.5;
    let ans = 0.3;
    //根据好感度获取概率
    if(assPlayer.favorability > 1000){
        ans = 0 ;
        flag=0.1;
    }else if(assPlayer.favorability > 500){
        ans = 0.1 ;
        flag=0.25;
    }else if(assPlayer.favorability > 200){
        ans = 0.2 ;
        flag=0.35;
    }
    if(random > flag){
        let randomA=Math.random();
        let res = 1 ;
        if(randomA > (0.5+ans)){
            res = 1;
            ass.facility[3].buildNum -=3;
        }else if(randomA > (0.2+ans)){
            res = 2;
            ass.facility[3].buildNum -=2;
        }else {
            res = 3 ;
            ass.facility[3].buildNum -=1;
        }
        assPlayer.contributionPoints -=1;
        await assUtil.setAssOrPlayer("assPlayer",usr_qq,assPlayer);
        await assUtil.checkFacility(ass);

        let location = 0 ;
        let item = {};
        let playerLevel = await Read_level(usr_qq);
        let now_level_id = playerLevel.level_id;
        let body_level_id = playerLevel.levelmax_id
        //获得奖励
        let randomB = Math.random();
        let timeList = [];
        if(ass.divineBeast==0){
            //给丹药,隐藏神兽,赐福时气血和修为都加,宗门驻地等级提高一级
            if(flag == 0.1 && res == 1 && randomB > 0.8){
                location = Math.floor(Math.random()*5);
                timeList = data.danyao_list.slice(-5);
                item = timeList[location];
            }else {
                location = Math.floor(Math.random() * (data.danyao_list.length / res));
                item = data.danyao_list[location];
            }
            await Add_experiencemax(usr_qq , 50*body_level_id );
            await Add_experience(usr_qq , 50*now_level_id);
            await Add_HP(usr_qq , 100);
            await Add_najie_things(item,usr_qq,1);
        }else if(ass.divineBeast==1){
            //给功法，赐福加修为
            if(flag == 0.1 && res == 1 && randomB > 0.8){
                location = Math.floor(Math.random()*5);
                timeList = data.gongfa_list.slice(-5);
                item = timeList[location];
            }else {
                location = Math.floor(Math.random() * (data.gongfa_list.length / res));
                item = data.gongfa_list[location];
            }
            await Add_experience(usr_qq , 30*now_level_id);
            await Add_HP(usr_qq , 100);
            await Add_najie_things(item,usr_qq,1);
        }else if(ass.divineBeast==4){
            //给护具，赐福加气血
            if(flag == 0.1 && res == 1 && randomB > 0.8){
                location = Math.floor(Math.random()*5);
                timeList = data.huju_list.slice(-5);
                item = timeList[location];
            }else {
                location = Math.floor(Math.random() * (data.huju_list.length / res));
                item = data.huju_list[location];
            }
            await Add_experiencemax(usr_qq , 30*body_level_id );
            await Add_HP(usr_qq , 100);
            await Add_najie_things(item,usr_qq,1);

        }else if(ass.divineBeast==3){
            //给法宝，赐福加修为
            if(flag == 0.1 && res == 1 && randomB > 0.8){
                location = Math.floor(Math.random()*5);
                timeList = data.fabao_list.slice(-5);
                item = timeList[location];
            }else {
                location = Math.floor(Math.random() * (data.fabao_list.length / res));
                item = data.fabao_list[location];
            }
            await Add_experience(usr_qq , 30*now_level_id);
            await Add_HP(usr_qq , 100);
            await Add_najie_things(item,usr_qq,1);
        }else {
            //白虎给武器 赐福加气血
            if(flag == 0.1 && res == 1 && randomB > 0.8){
                location = Math.floor(Math.random()*5);
                timeList = data.wuqi_list.slice(-5);
                item = timeList[location];
            }else {
                location = Math.floor(Math.random() * (data.wuqi_list.length / res));
                item = data.wuqi_list[location];
            }
            await Add_experiencemax(usr_qq , 30*body_level_id );
            await Add_HP(usr_qq , 100);
            await Add_najie_things(item,usr_qq,1);
        }
        if(flag == 0.1 && res == 1 && randomB > 0.8){
            e.reply(`看见你来了,${BeastList[ass.divineBeast - 1]}很高兴，仔细挑选了${item.name}给你`);

        }else {
            e.reply(`${BeastList[ass.divineBeast - 1]}今天心情不错，随手丢给了你${item.name}`);
        }
        e.reply(`经过神兽的赐福，你的血量回满了，同时修为或气血得到了一定的提升`);
        return ;
    }else {
        e.reply(`${BeastList[ass.divineBeast - 1]}闭上了眼睛，表示今天不想理你`);
        return ;
    }

}


async Feed_Beast(e){
    //不开放私聊功能
    if (!e.isGroup) {
        return;
    }
    let usr_qq = e.user_id;
    //用户不存在
    let ifexistplay =await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    }
    if(!assUtil.existAss("assPlayer",usr_qq)){
        return;
    }
    let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
    if(assPlayer.assName == 0){
        e.reply("你还没有宗门");
        return;
    }

    if(assPlayer.contributionPoints <= 1){
        e.reply("贡献不足");
        return;
    }
    let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
    if(ass.divineBeast==0){
        e.reply("你的宗门还没有神兽的护佑，快去召唤神兽吧");
        return;
    }

    let  thing_name = e.msg.replace("#喂给神兽", '');
    thing_name = thing_name.trim();

    let searchThing = await search_thing_name(thing_name);

    if (searchThing == 1) {
        e.reply(`不存在这样的东西:${thing_name}`);
        return;
    }

    //纳戒中的数量
    let thing_quantity = await exist_najie_thing_id(usr_qq, searchThing.id);

    if (thing_quantity == 1) {//没有
        e.reply(`你没有【${thing_name}】这样的东西!`);
        return;
    }


    //todo 写入配置
    let CDTime = 120;
    let ClassCD = ":feedBonusTime";
    let now_time = new Date().getTime();
    let cdSecond =await redis.ttl("xiuxian:player:" + usr_qq + ClassCD);
    if(cdSecond!= -2){
        if(cdSecond == -1){
            e.reply(`喂养神兽cd状态残留，请联系机器人管理员处理！`);
            return ;
        }
        e.reply(`喂养cd中，剩余${cdSecond}秒！`);
        return ;
    }

    await redis.set("xiuxian:player:" + usr_qq + ClassCD ,now_time);
    await redis.expire("xiuxian:player:" + usr_qq + ClassCD , CDTime * 60);

    //纳戒数量减少
    await Add_najie_things(searchThing, usr_qq,-1);

    assPlayer.favorability+=Math.trunc(searchThing.price/10000);

    e.reply(`喂养成功，你和神兽的亲密度增加了${Math.trunc(searchThing.price/10000)},当前为${assPlayer.favorability}`);
    return ;
    }


}


async function Add_najie_things(thing ,user_qq, account) {
    let najie = await Read_najie(user_qq);
    najie = await Add_najie_thing(najie,thing,account);
    await Write_najie(user_qq,najie);
    return ;
}

