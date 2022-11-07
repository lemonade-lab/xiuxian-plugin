import plugin from '../../../../lib/plugins/plugin.js'
import assUtil from '../../model/assUtil.js'
import config from "../../model/Config.js"
import fs from "fs"
import { segment } from "oicq"
import {Read_player,ForwardMsg,shijianc,Read_battle, Read_level,existplayer} from "../Xiuxian/Xiuxian.js";

const buildNameList = ["山门","藏宝阁","宗门秘境","神兽道场","聚灵阵","护宗大阵","药园"];
const spiritStoneAnsMax = [2000000, 5000000, 8000000, 11000000, 15000000, 20000000 ,35000000, 50000000, 80000000];

/**
 * 洞天福地
 */
export class BlessPlace extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'BlessPlace',
            /** 功能描述 */
            dsc: '宗门驻地模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 9999,
            rule: [
                {
                    reg: '^#洞天福地列表$',
                    fnc: 'List_blessPlace'
                },
                {
                    reg: '^#开采灵脉$',
                    fnc: 'exploitation_vein'
                },
                {
                    reg: '^#入驻洞天.*$',
                    fnc: 'Settled_Blessed_Place'
                },
                {
                    reg: '^#修建.*$',
                    fnc: 'construction_Guild'
                },
                {
                    reg: '^#查看宗门战力总和$',
                    fnc: 'show_Association_Power'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }



    async show_Association_Power(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        //用户不存在
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
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        let attackPower = 0;
        for (let i in ass.allMembers) {
            //遍历所有成员
            let member_qq = ass.allMembers[i];
            //(攻击+防御+生命*0.5)*暴击率=理论战力
            let member_data = await Read_battle(member_qq);
            let power=(member_data.attack+member_data.defense*0.8+member_data.hpmax*0.5)*(member_data.burst.toFixed(2));

            power = Math.trunc(power);
            attackPower+=power;
        }
        e.reply(`你的宗门战斗力总和为${attackPower}`);
        return ;

    }


    //秘境地点
    async List_blessPlace(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let addres="洞天福地";
        let weizhi = assUtil.blessPlaceList;
        await GoBlessPlace(e, weizhi, addres);
    }

    //入驻洞天
    async Settled_Blessed_Place(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        //用户不存在
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        //无宗门
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if(assPlayer.assName == 0){
            e.reply("你还没有宗门");
            return;
        }
        //职位不符
        if (assPlayer.assJob != "master") {
            e.reply("只有宗主可以操作");
            return;
        }

        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);


        //输入的洞天是否存在
        let  blessed_name = e.msg.replace("#入驻洞天", '');
        blessed_name = blessed_name.trim();
        //洞天不存在
        let dongTan = await assUtil.blessPlaceList.find(item => item.name == blessed_name);
        if (!isNotNull(dongTan)) {
            return;
        }

        if(ass.resident.name == blessed_name){
            e.reply(`咋的，要给自己宗门拆了重建啊`);
            return ;
        }

        //洞天是否已绑定宗门

        let dir = assUtil.filePathMap.association;
        let File = fs.readdirSync(dir);
        File = File.filter(file => file.endsWith(".json"));//这个数组内容是所有的宗门名称

        //遍历所有的宗门
        for (var i = 0; i < File.length; i++) {
            let this_name = File[i].replace(".json", '');
            let this_ass = await assUtil.getAssOrPlayer(2,this_name);

            if(this_ass.resident.name==dongTan.name){
                //找到了驻地为当前洞天的宗门，说明该洞天被人占据
                //开始战力计算，抢夺洞天

                let attackPower=0;
                let defendPower=0;

                for (let i in ass.allMembers) {
                    //遍历所有成员
                    let member_qq = ass.allMembers[i];
                    //(攻击+防御+生命*0.5)*暴击率=理论战力
                    let member_data = await Read_player(member_qq);
                    let power=(member_data.attack+member_data.defense*0.8+member_data.hpmax*0.5)*(member_data.burst.toFixed(2));

                    power = Math.trunc(power);
                    attackPower+=power;
                }

                for (let i in this_ass.allMembers) {
                    //遍历所有成员
                    let member_qq = this_ass.allMembers[i];
                    //(攻击+防御+生命*0.5)*暴击率=理论战力
                    let member_data = await Read_player(member_qq);
                    let power=(member_data.attack+member_data.defense*0.8+member_data.hpmax*0.5)*(member_data.burst.toFixed(2));

                    power = Math.trunc(power);
                    defendPower+=power;
                }

                let randomA=Math.random();
                let randomB=Math.random();
                if(randomA>0.75){
                    //进攻方状态大好，战力上升10%
                    attackPower= Math.trunc(attackPower*1.1);
                }
                if(randomA < 0.25){
                    attackPower= Math.trunc(attackPower*0.9);
                }

                if(randomB>0.75){
                    defendPower= Math.trunc(defendPower*1.1);
                }
                if(randomB < 0.25){
                    defendPower= Math.trunc(defendPower*0.9);
                }
                //防守方大阵血量加入计算
                if(this_ass.facility[5].status == 1){
                    defendPower+=Math.trunc(this_ass.facility[5].buildNum / 200) * this_ass.level * 300000;
                }

                if(attackPower > defendPower){
                    //抢夺成功了，更改双方驻地信息

                    ass.resident=dongTan;
                    this_ass.resident= {
                        "id": 0,
                        "name": 0,
                        "level": 0
                    };
                    this_ass.facility=this_ass.facility.map(function (i) {
                        i.buildNum=0;
                        i.status=0;
                        return i;
                    });
                    this_ass.divineBeast=0;
                    await assUtil.setAssOrPlayer("association",ass.id,ass);
                    await assUtil.setAssOrPlayer("association",this_ass.id,this_ass);
                    e.reply(`当前洞天已有宗门占据，${ass.id}抢夺驻地成功,将${this_ass.id}赶了出去,占据了${dongTan.name}`);
                }else {
                    if(attackPower/defendPower > 0.5){
                        this_ass.facility[5].buildNum=0;
                        this_ass.facility[5].status=0;
                    }
                    else if(attackPower/defendPower > 0.25){
                        if(this_ass.facility[5].buildNum > 200){
                            this_ass.facility[5].buildNum -=200;
                            this_ass.facility[5].status=0;
                        }else {
                            this_ass.facility[5].buildNum=0;
                            this_ass.facility[5].status=0;
                        }
                    }
                    await assUtil.setAssOrPlayer("association",ass.id,ass);
                    await assUtil.setAssOrPlayer("association",this_ass.id,this_ass);
                    e.reply(`当前洞天已有宗门占据，奈何对方宗门战力过于强大，抢夺洞天失败了`);
                }
                return ;
            }
        }

        //到这还没返回，说明是无主洞天，直接入驻
        //宗门中写洞天信息

        ass.resident=dongTan;
        ass.facility=ass.facility.map(function (i) {
            i.buildNum=0;
            i.status=0;
            return i;
        });
        await assUtil.setAssOrPlayer("association",ass.id, ass);
        e.reply(`入驻成功,${ass.id}当前驻地为：${dongTan.name}`);
        return ;

    }

    async exploitation_vein(e){
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        //无宗门
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
            e.reply(`你的宗门还没有驻地哦，没有灵脉可以开采`);
            return ;
        }

        let now = new Date();
        let nowTime = now.getTime(); //获取当前日期的时间戳
        let Today = await shijianc(nowTime);
        let lastExplorTime = await shijianc(assPlayer.lastExplorTime);//获得上次宗门签到日期
        if (Today.Y == lastExplorTime.Y && Today.M == lastExplorTime.M && Today.D == lastExplorTime.D) {
            e.reply(`今日已经开采过灵脉，不可以竭泽而渔哦，明天再来吧`);
            return;
        }
        assPlayer.lastExplorTime = nowTime;

        let gift_lingshi = 0 ;
        let player = await Read_level(usr_qq);
        gift_lingshi = 5000 *  ass.resident.level * player.level_id;

        let num =Math.trunc(gift_lingshi);

        if (ass.spiritStoneAns + num > spiritStoneAnsMax[ass.level - 1]) {
            ass.spiritStoneAns=spiritStoneAnsMax[ass.level - 1];
        }else {
            ass.spiritStoneAns += num;
        }

        assPlayer.contributionPoints+=Math.trunc(num/20000);
        assPlayer.historyContribution+=Math.trunc(num/20000);
        await assUtil.setAssOrPlayer("association",ass.id, ass);
        await assUtil.setAssOrPlayer("assPlayer",usr_qq, assPlayer);
        e.reply(`本次开采灵脉为宗门灵石池贡献了${gift_lingshi}灵石，你获得了`+Math.trunc(num/20000)+`点贡献点`);

        return ;
    }



    async construction_Guild(e){
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        //用户不存在
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = await Read_level(usr_qq);
        //无宗门
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if(assPlayer.assName == 0){
            e.reply("你还没有宗门");
            return;
        }

        let ass = await assUtil.getAssOrPlayer(2,assPlayer.assName);
        if(ass.resident.name==0){
            e.reply(`你的宗门还没有驻地，无法建设宗门`);
            return ;
        }

        let  buildName = e.msg.replace("#修建", '');
        buildName = buildName.trim();
        //洞天不存在
        let location = buildNameList.findIndex(item => item == buildName);
        if (location == -1) {
            return;
        }
        if(location!=0 && ass.facility[0].status == 0){
            e.reply(`宗门驻地里连块平地都没有,你修建啥呀,先给山门修修吧`);
            return ;
        }


        //todo 写入配置
        let CDTime = 60;
        let ClassCD = ":buildFacility";
        let now_time = new Date().getTime();
        let cdSecond =await redis.ttl("xiuxian:player:" + usr_qq + ClassCD);
        if(cdSecond!= -2){
            if(cdSecond == -1){
                e.reply(`修建cd状态残留，请联系机器人管理员处理！`);
                return ;
            }
            e.reply(`修建cd中，剩余${cdSecond}秒！`);
            return ;
        }

        await redis.set("xiuxian:player:" + usr_qq + ClassCD ,now_time);
        await redis.expire("xiuxian:player:" + usr_qq + ClassCD , CDTime * 60);

        let add = Math.trunc(player.level_id/10)+3;

        ass.facility[location].buildNum+=add;
        switch (location) {
            case 0:
                if(ass.facility[location].buildNum > 100){
                    ass.facility[location].status=1;
                }
                break;
            case 1:
                if(ass.facility[location].buildNum > 500){
                    ass.facility[location].status=1;
                }
                break;
            case 2:
                if(ass.facility[location].buildNum > 500){
                    ass.facility[location].status=1;
                }
                break;
            case 3:
                if(ass.facility[location].buildNum > 200){
                    ass.facility[location].status=1;
                }
                break;
            case 4:
                if(ass.facility[location].buildNum > 200){
                    ass.facility[location].status=1;
                }
                break;
            case 5:
                if(ass.facility[location].buildNum > 200){
                    ass.facility[location].status=1;
                }
                break;
            case 6:
                if(ass.facility[location].buildNum > 300){
                    ass.facility[location].status=1;
                }
                break;
            default:
                e.reply(`好像出错了呢qwq`);
                break;

        }
        let msg = ass.facility[location].status == 0 ? "未启用": "启用";
        assPlayer.contributionPoints+=Math.ceil(add/2)-1;
        assPlayer.historyContribution+=Math.ceil(add/2)-1;
        await assUtil.setAssOrPlayer("association",ass.id, ass);
        await assUtil.setAssOrPlayer("assPlayer",usr_qq, assPlayer);
        e.reply(`建设成功，为${buildName}增加了${add}点建设值，当前该设施建设总值为${ass.facility[location].buildNum},状态为`+msg);
        return ;
    }
}


/**
 * 地点查询
 */
async function GoBlessPlace(e, weizhi, addres) {
    let adr = addres;
    let msg = [
        "***" + adr + "***"
    ];
    for (var i = 0; i < weizhi.length; i++) {
        msg.push(weizhi[i].name + "\n" + "等级：" + weizhi[i].level + "\n"  + "修炼效率：" + weizhi[i].efficiency * 100 + "%");
    }
    await ForwardMsg(e, msg);
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

