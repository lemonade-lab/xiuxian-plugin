import plugin from '../../../../lib/plugins/plugin.js';
import fs from "fs";
import path from "path";
import data from '../../model/XiuxianData.js';
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
    newsorcery: path.join(__dirname, "/resources/data/birth/xiuxian/newsorcery"),
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
            rule: [
                {
                    reg: '^#测试$',
                    fnc: 'Xiuxain'
                }
            ]
        })
    }
    async Xiuxain(e) {
        e.reply("测试");
        return;
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
export async function existplayer(usr_qq) {
    let exist_player = fs.existsSync(`${__PATH.player}/${usr_qq}.json`);
    if (exist_player) {
        return true;
    }
    return false;
}
export async function Read_player(usr_qq) {
    return await Read(usr_qq,__PATH.player);;
}
export async function Write_player(usr_qq, player) {
    await Write(usr_qq,player,__PATH.player);
    return;
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
export async function Read_newsorcery(usr_qq) {
    return await Read(usr_qq,__PATH.newsorcery);
}
export async function Write_newsorcery(usr_qq, data) {
    await Write(usr_qq,data,__PATH.newsorcery);
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
    let attack=0,defense=0,blood=0,burst=0,burstmax=0,speed=0;
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
    player={
        nowblood: player.nowblood,
        attack: levelmini.attack+levelmax.attack+Math.floor((levelmini.attack+levelmax.attack)*attack*0.01),
        defense: levelmini.defense+levelmax.defense+Math.floor((levelmini.defense+levelmax.defense)*defense*0.01),
        blood: levelmini.blood+levelmax.blood+Math.floor((levelmini.blood+levelmax.blood)*blood*0.01),
        burst: levelmini.burst+levelmax.burst+burst,
        burstmax: levelmini.burstmax+levelmax.burstmax+burstmax,
        speed:levelmini.speed+levelmax.speed+speed
    }
    player.power=player.attack+player.defense+player.blood+player.burst+player.burstmax+player.speed;
    await Write_battle(usr_qq,player);
    return;
}
export async function Add_prestige(usr_qq, prestige) {
    let player = await Read_level(usr_qq);
    player.prestige += Math.trunc(prestige);
    await Write_level(usr_qq, player);
    return;
}
export async function Add_lingshi(usr_qq, lingshi) {
    let player = await Read_wealth(usr_qq);
    player.lingshi += Math.trunc(lingshi);
    await Write_wealth(usr_qq, player);
    return;
}
export async function Add_experience(usr_qq, experience) {
    let player = await Read_level(usr_qq);
    let exp0 = await Numbers(player.experience);
    let exp1 = await Numbers(experience);
    player.experience = await exp0 + exp1;
    await Write_level(usr_qq, player);
    return;
}
export async function Add_experiencemax(usr_qq, qixue) {
    let player = await Read_level(usr_qq);
    player.experiencemax += Math.trunc(qixue);
    await Write_level(usr_qq, player);
    return;
}
//血量按百分比恢复
export async function Add_blood(usr_qq, blood) {
    let player = await Read_battle(usr_qq);
    let battle= await Read_battle(usr_qq);
    //判断百分比
    if(player.nowblood<Math.floor(battle.blood*blood*0.01)){
        player.nowblood = Math.floor(battle.blood*blood*0.01);
    }
    await Write_battle(usr_qq, player);
    return;
}
export async function Add_najie_lingshi(usr_qq, acount) {
    let najie = await Read_najie(usr_qq);
    najie.lingshi += Math.trunc(acount);
    await Write_najie(usr_qq, najie);
    return;
}
export async function Add_player_AllSorcery(usr_qq, gongfa) {
    let player = await Read_talent(usr_qq);
    player.AllSorcery.push(gongfa);
    await Write_talent(usr_qq, player);
    await player_efficiency(usr_qq);
    return;
}
export async function battle(A, B) {
    let A_qq = await A;
    let B_qq = await B;
    let playerA = await Read_battle(A_qq);
    let playerB = await Read_battle(B_qq);


    //根据敏捷判断先手，

    //主动方,即A方增加+3敏捷，若低，则视为被对方发现，攻击落空，换为对方先手

    //攻击方根据技能循序发动技能

    //技能发动后计算伤害：判断是否暴击

    //对方血量-伤害=剩余血量

    //判断是否血空

    //另一方发动攻击，根据技能进行加成

    //一次攻击仅有20回，每3分钟可以发动一次攻击，即技能冷却时间，

    //双方将进入战斗状态，状态期间不可-------------

    //在地图上，可以自由攻击对方，打死对方的，视为胜利，即，获取一定概率，让对方掉装备


    return A_qq;
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
    let ifexist0 = JSON.parse(fs.readFileSync(`${data.all}/all.json`)).find(item => item.name == thing);
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
    let ifexist0 = JSON.parse(fs.readFileSync(`${data.all}/all.json`)).find(item => item.id == thing_id);
    if(ifexist0==undefined){
        return  1;
    }
    else{
        return ifexist0;
    }
}
export async function exist_najie_thing_id(usr_qq, thing_id) {
    let najie = await Read_najie(usr_qq);
    let ifexist  = najie.thing.find(item => item.id == thing_id);
    if(ifexist==undefined){
        return 1;
    }
    return ifexist;
}
export async function exist_najie_thing_name(usr_qq, name) {
    let najie = await Read_najie(usr_qq);
    let ifexist  = najie.thing.find(item => item.name == name);
    if(ifexist==undefined){
        return 1;
    }
    return ifexist;
}
export async function Add_najie_thing(najie, najie_thing, thing_acount) {
    let thing =  najie.thing.find(item => item.id == najie_thing.id);
    if(thing){
        let acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.thing =  najie.thing.filter(item => item.id != najie_thing.id);
        }
        else{
            najie.thing.find(item => item.id == najie_thing.id).acount = acount;
        }
        return najie;
    }else{ 
        najie_thing.acount=thing_acount;
        najie.thing.push(najie_thing);
       return najie;
    }
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
/**
 * 输入概率随机返回布尔类型数据
 */
export function probability(P) {
    //概率为1-100
    if (P > 100) { P = 100; };
    if (P < 0) { P = 0; };
    let rand = Math.floor((Math.random() * (100-1)+1));
    //命中
    if (rand < P) {
        return true;
    }
    return false;
}
export function Anyarray(ARR) {
    let randindex = Math.trunc(Math.random() * ARR.length);
    return ARR[randindex];
}
//沉睡
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
 * 关闭状态
 */
export async function offaction(qq) {
    let exists = await redis.exists("xiuxian:player:" + qq + ":action");
    if(exists == 1){
        await redis.del("xiuxian:player:" + qq + ":action");
    }
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
    let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
    if (action != undefined) {
        action = JSON.parse(action);
        e.reply(action.actionName+"中...")
        return false;
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
    let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
    if (action != undefined) {
        action = JSON.parse(action);
        e.reply(action.actionName+"中...")
        return false;
    }
    let player = await Read_battle(usr_qq);
    if (player.nowblood <= 1) {
        e.reply("你都伤成这样了，就不要出去浪了");
        return false;
    }
    return true;
}
               //0     1     2      3      4     5       6     7      8      9   10 11 12 13 14
const CDname=['攻击','降妖','闭关','改名','道宣','赠送','突破','破体','转世','行为','','','','',''];
/**
 * 冷却检测
 */
export async function GenerateCD(usr_qq, CDid) {
    let remainTime = await redis.ttl("xiuxian:player:" + usr_qq +':'+CDid);
    if(remainTime != -1){
        let h=Math.floor(remainTime/60/60);
        h=h<0?0:h;
        let m=Math.floor((remainTime-h*60*60)/60);
        m=m<0?0:m;
        let s=Math.floor((remainTime-h*60*60-m*60));
        s=s<0?0:s;
        if(h==0&&m==0&&s==0){
           return 0;
        }
        return CDname[CDid]+"冷却:"+h+"h"+m+"m"+s+"s";
    };
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

//判断两者是否可以交互
export async function interactive(A,B){
    let a=A;
    let b=B;
    a.x=Math.floor(a.x/100);
    a.y=Math.floor(a.y/100);
    b.x=Math.floor(b.x/100);
    b.y=Math.floor(b.y/100);
    if(a.x==b.x&&b.x==b.y){
        return true;
    }
    return false;
}

//判断两者距离
export async function distance(A,B){
    let a=A;
    let b=B;
    let h=Math.pow(Math.pow((a.x-b.x),2)+Math.pow((a.y-b.y),2),1/2);
    h==Math.floor(h);
    return h;
}