import plugin from '../../../../lib/plugins/plugin.js';
import fs from 'fs';
import path from 'path';
import data from '../../model/XiuxianData.js';
//插件地址
export const __dirname = `${path.resolve()}${path.sep}plugins${path.sep}Xiuxian-Plugin-Box`;
//插件地址链
export const __PATH = {
    player: path.join(__dirname, '/resources/data/birth/xiuxian/player'),
    action: path.join(__dirname, '/resources/data/birth/xiuxian/action'),
    battle: path.join(__dirname, '/resources/data/birth/xiuxian/battle'),
    equipment: path.join(__dirname, '/resources/data/birth/xiuxian/equipment'),
    level: path.join(__dirname, '/resources/data/birth/xiuxian/level'),
    talent: path.join(__dirname, '/resources/data/birth/xiuxian/talent'),
    wealth: path.join(__dirname, '/resources/data/birth/xiuxian/wealth'),
    najie: path.join(__dirname, '/resources/data/birth/xiuxian/najie'),
    Exchange: path.join(__dirname, '/resources/data/birth/Exchange'),
    Forum: path.join(__dirname, '/resources/data/birth/Forum'),
    life: path.join(__dirname, '/resources/data/birth/xiuxian/life')
};
//配置地址
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
    };
};
/**
 * 读取数据
 */
const Read = async (usr_qq, PATH) => {
    const dir = path.join(`${PATH}/${usr_qq}.json`);
    const the = {
        player: ''
    };
    the.player = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            return 'error';
        };
        return data;
    });
    the.player = JSON.parse(the.player);
    return the.player;
};
//写入数据
const Write = async (usr_qq, player, PATH) => {
    const dir = path.join(PATH, `${usr_qq}.json`);
    const new_ARR = JSON.stringify(player, '', '\t');
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
    });
    return;
};
//基础存档
export const existplayer = async (usr_qq) => {
    const life = await Read_Life();
    const find = life.find(item => item.qq == usr_qq);
    if (find == undefined) {
        return false;
    };
    if (find.status == 0) {
        return false;
    };
    return find;
};
//插件存档检测
export const existplayerplugins = async (usr_qq) => {
    const life = await Read_Life();
    const find = life.find(item => item.qq == usr_qq);
    if (find == undefined) {
        return false;
    };
    return find;
};
//读取存档
export const Read_player = async (usr_qq) => {
    return await Read(usr_qq, __PATH.player);;
};
//写入存档
export const Write_player = async (usr_qq, player) => {
    await Write(usr_qq, player, __PATH.player);
    return;
};
//读取灵根
export const Read_talent = async (usr_qq) => {
    return await Read(usr_qq, __PATH.talent);
};
//写入新灵根
export const Write_talent = async (usr_qq, player) => {
    await Write(usr_qq, player, __PATH.talent);
    return;
};
//读取战斗
export const Read_battle = async (usr_qq) => {
    return await Read(usr_qq, __PATH.battle);
};
//写入新战斗
export const Write_battle = async (usr_qq, data) => {
    await Write(usr_qq, data, __PATH.battle);
    return;
};
//读取境界
export const Read_level = async (usr_qq) => {
    return await Read(usr_qq, __PATH.level);
};
//写入新境界
export const Write_level = async (usr_qq, data) => {
    await Write(usr_qq, data, __PATH.level);
    return;
};
//读取财富
export const Read_wealth = async (usr_qq) => {
    return await Read(usr_qq, __PATH.wealth);
};
//写入新财富
export const Write_wealth = async (usr_qq, data) => {
    await Write(usr_qq, data, __PATH.wealth);
    return;
};
//读取状态
export const Read_action = async (usr_qq) => {
    return await Read(usr_qq, __PATH.action);
};
//写入新状态
export const Write_action = async (usr_qq, data) => {
    await Write(usr_qq, data, __PATH.action);
    return;
};
//读取储物袋
export const Write_najie = async (usr_qq, najie) => {
    await Write(usr_qq, najie, __PATH.najie);
    return;
};
//写入新储物袋
export const Read_najie = async (usr_qq) => {
    return await Read(usr_qq, __PATH.najie);
};
//读取装备
export const Read_equipment = async (usr_qq) => {
    return await Read(usr_qq, __PATH.equipment);
};
//写入新装备
export const Write_equipment = async (usr_qq, equipment) => {
    await Write(usr_qq, equipment, __PATH.equipment);
    await updata_equipment(usr_qq);
    return;
};
//计算面板
export const updata_equipment = async (usr_qq) => {
    const battle =await Read_battle(usr_qq);
    const equipment = await Read_equipment(usr_qq);
    const level = await Read_level(usr_qq);
    const levelmini = data.Level_list.find(item => item.id == level.level_id);
    const levelmax = data.LevelMax_list.find(item => item.id == level.levelmax_id);
    const the = {
        attack: 0,
        defense: 0,
        blood: 0,
        burst: 0,
        burstmax: 0,
        speed: 0,
        player: 0
    };
    equipment.forEach((item) => {
        the.attack = the.attack + item.attack;
        the.defense = the.defense + item.defense;
        the.blood = the.blood + item.blood;
        the.burst = the.burst + item.burst;
        the.burstmax = the.burstmax + item.burstmax;
        the.speed = the.speed + item.speed;
    });
    const bloodLimit = levelmini.blood + levelmax.blood + Math.floor((levelmini.blood + levelmax.blood) * the.blood * 0.01);
    the.player = {
        nowblood: battle.nowblood > bloodLimit ? bloodLimit : battle.nowblood,
        attack: levelmini.attack + levelmax.attack + Math.floor((levelmini.attack + levelmax.attack) * the.attack * 0.01),
        defense: levelmini.defense + levelmax.defense + Math.floor((levelmini.defense + levelmax.defense) * the.defense * 0.01),
        blood: bloodLimit,
        burst: levelmini.burst + levelmax.burst + the.burst,
        burstmax: levelmini.burstmax + levelmax.burstmax + the.burstmax + level.rank_id * 10,
        speed: levelmini.speed + levelmax.speed + the.speed
    };
    the.player.power = the.player.attack + the.player.defense + the.player.blood + the.player.burst + the.player.burstmax + the.player.speed;
    await Write_battle(usr_qq, the.player);
    return;
};
//魔力操作
export const Add_prestige = async (usr_qq, prestige) => {
    const player = await Read_level(usr_qq);
    player.prestige += Math.trunc(prestige);
    await Write_level(usr_qq, player);
    return;
};
//灵石操作
export const Add_lingshi = async (usr_qq, lingshi) => {
    const player = await Read_wealth(usr_qq);
    player.lingshi += Math.trunc(lingshi);
    await Write_wealth(usr_qq, player);
    return;
};
//修为操作
export const Add_experience = async (usr_qq, experience) => {
    const player = await Read_level(usr_qq);
    const exp0 = await Numbers(player.experience);
    const exp1 = await Numbers(experience);
    player.experience = await exp0 + exp1;
    await Write_level(usr_qq, player);
    return;
};
//气血操作
export const Add_experiencemax = async (usr_qq, qixue) => {
    const player = await Read_level(usr_qq);
    player.experiencemax += Math.trunc(qixue);
    await Write_level(usr_qq, player);
    return;
};
//血量按百分比恢复
export const Add_blood = async (usr_qq, blood) => {
    const player = await Read_battle(usr_qq);
    const battle = await Read_battle(usr_qq);
    //判断百分比
    if (player.nowblood < Math.floor(battle.blood * blood * 0.01)) {
        player.nowblood = Math.floor(battle.blood * blood * 0.01);
    };
    await Write_battle(usr_qq, player);
    return;
};
//储物袋灵石操作
export const Add_najie_lingshi = async (usr_qq, acount) => {
    const najie = await Read_najie(usr_qq);
    najie.lingshi += Math.trunc(acount);
    await Write_najie(usr_qq, najie);
    return;
};
//新增功法
export const Add_player_AllSorcery = async (usr_qq, gongfa) => {
    const player = await Read_talent(usr_qq);
    player.AllSorcery.push(gongfa);
    await Write_talent(usr_qq, player);
    await player_efficiency(usr_qq);
    return;
};
//怪物战斗
export const monsterbattle = async (e, battleA, battleB) => {
    const battle_msg = {
        msg: [],
        QQ: 1
    };
    const battle = {
        Z: 1
    };
    const battle_hurt = {
        hurtA: 0,
        hurtB: 0
    };
    if (battleA.speed >= battleB.speed - 5) {
        battle_hurt.hurtA = battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0;
        if (battle_hurt.hurtA <= 1) {
            battle_msg.msg.push('你个老六想偷袭,却连怪物的防御都破不了,被怪物一巴掌给拍死了!');
            battleA.nowblood = 0;
            battle_msg.QQ = 0;
            await Write_battle(e.user_id, battleA);
            return battle_msg;
        };
        const T = await battle_probability(battleA.burst);
        if (T) {
            battle_hurt.hurtA = Math.floor(battle_hurt.hurtA * battleA.burstmax / 100);
        };
        battleB.nowblood = battleB.nowblood - battle_hurt.hurtA;
        if (battleB.nowblood < 1) {
            battle_msg.msg.push('你仅出一招,就击败了怪物!');
            return battle_msg;
        } else {
            battle_msg.msg.push('你个老六偷袭,造成' + battle_hurt.hurtA + '伤害');
        };
    }
    else {
        battle_msg.msg.push('你个老六想偷袭,怪物一个转身就躲过去了');
    };
    while (true) {
        battle.Z++;
        if (battle.Z == 30) {
            break;
        };
        battle_hurt.hurtB = battleB.attack - battleA.defense >= 0 ? battleB.attack - battleA.defense + 1 : 0;
        const F = await battle_probability(battleB.burst);
        if (F) {
            battle_hurt.hurtB = Math.floor(battle_hurt.hurtB * battleB.burstmax / 100);
        };
        battleA.nowblood = battleA.nowblood - battle_hurt.hurtB;
        if (battle_hurt.hurtB > 1) {
            if (battleA.nowblood < 1) {
                battle_msg.msg.push('经过' + battle.Z + '回合,' + '你被怪物击败了!');
                battleA.nowblood = 0;
                battle_msg.QQ = 0;
                break;
            };
        };
        battle_hurt.hurtA = battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0;
        const T = await battle_probability(battleA.burst);
        if (T) {
            battle_hurt.hurtA = Math.floor(battle_hurt.hurtA * battleA.burstmax / 100);
        };
        if (battle_hurt.hurtA <= 1) {
            battle_msg.msg.push('你再次攻击,却连怪物的防御都破不了,被怪物一巴掌给拍死了!');
            battleA.nowblood = 0;
            battle_msg.QQ = 0;
            break;
        };
        battleB.nowblood = battleB.nowblood - battle_hurt.hurtA;
        if (battleB.nowblood < 1) {
            battle_msg.msg.push('经过' + battle.Z + '回合,' + '你击败了怪物!');
            break;
        };
    };
    battle_msg.msg.push(`血量剩余:${battleA.nowblood}`);
    await Write_battle(e.user_id, battleA);
    return battle_msg;
};
//战斗模型
export const battle = async (e, A, B) => {
    const battle_msg = {
        msg: [],
        QQ: 1
    };
    const battle = {
        X: 1,
        Y: 0,
        Z: 1
    };
    const battle_hurt = {
        'hurtA': 0,
        'hurtB': 0
    };
    const battleA = await Read_battle(A);
    const battleB = await Read_battle(B);
    battle_msg.QQ = A;
    if (battleA.speed >= battleB.speed - 5) {
        battle_hurt.hurtA = battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0;
        const T = await battle_probability(battleA.burst);
        if (T) {
            battle_hurt.hurtA = Math.floor(battle_hurt.hurtA * battleA.burstmax / 100);
        };
        if (battle_hurt.hurtA <= 1) {
            battle_msg.msg.push('你个老六想偷袭,却连对方的防御都破不了,被对方一巴掌给拍死了!');
            battleA.nowblood = 0;
            battle_msg.QQ = B;
            await ForwardMsg(e, battle_msg.msg);
            await Write_battle(A, battleA);
            return battle_msg.QQ;
        };
        battleB.nowblood = battleB.nowblood - battle_hurt.hurtA;
        if (battleB.nowblood < 1) {
            battle_msg.msg.push('你仅出一招,就击败了对方!');
            battleB.nowblood = 0;
            await ForwardMsg(e, battle_msg.msg);
            await Write_battle(B, battleB);
            return battle_msg.QQ;
        } else {
            battle_msg.msg.push('你个老六偷袭成功,造成' + battle_hurt.hurtA + '伤害');
        };
    } else {
        battle_msg.msg.push('你个老六想偷袭,对方却一个转身就躲过去了');
    };
    while (true) {
        battle.X++;
        battle.Z++;
        //分片发送消息
        if (battle.X == 15) {
            await ForwardMsg(e, battle_msg.msg);
            battle_msg.msg = [];
            battle.X = 0;
            battle.Y++;
            if (battle.Y == 2) {
                //就打2轮回
                break;
            };
        };
        //B开始
        battle_hurt.hurtB = battleB.attack - battleA.defense >= 0 ? battleB.attack - battleA.defense + 1 : 0;
        const F = await battle_probability(battleB.burst);
        if (F) {
            battle_hurt.hurtB = Math.floor(battle_hurt.hurtB * battleB.burstmax / 100);
        };
        battleA.nowblood = battleA.nowblood - battle_hurt.hurtB;
        if (battle_hurt.hurtB > 1) {
            if (battleA.nowblood < 0) {
                battle_msg.msg.push('第' + battle.Z + '回合:对方造成' + battle_hurt.hurtB + '伤害');
                battleA.nowblood = 0;
                battle_msg.QQ = B;
                await ForwardMsg(e, battle_msg.msg);
                break;
            }
        }
        else {
            battle_msg.msg.push('第' + battle.Z + '回合:对方造成' + battle_hurt.hurtB + '伤害');
        };
        //A开始
        battle_hurt.hurtA = battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0;
        const T = await battle_probability(battleA.burst);
        if (T) {
            battle_hurt.hurtA = Math.floor(battle_hurt.hurtA * battleA.burstmax / 100);
        };
        if (battle_hurt.hurtA <= 1) {
            //没伤害
            battle_msg.msg.push('你连对方的防御都破不了,被对方一巴掌给拍死了!');
            battleA.nowblood = 0;
            battle_msg.QQ = B;
            await ForwardMsg(e, battle_msg.msg);
            break;
        };
        battleB.nowblood = battleB.nowblood - battle_hurt.hurtA;
        if (battleB.nowblood < 0) {
            battle_msg.msg.push('第' + battle.Z + '回合:你造成' + battle_hurt.hurtA + '伤害,并击败了对方!');
            battle_msg.msg.push('你击败了对方!');
            battleB.nowblood = 0;
            await ForwardMsg(e, battle_msg.msg);
            break;
        } else {
            battle_msg.msg.push('第' + battle.Z + '回合:你造成' + battle_hurt.hurtA + '伤害');
        };
    };
    battle_msg.msg.push(`血量剩余:${battleA.nowblood}`);
    await Write_battle(A, battleA);
    await Write_battle(B, battleB);
    return battle_msg.QQ;
}
//暴击率
export const battle_probability = async (P) => {
    let newp = P;
    if (newp > 100) {
        newp = 100;
    };
    if (newp < 0) {
        newp = 0;
    };
    const rand = Math.floor((Math.random() * (100 - 1) + 1));
    if (newp > rand) {
        return true;
    };
    return false;
};
//得到灵根
export const get_talent = async () => {
    const newtalent = [];
    const talentacount = Math.round(Math.random() * (5 - 1)) + 1;
    for (let i = 0; i < talentacount; i++) {
        const x = Math.round(Math.random() * (10 - 1)) + 1;
        const y = newtalent.indexOf(x);
        if (y != -1) {
            continue;
        };
        if (x <= 5) {
            const z = newtalent.indexOf(x + 5);
            if (z != -1) {
                continue;
            };
        }
        else {
            const z = newtalent.indexOf(x - 5);
            if (z != -1) {
                continue;
            };
        };
        newtalent.push(x);
    };
    return newtalent;
};
/**
 * 得到灵根名字
 */
export const talentname = async (player) => {
    const talentname = [];
    let name = '';
    const talent = player.talent;
    for (let i = 0; i < talent.length; i++) {
        name = data.talent_list.find(item => item.id == talent[i]).name;
        talentname.push(name);
    };
    return talentname;
};

/**
 * 计算天赋
 */
const talentsize = async (player) => {
    const talent = {
        player: player.talent,
        talentsize: 250
    };
    //根据灵根数来判断
    for (let i = 0; i < talent.player.length; i++) {
        //循环加效率
        if (talent.player[i] <= 5) {
            talent.talentsize -= 50;
        };
        if (talent.player[i] >= 6) {
            talent.talentsize -= 40;
        };
    };
    return talent.talentsize;
};

/**
 * 天赋综合计算
 */
export const player_efficiency = async (usr_qq) => {
    const player = await Read_talent(usr_qq);
    const the = {
        gongfa_efficiency: 0,
        linggen_efficiency: 0
    };
    the.gongfa_efficiency = 0;
    player.AllSorcery.forEach((item) => {
        the.gongfa_efficiency = the.gongfa_efficiency + item.size;
    });
    the.linggen_efficiency = await talentsize(player);
    player.talentsize = the.linggen_efficiency + the.gongfa_efficiency;
    await Write_talent(usr_qq, player);
    return;
};

/**
 * 根据名字返回物品
 */
export const search_thing_name = async (thing) => {
    const ifexist0 = JSON.parse(fs.readFileSync(`${data.__PATH.all}/all.json`)).find(item => item.name == thing);
    if (!ifexist0) {
        return 1;
    };
    return ifexist0;
};
/**
 * 根据id返回物品
 */
export const search_thing_id = async (thing_id) => {
    const ifexist0 = JSON.parse(fs.readFileSync(`${data.__PATH.all}/all.json`)).find(item => item.id == thing_id);
    if (!ifexist0) {
        return 1;
    }
    else {
        return ifexist0;
    };
};
//根据id搜储物袋物品
export const exist_najie_thing_id = async (usr_qq, thing_id) => {
    const najie = await Read_najie(usr_qq);
    const ifexist = najie.thing.find(item => item.id == thing_id);
    if (!ifexist) {
        return 1;
    };
    return ifexist;
};
//根据名字搜储物袋物品
export const exist_najie_thing_name = async (usr_qq, name) => {
    const najie = await Read_najie(usr_qq);
    const ifexist = najie.thing.find(item => item.name == name);
    if (!ifexist) {
        return 1;
    };
    return ifexist;
};
//给储物袋添加物品
export const Add_najie_thing = async (najie, najie_thing, thing_acount) => {
    const thing = najie.thing.find(item => item.id == najie_thing.id);
    if (thing) {
        let acount = thing.acount + thing_acount;
        if (acount < 1) {
            najie.thing = najie.thing.filter(item => item.id != najie_thing.id);
        }
        else {
            najie.thing.find(item => item.id == najie_thing.id).acount = acount;
        };
        return najie;
    } else {
        najie_thing.acount = thing_acount;
        najie.thing.push(najie_thing);
        return najie;
    };
};
//发送转发消息
export const ForwardMsg = async (e, data) => {
    const msgList = [];
    for (let i of data) {
        msgList.push({
            message: i,
            nickname: Bot.nickname,
            user_id: Bot.uin,
        });
    };
    if (msgList.length == 1) {
        await e.reply(msgList[0].message);
    }
    else {
        await e.reply(await Bot.makeForwardMsg(msgList));
    };
    return;
};
/**
 * 对象数组排序
 * 从大到小
 */
export const sortBy = (field) => {
    return function (b, a) {
        return a[field] - b[field];
    };
};
/**
 * 输入概率随机返回布尔类型数据
 */
export const probability = (P) => {
    //概率为1-100
    if (P > 100) { P = 100; };
    if (P < 0) { P = 0; };
    const rand = Math.floor((Math.random() * (100 - 1) + 1));
    //命中
    if (rand < P) {
        return true;
    };
    return false;
};
//输入物品随机返回元素
export const Anyarray = (ARR) => {
    const randindex = Math.trunc(Math.random() * ARR.length);
    return ARR[randindex];
};
//沉睡
export const sleep = async (time) => {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
};
// 时间转换
export const timestampToTime = (timestamp) => {
    //时间戳为10位需*1000,时间戳为13位的话不需乘1000
    const date = new Date(timestamp);
    const Y = date.getFullYear() + '-';
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    const D = date.getDate() + ' ';
    const h = date.getHours() + ':';
    const m = date.getMinutes() + ':';
    const s = date.getSeconds();
    return Y + M + D + h + m + s;
}
//根据时间戳获取年月日时分秒
export const shijianc = async (time) => {
    const dateobj = {}
    const date = new Date(time)
    dateobj.Y = date.getFullYear()
    dateobj.M = date.getMonth() + 1
    dateobj.D = date.getDate()
    dateobj.h = date.getHours()
    dateobj.m = date.getMinutes()
    dateobj.s = date.getSeconds()
    return dateobj;
};
/**
 * 艾特并返回QQ
 */
export const At = async (e) => {
    const isat = e.message.some((item) => item.type === 'at');
    if (!isat) {
        return 0;
    };
    const atItem = e.message.filter((item) => item.type === 'at');
    const B = atItem[0].qq;
    const ifexistplay = await existplayer(B);
    if (!ifexistplay) {
        return 0;
    };
    return B;
};
/**
 * 判断对象是否不为undefined且不为null
 * @param obj 对象
 * @returns obj==null/undefined,return false,other return true
 */
export const isNotNull = (obj) => {
    if (obj == undefined || obj == null)
        return false;
    return true;
};
export const isNotBlank = (value) => {
    if (value ?? '' !== '') {
        return true;
    }
    else {
        return false;
    };
};
/**
 * 强制修正至少为1
 */
export const Numbers = async (value) => {
    const the = {};
    the.value = value;
    if (isNaN(parseFloat(the.value)) && !isFinite(the.value)) {
        the.value = 1;
    };
    the.value = Math.trunc(the.value);
    the.value = Number(the.value);
    if (the.value == null || the.value == undefined || the.value < 1 || the.value == NaN) {
        the.value = 1;
    };
    return the.value;
};
/**
 * 得到状态
 */
export const getPlayerAction = async (usr_qq) => {
    const arr = {};
    let action = await redis.get('xiuxian:player:' + usr_qq + ':action');
    action = JSON.parse(action);
    if (action != null) {
        const action_end_time = action.end_time;
        const now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            const m = parseInt((action_end_time - now_time) / 1000 / 60);
            const s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
            arr.action = action.action;//当期那动作
            arr.time = m + 'm' + s + 's';//剩余时间
            return arr;
        };
    };
    arr.action = '空闲';
    return arr;
};
/**
 * 关闭状态
 */
export const offaction = async (qq) => {
    const exists = await redis.exists('xiuxian:player:' + qq + ':action');
    if (exists == 1) {
        await redis.del('xiuxian:player:' + qq + ':action');
    };
    return;
};
/**
 * 状态封锁查询
 */
export const Gomini = async (e) => {
    if (!e.isGroup) {
        return false;
    };
    const usr_qq = e.user_id;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    };
    let action = await redis.get('xiuxian:player:' + usr_qq + ':action');
    if (action != undefined) {
        action = JSON.parse(action);
        if (action.actionName == undefined) {
            e.reply('存在旧版本残留,请联系主人使用#删除数据');
            return false;
        };
        e.reply(action.actionName + '中...')
        return false;
    };
    return true;
};

/**
 * 状态封锁查询
 */
export const Go = async (e) => {
    if (!e.isGroup) {
        return false;
    };
    const usr_qq = e.user_id;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return false;
    };
    let action = await redis.get('xiuxian:player:' + usr_qq + ':action');
    if (action != undefined) {
        action = JSON.parse(action);
        if (action.actionName == undefined) {
            e.reply('存在旧版本残留,请联系主人使用#删除数据');
            return false;
        };
        e.reply(action.actionName + '中...')
        return false;
    };
    const player = await Read_battle(usr_qq);
    if (player.nowblood <= 1) {
        e.reply('血量不足...');
        return false;
    };
    return true;
};
//0     1     2      3      4     5       6     7      8      9     10    11   12   13   14
const CDname = ['攻击', '降妖', '闭关', '改名', '道宣', '赠送', '突破', '破体', '转世', '行为', '击杀', '  ', '  ', '  ', '  '];
/**
 * 冷却检测
 */
export const GenerateCD = async (usr_qq, CDid) => {
    const remainTime = await redis.ttl('xiuxian:player:' + usr_qq + ':' + CDid);
    const time = {
        h: 0,
        m: 0,
        s: 0
    };
    if (remainTime != -1) {
        time.h = Math.floor(remainTime / 60 / 60);
        time.h = time.h < 0 ? 0 : time.h;
        time.m = Math.floor((remainTime - time.h * 60 * 60) / 60);
        time.m = time.m < 0 ? 0 : time.m;
        time.s = Math.floor((remainTime - time.h * 60 * 60 - time.m * 60));
        time.s = time.s < 0 ? 0 : time.s;
        if (time.h == 0 && time.m == 0 && time.s == 0) {
            return 0;
        };
        return CDname[CDid] + '冷却:' + time.h + 'h' + time.m + 'm' + time.s + 's';
    };
    return 0;
};
//插件CD检测
export const GenerateCDplugin = async (usr_qq, CDid, CDnameplugin) => {
    const remainTime = await redis.ttl('xiuxian:player:' + usr_qq + ':' + CDid);
    const time = {
        h: 0,
        m: 0,
        s: 0
    };
    if (remainTime != -1) {
        time.h = Math.floor(remainTime / 60 / 60);
        time.h = time.h < 0 ? 0 : time.h;
        time.m = Math.floor((remainTime - time.h * 60 * 60) / 60);
        time.m = time.m < 0 ? 0 : time.m;
        time.s = Math.floor((remainTime - time.h * 60 * 60 - time.m * 60));
        time.s = time.s < 0 ? 0 : time.s;
        if (time.h == 0 && time.m == 0 && time.s == 0) {
            return 0;
        };
        return CDnameplugin[CDid] + '冷却:' + time.h + 'h' + time.m + 'm' + time.s + 's';
    };
    return 0;
};
//写入
export const Write_Forum = async (wupin) => {
    await Write(`Forum`, wupin, __PATH.Forum);
    return;
};
//读取
export const Read_Forum = async () => {
    const dir = path.join(`${__PATH.Forum}/Forum.json`);
    let Forum = await newRead(dir);
    if (Forum == 1) {
        await Write_Forum([]);
        Forum = await newRead(dir);
    };
    Forum = JSON.parse(Forum);
    return Forum;
};
//写入交易表
export const Write_Exchange = async (wupin) => {
    await Write(`Exchange`, wupin, __PATH.Exchange);
    return;
};
//读交易表
export const Read_Exchange = async () => {
    const dir = path.join(`${__PATH.Exchange}/Exchange.json`);
    let Exchange = await newRead(dir);
    if (Exchange == 1) {
        await Write_Exchange([]);
        Exchange = await newRead(dir);
    };
    Exchange = await JSON.parse(Exchange);
    return Exchange;
};
//搜索物品
export const Search_Exchange = async (thing_qq) => {
    const the = {
        qq: thing_qq,
        x: -1
    };
    const Exchange = await Read_Exchange();
    if (the.thingqq == '') {
        return the.x;
    };
    for (let i = 0; i < Exchange.length; i++) {
        if (Exchange[i].qq == the.thingqq) {
            the.x = i;
            break;
        };
    };
    return the.x;
};
//写入寿命表
export const Write_Life = async (wupin) => {
    await Write(`life`, wupin, __PATH.life);
    return;
};
//读寿命表
export const Read_Life = async () => {
    const dir = path.join(`${__PATH.life}/life.json`);
    let Life = await newRead(dir);
    if (Life == 1) {
        await Write_Life([]);
        Life = await newRead(dir);
    };
    Life = await JSON.parse(Life);
    return Life;
};
//新的写入
export const newRead = async (dir) => {
    try {
        const newdata = fs.readFileSync(dir, 'utf8', (err, data) => {
            if (err) {
                return 'error';
            };
            return data;
        });
        return newdata;
    } catch {
        return 1;
    };
};
//判断两者是否可以交互
export const interactive = async (A, B) => {
    const a = await Read_action(A);
    const b = await Read_action(B);
    //198=1.98=1
    a.x = Math.floor(a.x / 100);
    a.y = Math.floor(a.y / 100);
    //145/100=1.45=1
    b.x = Math.floor(b.x / 100);
    b.y = Math.floor(b.y / 100);
    if (a.x == b.x && b.y == b.y) {
        return true;
    };
    return false;
};
//判断两者距离
export const distance = async (A, B) => {
    const a = await Read_action(A);
    const b = await Read_action(B);
    const h = Math.pow(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2), 1 / 2);
    return h;
};
//两者距离
export const map_distance = async (A, B) => {
    const h = Math.pow(Math.pow((A.x - B.x1), 2) + Math.pow((A.y - B.y1), 2), 1 / 2);
    return h;
};


//输入：模糊搜索名字并判断是否在此地
export const point_map = async (action, addressName) => {
    const point = JSON.parse(fs.readFileSync(`${data.__PATH.position}/point.json`));
    let T = false;
    point.forEach((item,index,arr) => {
        //存在模糊
        if (item.name.includes(addressName)) {
            //且位置配对
            if (action.x == item.x && action.y == item.y) {
                T = true;
            };
        };
    });
    return T;
};