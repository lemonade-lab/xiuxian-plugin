import plugin from '../../../../lib/plugins/plugin.js';
import fs from 'fs';
import path from 'path';
import data from '../../model/XiuxianData.js';
const __dirname = `${path.resolve()}${path.sep}plugins${path.sep}xiuxian-emulator-plugin`;
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
    let player = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            return 'error';
        };
        return data;
    });
    player = JSON.parse(player);
    return player;
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
    if (find.state == 0) {
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
export const Read_player = async (usr_qq) => {
    return await Read(usr_qq, __PATH.player);;
};
export const Write_player = async (usr_qq, player) => {
    await Write(usr_qq, player, __PATH.player);
    return;
};
export const Read_talent = async (usr_qq) => {
    return await Read(usr_qq, __PATH.talent);
};
export const Write_talent = async (usr_qq, player) => {
    await Write(usr_qq, player, __PATH.talent);
    return;
};
export const Read_battle = async (usr_qq) => {
    return await Read(usr_qq, __PATH.battle);
};
export const Write_battle = async (usr_qq, data) => {
    await Write(usr_qq, data, __PATH.battle);
    return;
};
export const Read_level = async (usr_qq) => {
    return await Read(usr_qq, __PATH.level);
};
export const Write_level = async (usr_qq, data) => {
    await Write(usr_qq, data, __PATH.level);
    return;
};
export const Read_wealth = async (usr_qq) => {
    return await Read(usr_qq, __PATH.wealth);
};
export const Write_wealth = async (usr_qq, data) => {
    await Write(usr_qq, data, __PATH.wealth);
    return;
};
export const Read_action = async (usr_qq) => {
    return await Read(usr_qq, __PATH.action);
};
export const Write_action = async (usr_qq, data) => {
    await Write(usr_qq, data, __PATH.action);
    return;
};
export const Write_najie = async (usr_qq, najie) => {
    await Write(usr_qq, najie, __PATH.najie);
    return;
};
export const Read_najie = async (usr_qq) => {
    return await Read(usr_qq, __PATH.najie);
};
export const Read_equipment = async (usr_qq) => {
    return await Read(usr_qq, __PATH.equipment);
};
export const Write_equipment = async (usr_qq, equipment) => {
    await Write(usr_qq, equipment, __PATH.equipment);
    await updata_equipment(usr_qq);
    return;
};
export const updata_equipment = async (usr_qq) => {
    let attack = 0, defense = 0, blood = 0, burst = 0, burstmax = 0, speed = 0;
    let equipment = await Read_equipment(usr_qq);
    equipment.forEach((item) => {
        attack = attack + item.attack;
        defense = defense + item.defense;
        blood = blood + item.blood;
        burst = burst + item.burst;
        burstmax = burstmax + item.burstmax;
        speed = speed + item.speed;
    });
    let level = await Read_level(usr_qq);
    let levelmini = data.Level_list.find(item => item.id == level.level_id);
    let levelmax = data.LevelMax_list.find(item => item.id == level.levelmax_id);
    let player = await Read_battle(usr_qq);
    player = {
        nowblood: player.nowblood,
        attack: levelmini.attack + levelmax.attack + Math.floor((levelmini.attack + levelmax.attack) * attack * 0.01),
        defense: levelmini.defense + levelmax.defense + Math.floor((levelmini.defense + levelmax.defense) * defense * 0.01),
        blood: levelmini.blood + levelmax.blood + Math.floor((levelmini.blood + levelmax.blood) * blood * 0.01),
        burst: levelmini.burst + levelmax.burst + burst,
        burstmax: levelmini.burstmax + levelmax.burstmax + burstmax + level.rank_id * 10,
        speed: levelmini.speed + levelmax.speed + speed
    }
    player.power = player.attack + player.defense + player.blood + player.burst + player.burstmax + player.speed;
    await Write_battle(usr_qq, player);
    return;
};
export const Add_prestige = async (usr_qq, prestige) => {
    const player = await Read_level(usr_qq);
    player.prestige += Math.trunc(prestige);
    await Write_level(usr_qq, player);
    return;
};
export const Add_lingshi = async (usr_qq, lingshi) => {
    const player = await Read_wealth(usr_qq);
    player.lingshi += Math.trunc(lingshi);
    await Write_wealth(usr_qq, player);
    return;
};
export const Add_experience = async (usr_qq, experience) => {
    const player = await Read_level(usr_qq);
    const exp0 = await Numbers(player.experience);
    const exp1 = await Numbers(experience);
    player.experience = await exp0 + exp1;
    await Write_level(usr_qq, player);
    return;
};
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
export const Add_najie_lingshi = async (usr_qq, acount) => {
    const najie = await Read_najie(usr_qq);
    najie.lingshi += Math.trunc(acount);
    await Write_najie(usr_qq, najie);
    return;
};
export const Add_player_AllSorcery = async (usr_qq, gongfa) => {
    const player = await Read_talent(usr_qq);
    player.AllSorcery.push(gongfa);
    await Write_talent(usr_qq, player);
    await player_efficiency(usr_qq);
    return;
};
export const monsterbattle = async (e, battleA, battleB) => {
    let msg = [];
    let qq = 1;
    if (battleA.speed >= battleB.speed - 5) {
        let hurt = battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0;
        if (hurt <= 0) {
            e.reply('你个老六想偷袭，却连怪物的防御都破不了，被怪物一巴掌给拍死了！');
            battleA.nowblood = 0;
            qq = 0;
            await Write_battle(e.user_id, battleA);
            return qq;
        };
        if (await battle_probability(battleA.burst)) {
            hurt = Math.floor(hurt * battleA.burstmax);
        };
        battleB.nowblood = battleB.nowblood - hurt;
        if (battleB.nowblood < 1) {
            e.reply('你仅出一招，就击败了怪物！');
            return qq;
        } else {
            msg.push('你个老六偷袭，造成' + hurt + '伤害');
        };
    } else {
        msg.push('你个老六想偷袭，对方却一个转身就躲过去了');
    };
    //循环回合，默认从B攻击开始
    var x = 1;
    var y = 0;
    var z = 1;
    while (true) {
        x++;
        z++;
        //分片发送消息
        if (x == 15) {
            await ForwardMsg(e, msg);
            msg = [];
            x = 0;
            y++;
            if (y == 2) {
                //就打2轮回
                break;
            };
        };
        //B开始
        let hurt = battleB.attack - battleA.defense >= 0 ? battleB.attack - battleA.defense + 1 : 0;
        if (await battle_probability(battleB.burst)) {
            hurt = Math.floor(hurt * battleB.burstmax);
        };
        battleA.nowblood = battleA.nowblood - hurt;
        if (battleA.nowblood < 0) {
            msg.push('第' + z + '回合:怪物造成' + hurt + '伤害');
            await ForwardMsg(e, msg);
            e.reply('你被怪物击败了！');
            battleA.nowblood = 0;
            battleB.nowblood = battleB.nowblood + 1;
            qq = 0;
            break;
        } else {
            msg.push('第' + z + '回合:怪物造成' + hurt + '伤害');
        };
        //A开始
        hurt = battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0;
        if (await battle_probability(battleA.burst)) {
            hurt = Math.floor(hurt * battleA.burstmax);
        };
        battleB.nowblood = battleB.nowblood - hurt;
        if (battleB.nowblood < 0) {
            msg.push('第' + z + '回合:你造成' + hurt + '伤害，并击败了怪物！');
            await ForwardMsg(e, msg);
            e.reply('你击败了怪物！');
            battleB.nowblood = 0;
            battleA.nowblood = battleA.nowblood + 1;
            break;
        }
        else {
            msg.push('第' + z + '回合:你造成' + hurt + '伤害');
        };
    };
    await Write_battle(e.user_id, battleA);
    return qq;
};
export const battle = async (e, A, B) => {
    let A_qq = A;
    let B_qq = B;
    let battleA = await Read_battle(A_qq);
    let battleB = await Read_battle(B_qq);
    let qq = A_qq;
    let msg = [];
    if (battleA.speed >= battleB.speed - 5) {
        let hurt = battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0;
        if (await battle_probability(battleA.burst)) {
            hurt = Math.floor(hurt * battleA.burstmax);
        };
        if (hurt <= 0) {
            e.reply('你个老六想偷袭，却连对方的防御都破不了，被对方一巴掌给拍死了！');
            battleA.nowblood = 0;
            qq = B_qq;
            await Write_battle(e.user_id, battleA);
            return qq;
        };
        battleB.nowblood = battleB.nowblood - hurt;
        if (battleB.nowblood < 1) {
            e.reply('你仅出一招，就击败了对方！');
            battleB.nowblood = 0;
            await Write_battle(B_qq, battleB);
            return qq;
        } else {
            msg.push('你个老六偷袭成功，造成' + hurt + '伤害');
        };
    } else {
        msg.push('你个老六想偷袭，对方却一个转身就躲过去了');
    };
    //循环回合，默认从B攻击开始
    var x = 1;
    var y = 0;
    var z = 1;
    while (true) {
        x++;
        z++;
        //分片发送消息
        if (x == 15) {
            await ForwardMsg(e, msg);
            msg = [];
            x = 0;
            y++;
            if (y == 2) {
                //就打2轮回
                break;
            };
        };
        //B开始
        let hurt = battleB.attack - battleA.defense >= 0 ? battleB.attack - battleA.defense + 1 : 0;
        if (await battle_probability(battleB.burst)) {
            hurt = Math.floor(hurt * battleB.burstmax);
        };
        battleA.nowblood = battleA.nowblood - hurt;
        if (battleA.nowblood < 0) {
            msg.push('第' + z + '回合:对方造成' + hurt + '伤害');
            await ForwardMsg(e, msg);
            e.reply('你被对方击败了！');
            battleA.nowblood = 0;
            battleB.nowblood = battleB.nowblood + 1;
            qq = B_qq;
            break;
        }
        else {
            msg.push('第' + z + '回合:对方造成' + hurt + '伤害');
        };
        //A开始
        hurt = battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 0;
        if (await battle_probability(battleA.burst)) {
            hurt = Math.floor(hurt * battleA.burstmax);
        };
        battleB.nowblood = battleB.nowblood - hurt;
        if (battleB.nowblood < 0) {
            msg.push('第' + z + '回合:你造成' + hurt + '伤害，并击败了对方！');
            await ForwardMsg(e, msg);
            e.reply('你击败了对方！');
            battleB.nowblood = 0;
            battleA.nowblood = battleA.nowblood + 1;
            break;
        } else {
            msg.push('第' + z + '回合:你造成' + hurt + '伤害');
        };
    };
    //在这里结算一下
    await Write_battle(A_qq, battleA);
    await Write_battle(B_qq, battleB);
    //返回赢家QQ
    return qq;
}
//整数
export const battle_probability = async (P) => {
    let newp = 0;
    if (P > 100) {
        newp = 100;
    };
    if (P < 0) {
        newp = 0;
    };
    const rand = Math.floor((Math.random() * (100 - 1) + 1));
    if (newp > rand) {
        return true;
    };
    return false;
};
/**
 * 灵根合集
 */
export const get_talent = async () => {
    const newtalent = [];
    const talentacount = Math.round(Math.random() * (5 - 1)) + 1;
    for (var i = 0; i < talentacount; i++) {
        var x = Math.round(Math.random() * (10 - 1)) + 1;
        var y = newtalent.indexOf(x);
        if (y != -1) {
            continue;
        };
        if (x <= 5) {
            var z = newtalent.indexOf(x + 5);
            if (z != -1) {
                continue;
            };
        }
        else {
            var z = newtalent.indexOf(x - 5);
            if (z != -1) {
                continue;
            };
        };
        newtalent.push(x);
    };
    return newtalent;
};

/**
 * 灵根名字
 */
export const talentname = async (player) => {
    const talentname = [];
    let name = '';
    const talent = player.talent;
    for (var i = 0; i < talent.length; i++) {
        name = data.talent_list.find(item => item.id == talent[i]).name;
        talentname.push(name);
    };
    return talentname;
};

/**
 * 计算天赋
 */
const talentsize = async (player) => {
    let talentsize = 250;
    const talent = player.talent;
    //根据灵根数来判断
    for (var i = 0; i < talent.length; i++) {
        //循环加效率
        if (talent[i] <= 5) {
            talentsize -= 50;
        };
        if (talent[i] >= 6) {
            talentsize -= 40;
        };
    };
    return talentsize;
};

/**
 * 天赋综合计算
 */
export const player_efficiency = async (usr_qq) => {
    const player = await Read_talent(usr_qq);
    let gongfa_efficiency = 0;
    player.AllSorcery.forEach((item) => {
        gongfa_efficiency = gongfa_efficiency + item.size;
    });
    let linggen_efficiency = await talentsize(player);
    player.talentsize = linggen_efficiency + gongfa_efficiency;
    await Write_talent(usr_qq, player);
    return;
};

/**
 * 根据名字返回物品
 */
export const search_thing_name = async (thing) => {
    const ifexist0 = JSON.parse(fs.readFileSync(`${data.all}/all.json`)).find(item => item.name == thing);
    if (ifexist0 == undefined) {
        return 1;
    };
    return ifexist0;
};
/**
 * 根据id返回物品
 */
export const search_thing_id = async (thing_id) => {
    const ifexist0 = JSON.parse(fs.readFileSync(`${data.all}/all.json`)).find(item => item.id == thing_id);
    if (ifexist0 == undefined) {
        return 1;
    }
    else {
        return ifexist0;
    };
};
export const exist_najie_thing_id = async (usr_qq, thing_id) => {
    const najie = await Read_najie(usr_qq);
    const ifexist = najie.thing.find(item => item.id == thing_id);
    if (ifexist == undefined) {
        return 1;
    };
    return ifexist;
};
export const exist_najie_thing_name = async (usr_qq, name) => {
    const najie = await Read_najie(usr_qq);
    const ifexist = najie.thing.find(item => item.name == name);
    if (ifexist == undefined) {
        return 1;
    };
    return ifexist;
};
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
    //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const date = new Date(timestamp);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y + M + D + h + m + s;
}
//根据时间戳获取年月日时分秒
export const shijianc = async (time) => {
    let dateobj = {}
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
 * 艾特
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
    let x = value;
    if (isNaN(parseFloat(x)) && !isFinite(x)) {
        x = 1;
    };
    x = Math.trunc(x);
    x = Number(x);
    if (x == null || x == undefined || x < 1 || x == NaN) {
        x = 1;
    };
    return x;
};
/**
 * 得到状态
 */
export const getPlayerAction = async (usr_qq) => {
    let arr = {};
    let action = await redis.get('xiuxian:player:' + usr_qq + ':action');
    action = JSON.parse(action);
    if (action != null) {
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = parseInt((action_end_time - now_time) / 1000 / 60);
            let s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
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
        return;
    };
    const usr_qq = e.user_id;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    };
    let action = await redis.get('xiuxian:player:' + usr_qq + ':action');
    if (action != undefined) {
        action = JSON.parse(action);
        if (action.actionName == undefined) {
            e.reply('存在旧版本残留，请联系主人使用#删除数据');
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
        return;
    };
    const usr_qq = e.user_id;
    const ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    };
    let action = await redis.get('xiuxian:player:' + usr_qq + ':action');
    if (action != undefined) {
        action = JSON.parse(action);
        if (action.actionName == undefined) {
            e.reply('存在旧版本残留，请联系主人使用#删除数据');
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
    if (remainTime != -1) {
        let h = Math.floor(remainTime / 60 / 60);
        h = h < 0 ? 0 : h;
        let m = Math.floor((remainTime - h * 60 * 60) / 60);
        m = m < 0 ? 0 : m;
        let s = Math.floor((remainTime - h * 60 * 60 - m * 60));
        s = s < 0 ? 0 : s;
        if (h == 0 && m == 0 && s == 0) {
            return 0;
        }
        return CDname[CDid] + '冷却:' + h + 'h' + m + 'm' + s + 's';
    };
    return 0;
};
export const GenerateCDplugin = async (usr_qq, CDid, CDnameplugin) => {
    const remainTime = await redis.ttl('xiuxian:player:' + usr_qq + ':' + CDid);
    if (remainTime != -1) {
        let h = Math.floor(remainTime / 60 / 60);
        h = h < 0 ? 0 : h;
        let m = Math.floor((remainTime - h * 60 * 60) / 60);
        m = m < 0 ? 0 : m;
        let s = Math.floor((remainTime - h * 60 * 60 - m * 60));
        s = s < 0 ? 0 : s;
        if (h == 0 && m == 0 && s == 0) {
            return 0;
        }
        return CDnameplugin[CDid] + '冷却:' + h + 'h' + m + 'm' + s + 's';
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
    const thingqq = thing_qq;
    let x = -1;
    const Exchange = await Read_Exchange();
    if (thingqq == '') {
        return x;
    };
    for (var i = 0; i < Exchange.length; i++) {
        if (Exchange[i].qq == thingqq) {
            x = i;
            break;
        };
    };
    return x;
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
//
export const map_distance = async (A, B) => {
    const h = Math.pow(Math.pow((A.x - B.x1), 2) + Math.pow((A.y - B.y1), 2), 1 / 2);
    return h;
};