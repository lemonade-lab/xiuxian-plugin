import fs from "fs"
import path from "path"
import data from './xiuxiandata.js'
import { __dirname, AppName } from '../app.config.js'
export const __PATH = {
    //用户数据
    player_path: path.join(__dirname, "/resources/data/xiuxian_player"),
    //装备
    equipment_path: path.join(__dirname, "/resources/data/xiuxian_equipment"),
    //纳戒
    najie_path: path.join(__dirname, "/resources/data/xiuxian_najie"),
    //源数据
    lib_path: path.join(__dirname, "/resources/data/item"),
    timelimit: path.join(__dirname, "/resources/data/timelimit"),
    forum: path.join(__dirname, "/resources/data/exchange"),
    exchange: path.join(__dirname, "/resources/data/forum"),
    log_path: path.join(__dirname, "/resources/data/suduku")
}
let xiuxianSetFile = "./plugins/" + AppName + "/config/xiuxian/xiuxian.yaml";
if (!fs.existsSync(xiuxianSetFile)) {
    fs.copyFileSync("./plugins/" + AppName + "/defset/xiuxian/xiuxian.yaml", xiuxianSetFile);
}
const 伪灵根概率 = 0.3;
const 真灵根概率 = 0.3;
const 天灵根概率 = 0.2;
//检查存档是否存在，存在返回true;
export async function existplayer(usr_qq) {
    let exist_player;
    exist_player = fs.existsSync(`${__PATH.player_path}/${usr_qq}.json`);
    if (exist_player) {
        return true;
    }
    return false;
}
/**
 * 状态
 */

export async function Go(e) {
    let usr_qq = e.user_id;
    //不支持私聊
    if (!e.isGroup) {
        return;
    }
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    }
    //获取游戏状态
    let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
    //防止继续其他娱乐行为
    if (game_action == 0) {
        e.reply("修仙:游戏进行中...");
        return;
    }
    //查询redis中的人物动作
    let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
    action = JSON.parse(action);
    if (action != null) {
        //人物有动作查询动作结束时间
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = parseInt((action_end_time - now_time) / 1000 / 60);
            let s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
            e.reply("正在" + action.action + "中,剩余时间:" + m + "分" + s + "秒");
            return;
        }
    }
    let player = await Read_player(usr_qq);
    if (player.当前血量 < 200) {
        e.reply("你都伤成这样了,就不要出去浪了");
        return;
    }
    return true;
}


//写入交易表
export async function Write_exchange(wupin) {
    let dir = path.join(__PATH.exchange, `exchange.json`);
    let new_ARR = JSON.stringify(wupin, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}

//读交易表
export async function Read_exchange() {
    let dir = path.join(`${__PATH.exchange}/exchange.json`);
    let exchange = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    //将字符串数据转变成数组格式
    exchange = JSON.parse(exchange);
    return exchange;
}

//写入
export async function Write_forum(wupin) {
    let dir = path.join(__PATH.forum, `forum.json`);
    let new_ARR = JSON.stringify(wupin, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}


//读取
export async function Read_forum() {
    let dir = path.join(`${__PATH.forum}/forum.json`);
    let forum = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    forum = JSON.parse(forum);
    return forum;
}


export async function dujie(user_qq) {
    let usr_qq = user_qq;
    let player = await Read_player(usr_qq);
    //根据当前血量才算
    //计算系数
    var new_blood = player.当前血量;
    var new_defense = player.防御;
    var new_attack = player.攻击;
    //渡劫期基础血量为1600000。防御800000，攻击800000 
    new_blood = new_blood / 100000;
    new_defense = new_defense / 100000;
    new_attack = new_attack / 100000;
    //取值比例4.6.2
    new_blood = (new_blood * 4) / 10;
    new_defense = (new_defense * 6) / 10;
    new_attack = (new_attack * 2) / 10;
    //基础厚度
    var N = new_blood + new_defense;
    //你的系数
    var x = N * new_attack;
    //系数只取到后两位

    //灵根加成
    if (player.灵根.type == "真灵根") {
        x = x * 1 + 0.5;
    }
    else if (player.灵根.type == "天灵根") {
        x = x * 1 + 0.75;
    }
    else {
        x = x * 1 + 1;
    }

    x = x.toFixed(2);

    return x;
}

//读取存档信息，返回成一个JavaScript对象
export async function Read_player(usr_qq) {
    let dir = path.join(`${__PATH.player_path}/${usr_qq}.json`);
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
    let dir = path.join(__PATH.player_path, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(player, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}


//读取装备信息，返回成一个JavaScript对象
export async function Read_equipment(usr_qq) {
    let dir = path.join(`${__PATH.equipment_path}/${usr_qq}.json`);
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


//写入装备信息,第二个参数是一个JavaScript对象
export async function Write_equipment(usr_qq, equipment) {
    //每次写入都要更新新的攻防生
    //
    let equ_atk = equipment.武器.atk + equipment.护具.atk + equipment.法宝.atk;
    let equ_def = equipment.武器.def + equipment.护具.def + equipment.法宝.def;
    let equ_HP = equipment.武器.HP + equipment.护具.HP + equipment.法宝.HP;
    let equ_bao = equipment.武器.bao + equipment.护具.bao + equipment.法宝.bao;

    let player = await Read_player(usr_qq);
    if (!isNotNull(player.level_id)) {
        await e.reply("请先#同步信息");
        return;
    }

    let attack = data.level_list.find(item => item.level_id == player.level_id).基础攻击;
    attack = attack + data.levelMax_list.find(item => item.level_id == player.Physique_id).基础攻击;

    let blood = data.level_list.find(item => item.level_id == player.level_id).基础血量;
    blood = blood + data.levelMax_list.find(item => item.level_id == player.Physique_id).基础血量;

    let defense = data.level_list.find(item => item.level_id == player.level_id).基础防御;
    defense = defense + data.levelMax_list.find(item => item.level_id == player.Physique_id).基础防御;

    let strike = data.level_list.find(item => item.level_id == player.level_id).基础暴击;

    player["攻击"] = equ_atk + attack;
    player["防御"] = equ_def + defense;
    player["血量上限"] = equ_HP + blood;
    player["暴击率"] = equ_bao + strike;
    await Write_player(usr_qq, player);
    await Add_HP(usr_qq, 0);
    let dir = path.join(__PATH.equipment_path, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(equipment, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}


//读取纳戒信息，返回成一个JavaScript对象
export async function Read_najie(usr_qq) {
    let dir = path.join(`${__PATH.najie_path}/${usr_qq}.json`);
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


//写入纳戒信息,第二个参数是一个JavaScript对象
export async function Write_najie(usr_qq, najie) {
    let dir = path.join(__PATH.najie_path, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(najie, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}


//修为数量和灵石数量正增加,负减少
//使用时记得加await
export async function Add_灵石(usr_qq, 灵石数量 = 0) {
    let player = await Read_player(usr_qq);
    player.灵石 += Math.trunc(灵石数量);
    await Write_player(usr_qq, player);
    return;
}
export async function Add_修为(usr_qq, 修为数量 = 0) {
    let player = await Read_player(usr_qq);
    player.修为 += Math.trunc(修为数量);
    await Write_player(usr_qq, player);
    return;
}
export async function Add_血气(usr_qq, 血气 = 0) {
    let player = await Read_player(usr_qq);
    player.血气 += Math.trunc(血气);
    await Write_player(usr_qq, player);
    return;
}
export async function Add_HP(usr_qq, blood = 0) {
    let player = await Read_player(usr_qq);
    player.当前血量 += Math.trunc(blood);
    if (player.当前血量 > player.血量上限) {
        player.当前血量 = player.血量上限;
    }
    await Write_player(usr_qq, player);
    return;
}
export async function Add_najie_灵石(usr_qq, lingshi) {
    let najie = await Read_najie(usr_qq);
    najie.灵石 += Math.trunc(lingshi);
    await Write_najie(usr_qq, najie);
    return;
}

export async function Add_player_学习功法(usr_qq, gongfa_name) {
    let player = await Read_player(usr_qq);
    player.学习的功法.push(gongfa_name);
    data.setData("player", usr_qq, player);
    await player_efficiency(usr_qq);
    return;
}
//---------------------------------------------分界线------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//修炼效率综合
export async function player_efficiency(usr_qq) {
    //这里有问题
    let player = await data.getData("player", usr_qq);//修仙个人信息
    let ass;
    let Assoc_efficiency;        //宗门效率加成
    let linggen_efficiency;      //灵根效率加成
    let gongfa_efficiency = 0;  //功法效率加成

    if (!isNotNull(player.宗门)) {//是否存在宗门信息
        Assoc_efficiency = 0;  //不存在，宗门效率为0
    } else {
        ass = await data.getAssociation(player.宗门.宗门名称);//修仙对应宗门信息
        Assoc_efficiency = ass.宗门等级 * 0.05;
    }
    if (!isNotNull(player.灵根)) {//是否存在灵根，判断老存档
        player.灵根 = await get_random_talent();//不存在灵根，获取灵根
    }
    linggen_efficiency = player.灵根.eff;//灵根修炼速率
    if (!isNotNull(player.学习的功法)) {//是否存在功法
        gongfa_efficiency = 0;    //不存在功法，功法效率为0
    }
    else {
        for (var i = 0; i < player.学习的功法.length; i++) { //存在功法，遍历功法加成
            let gongfa_name = player.学习的功法[i];
            //这里是查看了功法表
            let ifexist2;
            try {
                ifexist2 = data.gongfa_list.find(item => item.name == gongfa_name);
                if (ifexist2 == undefined) {
                    ifexist2 = data.timegongfa_list.find(item => item.name == gongfa_name);
                }
            }
            catch {
                ifexist2 = data.timegongfa_list.find(item => item.name == gongfa_name);
            }
            //如果表里不存在这个功法了
            if (!ifexist2) {
                //找到这个功法的位置
                let ceshi = player.学习的功法.indexOf(gongfa_name);
                //删除这个位置
                if (ceshi > -1) {
                    player.学习的功法.splice(ceshi, 1);
                }
                //删除完成后删除
                break;
            }
            //如果存在就是合理了
            gongfa_efficiency += ifexist2.修炼加成;
        }
    }
    if (parseInt(player.修炼效率提升) != parseInt(player.修炼效率提升)) {
        player.修炼效率提升 = 0;
    }
    player.修炼效率提升 = linggen_efficiency + Assoc_efficiency + gongfa_efficiency;//修炼效率综合
    await data.setData("player", usr_qq, player);
    return;
}

//检查纳戒内物品是否存在
//判断物品
//要用await
export async function exist_najie_thing(usr_qq, thing_name, thing_class) {
    let najie = await Read_najie(usr_qq);

    if (!isNotNull(najie.草药)) {
        najie.草药 = [];
    }
    await Write_najie(usr_qq, najie);
    let ifexist;
    if (thing_class == "装备") {
        ifexist = najie.装备.find(item => item.name == thing_name);
    }
    if (thing_class == "丹药") {
        ifexist = najie.丹药.find(item => item.name == thing_name);
    }
    if (thing_class == "道具") {
        ifexist = najie.道具.find(item => item.name == thing_name);
    }
    if (thing_class == "功法") {
        ifexist = najie.功法.find(item => item.name == thing_name);
    }
    if (thing_class == "草药") {
        ifexist = najie.草药.find(item => item.name == thing_name);
    }
    if (ifexist) {
        return ifexist.数量;
    }
    return false;
}


/**
 * 增加减少纳戒内物品
 * @param usr_qq 操作存档的qq号
 * @param thing_name  物品名称 
 * @param thing_class  物品类别
 * @param n  操作的数量,取+增加,取 -减少
 * @returns 无
 */

export async function Add_najie_thing(usr_qq, thing_name, thing_class, n) {
    if (n === 0) {
        n = 1
    };//调整为1
    if (n == 0) {
        n = 1
    };//调整为1
    var x = n;
    let najie = await Read_najie(usr_qq);
    var name = thing_name;
    if (!isNotNull(najie.草药)) {//判断老存档有没有草药字段
        najie.草药 = [];
    }
    //写入
    await Write_najie(usr_qq, najie);
    let exist = await exist_najie_thing(usr_qq, name, thing_class);
    //这部分写得很冗余,但能跑
    if (thing_class == "装备") {
        //失败
        if (x > 0 && !exist) {//无中生有
            let equipment = data.equipment_list.find(item => item.name == name);
            if (equipment == undefined) {
                equipment = data.timeequipmen_list.find(item => item.name == name);
                najie.装备.push(equipment);
            } else {
                najie.装备.push(equipment);
            }
            najie.装备.find(item => item.name == name).数量 = x;
            await Write_najie(usr_qq, najie);
            return;
        }
        //记录数量
        najie.装备.find(item => item.name == name).数量 += x;
        //
        if (najie.装备.find(item => item.name == name).数量 < 1) {
            //假如用完了,需要删掉数组中的元素,用.filter()把!=该元素的过滤出来
            najie.装备 = najie.装备.filter(item => item.name != name);
        }
        await Write_najie(usr_qq, najie);
        return;
    }
    if (thing_class == "丹药") {
        if (x > 0 && !exist) {//无中生有
            let daoyao = data.danyao_list.find(item => item.name == name);
            if (daoyao == undefined) {
                daoyao = data.timedanyao_list.find(item => item.name == name);
                najie.丹药.push(daoyao);
            } else {
                najie.丹药.push(daoyao);
            }
            najie.丹药.find(item => item.name == name).数量 = x;
            await Write_najie(usr_qq, najie);
            return;
        }
        najie.丹药.find(item => item.name == name).数量 += x;
        if (najie.丹药.find(item => item.name == name).数量 < 1) {
            najie.丹药 = najie.丹药.filter(item => item.name != name);
        }
        await Write_najie(usr_qq, najie);
        return;
    }
    if (thing_class == "道具") {
        if (x > 0 && !exist) {
            //无中生有
            let daoju = data.daoju_list.find(item => item.name == name)
            najie.道具.push(daoju);
            najie.道具.find(item => item.name == name).数量 = x;
            await Write_najie(usr_qq, najie);
            return;
        }
        najie.道具.find(item => item.name == name).数量 += x;
        if (najie.道具.find(item => item.name == name).数量 < 1) {
            //假如用完了,需要删掉数组中的元素,用.filter()把!=该元素的过滤出来
            najie.道具 = najie.道具.filter(item => item.name != name);
        }
        await Write_najie(usr_qq, najie);
        return;
    }
    if (thing_class == "功法") {
        if (x > 0 && !exist) {//无中生有
            let gonfa = data.gongfa_list.find(item => item.name == name);
            if (gonfa == undefined) {
                gonfa = data.timegongfa_list.find(item => item.name == name);
                najie.功法.push(gonfa);
            } else {
                najie.功法.push(gonfa);
            }
            najie.功法.find(item => item.name == name).数量 = x;
            await Write_najie(usr_qq, najie);
            return;
        }
        najie.功法.find(item => item.name == name).数量 += x;
        if (najie.功法.find(item => item.name == name).数量 < 1) {
            //假如用完了,需要删掉数组中的元素,用.filter()把!=该元素的过滤出来
            najie.功法 = najie.功法.filter(item => item.name != name);
        }
        await Write_najie(usr_qq, najie);
        return;
    }
    if (thing_class == "草药") {
        if (x > 0 && !exist) {//无中生有
            najie.草药.push(data.caoyao_list.find(item => item.name == name));
            najie.草药.find(item => item.name == name).数量 = x;
            await Write_najie(usr_qq, najie);
            return;
        }
        najie.草药.find(item => item.name == name).数量 += x;
        if (najie.草药.find(item => item.name == name).数量 < 1) {
            //假如用完了,需要删掉数组中的元素,用.filter()把!=该元素的过滤出来
            najie.草药 = najie.草药.filter(item => item.name != thing_name);
        }
        await Write_najie(usr_qq, najie);
        return;
    }
    return;
}


//替换装备
export async function instead_equipment(usr_qq, thing_name) {
    //装备name
    await Add_najie_thing(usr_qq, thing_name, "装备", -1);
    //下面出错，找到了
    let thing_type;
    let equipment;
    try {
        //根据名字找类型
        thing_type = data.equipment_list.find(item => item.name == thing_name).type;
        //读装备
        equipment = await Read_equipment(usr_qq);
        if (thing_type == "武器") {
            //把读取装备，把武器放回戒指
            await Add_najie_thing(usr_qq, equipment.武器.name, "装备", 1);
            //根据名字找武器
            equipment.武器 = data.equipment_list.find(item => item.name == thing_name);
            //武器写入装备
            await Write_equipment(usr_qq, equipment);
            return;
        }
        if (thing_type == "护具") {
            await Add_najie_thing(usr_qq, equipment.护具.name, "装备", 1);
            equipment.护具 = data.equipment_list.find(item => item.name == thing_name);
            await Write_equipment(usr_qq, equipment);
            return;
        }
        if (thing_type == "法宝") {
            await Add_najie_thing(usr_qq, equipment.法宝.name, "装备", 1);
            equipment.法宝 = data.equipment_list.find(item => item.name == thing_name);
            await Write_equipment(usr_qq, equipment);
            return;
        }
    }
    catch {
        thing_type = data.timeequipmen_list.find(item => item.name == thing_name).type;
        equipment = await Read_equipment(usr_qq);
        if (thing_type == "武器") {
            //把武器放回戒指
            await Add_najie_thing(usr_qq, equipment.武器.name, "装备", 1);
            //根据名字找武器，
            equipment.武器 = data.timeequipmen_list.find(item => item.name == thing_name);
            //把武器装备起来
            await Write_equipment(usr_qq, equipment);
            return;
        }
        if (thing_type == "护具") {
            await Add_najie_thing(usr_qq, equipment.护具.name, "装备", 1);
            equipment.护具 = data.timeequipmen_list.find(item => item.name == thing_name);
            await Write_equipment(usr_qq, equipment);
            return;
        }
        if (thing_type == "法宝") {
            await Add_najie_thing(usr_qq, equipment.法宝.name, "装备", 1);
            equipment.法宝 = data.timeequipmen_list.find(item => item.name == thing_name);
            await Write_equipment(usr_qq, equipment);
            return;
        }
    }
    return;
}
export async function Getmsg_battle(A_player, B_player) {
    let now_A_HP = A_player.当前血量;//保留初始血量方便计算最后扣多少血,避免反复读写文件
    let now_B_HP = B_player.当前血量;
    let A_xue = 0;//最后要扣多少血
    let B_xue = 0;
    let cnt = 0;//回合数
    let msg = [];
    while (A_player.当前血量 > 0 && B_player.当前血量 > 0) {
        if (cnt % 2 == 0) {
            let baoji = baojishanghai(A_player.暴击率);
            let 伤害 = Harm(A_player.攻击, B_player.防御);
            let 法球伤害 = Math.trunc(A_player.攻击 * A_player.法球倍率);
            伤害 = Math.trunc(baoji * 伤害 + 法球伤害);
            B_player.当前血量 -= 伤害;
            if (B_player.当前血量 < 0) { B_player.当前血量 = 0 }
            msg.push(`第${Math.trunc(cnt / 2) + 1}回合:
${A_player.名号}攻击了${B_player.名号}，${ifbaoji(baoji)}造成伤害${伤害}，${B_player.名号}剩余血量${B_player.当前血量}`);
        }
        if (cnt % 2 == 1) {
            let baoji = baojishanghai(B_player.暴击率);
            let 伤害 = Harm(B_player.攻击, A_player.防御);
            let 法球伤害 = Math.trunc(B_player.攻击 * B_player.法球倍率);
            伤害 = Math.trunc(baoji * 伤害 + 法球伤害);
            A_player.当前血量 -= 伤害;
            if (A_player.当前血量 < 0) { A_player.当前血量 = 0 }
            msg.push(`第${Math.trunc(cnt / 2) + 1}回合:
${B_player.名号}攻击了${A_player.名号}，${ifbaoji(baoji)}造成伤害${伤害}，${A_player.名号}剩余血量${A_player.当前血量}`);
        }
        cnt++;
    }
    if (A_player.当前血量 <= 0) {
        msg.push(`${B_player.名号}击败了${A_player.名号}`);
        B_xue = B_player.当前血量 - now_B_HP;
        A_xue = -now_A_HP;
    }
    if (B_player.当前血量 <= 0) {
        msg.push(`${A_player.名号}击败了${B_player.名号}`);
        B_xue = -now_B_HP;
        A_xue = A_player.当前血量 - now_A_HP;
    }
    let Data_nattle = {
        "msg": msg,
        "A_xue": A_xue,
        "B_xue": B_xue
    }
    return Data_nattle;
}

//通过输入暴击率,返回暴击伤害,不暴击返回1
export function baojishanghai(baojilv) {
    if (baojilv > 1) { baojilv = 1; }//暴击率最高为100%,即1
    let rand = Math.random();
    let bl = 1;
    if (rand < baojilv) {
        bl = baojilv + 2;//这个是暴击伤害倍率//满暴击时暴伤为300%
    }
    return bl;
}

//通过暴击伤害返回输出用的文本
export function ifbaoji(baoji) {
    if (baoji == 1) { return ""; }
    else { return '触发暴击，'; }
}


//攻击攻击防御计算伤害
export function Harm(atk, def) {
    let x;
    let s = atk / def;
    let rand = Math.trunc(Math.random() * 11) / 100 + 0.95;//保留±5%的伤害波动
    if (s < 1) {
        x = 0.1;
    }
    else if (s > 2.5) {
        x = 1;
    }
    else {
        x = 0.6 * s - 0.5;
    }
    x = Math.trunc(x * atk * rand);
    return x;
}


//发送转发消息
//输入data一个数组,元素是字符串,每一个元素都是一条消息.
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

//对象数组排序
export function sortBy(field) {//从大到小,b和a反一下就是从小到大
    return function (b, a) {
        return a[field] - b[field];
    }
}


//获取总修为
export async function Get_xiuwei(usr_qq) {
    let player = await Read_player(usr_qq);
    let sum_exp = 0;
    let now_level_id;
    if (!isNotNull(player.level_id)) {
        return;
    }
    now_level_id = data.level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id < 46) {
        for (var i = 1; i < now_level_id; i++) {
            sum_exp = sum_exp + data.level_list.find(temp => temp.level_id == i).exp;
        }
    }
    else { sum_exp = -999999999; }//说明玩家境界有错误
    sum_exp += player.修为;
    return sum_exp;
}



//获取随机灵根
export async function get_random_talent() {
    let talent;
    if (get_random_res(伪灵根概率)) {
        talent = data.talent_list.filter(item => item.type == "伪灵根");
    }
    else if (get_random_res(真灵根概率 / (1 - 伪灵根概率))) {
        talent = data.talent_list.filter(item => item.type == "真灵根");
    }
    else if (get_random_res(天灵根概率 / (1 - 真灵根概率 - 伪灵根概率))) {
        talent = data.talent_list.filter(item => item.type == "天灵根");
    }
    else {
        talent = data.talent_list.filter(item => item.type == "变异灵根");
    }
    let newtalent = get_random_fromARR(talent)
    return newtalent;
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
    //let L = ARR.length;
    let randindex = Math.trunc(Math.random() * ARR.length);
    return ARR[randindex];
}
//sleep
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
    return dateobj

}
//获取上次签到时间
export async function getLastsign(usr_qq) {
    //查询redis中的人物动作
    let time = await redis.get("xiuxian:player:" + usr_qq + ":lastsign_time");
    if (time != null) {
        let data = await shijianc(parseInt(time))
        return data;
    }
    return false;
}
//获取当前人物状态
export async function getPlayerAction(usr_qq) {
    //查询redis中的人物动作
    let arr = {};
    let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
    action = JSON.parse(action);
    //动作不为空闲
    if (action != null) {
        //人物有动作查询动作结束时间
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = parseInt((action_end_time - now_time) / 1000 / 60);
            let s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
            arr.action = action.action;//当期那动作
            arr.time = m + "分" + s + "秒";//剩余时间
            return arr;
        }
    }
    arr.action = "空闲";
    return arr;
}

//锁定
export async function dataverification(e) {
    if (!e.isGroup) {
        //禁私聊
        return 1;
    }
    let usr_qq = e.user_id;
    if (usr_qq == 80000000) {
        //非匿名
        return 1;
    }
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        //无存档
        return 1;//假
    }
    //真
    return 0;
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