import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import assUtil from '../../model/assUtil.js'
import config from "../../model/Config.js"
import {timestampToTime,player_efficiency,isNotNull,ForwardMsg,existplayer, Read_battle, Read_level, Write_battle} from "../Xiuxian/Xiuxian.js";
import { segment } from "oicq"

//要DIY的话，确保这两个数组长度相等
const numberMaximums = [6, 8, 10, 13, 16, 18, 20 ,23 ,25];
const spiritStoneAnsMax = [2000000, 5000000, 8000000, 11000000, 15000000, 20000000 ,35000000, 50000000, 80000000];
/**
 * 宗门
 */
export class AssociationJoin extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'AssociationJoin',
            /** 功能描述 */
            dsc: '宗门模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^#查看简历.*$',
                    fnc: 'View_Resume'
                },
                {
                    reg: '^#批准录取.*$',
                    fnc: 'Approval_Admission'
                },
                {
                    reg: '^#驳回申请.*$',
                    fnc: 'Denial_Application'
                },
                {
                    reg: '^#清空志愿$',
                    fnc: 'Clear_Volunteer'
                },
                {
                    reg: '^#展示所有简历$',
                    fnc: 'Show_All_Resume'
                },
                {
                    reg: '^#成为长老$',
                    fnc: 'FetchJob_Elder'
                },
                {
                    reg: '^#发起职位挑战.*$',
                    fnc: 'Launch_Job_Challenge'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    async FetchJob_Elder(e){
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
        if(assPlayer.assName == 0) {
            e.reply("你还没有宗门");
            return;
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        if(assPlayer.assJob == "master" || assPlayer.assJob == "elder"){
            return ;
        }

        let full_apmt = Math.ceil(ass.level/3) * 2;
        if(ass.job.elder.length >= full_apmt){
            e.reply(`本宗门的长老人数已经达到上限`);
            return;
        }

        ass.job[assPlayer.assJob] = ass.job[assPlayer.assJob].filter(item => item != usr_qq);
        assPlayer.assJob="elder";
        ass.job.elder.push(usr_qq+"");
        await assUtil.setAssOrPlayer("association",ass.id,ass);
        await assUtil.assEffCount(assPlayer);
        e.reply(`恭喜你成为了本宗门的长老！`);
        return ;
    }


    async Launch_Job_Challenge(e){
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
        if(assPlayer.assName == 0) {
            return;
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        if(assPlayer.assJob == "master" || assPlayer.assJob == "elder"){
            return ;
        }

        let battleQQ = e.msg.replace("#发起职位挑战", '');
        let ifexists = await existplayer(battleQQ);
        if (!ifexists) {
            return;
        }

        if(!assUtil.existAss("assPlayer",battleQQ)){
            return;
        }
        let battlePlayer = assUtil.getAssOrPlayer(1,battleQQ);
        if(battlePlayer.assName == 0) {
            return;
        }
        if(assPlayer.assName != battlePlayer.assName){
            return ;
        }
        if(battlePlayer.assJob!="elder"){
            return ;
        }
        let playerA=data.getData("player",usr_qq);
        let playerB=data.getData("player",battleQQ);
        let Data_battle = await battle(playerA,playerB);
        let msg = Data_battle.msg;

        if (msg.length > 30) {
            e.reply("战斗过程略...");
        } else {
            await ForwardMsg(e, msg);
        }

        if(Data_battle.victory==playerA){

            ass.job[assPlayer.assJob] = ass.job[assPlayer.assJob].filter(item => item!=usr_qq);
            ass.job.elder.push(usr_qq+"");
            ass.job.elder = ass.job.elder.filter(item => item != battleQQ);
            ass.job.miscellaneousLabor.push(battleQQ);
            assPlayer.assJob="elder";
            battlePlayer.assJob="miscellaneousLabor";
            await assUtil.setAssOrPlayer("association",ass.id,ass);
            await assUtil.assEffCount(assPlayer)
            await assUtil.assEffCount(battlePlayer);
            e.reply(`你强大的实力引来众人的赞叹，纷纷认为你是成为长老的最佳人选，对面自知技不如人，灰溜溜地让出了长老之位！`);
            return ;
        }else {
            e.reply(`你不自量力想挑战对方，不仅没获得长老职位，还被宗门众人嘲笑了一番，莫欺少年穷，你决定重振旗鼓潜心修炼，下次再来！`);
            return ;
        }
    }


    async View_Resume(e){
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }

        let joinQQ = e.msg.replace("#查看简历", '');
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);

        if(assPlayer.assName == 0) {
            return;
        }

        let joinPlayer = await Read_level(joinQQ);
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        let find = ass.applyJoinList.findIndex(item => item == joinQQ);
        if(find == -1){
            return ;
        }

        if(assPlayer.assJob !="master"){
            if(assPlayer.assJob!="elder"){
                e.reply(`权限不足`);
                return ;
            }
        }


        let msg = `qq号:${joinQQ} ` + '\n' + '\n' + `练气境界: ${joinPlayer.levelname}` +
            "\n" + `境界阶段: ${joinPlayer.rank_name}` + '\n' + `炼体境界: ${joinPlayer.levelnamemax}` + '\n';
        e.reply(msg);
        return ;

    }


    async Clear_Volunteer(e){
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

        if(assPlayer.volunteerAss == 0){
            return ;
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.volunteerAss);
        if(!isNotNull(ass)){
            assPlayer.volunteerAss=0;
            await assUtil.setAssOrPlayer("assPlayer",usr_qq,assPlayer);
            e.reply(`清除成功！`);
            return ;
        }else {
            assPlayer.volunteerAss=0;
            ass.applyJoinList = ass.applyJoinList.filter(item => item!=usr_qq);
            await assUtil.setAssOrPlayer("assPlayer",usr_qq,assPlayer);
            await assUtil.setAssOrPlayer("association",ass.id,ass);
            e.reply(`清除成功！`);
            return ;
        }


    }

    async Approval_Admission(e){
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }

        let joinQQ = e.msg.replace("#批准录取", '');
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        if(!assUtil.existAss("assPlayer",joinQQ)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if(assPlayer.assName == 0){
            return;
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        let find = ass.applyJoinList.findIndex(item => item == joinQQ);
        if(find == -1){
            return ;
        }
        let joinPlayer = assUtil.getAssOrPlayer(1,joinQQ);

        if(assPlayer.assJob == "master" || assPlayer.assJob=="elder"){

            let now = new Date();
            let nowTime = now.getTime(); //获取当前时间戳
            let date = timestampToTime(nowTime);
            joinPlayer.assName=ass.id;
            joinPlayer.assJob="miscellaneousLabor";
            joinPlayer.volunteerAss=0;
            joinPlayer.time=[date, nowTime];

            ass.allMembers.push(joinQQ);
            ass.job.miscellaneousLabor.push(joinQQ);
            ass.applyJoinList = ass.applyJoinList.filter(item => item != joinQQ);
            await assUtil.setAssOrPlayer("association",ass.id, ass);
            await assUtil.assEffCount(joinPlayer);
            await player_efficiency(joinQQ);
            e.reply(`已批准${joinQQ}的入宗申请，恭喜你的宗门又招收到一位新弟子`);
            return;

        }else {
            e.reply(`你没有权限`);
            return ;
        }

    }

    async Denial_Application(e){
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }

        let joinQQ = e.msg.replace("#驳回申请", '');

        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        if(!assUtil.existAss("assPlayer",joinQQ)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if(assPlayer.assName == 0){
            return;
        }
        if(assPlayer.assJob !="master"){
            if(assPlayer.assJob!="elder"){
                e.reply(`权限不足`);
                return ;
            }
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        var find = ass.applyJoinList.findIndex(item => item == joinQQ);
        if(find == -1){
            return ;
        }

        let joinPlayer = assUtil.getAssOrPlayer(1,joinQQ);

        joinPlayer.volunteerAss=0;
        ass.applyJoinList = ass.applyJoinList.filter(item => item!=joinQQ);
        await assUtil.setAssOrPlayer("assPlayer",joinQQ,joinPlayer);
        await assUtil.setAssOrPlayer("association",ass.id,ass);
        e.reply(`已拒绝！`);
        return ;
    }

    async Show_All_Resume(e){
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
            return;
        }

        if(assPlayer.assJob !="master"){
            if(assPlayer.assJob!="elder"){
                e.reply(`权限不足`);
                return ;
            }
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        if(ass.applyJoinList.length == 0){
            e.reply(`你的宗门还没有收到任何简历！！！快去招收弟子吧！`);
            return ;
        }


        let temp = ["简历列表"];

        for (var i = 0; i < ass.applyJoinList.length; i++) {
            temp.push(`序号:${1 + i} ` + '\n' + `申请人QQ: ${ass.applyJoinList[i]}` + '\n');
        }
        await ForwardMsg(e, temp);
        return;

    }


}


export async function battle(A, B) {
    let A_qq = await A;
    let B_qq = await B;
    let playerA = await Read_battle(A_qq);
    let playerB = await Read_battle(B_qq);
    let bloodA = await playerA.nowblood;
    let bloodB = await playerB.nowblood;
    let hurtA = await playerA.attack - playerB.defense;
    let hurtB = await playerB.attack - playerA.defense;
    //伤害需要大于0
    if (hurtA <= 0) {
        hurtA = 0;//破不了防御，没伤害
    }
    if (hurtB <= 0) {
        hurtB = 0;//破不了防御，没伤害
    }
    let victory = await A_qq;
    let msg = [];
    let x = 0;
    /**
     * 默认A为主动方，敏捷+5
     */
    if (playerA.speed + 5 >= playerB.speed) {
        x = 0;
        //确认敏捷足够A、先手
    } else {
        //B先手
        x = 1;
    }
    while (bloodA > 0 && bloodB > 0) {
        if (bloodA <= 0) {
            //A输了
            victory = await B_qq;
            msg.push("你没血了");
            break;
        }
        if (bloodB <= 0) {
            msg.push("对方没血了");
            break;
        }
        let hurtAA = hurtA;
        let hurtBB = hurtB;
        /**
         * 先手
         */
        if (x == 0) {
            if (await battlebursthurt(playerA.burst)) {
                hurtAA = hurtAA * (playerA.burstmax + 1);
            }
            bloodB = await bloodB - hurtAA;
            msg.push("你向发对方动了攻击，对[" + playerB.name + "]造成了" + hurtAA + "伤害，对方血量剩余" + bloodB > 0 ? bloodB : 0);
            if (bloodB <= 0) {
                victory = await A_qq;
                bloodB = 0;
                break;
            }

            if (await battlebursthurt(playerB.burst)) {
                hurtBB = hurtAA * (playerB.burstmax + 1);
            }
            bloodA = await bloodA - hurtBB;
            msg.push("对方向你发动了攻击，对[" + playerA.name + "]造成了" + hurtBB + "伤害，你血量剩余" + bloodA > 0 ? bloodA : 0);
            if (bloodA <= 0) {
                victory = await B_qq;
                bloodA = 0;
                break;
            }
        }
        else {
            if (await battlebursthurt(playerB.burst)) {
                hurtBB = hurtAA * (playerB.bursthurt + 1);
            }
            bloodA = await bloodA - hurtBB;
            if (bloodA <= 0) {
                victory = await B_qq;
                bloodA = 0;
            }
            msg.push("对方向你，发动了攻击，对[" + playerA.name + "]造成了" + hurtBB + "伤害，你血量剩余" + bloodA);
            if (bloodA <= 0) {
                break;
            }
            if (await battlebursthurt(playerA.burst)) {
                hurtAA = hurtAA * (playerA.bursthurt + 1);
            }
            bloodB = await bloodB - hurtAA;
            if (bloodB <= 0) {
                victory = await A_qq;
                bloodB = 0;
            }
            msg.push("你向对方发动了攻击，对[" + playerB.name + "]造成了" + hurtAA + "伤害，对方血量剩余" + bloodB);
            if (bloodB <= 0) {
                break;
            }
        }
    }
    playerA.nowblood -= bloodA;
    playerB.nowblood -= bloodB;
    await Write_battle(A, playerA);
    await Write_battle(B, playerB);
    let battle = {
        "msg": msg,
        "victory": victory
    }
    return battle;
}

/**
 * 随机取。判断是否暴
 */
export async function battlebursthurt(x) {
    let bursthurt = x;
    if (bursthurt >= 1) {
        //大于1，直接暴
        return true;
    }
    let y = Math.random();
    if (bursthurt > y) {
        return true;
    }
    //默认不暴
    return false;
}


