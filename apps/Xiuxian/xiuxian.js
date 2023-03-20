import plugin from '../../../../lib/plugins/plugin.js'
import fs from "fs"
import path from "path"
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import { Writeit, Read_it } from "../duanzao/duanzaofu.js";
import { fixed } from "../User/BackUptask.js";
import { AppName } from '../../app.config.js'
/**
 * 全局
 */
//插件根目录
const __dirname = path.resolve() + path.sep + "plugins" + path.sep + AppName;
// 文件存放路径
export const __PATH = {
    //更新日志
    updata_log_path: path.join(__dirname, "vertion.txt"),
    //用户数据
    player_path: path.join(__dirname, "/resources/data/xiuxian_player"),
    //装备
    equipment_path: path.join(__dirname, "/resources/data/xiuxian_equipment"),
    //纳戒
    najie_path: path.join(__dirname, "/resources/data/xiuxian_najie"),
    //丹药
    danyao_path: path.join(__dirname, "/resources/data/xiuxian_danyao"),
    //源数据
    lib_path: path.join(__dirname, "/resources/data/item"),
    Timelimit: path.join(__dirname, "/resources/data/Timelimit"),
    Exchange: path.join(__dirname, "/resources/data/Exchange"),
    shop: path.join(__dirname, "/resources/data/shop"),
    log_path: path.join(__dirname, "/resources/data/suduku"),
    association: path.join(__dirname, "/resources/data/association"),
    tiandibang: path.join(__dirname, "/resources/data/tiandibang"),
    qinmidu: path.join(__dirname, "/resources/data/qinmidu"),
    backup: path.join(__dirname, "/resources/backup"),
    player_pifu_path: path.join(__dirname, "/resources/img/player_pifu"),
    shitu: path.join(__dirname, "/resources/data/shitu"),
    equipment_pifu_path: path.join(__dirname, "/resources/img/equipment_pifu"),
    duanlu: path.join(__dirname, "/resources/data/duanlu"),
    temp_path: path.join(__dirname, "/resources/data/temp"),
    custom: path.join(__dirname, "/resources/data/custom"),
    auto_backup: path.join(__dirname, "/resources/data/auto_backup"),
}
let xiuxianSetFile = "./plugins/" + AppName + "/config/xiuxian/xiuxian.yaml";
if (!fs.existsSync(xiuxianSetFile)) {
    fs.copyFileSync("./plugins/" + AppName + "/defSet/xiuxian/xiuxian.yaml", xiuxianSetFile);
}

//处理消息
export class xiuxian extends plugin {
    constructor() {
        super({
            name: 'xiuxian',
            dsc: '修仙模块',
            event: 'message',
            priority: 800,
            rule: []
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }
}

const 体质概率 = 0.2;
const 伪灵根概率 = 0.37;
const 真灵根概率 = 0.29;
const 天灵根概率 = 0.08;
const 圣体概率 = 0.01;
const 变异灵根概率 = 1 - 体质概率 - 伪灵根概率 - 真灵根概率 - 天灵根概率 - 圣体概率;

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
 * 

/**
 * 
 * @param {*} amount 输入数量
 * @returns 返回正整数
 */
export async function convert2integer(amount) {
    let number = 1;
    let reg = new RegExp(/^[1-9]\d*$/);
    if (!reg.test(amount)) {
        return number;
    }
    else {
        return parseInt(amount);;
    }
}

export async function Read_updata_log() {
    let dir = path.join(`${__PATH.updata_log_path}`);
    let update_log = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    return update_log;
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
    let player = await Read_player(usr_qq);
    player.攻击 = data.Level_list.find(item => item.level_id == player.level_id).基础攻击 + player.攻击加成 + data.LevelMax_list.find(item => item.level_id == player.Physique_id).基础攻击;
    player.防御 = data.Level_list.find(item => item.level_id == player.level_id).基础防御 + player.防御加成 + data.LevelMax_list.find(item => item.level_id == player.Physique_id).基础防御;
    player.血量上限 = data.Level_list.find(item => item.level_id == player.level_id).基础血量 + player.生命加成 + data.LevelMax_list.find(item => item.level_id == player.Physique_id).基础血量;
    player.暴击率 = data.Level_list.find(item => item.level_id == player.level_id).基础暴击 + data.LevelMax_list.find(item => item.level_id == player.Physique_id).基础暴击;
    let type = ["武器", "护具", "法宝"];
    for (let i of type) {
        if (equipment[i].atk > 10 || equipment[i].def > 10 || equipment[i].HP > 10) {
            player.攻击 += equipment[i].atk;
            player.防御 += equipment[i].def;
            player.血量上限 += equipment[i].HP;
        }
        else {
            player.攻击 = Math.trunc(player.攻击 * (1 + equipment[i].atk));
            player.防御 = Math.trunc(player.防御 * (1 + equipment[i].def));
            player.血量上限 = Math.trunc(player.血量上限 * (1 + equipment[i].HP));
        }
        player.暴击率 += equipment[i].bao;
    }
    player.暴击伤害 = player.暴击率 + 1.5;
    if (player.暴击伤害 > 2.5)
        player.暴击伤害 = 2.5;
    if (player.仙宠.type == "暴伤")
        player.暴击伤害 += player.仙宠.加成;
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
    try {
        najie = JSON.parse(najie);
    }
    catch//转换不了，纳戒错误
    {
        await fixed(usr_qq);
        najie = await Read_najie(usr_qq);
    }
    return najie;
}
//改变数据格式
export async function datachange(data) {
    if (data / 1000000000000 > 1) {
        return Math.floor((data * 100) / 1000000000000) / 100 + '万亿';
    } else if (data / 100000000 > 1) {
        return Math.floor((data * 100) / 100000000) / 100 + '亿';
    } else if (data / 10000 > 1) {
        return Math.floor((data * 100) / 10000) / 100 + '万';
    } else {
        return data;
    }
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
export async function Add_魔道值(usr_qq, 魔道值 = 0) {
    let player = await Read_player(usr_qq);
    player.魔道值 += Math.trunc(魔道值);
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
    if (player.当前血量 < 0) {
        player.当前血量 = 0;
    }
    await Write_player(usr_qq, player);
    return;
}
/**
 * 
 * @param {*} usr_qq 用户qq
 * @param {*} exp 经验值
 * @returns 
 */
export async function Add_职业经验(usr_qq, exp = 0) {
    let player = await Read_player(usr_qq);
    if (exp == 0) {
        return;
    }
    exp = player.occupation_exp + exp;
    let level = player.occupation_level;
    while (true) {
        let need_exp = data.occupation_exp_list.find(item => item.id == level).experience;
        if (need_exp > exp) {
            break;
        } else {
            exp -= need_exp;
            level++;
        }
    }
    player.occupation_exp = exp;
    player.occupation_level = level;
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

export async function Reduse_player_学习功法(usr_qq, gongfa_name) {
    let player = await Read_player(usr_qq);
    Array.prototype.remove = function (v) {
        for (let i = 0, j = 0; i < this.length; i++) {
            if (this[i] != v) {
                this[j++] = this[i];
            }
        }
        this.length -= 1;
    }
    player.学习的功法.remove(gongfa_name);
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
    let xianchong_efficiency = 0; // 仙宠效率加成
    if (!isNotNull(player.宗门)) {//是否存在宗门信息
        Assoc_efficiency = 0;  //不存在，宗门效率为0
    } else {
        ass = await data.getAssociation(player.宗门.宗门名称);//修仙对应宗门信息
        if (ass.宗门驻地 == 0) {
            Assoc_efficiency = ass.宗门等级 * 0.05
        } else {
            let dongTan = await data.bless_list.find(item => item.name == ass.宗门驻地);
            try {
                Assoc_efficiency = ass.宗门等级 * 0.05 + dongTan.efficiency;
            }
            catch
            {
                Assoc_efficiency = ass.宗门等级 * 0.05 + 0.5;
            }
        }
    }
    linggen_efficiency = player.灵根.eff;//灵根修炼速率
    label1: for (let i in player.学习的功法) { //存在功法，遍历功法加成
        let gongfa = ["gongfa_list", "timegongfa_list"];
        //这里是查看了功法表
        for (let j of gongfa) {
            let ifexist = data[j].find(item => item.name == player.学习的功法[i]);
            if (ifexist) {
                gongfa_efficiency += ifexist.修炼加成;
                continue label1;
            }
        }
        player.学习的功法.splice(i, 1);
    }
    if (player.仙宠.type == '修炼') { // 是否存在修炼仙宠
        xianchong_efficiency = player.仙宠.加成; // 存在修炼仙宠，仙宠效率为仙宠效率加成
    }
    let dy = await Read_danyao(usr_qq);
    let bgdan = dy.biguanxl;
    if (parseInt(player.修炼效率提升) != parseInt(player.修炼效率提升)) {
        player.修炼效率提升 = 0;
    }

    player.修炼效率提升 = linggen_efficiency + Assoc_efficiency + gongfa_efficiency + xianchong_efficiency + bgdan;//修炼效率综合
    data.setData("player", usr_qq, player);
    return;
}
/**
 * 
 * @param {*} usr_qq 玩家qq
 * @param {*} thing_name 物品名
 * @param {*} thing_class 物品类别
 * @param {*} thing_pinji 可选参数，装备品阶，数字0-6等
 * @returns 物品数量或者false
 */

//修改纳戒物品锁定状态
export async function re_najie_thing(usr_qq, thing_name, thing_class, thing_pinji, lock) {
    let najie = await Read_najie(usr_qq);
    if (thing_class == "装备" && (thing_pinji || thing_pinji == 0)) {
        for (let i of najie["装备"]) {
            if (i.name == thing_name && i.pinji == thing_pinji)
                i.islockd = lock;
        }
    }
    else {
        for (let i of najie[thing_class]) {
            if (i.name == thing_name)
                i.islockd = lock;
        }
    }
    await Write_najie(usr_qq, najie);
    return true;
}

//检查纳戒内物品是否存在
//判断物品
//要用await
export async function exist_najie_thing(usr_qq, thing_name, thing_class, thing_pinji) {
    let najie = await Read_najie(usr_qq);
    let ifexist;
    if (thing_class == "装备" && (thing_pinji || thing_pinji == 0)) {
        ifexist = najie.装备.find(item => item.name == thing_name && item.pinji == thing_pinji);
    }
    else {
        let type = ["装备", "丹药", "道具", "功法", "草药", "材料", "仙宠", "仙宠口粮"];
        for (let i of type) {
            ifexist = najie[i].find(item => item.name == thing_name);
            if (ifexist)
                break;
        }
    }
    if (ifexist) {
        return ifexist.数量;
    }
    return false;
}
/**
 * 
 * @param {*} usr_qq 用户qq
 * @param {*} thing_name 物品名
 * @param {*} thing_class 物品类别
 * @param {*} thing_pinji 品级 数字0-6
 * @returns 
 */

/**
 * 增加减少纳戒内物品
 * @param usr_qq 操作存档的qq号
 * @param name  物品名称
 * @param thing_class  物品类别
 * @param x  操作的数量,取+增加,取 -减少
 * @param pinji 品级 数字0-6
 * @returns 无
 */
export async function Add_najie_thing(usr_qq, name, thing_class, x, pinji) {
    if (x == 0)
        return;
    let najie = await Read_najie(usr_qq);
    //写入
    //这部分写得很冗余,但能跑
    if (thing_class == "装备") {
        if (!pinji && pinji != 0) {
            pinji = Math.trunc(Math.random() * 6);
        }
        let z = [0.8, 1, 1.1, 1.2, 1.3, 1.5, 2];
        if (x > 0) {
            if ((typeof name) != "object") {
                let list = ["equipment_list", "timeequipmen_list", "duanzhaowuqi", "duanzhaohuju", "duanzhaobaowu"];
                for (let i of list) {
                    let thing = data[i].find(item => item.name == name);
                    if (thing) {
                        let equ = JSON.parse(JSON.stringify(thing));
                        equ.pinji = pinji
                        equ.atk *= z[pinji];
                        equ.def *= z[pinji];
                        equ.HP *= z[pinji];
                        equ.数量 = x;
                        equ.islockd = 0;
                        najie[thing_class].push(equ);
                        await Write_najie(usr_qq, najie);
                        return;
                    }
                }
            }
            else {
                if (!name.pinji)
                    name.pinji = pinji;
                name.数量 = x;
                name.islockd = 0;
                najie[thing_class].push(name);
                await Write_najie(usr_qq, najie);
                return;
            }
        }
        if ((typeof name) != "object") {
            najie[thing_class].find(item => item.name == name && item.pinji == pinji).数量 += x;
        }
        else {
            najie[thing_class].find(item => item.name == name.name && item.pinji == pinji).数量 += x;
        }
        najie.装备 = najie.装备.filter(item => item.数量 > 0);
        await Write_najie(usr_qq, najie);
        return;
    }
    else if (thing_class == "仙宠") {
        if (x > 0) {
            if ((typeof name) != "object") {
                let thing = data.xianchon.find(item => item.name == name);
                if (thing) {
                    thing = JSON.parse(JSON.stringify(thing));
                    thing.数量 = x;
                    thing.islockd = 0;
                    najie[thing_class].push(thing);
                    await Write_najie(usr_qq, najie);
                    return;
                }
            }
            else {
                name.数量 = x;
                name.islockd = 0;
                najie[thing_class].push(name);
                await Write_najie(usr_qq, najie);
                return;
            }
        }
        if ((typeof name) != "object") {
            najie[thing_class].find(item => item.name == name).数量 += x;
        }
        else {
            najie[thing_class].find(item => item.name == name.name).数量 += x;
        }
        najie.仙宠 = najie.仙宠.filter(item => item.数量 > 0);
        await Write_najie(usr_qq, najie);
        return;
    }
    let exist = await exist_najie_thing(usr_qq, name, thing_class);
    if (x > 0 && !exist) {
        let thing;
        let list = ["danyao_list", "newdanyao_list", "timedanyao_list", "daoju_list", "gongfa_list", "timegongfa_list",
            "caoyao_list", "xianchonkouliang", "duanzhaocailiao"];
        for (let i of list) {
            thing = data[i].find(item => item.name == name);
            if (thing) {
                najie[thing_class].push(thing);
                najie[thing_class].find(item => item.name == name).数量 = x;
                najie[thing_class].find(item => item.name == name).islockd = 0;
                await Write_najie(usr_qq, najie);
                return;
            }
        }
    }
    najie[thing_class].find(item => item.name == name).数量 += x;
    najie[thing_class] = najie[thing_class].filter(item => item.数量 > 0);
    await Write_najie(usr_qq, najie);
    return;
}

//替换装备
export async function instead_equipment(usr_qq, equipment_data) {
    //装备name
    await Add_najie_thing(usr_qq, equipment_data, "装备", -1, equipment_data.pinji);
    let equipment = await Read_equipment(usr_qq);
    if (equipment_data.type == "武器") {
        //把读取装备，把武器放回戒指
        await Add_najie_thing(usr_qq, equipment.武器, "装备", 1, equipment.武器.pinji);
        //根据名字找武器
        equipment.武器 = equipment_data;
        //武器写入装备
        await Write_equipment(usr_qq, equipment);
        return;
    }
    if (equipment_data.type == "护具") {
        await Add_najie_thing(usr_qq, equipment.护具, "装备", 1, equipment.护具.pinji);
        equipment.护具 = equipment_data;
        await Write_equipment(usr_qq, equipment);
        return;
    }
    if (equipment_data.type == "法宝") {
        await Add_najie_thing(usr_qq, equipment.法宝, "装备", 1, equipment.法宝.pinji);
        equipment.法宝 = equipment_data;
        await Write_equipment(usr_qq, equipment);
        return;
    }
    return;
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
    } else {
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
    now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
    if (now_level_id < 65) {
        for (var i = 1; i < now_level_id; i++) {
            sum_exp = sum_exp + data.Level_list.find(temp => temp.level_id == i).exp;
        }
    } else {
        sum_exp = -999999999;
    }//说明玩家境界有错误
    sum_exp += player.修为;
    return sum_exp;
}

//获取随机灵根
export async function get_random_talent() {
    let talent;
    if (get_random_res(体质概率)) {
        talent = data.talent_list.filter(item => item.type == "体质");
    } else if (get_random_res(伪灵根概率 / (1 - 体质概率))) {
        talent = data.talent_list.filter(item => item.type == "伪灵根");
    } else if (get_random_res(真灵根概率 / (1 - 伪灵根概率 - 体质概率))) {
        talent = data.talent_list.filter(item => item.type == "真灵根");
    } else if (get_random_res(天灵根概率 / (1 - 真灵根概率 - 伪灵根概率 - 体质概率))) {
        talent = data.talent_list.filter(item => item.type == "天灵根");
    } else if (get_random_res(圣体概率 / (1 - 真灵根概率 - 伪灵根概率 - 体质概率 - 天灵根概率))) {
        talent = data.talent_list.filter(item => item.type == "圣体");
    } else {
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
    if (P > 1) {
        P = 1;
    }
    if (P < 0) {
        P = 0;
    }
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
 * @returns 
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

export async function Read_qinmidu() {
    let dir = path.join(`${__PATH.qinmidu}/qinmidu.json`);
    let qinmidu = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    //将字符串数据转变成数组格式
    qinmidu = JSON.parse(qinmidu);
    return qinmidu;
}

export async function Write_qinmidu(qinmidu) {
    let dir = path.join(__PATH.qinmidu, `qinmidu.json`);
    let new_ARR = JSON.stringify(qinmidu, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}
export async function fstadd_qinmidu(A, B) {
    let qinmidu;
    try {
        qinmidu = await Read_qinmidu();
        ;
    } catch {
        //没有表要先建立一个！
        await Write_qinmidu([]);
        qinmidu = await Read_qinmidu();
    }
    let player = {
        QQ_A: A,
        QQ_B: B,
        亲密度: 0,
        婚姻: 0
    }
    qinmidu.push(player);
    await Write_qinmidu(qinmidu);
    return;
}

export async function add_qinmidu(A, B, qinmi) {
    let qinmidu;
    try {
        qinmidu = await Read_qinmidu();
        ;
    } catch {
        //没有表要先建立一个！
        await Write_qinmidu([]);
        qinmidu = await Read_qinmidu();
    }
    let i;
    for (i = 0; i < qinmidu.length; i++) {
        if ((qinmidu[i].QQ_A == A && qinmidu[i].QQ_B == B) || (qinmidu[i].QQ_A == B && qinmidu[i].QQ_B == A)) {
            break;
        }
    }
    if (i == qinmidu.length) {
        await fstadd_qinmidu(A, B);
        qinmidu = await Read_qinmidu();
    }
    qinmidu[i].亲密度 += qinmi;
    await Write_qinmidu(qinmidu);
    return;
}

export async function find_qinmidu(A, B) {
    let qinmidu;
    try {
        qinmidu = await Read_qinmidu();
    } catch {
        //没有建立一个
        await Write_qinmidu([])
        qinmidu = await Read_qinmidu();
    }
    let i;
    let QQ = [];
    for (i = 0; i < qinmidu.length; i++) {
        if (qinmidu[i].QQ_A == A || qinmidu[i].QQ_A == B) {
            if (qinmidu[i].婚姻 != 0) {
                QQ.push = qinmidu[i].QQ_B;
                break;
            }
        } else if (qinmidu[i].QQ_B == A || qinmidu[i].QQ_B == B) {
            if (qinmidu[i].婚姻 != 0) {
                QQ.push = qinmidu[i].QQ_A;
                break;
            }
        }
    }
    for (i = 0; i < qinmidu.length; i++) {
        if ((qinmidu[i].QQ_A == A && qinmidu[i].QQ_B == B) || (qinmidu[i].QQ_A == B && qinmidu[i].QQ_B == A)) {
            break;
        }
    }
    if (i == qinmidu.length) {
        return false;
    } else if (QQ.length != 0) {
        return 0;
    } else {
        return qinmidu[i].亲密度;
    }
}
//查询A的婚姻，如果有婚姻则返回对方qq，若无则返回false
export async function exist_hunyin(A) {
    let qinmidu;
    try {
        qinmidu = await Read_qinmidu();
    } catch {
        //没有建立一个
        await Write_qinmidu([])
        qinmidu = await Read_qinmidu();
    }
    let i = 0;
    let flag = 0;
    for (i = 0; i < qinmidu.length; i++) {
        if (qinmidu[i].QQ_A == A) {
            //已婚则将A/B的另一半存到QQ数组中
            if (qinmidu[i].婚姻 != 0) {
                flag = qinmidu[i].QQ_B;
                break;
            }
        } else if (qinmidu[i].QQ_B == A) {
            if (qinmidu[i].婚姻 != 0) {
                flag = qinmidu[i].QQ_A;
                break;
            }
        }
    }
    //A存在已婚则返回对方qq
    if (flag != 0) {
        //console.log(flag);
        return flag;
    } else {
        return false;
    }
}

export async function Write_shitu(shitu) {
    let dir = path.join(__PATH.shitu, `shitu.json`);
    let new_ARR = JSON.stringify(shitu, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}
export async function Read_shitu() {
    let dir = path.join(`${__PATH.shitu}/shitu.json`);
    let shitu = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    //将字符串数据转变成数组格式
    shitu = JSON.parse(shitu);
    return shitu;
}

export async function fstadd_shitu(A) {
    let shitu;
    try {
        shitu = await Read_shitu();
        ;
    } catch {
        //没有表要先建立一个！
        await Write_shitu([]);
        shitu = await Read_shitu();
    }
    let player = {
        师傅: A,
        收徒: 0,
        未出师徒弟: 0,
        任务阶段: 0,
        renwu1: 0,
        renwu2: 0,
        renwu3: 0,
        师徒BOOS剩余血量: 100000000,
        已出师徒弟: [],

    }
    shitu.push(player);
    await Write_shitu(shitu);
    return;
}

export async function add_shitu(A, num) {
    let shitu;
    try {
        shitu = await Read_shitu();
        ;
    } catch {
        //没有表要先建立一个！
        await Write_shitu([]);
        shitu = await Read_shitu();
    }
    let i;
    for (i = 0; i < shitu.length; i++) {
        if (shitu[i].A == A) {
            break;
        }
    }
    if (i == shitu.length) {
        await fstadd_shitu(A);
        shitu = await Read_shitu();
    }
    shitu[i].收徒 += num;
    await Write_shitu(shitu);
    return;
}

export async function find_shitu(A) {
    let shitu;
    try {
        shitu = await Read_shitu();
    } catch {
        //没有建立一个
        await Write_shitu([])
        shitu = await Read_shitu();
    }
    let i;
    let QQ = [];
    for (i = 0; i < shitu.length; i++) {
        if (shitu[i].师傅 == A) {
            break;

        }
    }
    if (i == shitu.length) {
        return false;
    } else if (QQ.length != 0) {
        return 0;
    } else {
        return shitu[i].师徒;
    }
}

export async function find_tudi(A) {
    let shitu;
    shitu = await Read_shitu();
    let i;
    let QQ = [];
    for (i = 0; i < shitu.length; i++) {
        if (shitu[i].未出师徒弟 == A) {
            break;

        }
    }
    if (i == shitu.length) {
        return false;
    } else if (QQ.length != 0) {
        return 0;
    } else {
        return shitu[i].师徒;
    }
}
export async function Read_danyao(usr_qq) {
    let dir = path.join(`${__PATH.danyao_path}/${usr_qq}.json`);
    let danyao = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    //将字符串数据转变成数组格式
    danyao = JSON.parse(danyao);
    return danyao;
}

export async function Write_danyao(usr_qq, danyao) {
    let dir = path.join(__PATH.danyao_path, `${usr_qq}.json`);
    let new_ARR = JSON.stringify(danyao, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}

export async function Read_temp() {
    let dir = path.join(`${__PATH.temp_path}/temp.json`);
    let temp = fs.readFileSync(dir, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return "error";
        }
        return data;
    })
    //将字符串数据转变成数组格式
    temp = JSON.parse(temp);
    return temp;
}

export async function Write_temp(temp) {
    let dir = path.join(__PATH.temp_path, `temp.json`);
    let new_ARR = JSON.stringify(temp, "", "\t");
    fs.writeFileSync(dir, new_ARR, 'utf8', (err) => {
        console.log('写入成功', err)
    })
    return;
}

/**
 * 
 * @param {*} thing_name 物品名
 * @returns 
 */
//遍历物品
export async function foundthing(thing_name) {
    let thing = ["equipment_list", "danyao_list", "daoju_list", "gongfa_list", "caoyao_list",
        "timegongfa_list", "timeequipmen_list", "timedanyao_list", "newdanyao_list",
        "xianchon", "xianchonkouliang", "duanzhaocailiao"];
    for (var i of thing) {
        for (var j of data[i]) {
            if (j.name == thing_name)
                return j;
        }
    }
    let A;
    try {
        A = await Read_it();
    } catch {
        await Writeit([]);
        A = await Read_it();
    }
    for (var j of A) {
        if (j.name == thing_name)
            return j
    }
    thing_name = thing_name.replace(/[0-9]+/g, "");
    thing = ["duanzhaowuqi", "duanzhaohuju", "duanzhaobaowu", "zalei"];
    for (var i of thing) {
        for (var j of data[i]) {
            if (j.name == thing_name)
                return j;
        }
    }
    return false
}