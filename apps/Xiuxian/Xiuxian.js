import plugin from '../../../../lib/plugins/plugin.js'
import fs from "fs"
import path from "path"
import data from '../../model/XiuxianData.js'
//插件根目录
const __dirname = path.resolve() + path.sep + "plugins" + path.sep + "xiuxian-emulator-plugin";
// 文件存放路径
export const __PATH = {
    //用户数据
    player: path.join(__dirname, "/resources/data/birth/xiuxian/player"),
    equipment: path.join(__dirname, "/resources/data/birth/xiuxian/equipment"),
    najie: path.join(__dirname, "/resources/data/birth/xiuxian/najie"),
    //冲水
    Exchange: path.join(__dirname, "/resources/data/birth/Exchange"),
    //论坛
    Forum: path.join(__dirname, "/resources/data/birth/Forum"),
    //限定
    Timelimit: path.join(__dirname, "/resources/data/fixed/Timelimit"),
}
let xiuxianSetFile = "./plugins/xiuxian-emulator-plugin/config/xiuxian/xiuxian.yaml";
if (!fs.existsSync(xiuxianSetFile)) {
    fs.copyFileSync("./plugins/xiuxian-emulator-plugin/defSet/xiuxian/xiuxian.yaml", xiuxianSetFile);
}
//处理消息
export class Xiuxian extends plugin {
    constructor() {
        super({
            name: 'Xiuxian',
            dsc: 'Xiuxian',
            event: 'message',
            priority: 800,
            rule: [
            ]
        })
    }
}

//检查存档是否存在，存在返回true;
export async function existplayer(usr_qq) {
    let exist_player;
    exist_player = fs.existsSync(`${__PATH.player}/${usr_qq}.json`);
    if (exist_player) {
        return true;
    }
    return false;
}

/**
 * *****************************************************************************
 * 读写合集
 */

//读取存档信息，返回成一个JavaScript对象
export async function Read_player(usr_qq) {
    let dir = path.join(`${__PATH.player}/${usr_qq}.json`);
    let player = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    //将字符串数据转变成数组格式
    player = JSON.parse(player);
    return player;
}

//写入存档信息,第二个参数是一个JavaScript对象
export async function Write_player(usr_qq, player) {
    let dir = path.join(__PATH.player, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(player, "", "\t");
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

//写入纳戒信息
export async function Write_najie(usr_qq, najie) {
    let dir = path.join(__PATH.najie, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(najie, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}


//读取装备信息
export async function Read_equipment(usr_qq) {
    let dir = path.join(`${__PATH.equipment}/${usr_qq}.json`);
    let equipment = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    //将字符串数据转变成数组格式
    equipment = JSON.parse(equipment);
    return equipment;
}

//写入装备信息
export async function Write_equipment(usr_qq, equipment) {
    //攻击
    let equ_atk1 = data.wuqi_list.find(item => item.id == equipment.arms.id).atk;
    //防御
    let equ_def1 = data.wuqi_list.find(item => item.id == equipment.arms.id).def;
    //血量
    let equ_HP1 = data.wuqi_list.find(item => item.id == equipment.arms.id).HP;
    //暴击率
    let equ_bao1 = data.wuqi_list.find(item => item.id == equipment.arms.id).bao;
    //敏捷
    let speed1 = data.wuqi_list.find(item => item.id == equipment.arms.id).speed;
    //攻击
    let equ_atk2 = data.huju_list.find(item => item.id == equipment.huju.id).atk;
    //防御
    let equ_def2 = data.huju_list.find(item => item.id == equipment.huju.id).def;
    //血量
    let equ_HP2 = data.huju_list.find(item => item.id == equipment.huju.id).HP;
    //暴击率
    let equ_bao2 = data.huju_list.find(item => item.id == equipment.huju.id).bao;
    //敏捷
    let speed2 = data.huju_list.find(item => item.id == equipment.huju.id).speed;
    //攻击
    let equ_atk3 = data.fabao_list.find(item => item.id == equipment.fabao.id).atk;
    //防御
    let equ_def3 = data.fabao_list.find(item => item.id == equipment.fabao.id).def;
    //血量
    let equ_HP3 = data.fabao_list.find(item => item.id == equipment.fabao.id).HP;
    //暴击率
    let equ_bao3 = data.fabao_list.find(item => item.id == equipment.fabao.id).bao;
    //敏捷
    let speed3 = data.fabao_list.find(item => item.id == equipment.fabao.id).speed;
    //装备总计
    let equ_atk = equ_atk1 + equ_atk2 + equ_atk3;
    let equ_def = equ_def1 + equ_def2 + equ_def3;
    let equ_HP = equ_HP1 + equ_HP2 + equ_HP3;
    let equ_bao = equ_bao1 + equ_bao2 + equ_bao3;
    let equ_speed = speed1 + speed2 + speed3;
    //得到存档
    let player = await Read_player(usr_qq);
    /**
     * 基础数据
     */
    let attack = data.Level_list.find(item => item.level_id == player.level_id).attack;
    attack = attack + data.LevelMax_list.find(item => item.level_id == player.Physique_id).attack;
    let blood = data.Level_list.find(item => item.level_id == player.level_id).blood;
    blood = blood + data.LevelMax_list.find(item => item.level_id == player.Physique_id).blood;
    let defense = data.Level_list.find(item => item.level_id == player.level_id).defense;
    defense = defense + data.LevelMax_list.find(item => item.level_id == player.Physique_id).defense;
    let strike = data.Level_list.find(item => item.level_id == player.level_id).burst;
    let speed = data.LevelMax_list.find(item => item.level_id == player.Physique_id).speed;
    /**
     * 境界距离
     */
    for (var i = 1; i <= 8; i++) {
        if (player.level_id >= 6 * i) {
            speed = speed * 2;
        }
    }
    /**
     * 当前面板计算
     */
    player["nowattack"] = equ_atk + attack;//当前攻击
    player["nowdefense"] = equ_def + defense;//当前防御
    player["hpmax"] = equ_HP + blood;//血量上限
    player["burst"] = equ_bao + strike;//暴击率
    player["speed"] = equ_speed + speed;//敏捷
    player["bursthurt"] = 0;//暴伤
    await Write_player(usr_qq, player);
    //写入
    let dir = path.join(__PATH.equipment, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(equipment, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}


/**
 * ***********************************************************
 * 增减合集
 */

//灵石
export async function Add_lingshi(usr_qq, lingshi) {
    let player = await Read_player(usr_qq);
    player.lingshi += Math.trunc(lingshi);
    await Write_player(usr_qq, player);
    return;
}
//修为
export async function Add_experience(usr_qq, experience) {
    let player = await Read_player(usr_qq);
    let exp0 = await Numbers(player.experience);
    let exp1 = await Numbers(experience);
    player.experience = await exp0 + exp1;
    await Write_player(usr_qq, player);
    return;
}

//气血
export async function Add_experiencemax(usr_qq, qixue) {
    let player = await Read_player(usr_qq);
    player.experiencemax += Math.trunc(qixue);
    await Write_player(usr_qq, player);
    return;
}

//血量
export async function Add_HP(usr_qq, blood) {
    let player = await Read_player(usr_qq);
    player.nowblood += Math.trunc(blood);
    if (player.nowblood > player.hpmax) {
        player.nowblood = player.hpmax;
    }
    await Write_player(usr_qq, player);
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
export async function Add_player_AllSorcery(usr_qq, gongfa_name_id) {
    let player = await Read_player(usr_qq);
    let id = gongfa_name_id;
    player.AllSorcery.push(id);
    await Write_player(usr_qq, player);
    return;
}



/**
 * ***********************************************************
 * 战斗系统合集
 */
export async function battle(A, B) {
    let A_qq = await A;
    let B_qq = await B;
    let playerA = await Read_player(A_qq);
    let playerB = await Read_player(B_qq);
    let bloodA = await playerA.nowblood;
    let bloodB = await playerB.nowblood;
    let hurtA = await playerA.nowattack - playerB.nowdefense;
    let hurtB = await playerB.nowattack - playerA.nowdefense;
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
    while (bloodA >= 0 && bloodB >= 0) {
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
        let hurtBB = hurtA;
        /**
         * 先手
         */
        if (x == 0) {
            if (await battlebursthurt(playerA.burst)) {
                hurtAA = hurtAA * (playerA.bursthurt + 1);
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
                hurtBB = hurtAA * (playerB.bursthurt + 1);
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



/**
 * **************************************************************
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
export async function talentsize(player) {
    let talentsize = 2.5;
    let talent = player.talent;
    //根据灵根数来判断
    for (var i = 0; i < talent.length; i++) {
        //循环加效率
        if (talent[i] <= 5) {
            talentsize -= 0.5;
        }
        if (talent[i] >= 6) {
            talentsize -= 0.4;
        }
    }
    return talentsize;
}
/**
 * 天赋综合计算
 */
export async function player_efficiency(usr_qq) {
    let player = await data.getData("player", usr_qq);
    let gongfa_efficiency = 0;
    let ifexist2;
    let gongfa_id;
    if(player.AllSorcery.length!=undefined){
        for (var i = 0; i < player.AllSorcery.length; i++) {
            gongfa_id = player.AllSorcery[i];
            ifexist2 = data.gongfa_list.find(item => item.id == gongfa_id);
            if (ifexist2 == undefined) {
                ifexist2 = data.timegongfa_list.find(item => item.id == gongfa_id);
                if(ifexist2!=undefined){
                  gongfa_efficiency += ifexist2.size;
                }
            }
        }
    }
    if (parseInt(player.talentsize) != parseInt(player.talentsize)) {
        player.talentsize = 0;
    }
    let linggen_efficiency = await talentsize(player);
    player.talentsize = linggen_efficiency + gongfa_efficiency;
    data.setData("player", usr_qq, player);
    return;
}

/**
 * 
 * 检查纳戒内物品是否存在
 */
export async function exist_thing(thing_id, thing_class) {
    //要分限定和普通
    let ifexist;
    if (thing_class == 1) {
        ifexist = data.wuqi_list.find(item => item.id == thing_id);
        if (ifexist == undefined) {
            ifexist = data.timewuqi_list.find(item => item.id == thing_id);
        }
    }
    if (thing_class == 2) {
        ifexist = data.huju_list.find(item => item.id == thing_id);
        if (ifexist == undefined) {
            ifexist = data.timehuju_list.find(item => item.id == thing_id);
        }
    }
    if (thing_class == 3) {
        ifexist = data.fabao_list.find(item => item.id == thing_id);
        if (ifexist == undefined) {
            ifexist = data.timefabao_list.find(item => item.id == thing_id);
        }
    }
    if (thing_class == 4) {
        ifexist = data.danyao_list.find(item => item.id == thing_id);
        if (ifexist == undefined) {
            ifexist = data.timedanyao_list.find(item => item.id == thing_id);
        }
    }
    if (thing_class == 5) {
        ifexist = data.gongfa_list.find(item => item.id == thing_id);
        if (ifexist == undefined) {
            ifexist = data.timefabao_list.find(item => item.id == thing_id);
        }
    }
    if (thing_class == 6) {
        ifexist = data.daoju_list.find(item => item.id == thing_id);
        if (ifexist == undefined) {
            ifexist = data.timedanyao_list.find(item => item.id == thing_id);
        }
    }
    if (thing_class == 7) {
        ifexist = data.ring_list.find(item => item.id == thing_id);
    }
    /**
     * 不存在
     */
    if (ifexist==undefined) {
        return 1;
    }
    return ifexist;
}


/**
 * 根据名字查找物品信息
 */
export async function search_thing(thing_name) {
    let ifexist0 = data.fabao_list.find(item => item.name == thing_name);
    if (ifexist0 == undefined) {
        ifexist0 = data.wuqi_list.find(item => item.name == thing_name);
        if (ifexist0 == undefined) {
            ifexist0 = data.huju_list.find(item => item.name == thing_name);
            if (ifexist0 == undefined) {
                ifexist0 = data.danyao_list.find(item => item.name == thing_name);
                if (ifexist0 == undefined) {
                    ifexist0 = data.daoju_list.find(item => item.name == thing_name);
                    if (ifexist0 == undefined) {
                        ifexist0 = data.gongfa_list.find(item => item.name == thing_name);
                        if (ifexist0 == undefined) {
                            ifexist0 = data.timegongfa_list.find(item => item.name == thing_name);
                            if (ifexist0 == undefined) {
                                ifexist0 = data.timedanyao_list.find(item => item.name == thing_name);
                                if (ifexist0 == undefined) {
                                    ifexist0 = data.timefabao_list.find(item => item.name == thing_name);
                                    if (ifexist0 == undefined) {
                                        ifexist0 = data.timewuqi_list.find(item => item.name == thing_name);
                                        if (ifexist0 == undefined) {
                                            ifexist0 = data.timehuju_list.find(item => item.name == thing_name);
                                            if (ifexist0 == undefined) {
                                                ifexist0 = data.ring_list.find(item => item.name == thing_name);
                                                //还是找不到，就是不存在该物品
                                                return 1;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return ifexist0;
}


/**
 * 
 * 检查纳戒内物品是否存在
 */
export async function exist_najie_thing(usr_qq, thing_id, thing_class) {
    let najie = await Read_najie(usr_qq);
    let ifexist;
    if (thing_class == 1) {
        ifexist = najie.arms.find(item => item.id == thing_id);
    }
    if (thing_class == 2) {
        ifexist = najie.huju.find(item => item.id == thing_id);
    }
    if (thing_class == 3) {
        ifexist = najie.fabao.find(item => item.id == thing_id);
    }
    if (thing_class == 4) {
        ifexist = najie.danyao.find(item => item.id == thing_id);
    }
    if (thing_class == 5) {
        ifexist = najie.gonfa.find(item => item.id == thing_id);
    }
    if (thing_class == 6) {
        ifexist = najie.daoju.find(item => item.id == thing_id);
    }
    if (thing_class == 7) {
        ifexist = najie.ring.find(item => item.id == thing_id);
    }
    if (!ifexist) {
        return 1;
    }
    return ifexist;
}


export async function Add_najie_thing_arms(usr_qq, thing_id, thing_class, thing_type, thing_acount) {
    let najie = await Read_najie(usr_qq);
    let acount;
    let thing =  najie.arms.find(item => item.id == thing_id);
    if (thing == undefined) {    
        let equipment = {
        id: thing_id,
        class: thing_class,
        type: thing_type,
        acount: thing_acount
       }
         najie.arms.push(equipment);
    }
    else {
        acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.arms =  najie.arms.filter(item => item.id != thing_id);
        }else{
            najie.arms.find(item => item.id == thing_id).acount = acount;
        }
    }
    
    await Write_najie(usr_qq, najie);
    return;
}

export async function Add_najie_thing_huju(usr_qq, thing_id, thing_class, thing_type, thing_acount) {
    let najie = await Read_najie(usr_qq);
    let acount;
    let thing =  najie.huju.find(item => item.id == thing_id);
    if (thing == undefined) {    
        let equipment = {
        id: thing_id,
        class: thing_class,
        type: thing_type,
        acount: thing_acount
    }
         najie.huju.push(equipment);
    }
    else {
        acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.huju =  najie.huju.filter(item => item.id != thing_id);
        }else{
            najie.huju.find(item => item.id == thing_id).acount = acount;
        }
    }
    
    await Write_najie(usr_qq, najie);
    return;
}

export async function Add_najie_thing_fabao(usr_qq, thing_id, thing_class, thing_type, thing_acount) {
    let najie = await Read_najie(usr_qq);
    let acount;
    let thing =  najie.fabao.find(item => item.id == thing_id);
    if (thing == undefined) {
        let equipment = {
            id: thing_id,
            class: thing_class,
            type: thing_type,
            acount: thing_acount
        }
         najie.fabao.push(equipment);
    }
    else {
        acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.fabao =  najie.fabao.filter(item => item.id != thing_id);
        }else{
            najie.fabao.find(item => item.id == thing_id).acount = acount;
        }
    }
   
    await Write_najie(usr_qq, najie);
    return;
}

export async function Add_najie_thing_danyao(usr_qq, thing_id, thing_class, thing_type, thing_acount) {
    let najie = await Read_najie(usr_qq);
    let acount;
    let thing =  najie.danyao.find(item => item.id == thing_id);
    if (thing == undefined) {
        let equipment = {
            id: thing_id,
            class: thing_class,
            type: thing_type,
            acount: thing_acount
        }
         najie.danyao.push(equipment);
    }
    else {
        acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.danyao =  najie.danyao.filter(item => item.id != thing_id);
        }else{
            najie.danyao.find(item => item.id == thing_id).acount = acount;
        }
    }
    
    await Write_najie(usr_qq, najie);
    return;
}


export async function Add_najie_thing_gonfa(usr_qq, thing_id, thing_class, thing_type, thing_acount) {
    let najie = await Read_najie(usr_qq);
    let acount;
    let thing =  najie.gonfa.find(item => item.id == thing_id);
    if (thing == undefined) {    
        let equipment = {
        id: thing_id,
        class: thing_class,
        type: thing_type,
        acount: thing_acount
    }
         najie.gonfa.push(equipment);
    }
    else {
        acount =  thing.acount + thing_acount;
        if (acount < 1) {
            najie.gonfa =  najie.gonfa.filter(item => item.id != thing_id);
        }else{
            najie.gonfa.find(item => item.id == thing_id).acount = acount;
        }
    }
   
    await Write_najie(usr_qq, najie);
    return;
}


export async function Add_najie_thing_daoju(usr_qq, thing_id, thing_class, thing_type, thing_acount) {
    let najie = await Read_najie(usr_qq);
    let acount;
    let thing =  najie.daoju.find(item => item.id == thing_id);
    if (thing == undefined) {    
        let equipment = {
        id: thing_id,
        class: thing_class,
        type: thing_type,
        acount: thing_acount
    }
       najie.daoju.push(equipment);
    }
    else {
        acount =  thing.acount + thing_acount; 
        if (acount < 1) {
            najie.daoju =  najie.daoju.filter(item => item.id != thing_id);
        }else{
            najie.daoju.find(item => item.id == thing_id).acount = acount;
        }
    }
   
    await Write_najie(usr_qq, najie);
    return;
}

export async function Add_najie_thing_ring(usr_qq, thing_id, thing_class, thing_type, thing_acount) {
    let najie = await Read_najie(usr_qq);
    let acount;
    let thing =  najie.ring.find(item => item.id == thing_id);
    if (thing == undefined) {    
        let equipment = {
        id: thing_id,
        class: thing_class,
        type: thing_type,
        acount: thing_acount
    }
         najie.ring.push(equipment);
    }
    else {
        acount =  thing.acount + thing_acount;    
        if (acount < 1) {
            najie.ring =  najie.ring.filter(item => item.id != thing_id);
        }else{
            najie.ring.find(item => item.id == thing_id).acount = acount;
        }
    }
    await Write_najie(usr_qq, najie);
    return;
}


/**
 * 替换装备
 */
export async function instead_equipment_arms(usr_qq, thing_id, thing_class,thing_type) {
    let equipment = await Read_equipment(usr_qq);
    await Add_najie_thing_arms(usr_qq, equipment.arms.id, equipment.arms.class, equipment.arms.type, 1);
    equipment.arms ={
        "id": thing_id,
        "class": thing_class,
        "type": thing_type,
        "acount": 1 
    }
    await Write_equipment(usr_qq, equipment);
    return 0;
}

/**
 * 替换护具
 */
 export async function instead_equipment_huju(usr_qq, thing_id, thing_class,thing_type) {
    let equipment = await Read_equipment(usr_qq);
    await Add_najie_thing_huju(usr_qq, equipment.huju.id, equipment.huju.class, equipment.huju.type, 1);
    equipment.huju ={
            "id": thing_id,
            "class": thing_class,
            "type": thing_type,
            "acount": 1 
        }
    await Write_equipment(usr_qq, equipment);
    return 0;
}

/**
 * 替换装备
 */
export async function instead_equipment_fabao(usr_qq, thing_id, thing_class,thing_type) {
    let equipment = await Read_equipment(usr_qq);
    await Add_najie_thing_fabao(usr_qq, equipment.fabao.id, equipment.fabao.class, equipment.fabao.type, 1);
    equipment.fabao ={
        "id": thing_id,
        "class": thing_class,
        "type": thing_type,
        "acount": 1 
    }
    await Write_equipment(usr_qq, equipment);
    return 0;
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
    let player = await Read_player(usr_qq);
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
    let player = await Read_player(usr_qq);
    if (player.nowblood < 200) {
        e.reply("受伤了，出不来远门");
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
    let player = await Read_player(usr_qq);
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

/**
 * 世界财富
 * 
 */
export async function Worldwealth(acount) {
    let worldacount = await Numbers(acount);
    let Worldmoney = await redis.get("Xiuxian:Worldmoney");
    Worldmoney = await Numbers(Worldmoney);
    Worldmoney += worldacount;
    await redis.set("Xiuxian:Worldmoney", Worldmoney);
    return;
}


//写入
export async function Write_Forum(wupin) {
    let dir = path.join(__PATH.Forum, `Forum.json`);
    let new_ARR = JSON.stringify(wupin, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}


//读取
export async function Read_Forum() {
    let dir = path.join(`${__PATH.Forum}/Forum.json`);
    let Forum;
    try {
        Forum = fs.readFileSync(dir, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                return "error";
            }
            return data;
        })

    } catch {
        await Write_Forum([]);
        Forum = fs.readFileSync(dir, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                return "error";
            }
            return data;
        })
    }
    Forum = JSON.parse(Forum);
    return Forum;
}



//写入交易表
export async function Write_Exchange(wupin) {
    let dir = path.join(__PATH.Exchange, `Exchange.json`);
    let new_ARR = JSON.stringify(wupin, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}



//读交易表
export async function Read_Exchange() {
    let dir = path.join(`${__PATH.Exchange}/Exchange.json`);
    let Exchange;
    try {
        Exchange = fs.readFileSync(dir, 'utf8', (err, data) => {
            if (err) {
                return "error";
            }
            return data;
        })
    }
    catch
    {
        await Write_Exchange([]);
        Exchange = fs.readFileSync(dir, 'utf8', (err, data) => {
            if (err) {
                return "error";
            }
            return data;
        })
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


/**
 * 返回物品名字
 */
export async function returnname(thing_class) {
    let name = thing_class;
    if(name==1){
        name="武器";
        return name;
    }
    if(name==2){
        name="护具"
        return name;
    }
    if(name==3){
        name="法宝";
        return name;
    }
    if(name==4){
        Exchange[i].class="丹药";
        return name;
    }
    if(name==5){
        name="功法";
        return name;
    }
    if(name==6){
        name="道具";
        return name;
    }
    if(name==7){
        name="戒指";
        return name;
    }
}

