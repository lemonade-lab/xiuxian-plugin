import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import assUtil from '../../model/assUtil.js'
import config from "../../model/Config.js"
import puppeteer from "../../../../lib/puppeteer/puppeteer.js";
import base from "../../model/base.js";
import fs from "fs"
import {player_efficiency,ForwardMsg, shijianc,Add_lingshi, existplayer, Read_level, Read_wealth, Write_wealth} from "../Xiuxian/Xiuxian.js";
import { segment } from "oicq"

//要DIY的话，确保这两个数组长度相等
const numberMaximums = [6, 8, 10, 13, 16, 18, 20 ,23 ,25];
const spiritStoneAnsMax = [2000000, 5000000, 8000000, 11000000, 15000000, 20000000 ,35000000, 50000000, 80000000];
/**
 * 宗门
 */
export class Association extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'Association',
            /** 功能描述 */
            dsc: '宗门模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^#申请加入.*$',
                    fnc: 'Join_association'
                },
                {
                    reg: '^#退出宗门$',
                    fnc: 'Exit_association'
                },
                {
                    reg: '^#宗门(上交|上缴|捐赠)灵石.*$',
                    fnc: 'give_association_lingshi'
                },
                {
                    reg: '^#宗门俸禄$',
                    fnc: 'gift_association'
                },
                {
                    reg: '^#(宗门列表)$',
                    fnc: 'List_appointment'
                },
                {
                    reg: "^#我的宗门$",
                    fnc: "show_association",
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }



    async show_association(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let img = await get_association_img(e);
        e.reply(img);
        return;
    }



    //宗门俸禄
    async gift_association(e) {
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


        let now = new Date();
        let nowTime = now.getTime(); //获取当前日期的时间戳
        let oldTime = assPlayer.time[1];
        let days=Math.trunc((nowTime - oldTime)/(24*60*60*1000));
        if(assPlayer.contributionPoints<=0 || assPlayer.historyContribution < days){
            e.reply(`你对宗门做成的贡献不足，没有领取俸禄的资格！！！`);
            return ;
        }
        let Today = await shijianc(nowTime);
        let lasting_time = await shijianc(assPlayer.lastSignAss);//获得上次宗门签到日期
        if (Today.Y == lasting_time.Y && Today.M == lasting_time.M && Today.D == lasting_time.D) {
            e.reply(`今日已经领取过了`);
            return;
        }
        if(ass.facility[4].status === 0){
            e.reply(`聚灵阵破烂不堪，导致灵石池无法存取灵石，快去修建！`);
            return;
        }


        //给奖励
        let temp = 0;
        let jobList=["宗主","长老","内门弟子","外门弟子","杂役"];
        let location = jobList.findIndex( item=> item == assPlayer.assJob);
        switch (location) {
            case 0:
                temp=7;
                break;
            case 1:
                temp=5;
                break;
            case 2:
                temp=3;
                break;
            case 3:
                temp=2;
                break;
            case 4:
                temp=1;
                break;
            default:
                temp=1
                break;
        }

        let giftNumber = ass.level * 2000 * temp;
        if((ass.spiritStoneAns-giftNumber) < 0){
            e.reply(`宗门灵石池不够发放俸禄啦，快去为宗门做贡献吧`);
            return ;
        }
        ass.spiritStoneAns-=giftNumber;
        ass.facility[4].buildNum -= 1;
        assPlayer.contributionPoints -= 1;
        assPlayer.lastSignAss = nowTime;
        await Add_lingshi(usr_qq, giftNumber);
        await assUtil.checkFacility(ass);
        await assUtil.setAssOrPlayer("assPlayer",usr_qq,assPlayer);
        let msg = [
            segment.at(usr_qq),
            `宗门俸禄领取成功,获得了${giftNumber}灵石`
        ]
        e.reply(msg);
        return;
    }



    //加入宗门
    async Join_association(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);

        if (!ifexistplay) {
            return;
        }
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }

        let player = await Read_level(usr_qq);
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);

        if(assPlayer.assName != 0){
            e.reply("你已经有宗门了！");
            return;
        }

        if(assPlayer.volunteerAss !=0){
            e.reply(`你已向其他宗门发出申请，不可重复申请多个宗门，请先清空志愿`);
            return ;
        }


        let association_name = e.msg.replace("#申请加入", '');
        association_name = association_name.trim();
        let assRelation = assUtil.assRelationList.find(item => item.name == association_name);
        if (!isNotNull(assRelation)) {
            e.reply(`该宗门不存在！`);
            return;
        }
        association_name =assRelation.id;
        let ass = assUtil.getAssOrPlayer(2,association_name);
        let now_level = data.Level_list.find(item => item.id == player.level_id);
        if(now_level.id > 10){
            e.reply("仙人不可下界！");
            return;
        }

        let mostMem = numberMaximums[ass.level - 1];//该宗门目前人数上限
        let nowMem = ass.allMembers.length;//该宗门目前人数
        if (mostMem <= nowMem) {
            e.reply(`${assRelation.name}的弟子人数已经达到目前等级最大,无法加入`);
            return;
        }

        assPlayer.volunteerAss=association_name;
        ass.applyJoinList.push(usr_qq);
        await assUtil.setAssOrPlayer("association",association_name,ass);
        await assUtil.setAssOrPlayer("assPlayer",usr_qq,assPlayer);
        e.reply(`已成功发出申请！`)
        return ;
    }


    //退出宗门
    async Exit_association(e) {
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



        let now = new Date();
        let nowTime = now.getTime(); //获取当前时间戳
        let addTime;

        let time=this.xiuxianConfigData.CD.joinassociation;//分钟

        addTime = assPlayer.time[1] + 60000 * time;

        if (addTime > nowTime) {
            e.reply("加入宗门不满" + `${time}小时,无法退出`);
            return;
        }

        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);

        if (assPlayer.assJob != "master") {

            let JobName=assPlayer.assJob;
            ass.job[JobName] = ass.job[JobName].filter( item => item !== assPlayer.qqNumber);//原来的职位表删掉这个B
            ass.allMembers = ass.allMembers.filter( item => item !== assPlayer.qqNumber);//原来的职位表删掉这个B

            assPlayer.assName=0;
            assPlayer.assJob=0;
            assPlayer.favorability=0;

            await assUtil.setAssOrPlayer("association",ass.id, ass);//记录到存档
            await assUtil.assEffCount(assPlayer);
            await player_efficiency(usr_qq);
            e.reply("退出宗门成功");
        } else {


            if (ass.allMembers.length < 2) {
                fs.rmSync(`${assUtil.filePathMap.association}/${assPlayer.assName}.json`);

                assPlayer.assName=0;
                assPlayer.assJob=0;
                assPlayer.favorability=0;

                await assUtil.assEffCount(assPlayer);
                await player_efficiency(usr_qq);
                e.reply("退出宗门成功,退出后宗门空无一人,自动解散");
            } else {
                ass.allMembers = ass.allMembers.filter( item => item !== assPlayer.qqNumber);
                assPlayer.assName=0;
                assPlayer.assJob=0;
                assPlayer.favorability=0;

                await assUtil.assEffCount(assPlayer);
                await player_efficiency(usr_qq);
                //随机一个幸运儿的QQ,优先挑选等级高的
                let randMember_qq;
                if (ass.job.elder.length > 0) { randMember_qq = await get_random_fromARR(ass.job.elder); }
                else if (ass.job.innerDisciple.length > 0) { randMember_qq = await get_random_fromARR(ass.job.innerDisciple); }
                else if (ass.job.outDisciple.length > 0) { randMember_qq = await get_random_fromARR(ass.job.outDisciple); }
                else { randMember_qq = await get_random_fromARR(ass.allMembers); }

                let randMember = await assUtil.getAssOrPlayer(1, randMember_qq);//获取幸运儿的存档
                let JobRand=assPlayer.assJob;
                ass.job[JobRand] = ass.job[JobRand] .filter((item) => item != randMember_qq);//原来的职位表删掉这个幸运儿
                ass.master= randMember_qq;//新的职位表加入这个幸运儿
                randMember.assJob = "master";//成员存档里改职位

                await assUtil.setAssOrPlayer("association",ass.id, ass);//记录到存档
                await assUtil.assEffCount(randMember);
                await player_efficiency(randMember_qq);
                e.reply(`退出宗门成功,退出后,宗主职位由[${randMember.qqNumber}]接管`);
            }
        }
        return;
    }


    //捐赠灵石
    async give_association_lingshi(e) {
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
        let player = await Read_wealth(usr_qq);
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if(assPlayer.assName == 0){
            e.reply("你还没有宗门");
            return;
        }

        //获取灵石数量
        let reg = new RegExp(/#宗门(上交|上缴|捐赠)灵石/);
        let lingshi = e.msg.replace(reg, '');
        lingshi = lingshi.trim();//去掉空格

        if(!isNaN(parseFloat(lingshi)) && isFinite(lingshi)){
        }else{
            return;
        }


        //校验输入灵石数
        if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) > 0) {
            lingshi = parseInt(lingshi);
        }
        else {
            return;
        }
        if (player.lingshi < lingshi) {
            e.reply(`你身上只有${player.lingshi}灵石,数量不足`);
            return;
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        let assRelation = assUtil.assRelationList.find(item => item.id == assPlayer.assName);

        if (ass.spiritStoneAns + lingshi > spiritStoneAnsMax[ass.level - 1]) {
            e.reply(`${assRelation.name}的灵石池最多还能容纳${spiritStoneAnsMax[ass.level - 1] - ass.spiritStoneAns}灵石,请重新捐赠`);
            return;
        }
        ass.spiritStoneAns += lingshi;
        assPlayer.contributionPoints += Math.trunc(lingshi/15000);
        assPlayer.historyContribution += Math.trunc(lingshi/15000);
        player.lingshi -= lingshi;
        await Write_wealth(usr_qq,player);
        await assUtil.setAssOrPlayer("association",ass.id, ass);
        await assUtil.setAssOrPlayer("assPlayer",assPlayer.qqNumber, assPlayer);
        e.reply(`捐赠成功,你身上还有${player.lingshi - lingshi}灵石,宗门灵石池目前有${ass.spiritStoneAns}灵石`);
        return;
    }



    //宗门列表
    async List_appointment(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) { return; }
        let dir = assUtil.filePathMap.association;
        let File = fs.readdirSync(dir);
        File = File.filter(file => file.endsWith(".json"));

        let temp = ["宗门列表"];
        if (File.length == 0) {
            temp.push("暂时没有宗门数据");
        }

        for (let i = 0; i < File.length; i++) {
            let this_name = File[i].replace(".json", '');
            let assRelation = assUtil.assRelationList.find(item => item.id == this_name);
            let this_ass = await assUtil.getAssOrPlayer(2,this_name);
            let this_ass_xiuxian=0;
            if(this_ass.resident.name == 0){
                this_ass_xiuxian="无驻地";
            }else {
                this_ass_xiuxian=this_ass.resident.name;
            }
            let this_ass_beast = this_ass.divineBeast==0 ?"无神兽":this_ass.divineBeast ;
            temp.push(`序号:${1 + i} ` + '\n' + `宗名: ${assRelation.name}` + '\n' + `人数: ${this_ass.allMembers.length}/${numberMaximums[this_ass.level - 1]}` +
                "\n" + `等级: ${this_ass.level}` + '\n' + `宗门驻地: ${this_ass_xiuxian}` + '\n' +
                `宗主: ${this_ass.master}`+ '\n' +
                `宗门神兽: ${this_ass_beast}`
            );
        }
        await ForwardMsg(e, temp);
        return;
    }

}





/**
 * 判断对象是否不为undefined且不为null
 * @param obj 对象
 * @returns obj==null/undefined,return false,other return true
 */
function isNotNull(obj) {
    if (obj == undefined || obj == null)
        return false;
    return true;
}



/**
 * 我的宗门
 * @return image
 */
export async function get_association_img(e) {
    let usr_qq = e.user_id;
    //无存档
    let ifexistplay = await existplayer(usr_qq);
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


    //有加入宗门
    let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
    //寻找
    let master = await data.getData("player", ass.master);
    //门槛


    let elderMember = [];
    for (let item in ass.job.elder) {
        elderMember[item] = "道号："+data.getData("player", ass.job.elder[item]).name+"QQ："+ ass.job.elder[item].qqNumber
    }
    let innerMember = [];
    for (let item in ass.job.innerDisciple) {
        innerMember[item] = "道号："+data.getData("player", ass.job.innerDisciple[item]).name+"QQ："+ ass.job.innerDisciple[item].qqNumber
    }
    let outMember = [];
    for (let item in ass.job.outDisciple) {
        outMember[item] = "道号："+data.getData("player", ass.job.outDisciple[item]).name+"QQ："+ ass.job.outDisciple[item].qqNumber
    }
    let miscellaneousLabor = [];
    for (let item in ass.job.miscellaneousLabor) {
        miscellaneousLabor[item] = "道号："+data.getData("player", ass.job.miscellaneousLabor[item]).name+"QQ："+ ass.job.miscellaneousLabor[item].qqNumber
    }



    let association_data = {
        user_id: usr_qq,
        ass: ass,
        mainname: master.name,
        master: ass.master,
        elderMember: elderMember,
        innerMember: innerMember,
        outMember: outMember,
        miscellaneousLabor: miscellaneousLabor
    }


    const data1 = get_associationData(association_data);
    let img = await puppeteer.screenshot("association", {
        ...data1,
    });
    return img;

}


//我的宗门
async function get_associationData(myData) {
    base.model = "association";
    base.model0 = "association";
    return {
        ...base.screenData,
        saveId: "association",
        ...myData,
    };
}

async function get_random_fromARR(ARR) {
    let randindex = Math.trunc(Math.random() * ARR.length);
    return ARR[randindex];
}

