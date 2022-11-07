import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import assUtil from '../../model/assUtil.js'
import config from "../../model/Config.js"
import { segment } from "oicq"
import { Read_najie, Write_najie,timestampToTime,player_efficiency,Add_najie_thing,
    exist_najie_thing_id, existplayer,
    Read_level,
    Read_wealth,
    Write_wealth} from "../Xiuxian/Xiuxian.js";


//要DIY的话，确保这两个数组长度相等
const numberMaximums = [6, 8, 10, 13, 16, 18, 20 ,23 ,25];
const spiritStoneAnsMax = [2000000, 5000000, 8000000, 11000000, 15000000, 20000000 ,35000000, 50000000, 80000000];

/**
 * 宗门
 */

export class AssociationAdmin extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'AssociationAdmin',
            /** 功能描述 */
            dsc: '宗门模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^#开宗立派$',
                    fnc: 'Create_association'
                },
                {
                    reg: '^#(升级宗门|宗门升级)$',
                    fnc: 'lvup_association'
                },
                {
                    reg: '^任命.*',
                    fnc: 'Set_appointment'
                },
                {
                    reg: '^#逐出门派.*$',
                    fnc: 'Deleteusermax'
                },
                {
                    reg: "^#宗门改名.*$",
                    fnc: 'AssRename'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }




    //判断是否满足创建宗门条件
    async Create_association(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }

        let player = await Read_wealth(usr_qq);
        let playerLevel = await Read_level(usr_qq);

        let now_level = data.Level_list.find(item => item.id == playerLevel.level_id);

        if (now_level.id < 6) {
            e.reply("修为达到化神再来吧");
            return;
        }
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);

        if(assPlayer.assName!=0){
            e.reply("已经有宗门了");
            return;
        }

        if (player.lingshi < 100000) {
            e.reply("开宗立派是需要本钱的,攒到十万灵石再来吧");
            return;
        }

        //是否存在宗门令牌      否，return
        //是 令牌为中级或低级
        //中，是否四大隐藏有主            是，检测低级，否，随机获取四大宗门
        //低，进行普通创建

        let najieThingA =await exist_najie_thing_id(usr_qq,"6-2-41");
        let najieThingB =await exist_najie_thing_id(usr_qq,"6-2-42");

        if(najieThingA == 1){
            e.reply(`你尚无创建宗门的资格，请获取宗门令牌后再来吧`);
            return ;
        }
        //有令牌，可以开始创建宗门了
        if(najieThingB !=1){
            //有中级令牌
            //判断隐藏宗门是否被占完了

            let assName = [];
            assUtil.existAss("association","Ass000001") ? "":assName.push("Ass000001");
            assUtil.existAss("association","Ass000002") ? "":assName.push("Ass000002");
            assUtil.existAss("association","Ass000003") ? "":assName.push("Ass000003");
            assUtil.existAss("association","Ass000004") ? "":assName.push("Ass000004");


            if(assName.length !=0){
                //可以创建隐藏宗门
                player.lingshi -= 100000;
                await Write_wealth(usr_qq,player);

                let najie = await Read_najie(usr_qq);
                najie = await Add_najie_thing(najie, najieThingB, -1);
                await Write_najie(usr_qq, najie);
                let now = new Date();
                let nowTime = now.getTime(); //获取当前时间戳
                let date =  timestampToTime(nowTime);

                let location = Math.floor(Math.random() * assName.length);
                let association = {
                    "id": assName[location],
                    "level": 4,
                    "createTime": [date, nowTime],
                    "spiritStoneAns": 100000,
                    "resident": {
                        "id": 0,
                        "name": 0,
                        "level": 0
                    },
                    "facility": [
                        {
                            "buildNum": 0,
                            "status": 0,
                            "more2": 0,
                            "more3": 0
                        },
                        {
                            "buildNum": 0,
                            "status": 0,
                            "more2": 0,
                            "more3": 0
                        },
                        {
                            "buildNum": 0,
                            "status": 0,
                            "more2": 0,
                            "more3": 0
                        },
                        {
                            "buildNum": 0,
                            "status": 0,
                            "more2": 0,
                            "more3": 0
                        },
                        {
                            "buildNum": 0,
                            "status": 0,
                            "more2": 0,
                            "more3": 0
                        },
                        {
                            "buildNum": 0,
                            "status": 0,
                            "more2": 0,
                            "more3": 0
                        },
                        {
                            "buildNum": 0,
                            "status": 0,
                            "more2": 0,
                            "more3": 0
                        }
                    ],
                    "divineBeast": 0,
                    "master": usr_qq,
                    "job": {
                        "elder": [],
                        "innerDisciple": [],
                        "outDisciple": [],
                        "miscellaneousLabor": []
                    },
                    "allMembers": [usr_qq,],
                    "applyJoinList": [],
                    "more1": 0,
                    "more2": 0,
                    "more3": 0
                }


                let assPlayer = assUtil.getAssOrPlayer(1, usr_qq);
                assPlayer = {
                    "assName": assName[location],
                    "qqNumber":usr_qq,
                    "assJob": "master",
                    "effective": 0,
                    "contributionPoints": 0,
                    "historyContribution": 0,
                    "favorability":0,
                    "time": [date, nowTime]
                }
                await assUtil.setAssOrPlayer("association",assName[location], association);
                await assUtil.assEffCount(assPlayer);
                let assRelation = assUtil.assRelationList.find(item => item.id == assName[location]);
                e.reply(`恭喜你找到了${assRelation.name}遗址，继承其传承，建立了隐藏宗门${assRelation.name}！！！`)
                return ;
            }
        }

        //隐藏宗门没了，只能创建普通宗门，判断有无低级令牌
        if(najieThingA !=1){
            player.lingshi -= 100000;
            await data.setData("player",usr_qq,player);
            let najie =await Read_najie(usr_qq);
            await Add_najie_thing(najie,najieThingA,-1);
            await Write_najie(usr_qq,najie);
            //有低级令牌，可以创建普通宗门
            /** 设置上下文 */
            this.setContext('Get_association_name');
            /** 回复 */
            await e.reply('请发送宗门的名字,一旦设立,无法再改,请慎重取名,(宗门名字最多6个中文字符)', false, { at: true });
            return;
        }
    }

    /** 获取宗门名称 */
    async Get_association_name(e) {
        let usr_qq = e.user_id;
        /** 内容 */
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        let new_msg = this.e.message;
        if (new_msg[0].type != "text") {
            this.setContext('Get_association_name');
            await this.reply('请发送文本,请重新输入:');
            return;
        }
        let association_name = new_msg[0].text;
        if (association_name.length > 6) {
            this.setContext('Get_association_name');
            await this.reply('宗门名字最多只能设置6个字符,请重新输入:');
            return;
        }
        var reg = /[^\u4e00-\u9fa5]/g;//汉字检验正则
        var res = reg.test(association_name);
        //res为true表示存在汉字以外的字符
        if (res) {
            this.setContext('Get_association_name');
            await this.reply('宗门名字只能使用中文,请重新输入:');
            return;
        }
        let assRelation = assUtil.assRelationList.find(item => item.name == association_name);

        if (isNotNull(assRelation)) {
            this.setContext('Get_association_name');
            await this.reply('该宗门已经存在,请重新输入:');
            return;
        }

        let now = new Date();
        let nowTime = now.getTime(); //获取当前时间戳
        let date =  timestampToTime(nowTime);
        let assPlayer = assUtil.getAssOrPlayer(1, usr_qq);
        let id = assUtil.assRelationList[assUtil.assRelationList.length - 1].id;
        let replace = Number(id.replace("Ass00000","")) + 1;
        let association_id = "Ass00000"+ replace;

        let relation =   {
                "id": association_id,
                "name": association_name,
                "master": "宗主",
                "elder": "长老",
                "innerDisciple": "内门弟子",
                "outDisciple": "外门弟子",
                "miscellaneousLabor": "杂役",
                "unchartedName": association_id
            };
        let relationAll = assUtil.assRelationList;
        relationAll.push(relation);
        await assUtil.setAssOrPlayer("assRelation","AssRelation",relationAll);
        assPlayer = {
            "assName": association_id,
            "qqNumber":usr_qq,
            "assJob": "master",
            "contributionPoints": 0,
            "historyContribution": 0,
            "effective": 0,
            "favorability":0,
            "time": [date, nowTime]
        }
        await assUtil.setAssOrPlayer("assPlayer", usr_qq, assPlayer);
        await new_Association(association_id, usr_qq);
        await assUtil.assEffCount(assPlayer);
        await this.reply('宗门创建成功');
        /** 结束上下文 */
        this.finish('Get_association_name');
        //return association_name;
    }




    //升级宗门
    async lvup_association(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
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


        if (assPlayer.assJob != "master") {
            e.reply("只有宗主可以操作");
            return;
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        if (ass.level == numberMaximums.length) {
            e.reply("已经是最高等级宗门");
            return;
        }
        if (ass.spiritStoneAns < ass.level * 300000) {
            e.reply(`本宗门目前灵石池中仅有${ass.spiritStoneAns}灵石,当前宗门升级需要${ass.level * 300000}灵石,数量不足`);
            return;
        }

        let najieThingA =await exist_najie_thing_id(usr_qq,"6-2-42");
        let najieThingB =await exist_najie_thing_id(usr_qq,"6-2-43");

        let najie =await Read_najie(usr_qq);

        if (ass.level == 3){
            if(najieThingA == 1){
                e.reply(`升级中等宗门需要对应令牌，快去获取吧`);
                return ;
            }
            najie = await Add_najie_thing(najie, najieThingA, -1);
        }


        if (ass.level == 6){
            if(najieThingB == 1){
                e.reply(`升级上等宗门需要对应令牌，快去获取吧`);
                return ;
            }
            najie = await Add_najie_thing(najie, najieThingB, -1);

        }

        ass.spiritStoneAns -= ass.level * 300000;
        ass.level += 1;
        await assUtil.setAssOrPlayer("association",ass.id, ass);
        await Write_najie(usr_qq,najie);
        await assUtil.assEffCount(assPlayer);
        await player_efficiency(usr_qq);
        e.reply("宗门升级成功" + `当前宗门等级为${ass.level},宗门人数上限提高到:${numberMaximums[ass.level - 1]}`);
        return;
    }


    //任命职位
    async Set_appointment(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let isat = e.message.some((item) => item.type === "at");
        if (!isat) { return; }//没有at信息直接返回,不执行
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


        if (assPlayer.assJob != "master") {
            e.reply("只有宗主可以操作");
            return;
        }

        let atItem = e.message.filter((item) => item.type === "at");//获取at信息
        let member_qq = atItem[0].qq;
        if (usr_qq == member_qq) { e.reply("???"); return; }//at宗主自己,这不扯犊子呢

        let ass = await assUtil.getAssOrPlayer(2,assPlayer.assName);
        let isinass = ass.allMembers.find(item => item == member_qq);
        if (!isinass) { e.reply("只能设置宗门内弟子的职位"); return; }

        let member = assUtil.getAssOrPlayer(1, member_qq);//获取这个B的存档
        let now_apmt = member.assJob//这个B现在的职位
        let full_apmt = 0;
        //检索输入的第一个职位
        var reg = new RegExp(/长老|外门弟子|内门弟子|杂役/);
        let appointment = reg.exec(e.msg);//获取输入的职位
        if (appointment == now_apmt) { e.reply(`此人已经是本宗门的${appointment}`); return; }

        if (appointment == "长老") {
            full_apmt = Math.ceil(ass.level/3) * 2;
            if(ass.job.elder.length >= full_apmt){
                e.reply(`本宗门的${appointment}人数已经达到上限`);
                return;
            }

            //这里做了长老不能被任命的限制，在association.js文件中，有成为长老的指令
            //长老不能被踢出宗门，不能被主动任命，只能靠发起对战抢夺
            //如果需要取消任命限制，将下面两行删除即可

            e.reply(`长老职位不能被任命`);
            return ;

        }
        else if (appointment == "内门弟子") {
            full_apmt = 4 + Math.ceil(ass.level/3) * 4;
            if(ass.job.innerDisciple.length >= full_apmt){
                e.reply(`本宗门的${appointment}人数已经达到上限`);
                return;
            }

        }

        await nominationJob(member,ass,appointment);
        e.reply(`任命成功！！！`);
        return ;

    }



    async AssRename(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);
        if(assPlayer.assName == 0) {
            e.reply("你还没有宗门");
            return;
        }

        if (assPlayer.assJob != "master") {
            e.reply("只有宗主可以操作");
            return;
        }

        if(assUtil.assRelationList.findIndex(item => item.id == ass.id) <= 3){
            e.reply(`请好好继承隐藏宗门的传承吧，就不要想着改名了!!!`);
            return ;
        }
        let association_name = e.msg.replace("#宗门改名", '');
        association_name = association_name.trim();

        if (ass.spiritStoneAns < 100000) {
            e.reply(`宗门更名需要10w灵石,攒够钱再来吧`);
            return;
        }
        ass.spiritStoneAns -=100000;
        await assUtil.setAssOrPlayer("association",ass.id,ass);
        await assUtil.assRename(ass.id,1,association_name);
        e.reply(`改名成功，宗门当前名称为${association_name}`);
        return ;
    }


    async Deleteusermax(e){
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let playerA = assUtil.getAssOrPlayer(1,usr_qq);
        if(playerA.assName == 0) {
            e.reply("你还没有宗门");
            return;
        }


        if (playerA.assJob != "master") {
            if(playerA.assJob != "elder"){
                e.reply("只有宗主或长老可以操作");
                return;
            }
        }

        let menpai = e.msg.replace("#", '');

        menpai = menpai.replace("逐出门派", '');

        let member_qq = menpai;

        if (usr_qq == member_qq) { e.reply("???"); return; }

        let ifexistplayB = await existplayer(member_qq);
        if (!ifexistplayB) {
            e.reply(`${member_qq}此人未踏入仙途！`);
            return;
        }
        let playerB = await assUtil.getAssOrPlayer(1,member_qq);
        if (isNotNull(playerB)) {
            if(playerB.assName == 0){
                e.reply("对方尚未加入宗门");
                return;
            }
        }else {
            e.reply("对方尚未加入宗门");
            return;
        }

        let bss = assUtil.getAssOrPlayer(2,playerB.assName);
        if(playerA.assName!=playerB.assName){
            return;
        }
        if (playerB.assJob == "宗主" || playerB.assJob == "长老") {
            e.reply(`无权进行此操作`);
            return;
        }
        let jobName =playerB.assJob;
        bss.job[jobName] = bss.job[jobName].filter(item => item != member_qq);
        bss.allMembers = bss.allMembers.filter(item => item != member_qq);
        playerB.favorability=0;
        playerB.assJob=0;
        playerB.assName=0;
        await assUtil.setAssOrPlayer("association",bss.id, bss);
        await assUtil.assEffCount(playerB);
        await player_efficiency(member_qq);
        e.reply("已踢出！");
        return ;
    }

}


/**
 * 创立新的宗门
 * @param name 宗门名称
 * @param holder_qq 宗主qq号
 */
async function new_Association(name, holder_qq) {
    let now = new Date();
    let nowTime = now.getTime(); //获取当前时间戳
    let date = timestampToTime(nowTime);
    let Association = {
        "id": name,
        "level": 1,
        "createTime": [date, nowTime],
        "spiritStoneAns": 0,
        "resident": {
            "id": 0,
            "name": 0,
            "level": 0
        },
        "facility":[
            {
                "buildNum":0,
                "more1":0,
                "more2":0,
                "more3":0
            },
            {
                "buildNum":0,
                "more1":0,
                "more2":0,
                "more3":0
            },
            {
                "buildNum":0,
                "more1":0,
                "more2":0,
                "more3":0
            },
            {
                "buildNum":0,
                "more1":0,
                "more2":0,
                "more3":0
            },
            {
                "buildNum":0,
                "more1":0,
                "more2":0,
                "more3":0
            },
            {
                "buildNum":0,
                "more1":0,
                "more2":0,
                "more3":0
            },
            {
                "buildNum":0,
                "more1":0,
                "more2":0,
                "more3":0
            }
        ],

        "divineBeast":0,

        "master": holder_qq,
        "job":{
            "elder":[],
            "innerDisciple":[],
            "outDisciple":[],
            "miscellaneousLabor":[]
        },
        "allMembers": [holder_qq,],
        "applyJoinList": [],
        "more1":0,
        "more2":0,
        "more3":0
    }

    let uncharted = [[],[],[]];
    let treasureVault = {
        "id": name,
        "Grade": "宗门秘境",
        "Price": 100000,
        "experience": 200000,
        "one": [],
        "two": [],
        "three": []
    }


    assUtil.setAssOrPlayer("association",name, Association);
    assUtil.setAssOrPlayer("assUncharted",name, uncharted);
    assUtil.setAssOrPlayer("assTreasureVault",name, treasureVault);
    return;
}



//sleep
async function sleep(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    })
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



async function nominationJob(member,ass,newJob) {
    let oldJob = member.assJob;
    //成员存档里改职位
    let newJobName=await switchJob(newJob);
    member.assJob = newJobName;


    ass.job[oldJob] = ass.job[oldJob].filter( item => item !== member.qqNumber);//原来的职位表删掉这个B
    ass.job[newJobName].push(member.qqNumber);//新的职位表加入这个B
    await assUtil.setAssOrPlayer("assPlayer",member.qqNumber, member);//记录到存档
    await assUtil.setAssOrPlayer("association",ass.id, ass);//记录到存档
    return;
}

//传入中文职位，转换成宗门信息中的职位英文
async function switchJob(job) {
    let jobList=["长老","内门弟子","外门弟子","杂役"];
    let location = jobList.findIndex( item=> item == job);
    switch (location) {
        case 0:
            job="elder";
            break;
        case 1:
            job="innerDisciple";
            break;
        case 2:
            job="outDisciple";
            break;
        case 3:
            job="miscellaneousLabor";
            break;
        default:
            job="miscellaneousLabor"
            break;
    }
    return job;
}


