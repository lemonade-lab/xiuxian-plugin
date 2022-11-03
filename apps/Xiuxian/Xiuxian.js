import plugin from '../../../../lib/plugins/plugin.js'
import fs from "fs"
import path from "path"
import data from '../../model/XiuxianData.js'
const __dirname = path.resolve() + path.sep + "plugins" + path.sep + "xiuxian-emulator-plugin";
export const __PATH = {
    player: path.join(__dirname, "/resources/data/birth/xiuxian/player"),
    action: path.join(__dirname, "/resources/data/birth/xiuxian/action"),
    battle: path.join(__dirname, "/resources/data/birth/xiuxian/battle"),
    equipment: path.join(__dirname, "/resources/data/birth/xiuxian/equipment"),
    level: path.join(__dirname, "/resources/data/birth/xiuxian/level"),
    talent: path.join(__dirname, "/resources/data/birth/xiuxian/talent"),
    wealth: path.join(__dirname, "/resources/data/birth/xiuxian/wealth"),
    najie: path.join(__dirname, "/resources/data/birth/xiuxian/najie"),
    Exchange: path.join(__dirname, "/resources/data/birth/Exchange"),
    Forum: path.join(__dirname, "/resources/data/birth/Forum"),
    life: path.join(__dirname, "/resources/data/birth/xiuxian/life")
}
export class Xiuxian extends plugin {
    constructor() {
        super({
            name: 'Xiuxian',
            dsc: 'Xiuxian',
            event: 'message',   
            priority: 800,
            rule: []
        })
    }

}

async function Read(usr_qq,PATH) {
    let dir = path.join(`${PATH}/${usr_qq}.json`);
    let player = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            return "error";
        }
        return data;
    })
    player = JSON.parse(player);
    return player;
}
async function Write(usr_qq,player,PATH){
    let dir = path.join(PATH, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(player, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
    })
    return;
}
export async function Read_player(usr_qq) {
    return await Read(usr_qq,__PATH.player);;
}
export async function Write_player(usr_qq, player) {
    await Write(usr_qq,player,__PATH.player);
    return;
}
//检查存档是否存在，存在返回true
export async function existplayer(usr_qq) {
    let exist_player = fs.existsSync(`${__PATH.player}/${usr_qq}.json`);
    if (exist_player) {
        return true;
    }
    return false;
}
export async function Read_talent(usr_qq) {
    return await Read(usr_qq,__PATH.talent);
}
export async function Write_talent(usr_qq, player) {
    await Write(usr_qq,player,__PATH.talent);
    return;
}
export async function Read_battle(usr_qq) {
    return await Read(usr_qq,__PATH.battle);
}
export async function Write_battle(usr_qq, data) {
    await Write(usr_qq,data,__PATH.battle);
    return;
}
export async function Read_level(usr_qq) {
    return await Read(usr_qq,__PATH.level);
}
export async function Write_level(usr_qq, data) {
    await Write(usr_qq,data,__PATH.level);
    return;
}
export async function Read_wealth(usr_qq) {
    return await Read(usr_qq,__PATH.wealth);
}
export async function Write_wealth(usr_qq, data) {
    await Write(usr_qq,data,__PATH.wealth);
    return;
}
export async function Read_action(usr_qq) {
    return await Read(usr_qq,__PATH.action);
}
export async function Write_action(usr_qq, data) {
    await Write(usr_qq,data,__PATH.action);
    return;
}
export async function Write_najie(usr_qq, najie) {
    await Write(usr_qq,najie,__PATH.najie);
    return;
}
export async function Read_najie(usr_qq) {
    return await Read(usr_qq,__PATH.najie);
}
export async function Read_equipment(usr_qq) {
    return await Read(usr_qq,__PATH.equipment);
}
export async function Write_equipment(usr_qq, equipment) {
    await Write(usr_qq,equipment,__PATH.equipment);
    await updata_equipment(usr_qq);
    return;
}


export async function updata_equipment(usr_qq) {
    let attack=0;
    let defense=0;
    let blood=0;
    let burst=0;
    let burstmax=0;
    let speed=0;
    let equipment = await Read_equipment(usr_qq);
    equipment.forEach((item)=>{
        attack=attack+item.attack;
         defense=defense+item.defense;
         blood=blood+item.blood;
         burst=burst+item.burst;
         burstmax=burstmax+item.burstmax;
         speed=speed+item.speed;
    })

    let level = await Read_level(usr_qq);
    let levelmini = data.Level_list.find(item => item.id == level.level_id);
    let levelmax = data.LevelMax_list.find(item => item.id == level.levelmax_id);
    let player=await Read_battle(usr_qq);
    attack=levelmini.attack+levelmax.attack+attack;
    defense=levelmini.defense+levelmax.defense+defense;
    blood=levelmini.blood+levelmax.blood+blood;
    burst=levelmini.burst+levelmax.burst+burst;
    burstmax=levelmini.burstmax+levelmax.burstmax+burstmax;
    speed=levelmini.speed+levelmax.speed+speed;
    player={
        nowblood: player.nowblood,
        attack: attack,
        defense: defense,
        blood: blood,
        burst: burst,
        burstmax: burstmax,
        speed:speed,
        power:attack+defense+blood+burst+burstmax
    }
    await Write_battle(usr_qq,player);
    return;
}
//魔力
export async function Add_prestige(usr_qq, prestige) {
    let player = await Read_level(usr_qq);
    player.prestige += Math.trunc(prestige);
    await Write_level(usr_qq, player);
    return;
}
//灵石
export async function Add_lingshi(usr_qq, lingshi) {
    let player = await Read_wealth(usr_qq);
    player.lingshi += Math.trunc(lingshi);
    await Write_wealth(usr_qq, player);
    return;
}
//修为
export async function Add_experience(usr_qq, experience) {
    let player = await Read_level(usr_qq);
    let exp0 = await Numbers(player.experience);
    let exp1 = await Numbers(experience);
    player.experience = await exp0 + exp1;
    await Write_level(usr_qq, player);
    return;
}
//气血
export async function Add_experiencemax(usr_qq, qixue) {
    let player = await Read_level(usr_qq);
    player.experiencemax += Math.trunc(qixue);
    await Write_level(usr_qq, player);
    return;
}
//血量
export async function Add_HP(usr_qq, blood) {
    let player = await Read_battle(usr_qq);
    player.nowblood += Math.trunc(blood);
    if (player.nowblood > player.hpmax) {
        player.nowblood = player.hpmax;
    }
    await Write_battle(usr_qq, player);
    return;
}
//纳戒灵石
export async function Add_najie_lingshi(usr_qq, acount) {
    let najie = await Read_najie(usr_qq);
    najie.lingshi += Math.trunc(acount);
    await Write_najie(usr_qq, najie);
    return;
}

//功法
export async function Add_player_AllSorcery(usr_qq, gongfa) {
    let player = await Read_talent(usr_qq);
    player.AllSorcery.push(gongfa);
    await Write_talent(usr_qq, player);
    //计算天赋
    await player_efficiency(usr_qq);
    return;
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
    if (hurtA <= 0) {
        hurtA = 0;
    }
    if (hurtB <= 0) {
        hurtB = 0;
    }
    let victory = await A_qq;
    let msg = [];
    let x = 0;
    let n=0;
    if (playerA.speed + 5 >= playerB.speed) {
        x = 0;
    } else {
        x = 1;
    }
    while (bloodA >= 0 && bloodB >= 0) {
        n++;
        if (bloodA <= 0||n>=30) {
            victory = await B_qq;
            break;
        }
        if (bloodB <= 0) {
            msg.push("对方没血了");
            break;
        }
        let hurtAA = hurtA;
        let hurtBB = hurtA;
        if (x == 0) {
            if (await battlebursthurt(playerA.burst)) {
                hurtAA = hurtAA * (playerA.burstmax + 1);
            }
            bloodB = await bloodB - hurtAA;
            if (bloodB <= 0) {
                bloodB = 0;
            }
            msg.push("你向发对方动了攻击，对[" + playerB.name + "]造成了" + hurtAA + "伤害，对方血量剩余" + bloodB);
            if (bloodB <= 0) {
                break;
            }
            if (await battlebursthurt(playerB.burst)) {
                hurtBB = hurtAA * (playerB.burstmax + 1);
            }
            bloodA = await bloodA - hurtBB;
            if (bloodA <= 0) {
                victory = await B_qq;
                bloodA = 0;
            }
            msg.push("对方向你发动了攻击，对[" + playerA.name + "]造成了" + hurtBB + "伤害，你血量剩余" + bloodA);
            if (bloodA <= 0) {
                break;
            }
        }
        else {
            if (await battlebursthurt(playerB.burst)) {
                hurtBB = hurtAA * (playerB.burstmax + 1);
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
                hurtAA = hurtAA * (playerA.burstmax + 1);
            }
            bloodB = await bloodB - hurtAA;
            if (bloodB <= 0) {
                bloodB = 0;
            }
            msg.push("你向对方发动了攻击，对[" + playerB.name + "]造成了" + hurtAA + "伤害，对方血量剩余" + bloodB);
            if (bloodB <= 0) {
                break;
            }
        }
    }
    bloodA = await playerA.nowblood - bloodA;
    bloodB = await playerB.nowblood - bloodB;
    await Add_HP(A, -bloodA);
    await Add_HP(B, -bloodB);
    let battle = {
        "msg": msg,
        "victory": victory
    }
    return battle;
}

/**
 * 随机取。判断是否暴
 */
async function battlebursthurt(x) {
    let bursthurt = x;
    if (bursthurt >= 100) {
        //大于100，直接暴
        return true;
    }
    let y = Math.random();
    if (bursthurt > y*100) {
        return true;
    }else{
        return false;
    }
}

/**
 * 灵根合集
 */
export async function get_talent() {
    let newtalent = [];
    var talentacount = Math.round(Math.random() * (5 - 1)) + 1;
    for (var i = 0; i < talentacount; i++) {
        var x = Math.round(Math.random() * (10 - 1)) + 1;
        var y = newtalent.indexOf(x);
        if (y != -1) {
            continue;
        }
        if (x <= 5) {
            var z = newtalent.indexOf(x + 5);
            if (z != -1) {
                continue;
            }
        }
        else {
            var z = newtalent.indexOf(x - 5);
            if (z != -1) {
                continue;
            }
        }
        newtalent.push(x);
    }
    return newtalent;
}

/**
 * 灵根名字
 */
export async function talentname(player) {
    let talentname = [];
    let name = "";
    let talent = player.talent;
    for (var i = 0; i < talent.length; i++) {
        name = data.talent_list.find(item => item.id == talent[i]).name;
        talentname.push(name);
    }
    return talentname;
}

/**
 * 计算天赋
 */
async function talentsize(player) {
    let talentsize = 250;
    let talent = player.talent;
    //根据灵根数来判断
    for (var i = 0; i < talent.length; i++) {
        //循环加效率
        if (talent[i] <= 5) {
            talentsize -= 50;
        }
        if (talent[i] >= 6) {
            talentsize -= 40;
        }
    }
    return talentsize;
}

/**
 * 天赋综合计算
 */
export async function player_efficiency(usr_qq) {
    let player = await Read_talent(usr_qq);
    let gongfa_efficiency = 0;
    player.AllSorcery.forEach((item)=>{
        gongfa_efficiency=gongfa_efficiency+item.size;
    });
    let linggen_efficiency = await talentsize(player);
    player.talentsize = linggen_efficiency + gongfa_efficiency;
    await  Write_talent(usr_qq,player);
    return;
}

/**
 * 根据名字返回物品
 */
export async function search_thing_name(thing) {
    let ifexist0 = data.all_list.find(item => item.name == thing);
    if(ifexist0==undefined){
        return  1;
    }
    else{
        return ifexist0;
    }
}


/**
 * 根据id返回物品
 */
export async function search_thing_id(thing_id) {
    let ifexist0 = data.all_list.find(item => item.id == thing_id);
    if(ifexist0==undefined){
        return  1;
    }
    else{
        return ifexist0;
    }
}

/**
 * 检查纳戒内物品是否存在：直接判断是否存在这个id
 */
export async function exist_najie_thing(usr_qq, thing_id) {
    let najie = await Read_najie(usr_qq);
    let ifexist  = najie.thing.find(item => item.id == thing_id);
    return ifexist;
}
export async function exist_najie_thingname(usr_qq, name) {
    let najie = await Read_najie(usr_qq);
    let ifexist  = najie.thing.find(item => item.name == name);
    return ifexist;
}
export async function Add_najie_thing(najie, najie_thing, thing_acount) {
    let thing =  najie.thing.find(item => item.id == najie_thing.id);
    if (thing == undefined) {    
        najie_thing.acount=thing_acount;
        najie.thing.push(najie_thing);
       return najie;
    }
    else {
        let acount =  thing.acount + thing_acount;
        if (acount < 1) {
            //删除
            najie.thing =  najie.thing.filter(item => item.id != najie_thing.id);
        }
        else{
            //更新
            najie.thing.find(item => item.id == najie_thing.id).acount = acount;
        }
        return najie;
    }
}

/**
 * 替换装备：只需要换id
 */
export async function instead_equipment(equipment, thing_id) {
    equipment.arms = thing_id;
    return equipment;
}
//发送转发消息
export async function ForwardMsg(e, data) {
    let msgList = [];
    for (let i of data) {
        msgList.push({
            message: i,
            nickname: Bot.nickname,
            user_id: Bot.uin,
        });
    }
    if (msgList.length == 1) {
        await e.reply(msgList[0].message);
    }
    else {
        await e.reply(await Bot.makeForwardMsg(msgList));
    }
    return;
}
/**
 * 对象数组排序
 * 从大到小
 */
export function sortBy(field) {
    return function (b, a) {
        return a[field] - b[field];
    }
}

//获取总修为
export async function get_experience(usr_qq) {
    let player = await Read_level(usr_qq);
    let sum_exp = 0;
    let now_level_id = player.level_id;
    if (now_level_id < 46) {
        for (var i = 1; i < now_level_id; i++) {
            sum_exp = sum_exp + data.Level_list.find(temp => temp.level_id == i).exp;
        }
    }
    sum_exp += player.experience;
    return sum_exp;
}
/**
 * 输入概率随机返回布尔类型数据
 * @param P 概率
 * @returns 随机返回 false or true
 */
export function get_random_res(P) {
    if (P > 1) { P = 1; }
    if (P < 0) { P = 0; }
    let rand = Math.random();
    if (rand < P) {
        return true;
    }
    return false;
}
/**
 * 输入数组随机返回其中一个
 * @param ARR 输入的数组
 * @returns 随机返回一个元素
 */
export function get_random_fromARR(ARR) {
    let randindex = Math.trunc(Math.random() * ARR.length);
    return ARR[randindex];
}
//延迟
export async function sleep(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    })
}
// 时间转换
export function timestampToTime(timestamp) {
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
}
//根据时间戳获取年月日时分秒
export async function shijianc(time) {
    let dateobj = {}
    var date = new Date(time)
    dateobj.Y = date.getFullYear()
    dateobj.M = date.getMonth() + 1
    dateobj.D = date.getDate()
    dateobj.h = date.getHours()
    dateobj.m = date.getMinutes()
    dateobj.s = date.getSeconds()
    return dateobj;

}
//获取上次签到时间
export async function getLastsign(usr_qq) {
    let time = await redis.get("xiuxian:player:" + usr_qq + ":lastsign_time");
    if (time != null) {
        let data = await shijianc(parseInt(time))
        return data;
    }
    return false;
}
/**
 * 得到状态
 */
export async function getPlayerAction(usr_qq) {
    let arr = {};
    let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
    action = JSON.parse(action);
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = parseInt((action_end_time - now_time) / 1000 / 60);
            let s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
            arr.action = action.action;//当期那动作
            arr.time = m + "m" + s + "s";//剩余时间
            return arr;
        }
    }
    arr.action = "空闲";
    return arr;
}
/**
 * 艾特
 */
export async function At(e) {
    let isat = e.message.some((item) => item.type === "at");
    if (!isat) {
        return 0;
    }
    let atItem = e.message.filter((item) => item.type === "at");
    let B = atItem[0].qq;
    let ifexistplay = await existplayer(B);
    if (!ifexistplay) {
        return 0;
    }
    return B;
}
/**
 * 判断对象是否不为undefined且不为null
 * @param obj 对象
 * @returns obj==null/undefined,return false,other return true
 */
export function isNotNull(obj) {
    if (obj == undefined || obj == null)
        return false;
    return true;
}
export function isNotBlank(value) {
    if (value ?? '' !== '') {
        return true;
    } else {
        return false;
    }
}
/**
 * 强制修正至少为1
 */
export async function Numbers(value) {
    let x = value;
    if (isNaN(parseFloat(x)) && !isFinite(x)) {
        x = 1;
    }
    x = Math.trunc(x);
    x = Number(x);
    if (x == null || x == undefined || x < 1 || x == NaN) {
        x = 1;
    }
    return x;
}
/**
 * 关闭状态
 */
export async function offaction(qq) {
    let action = await redis.get("xiuxian:player:" + qq + ":action");
    action = JSON.parse(action);
    if (action != null) {
        await redis.del("xiuxian:player:" + qq + ":action");
        let arr = action;
        arr.is_jiesuan = 1;//结算状态
        arr.shutup = 1;//闭关状态
        arr.working = 1;//降妖状态
        arr.power_up = 1;//渡劫状态
        arr.Place_action = 1;//秘境
        arr.Place_actionplus = 1;//沉迷状态
        arr.end_time = new Date().getTime();//结束的时间也修改为当前时间
        delete arr.group_id;//结算完去除group_id
        await redis.set("xiuxian:player:" + qq + ":action", JSON.stringify(arr));
    }
    await redis.set("xiuxian:player:" + qq + ":game_action", 1);
    return;
}
/**
 * 状态封锁查询
 */
 export async function Gomini(e) {
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
    let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
    action = JSON.parse(action);
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = parseInt((action_end_time - now_time) / 1000 / 60);
            let s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
            e.reply("[ACTION:" + action.action + "]:[time:" + m + "m" + s + "s]");
            return;
        }
    }
    return true;
}
/**
 * 状态封锁查询
 */
export async function Go(e) {
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
    let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
    action = JSON.parse(action);
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = parseInt((action_end_time - now_time) / 1000 / 60);
            let s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
            e.reply("[ACTION:" + action.action + "]:[time:" + m + "m" + s + "s]");
            return;
        }
    }
    let player = await Read_battle(usr_qq);
    if (player.nowblood <= 1) {
        e.reply("你都伤成这样了，就不要出去浪了");
        return;
    }
    return true;
}
/**
 * 状态封锁查询
 */
export async function UserGo(usr_qq) {
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    }
    let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
    if (game_action == 0) {
        return "游戏进行中...";
    }
    let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
    action = JSON.parse(action);
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = parseInt((action_end_time - now_time) / 1000 / 60);
            let s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
            return "[ACTION:" + action.action + "]:[time:" + m + "m" + s + "s]";
        }
    }
    let player = await Read_battle(usr_qq);
    if (player.nowblood < 200) {
        return "你都伤成这样了,就不要出去浪了";
    }
    return true;
}

/**
 * 冷却检测
 */
export async function GenerateCD(usr_qq, usr_class, now_time, time) {
    var time0 = time;
    let CD = await redis.get("xiuxian:player:" + usr_qq + usr_class);
    CD = parseInt(CD);
    let transferTimeout = parseInt(60000 * time0)
    if (now_time < CD + transferTimeout) {
        let CD_m = Math.trunc((CD + transferTimeout - now_time) / 60 / 1000);
        let CD_s = Math.trunc(((CD + transferTimeout - now_time) % 60000) / 1000);
        return "[T:" + transferTimeout / 1000 / 60 + "m]:[CD:" + CD_m + "m" + CD_s + "s]";
    }
    return 0;
}


//写入
export async function Write_Forum(wupin) {
    await Write(`Forum`,wupin,__PATH.Forum);
    return;
}

//读取
export async function Read_Forum() {
    let dir = path.join(`${__PATH.Forum}/Forum.json`);
    let Forum = await newRead(dir);
    if(Forum==1){
        await Write_Forum([]);
        Forum = await newRead(dir);
    }
    Forum = JSON.parse(Forum);
    return Forum;
}

//写入交易表
export async function Write_Exchange(wupin) {
    await Write(`Exchange`,wupin,__PATH.Exchange);
    return;
}

//读交易表
export async function Read_Exchange() {
    let dir = path.join(`${__PATH.Exchange}/Exchange.json`);
    let Exchange = await newRead(dir);
    if(Exchange==1){
        await Write_Exchange([]);
        Exchange = await newRead(dir);
    }
    Exchange = await JSON.parse(Exchange);
    return Exchange;
}

//搜索物品
export async function Search_Exchange(thing_qq) {
    let thingqq = thing_qq;
    let x = -1;
    let Exchange = await Read_Exchange();
    if (thingqq == "") {
        return x;
    }
    for (var i = 0; i < Exchange.length; i++) {
        if (Exchange[i].qq == thingqq) {
            x = i;
            break;
        }
    }
    return x;
}

//写入寿命表
export async function Write_Life(wupin) {
    await Write(`life`,wupin,__PATH.life);
    return;
}

//读寿命表
export async function Read_Life() {
    let dir = path.join(`${__PATH.life}/life.json`);
    let Life = await newRead(dir);
    if(Life==1){
        await Write_Life([]);
        Life = await newRead(dir);
    }
    Life = await JSON.parse(Life);
    return Life;
}

export async function newRead(dir) {
    try{
        let newdata = fs.readFileSync(dir, 'utf8', (err, data) => {
            if (err) {
                return "error";
            }
            return data;
        })
        return newdata;
    }catch{
        return 1;
    }
}
