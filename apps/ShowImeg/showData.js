import plugin from "../../../../lib/plugins/plugin.js"
import Show from "../../model/show.js"
import puppeteer from "../../../../lib/puppeteer/puppeteer.js"
import config from "../../model/Config.js"
import Config from "../../model/Config.js"
import data from '../../model/XiuxianData.js'
import { __PATH, get_random_talent, isNotNull, player_efficiency, Read_equipment, Read_najie, Read_player, Read_qinmidu, Write_qinmidu } from "../../model/xiuxian.js"

/**
 * 生图模块
 *
 */
let xiuxianConfigData = config.getConfig("xiuxian", "xiuxian")
//定义一个版本信息的常量,获取默认文件配置文件信息
const versionData = Config.getdefSet("version", "version");

export class showData extends plugin {
    constructor(e) {
        super({
            name: "showData",
            dsc: "修仙存档展示",
            event: "message",
            priority: 600,
            rule: [
                {
                    reg: "^#我的装备$",
                    fnc: "show_equipment",
                },
                {
                    reg: "^#我的炼体$",
                    fnc: "show_power",
                },
                {
                    reg: "^#练气境界$",
                    fnc: "show_Level",
                },
                {
                    reg: "^#职业等级$",
                    fnc: "show_Levelzhiye",
                },
                {
                    reg: "^#炼体境界$",
                    fnc: "show_LevelMax",
                },
                {
                    reg: "^#我的宗门$",
                    fnc: "show_association",
                },
                {
                    reg: "^#修仙设置$",
                    fnc: "show_adminset",
                }
            ]
        })
        this.path = __PATH.player_path
    }

    //修仙设置
    async show_adminset(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        let img = await get_adminset_img(e);
        e.reply(img);
        return;
    }

    async show_power(e) {
        if (!e.isGroup) {
            return;
        }
        let img = await get_power_img(e);
        e.reply(img);
        return;
    }
    async show_equipment(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let img = await get_equipment_img(e);
        e.reply(img);
        return;
    }

    async show_Levelzhiye(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let img = await get_statezhiye_img(e);
        e.reply(img);
        return;
    }

    async show_Level(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let img = await get_state_img(e);
        e.reply(img);
        return;
    }

    async show_LevelMax(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let img = await get_statemax_img(e);
        e.reply(img);
        return;
    }

    //我的宗门
    async show_association(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let img = await get_association_img(e);
        e.reply(img);
        return;
    }

    //更新记录
    async show_updata(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let img = await get_updata_img(e);
        e.reply(img);
        return;
    }
}

//////////////////////////////////////////////////
/**
 * 返回该玩家的仙宠图片
 * @return image
 */
export async function get_XianChong_img(e) {
    let i;
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) {
        return
    }
    let player = await data.getData('player', usr_qq)
    let najie = await Read_najie(usr_qq);
    let XianChong_have = [];
    let XianChong_need = [];
    let Kouliang = [];
    let XianChong_list = data.xianchon;
    let Kouliang_list = data.xianchonkouliang
    for (i = 0; i < XianChong_list.length; i++) {
        if (najie.仙宠.find(item => item.name == XianChong_list[i].name)) {
            XianChong_have.push(XianChong_list[i]);
        } else if (player.仙宠.name == XianChong_list[i].name) {
            XianChong_have.push(XianChong_list[i]);
        } else {
            XianChong_need.push(XianChong_list[i])
        }
    }
    for (i = 0; i < Kouliang_list.length; i++) {
        Kouliang.push(Kouliang_list[i])
    }
    let player_data = {
        nickname: player.名号,
        XianChong_have,
        XianChong_need,
        Kouliang
    }
    const data1 = await new Show(e).get_xianchong(player_data)
    return await puppeteer.screenshot('xianchong', {
        ...data1
    })
}

/**
 * 返回该玩家的道具图片
 * @return image
 */
export async function get_daoju_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) {
        return
    }
    let player = await data.getData('player', usr_qq)
    let najie = await Read_najie(usr_qq);
    let daoju_have = []
    let daoju_need = []
    for (const i of data.daoju_list) {
        if (najie.道具.find(item => item.name == i.name)) {
            daoju_have.push(i)
        }
        else {
            daoju_need.push(i)
        }
    }
    let player_data = {
        user_id: usr_qq,
        nickname: player.名号,
        daoju_have,
        daoju_need
    }
    const data1 = await new Show(e).get_daojuData(player_data)
    return await puppeteer.screenshot('daoju', {
        ...data1
    })
}


/**
 * 返回该玩家的武器图片
 * @return image
 */
export async function get_wuqi_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) {
        return
    }
    let player = await data.getData('player', usr_qq)
    let najie = await Read_najie(usr_qq);
    let equipment = await Read_equipment(usr_qq);
    let wuqi_have = [];
    let wuqi_need = [];
    const wuqi_list = ["equipment_list", "timeequipmen_list", "duanzhaowuqi", "duanzhaohuju", "duanzhaobaowu"];
    let zb = [];
    for (const i of wuqi_list) {
        for (const j of data[i]) {
            if (najie['装备'].find(item => item.name == j.name) && !wuqi_have.find(item => item.name == j.name)) {
                wuqi_have.push(j);
            } 
            else if ((equipment['武器'].name==j.name || equipment['法宝'].name==j.name || equipment['护具'].name==j.name)&& !wuqi_have.find(item => item.name == j.name))
            {
                wuqi_have.push(j);
            }
            else if (!wuqi_need.find(item => item.name == j.name)) {
                wuqi_need.push(j);
            }
        }
    }

    let player_data = {
        user_id: usr_qq,
        nickname: player.名号,
        wuqi_have,
        wuqi_need,
    }
    const data1 = await new Show(e).get_wuqiData(player_data)
    return await puppeteer.screenshot('wuqi', {
        ...data1
    })
}

/**
 * 返回该玩家的丹药图片
 * @return image
 */
export async function get_danyao_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) {
        return
    }
    const player = await Read_player(usr_qq);
    const najie = await Read_najie(usr_qq);
    let danyao_have = [];
    let danyao_need = [];
    const danyao = ['danyao_list', 'timedanyao_list'];
    for (const i of danyao) {
        for (const j of data[i]) {
            if (najie['丹药'].find(item => item.name == j.name) && !danyao_have.find(item => item.name == j.name)) {
                danyao_have.push(j);
            } else if (!danyao_need.find(item => item.name == j.name)) {
                danyao_need.push(j);
            }
        }
    }
    let player_data = {
        user_id: usr_qq,
        nickname: player.名号,
        danyao_have,
        danyao_need,
    }
    const data1 = await new Show(e).get_danyaoData(player_data)
    return await puppeteer.screenshot('danyao', {
        ...data1
    })
}

/**
 * 返回该玩家的功法图片
 * @return image
 */
export async function get_gongfa_img(e) {
    let i;
    let usr_qq = e.user_id
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) {
        return
    }
    let player = await data.getData('player', usr_qq)
    let xuexi_gongfa = player.学习的功法
    let gongfa_have = [];
    let gongfa_need = [];
    const gongfa = ['gongfa_list', 'timegongfa_list'];
    for (const i of gongfa) {
        for (const j of data[i]) {
            if (xuexi_gongfa.find(item => item == j.name) && !gongfa_have.find(item => item.name == j.name)) {
                gongfa_have.push(j);
            } else if (!gongfa_need.find(item => item.name == j.name)) {
                gongfa_need.push(j);
            }
        }
    }
    let player_data = {
        user_id: usr_qq,
        nickname: player.名号,
        gongfa_have,
        gongfa_need
    }
    const data1 = await new Show(e).get_gongfaData(player_data)
    return await puppeteer.screenshot('gongfa', {
        ...data1
    })
}

/**
 * 返回该玩家的法体
 * @return image
 */
export async function get_power_img(e) {
    let usr_qq = e.user_id;
    let player = await data.getData("player", usr_qq);
    let lingshi = Math.trunc(player.灵石);
    if (player.灵石 > 999999999999) {
        lingshi = 999999999999;
    }
    data.setData("player", usr_qq, player);
    await player_efficiency(usr_qq);
    if (!isNotNull(player.level_id)) {
        e.reply("请先#同步信息");
        return;
    }
    let this_association;
    if (!isNotNull(player.宗门)) {
        this_association = {
            "宗门名称": "无",
            "职位": "无"
        };
    } else {
        this_association = player.宗门;
    }
    //境界名字需要查找境界名
    let levelMax = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level;
    let need_xueqi = data.LevelMax_list.find(item => item.level_id == player.Physique_id).exp;
    let playercopy = {
        user_id: usr_qq,
        nickname: player.名号,
        need_xueqi: need_xueqi,
        xueqi: player.血气,
        levelMax: levelMax,
        lingshi: lingshi,
        镇妖塔层数: player.镇妖塔层数,
        神魄段数: player.神魄段数,
        hgd: player.favorability,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        learned_gongfa: player.学习的功法,
        association: this_association
    }
    const data1 = await new Show(e).get_playercopyData(playercopy);
    return await puppeteer.screenshot("playercopy", {
        ...data1,
    });
}

/**
 * 返回该玩家的存档图片
 * @return image
 */
export async function get_player_img(e) {
    let 法宝评级;
    let 护具评级;
    let 武器评级;
    let usr_qq = e.user_id
    let ifexistplay = data.existData('player', usr_qq)
    if (!ifexistplay) {
        return
    }
    let player = await data.getData('player', usr_qq)
    let equipment = await data.getData('equipment', usr_qq)
    let player_status = await getPlayerAction(usr_qq)
    let status = '空闲'
    if (player_status.time != null) {
        status = player_status.action + '(剩余时间:' + player_status.time + ')'
    }
    let lingshi = Math.trunc(player.灵石);
    if (player.灵石 > 999999999999) {
        lingshi = 999999999999;
    }
    if (player.宣言 == null || player.宣言 == undefined) {
        player.宣言 = '这个人很懒什么都没写'
    }
    if (player.灵根 == null || player.灵根 == undefined) {
        player.灵根 = await get_random_talent()
    }
    data.setData('player', usr_qq, player)
    await player_efficiency(usr_qq) // 注意这里刷新了修炼效率提升
    if (await player.linggenshow != 0) {
        player.灵根.type = '无'
        player.灵根.name = '未知'
        player.灵根.法球倍率 = '0'
        player.修炼效率提升 = '0'
    }
    if (!isNotNull(player.level_id)) {
        e.reply("请先#一键同步");
        return;
    }
    if (!isNotNull(player.sex)) {
        e.reply("请先#一键同步");
        return;
    }
    let nd = '无';
    if (player.隐藏灵根)
        nd = player.隐藏灵根.name;
    let zd = ['攻击', '防御', '生命加成', '防御加成', '攻击加成'];
    let num = [];
    let p = [];
    let kxjs = [];
    let count = 0;
    for (let j of zd) {
        if (player[j] == 0) {
            p[count] = '';
            kxjs[count] = 0;
            count++;
            continue;
        }
        p[count] = Math.floor(Math.log(player[j]) / Math.LN10);
        num[count] = player[j] * (10 ** -p[count]);
        kxjs[count] = `${(num[count]).toFixed(2)} x 10`;
        count++;
    }
    //境界名字需要查找境界名
    let level = data.Level_list.find(item => item.level_id == player.level_id).level;
    let power = (((player.攻击 * 0.9 + player.防御 * 1.1 + player.血量上限 * 0.6) + (player.暴击率 * player.攻击 * 0.5) + (player.灵根.法球倍率 * player.攻击)) / 10000);
    power = Number(power)
    power = power.toFixed(2)
    let power2 = (((player.攻击 + player.防御 * 1.1 + player.血量上限 * 0.5)) / 10000);
    power2 = Number(power2)
    power2 = power2.toFixed(2)
    let level2 = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level;
    let need_exp = data.Level_list.find(item => item.level_id == player.level_id).exp;
    let need_exp2 = data.LevelMax_list.find(item => item.level_id == player.Physique_id).exp;
    let occupation = player.occupation;
    let occupation_level;
    let occupation_level_name;
    let occupation_exp;
    let occupation_need_exp;
    if (!isNotNull(player.occupation)) {
        occupation = "无";
        occupation_level_name = "-";
        occupation_exp = "-";
        occupation_need_exp = "-";
    } else {
        occupation_level = player.occupation_level;
        occupation_level_name = data.occupation_exp_list.find(item => item.id == occupation_level).name;
        occupation_exp = player.occupation_exp;
        occupation_need_exp = data.occupation_exp_list.find(item => item.id == occupation_level).experience;
    }
    let this_association;
    if (!isNotNull(player.宗门)) {
        this_association = {
            宗门名称: '无',
            职位: '无'
        }
    } else {
        this_association = player.宗门
    }
    let pinji = ['劣', '普', '优', '精', '极', '绝', '顶']
    if (!isNotNull(equipment.武器.pinji)) {
        武器评级 = "无";
    } else {
        武器评级 = pinji[equipment.武器.pinji];
    }
    if (!isNotNull(equipment.护具.pinji)) {
        护具评级 = "无";
    } else {
        护具评级 = pinji[equipment.护具.pinji];
    }
    if (!isNotNull(equipment.法宝.pinji)) {
        法宝评级 = "无";
    } else {
        法宝评级 = pinji[equipment.法宝.pinji];
    }
    let rank_lianqi = data.Level_list.find(item => item.level_id == player.level_id).level
    let expmax_lianqi = data.Level_list.find(item => item.level_id == player.level_id).exp
    let rank_llianti = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level
    let expmax_llianti = need_exp2
    let rank_liandan = occupation_level_name
    let expmax_liandan = occupation_need_exp
    let strand_hp = Strand(player.当前血量, player.血量上限)
    let strand_lianqi = Strand(player.修为, expmax_lianqi)
    let strand_llianti = Strand(player.血气, expmax_llianti)
    let strand_liandan = Strand(occupation_exp, expmax_liandan)
    let Power = GetPower(player.攻击, player.防御, player.血量上限, player.暴击率);
    let PowerMini = bigNumberTransform(Power);
    let bao = parseInt(player.暴击率 * 100) + "%"
    equipment.武器.bao = parseInt(equipment.武器.bao * 100) + "%"
    equipment.护具.bao = parseInt(equipment.护具.bao * 100) + "%"
    equipment.法宝.bao = parseInt(equipment.法宝.bao * 100) + "%"
    lingshi = bigNumberTransform(lingshi)
    let hunyin = "未知";
    let A = usr_qq
    let qinmidu;
    try {
        qinmidu = await Read_qinmidu();
    } catch {
        //没有建立一个
        await Write_qinmidu([])
        qinmidu = await Read_qinmidu();
    }
    for (let i = 0; i < qinmidu.length; i++) {
        if ((qinmidu[i].QQ_A == A) || (qinmidu[i].QQ_B == A)) {
            if (qinmidu[i].婚姻 > 0) {
                if (qinmidu[i].QQ_A == A) {
                    let B = await Read_player(qinmidu[i].QQ_B)
                    hunyin = B.名号
                } else {
                    let A = await Read_player(qinmidu[i].QQ_A)
                    hunyin = A.名号
                }
                break;
            }
        }
    }
    let action = player.练气皮肤
    let player_data = {
        neidan: nd,
        pifu: action,
        user_id: usr_qq,
        player,  // 玩家数据
        rank_lianqi,  // 练气境界
        expmax_lianqi,  // 练气需求经验
        rank_llianti,  // 炼体境界
        expmax_llianti,  // 炼体需求经验
        rank_liandan,  // 炼丹境界
        expmax_liandan,  // 炼丹需求经验
        equipment,  // 装备数据
        talent: parseInt(player.修炼效率提升 * 100), //
        player_action: status,  // 当前状态
        this_association,  // 宗门信息
        strand_hp,
        strand_lianqi,
        strand_llianti,
        strand_liandan,
        PowerMini,  // 玩家战力
        bao,
        nickname: player.名号,
        linggen: player.灵根,//
        declaration: player.宣言,
        need_exp: need_exp,
        need_exp2: need_exp2,
        exp: player.修为,
        exp2: player.血气,
        zdl: power,
        镇妖塔层数: player.镇妖塔层数,
        sh: player.神魄段数,
        mdz: player.魔道值,
        hgd: player.favorability,
        jczdl: power2,
        level: level,
        level2: level2,
        lingshi: lingshi,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        player_atk: kxjs[0],
        player_atk2: p[0],
        player_def: kxjs[1],
        player_def2: p[1],
        生命加成: kxjs[2],
        生命加成_t: p[2],
        防御加成: kxjs[3],
        防御加成_t: p[3],
        攻击加成: kxjs[4],
        攻击加成_t: p[4],
        player_bao: player.暴击率,
        player_bao2: player.暴击伤害,
        occupation: occupation,
        occupation_level: occupation_level_name,
        occupation_exp: occupation_exp,
        occupation_need_exp: occupation_need_exp,
        arms: equipment.武器,
        armor: equipment.护具,
        treasure: equipment.法宝,
        association: this_association,
        learned_gongfa: player.学习的功法,
        婚姻状况: hunyin,
        武器评级: 武器评级,
        护具评级: 护具评级,
        法宝评级: 法宝评级,
        修仙版本: versionData
    }
    const data1 = await new Show(e).get_playerData(player_data);
    return await puppeteer.screenshot("player", {
        ...data1,
    });
}

/**
 * 我的宗门
 * @return image
 */
export async function get_association_img(e) {
    let item;
    let usr_qq = e.user_id;
    //无存档
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    //门派
    let player = data.getData("player", usr_qq);
    if (!isNotNull(player.宗门)) {
        return;
    }
    //境界
    //let now_level_id;
    if (!isNotNull(player.level_id)) {
        e.reply("请先#同步信息");
        return;
    }
    //有加入宗门
    let ass = data.getAssociation(player.宗门.宗门名称);
    //寻找
    let mainqq = await data.getData("player", ass.宗主);
    //仙宗
    let xian = ass.power;
    let weizhi;
    if (xian == 0) {
        weizhi = "凡界";
    } else {
        weizhi = "仙界";
    }
    //门槛
    let level = data.Level_list.find(item => item.level_id === ass.最低加入境界).level;
    // 副宗主
    let fuzong = []
    for (item in ass.副宗主) {
        fuzong[item] = "道号：" + data.getData("player", ass.副宗主[item]).名号 + "QQ：" + ass.副宗主[item]
    }
    //长老
    const zhanglao = [];
    for (item in ass.长老) {
        zhanglao[item] = "道号：" + data.getData("player", ass.长老[item]).名号 + "QQ：" + ass.长老[item]
    }
    //内门弟子
    const neimen = [];
    for (item in ass.内门弟子) {
        neimen[item] = "道号：" + data.getData("player", ass.内门弟子[item]).名号 + "QQ：" + ass.内门弟子[item]
    }
    //外门弟子
    const waimen = [];
    for (item in ass.外门弟子) {
        waimen[item] = "道号：" + data.getData("player", ass.外门弟子[item]).名号 + "QQ：" + ass.外门弟子[item]
    }
    let state = "需要维护";
    let now = new Date();
    let nowTime = now.getTime(); //获取当前日期的时间戳
    if (ass.维护时间 > nowTime - 1000 * 60 * 60 * 24 * 7) {
        state = "不需要维护";
    }
    //计算修炼效率
    let xiulian;
    let dongTan = await data.bless_list.find(item => item.name == ass.宗门驻地);
    if (ass.宗门驻地 == 0) {
        xiulian = ass.宗门等级 * 0.05 * 100
    } else {
        try {
            xiulian = ass.宗门等级 * 0.05 * 100 + dongTan.efficiency * 100;
        }
        catch
        {
            xiulian = ass.宗门等级 * 0.05 * 100 + 0.5;
        }
    }
    xiulian = Math.trunc(xiulian);
    if (ass.宗门神兽 == 0) {
        ass.宗门神兽 = "无"
    }
    let association_data = {
        user_id: usr_qq,
        ass: ass,
        mainname: mainqq.名号,
        mainqq: ass.宗主,
        xiulian: xiulian,
        weizhi: weizhi,
        level: level,
        mdz: player.魔道值,
        zhanglao: zhanglao,
        fuzong: fuzong,
        neimen: neimen,
        waimen: waimen,
        state: state
    }
    const data1 = await new Show(e).get_associationData(association_data);
    return await puppeteer.screenshot("association", {
        ...data1,
    });
}

/**
 * 返回该玩家的装备图片
 * @return image
 */
export async function get_equipment_img(e) {
    let usr_qq = e.user_id;
    let player = await data.getData("player", usr_qq);
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    const bao = Math.trunc(parseInt(player.暴击率 * 100));
    let equipment = await data.getData("equipment", usr_qq);
    let player_data = {
        user_id: usr_qq,
        mdz: player.魔道值,
        nickname: player.名号,
        arms: equipment.武器,
        armor: equipment.护具,
        treasure: equipment.法宝,
        player_atk: player.攻击,
        player_def: player.防御,
        player_bao: bao,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        pifu: Number(player.装备皮肤)
    }
    const data1 = await new Show(e).get_equipmnetData(player_data);
    return await puppeteer.screenshot("equipment", {
        ...data1,
    });
}
/**
 * 返回该玩家的纳戒图片
 * @return image
 */
export async function get_najie_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let player = await data.getData("player", usr_qq);
    let najie = await Read_najie(usr_qq);
    const lingshi = Math.trunc(najie.灵石);
    const lingshi2 = Math.trunc(najie.灵石上限);
    let strand_hp = Strand(player.当前血量, player.血量上限)
    let strand_lingshi = Strand(najie.灵石, najie.灵石上限)
    let player_data = {
        user_id: usr_qq,
        player: player,
        najie: najie,
        mdz: player.魔道值,
        nickname: player.名号,
        najie_lv: najie.等级,
        player_maxHP: player.血量上限,
        player_nowHP: player.当前血量,
        najie_maxlingshi: lingshi2,
        najie_lingshi: lingshi,
        najie_equipment: najie.装备,
        najie_danyao: najie.丹药,
        najie_daoju: najie.道具,
        najie_gongfa: najie.功法,
        najie_caoyao: najie.草药,
        najie_cailiao: najie.材料,
        strand_hp: strand_hp,
        strand_lingshi: strand_lingshi,
        修仙版本: versionData,
        pifu: player.练气皮肤
    }
    const data1 = await new Show(e).get_najieData(player_data);
    return await puppeteer.screenshot("najie", {
        ...data1,
    });
}

/**
 * 返回境界列表图片
 * @return image
 */
export async function get_state_img(e, all_level) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let player = await data.getData("player", usr_qq);
    let Level_id = player.level_id;
    let Level_list = data.Level_list;
    //循环删除表信息
    if (!all_level) {
        for (let i = 1; i <= 60; i++) {
            if (i > Level_id - 6 && i < Level_id + 6) {
                continue;
            }
            Level_list = await Level_list.filter(item => item.level_id != i);
        }
    }
    let state_data = {
        user_id: usr_qq,
        Level_list: Level_list
    }
    const data1 = await new Show(e).get_stateData(state_data);
    return await puppeteer.screenshot("state", {
        ...data1,
    });
}

export async function get_statezhiye_img(e, all_level) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let player = await data.getData("player", usr_qq);
    let Level_id = player.occupation_level;
    let Level_list = data.occupation_exp_list;
    //循环删除表信息
    if (!all_level) {
        for (let i = 0; i <= 60; i++) {
            if (i > Level_id - 6 && i < Level_id + 6) {
                continue;
            }
            Level_list = await Level_list.filter(item => item.id != i);
        }
    }
    let state_data = {
        user_id: usr_qq,
        Level_list: Level_list
    }
    const data1 = await new Show(e).get_stateDatazhiye(state_data);
    return await puppeteer.screenshot("statezhiye", {
        ...data1,
    });
}

/**
 * 返回境界列表图片
 * @return image
 */
export async function get_statemax_img(e, all_level) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let player = await data.getData("player", usr_qq);
    let Level_id = player.Physique_id;
    let LevelMax_list = data.LevelMax_list;
    //循环删除表信息
    if (!all_level) {
        for (let i = 1; i <= 60; i++) {
            if (i > Level_id - 6 && i < Level_id + 6) {
                continue;
            }
            LevelMax_list = await LevelMax_list.filter(item => item.level_id != i);
        }
    }
    let statemax_data = {
        user_id: usr_qq,
        LevelMax_list: LevelMax_list
    }
    const data1 = await new Show(e).get_statemaxData(statemax_data);
    return await puppeteer.screenshot("statemax", {
        ...data1,
    });
}

export async function get_talent_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let player = await data.getData("player", usr_qq);
    let Level_id = player.Physique_id;
    let talent_list = data.talent_list;
    let talent_data = {
        user_id: usr_qq,
        talent_list: talent_list
    }
    const data1 = await new Show(e).get_talentData(talent_data);
    return await puppeteer.screenshot("talent", {
        ...data1,
    });
}


/**
 * 返回修仙设置
 * @return image
 */
export async function get_adminset_img(e) {
    let adminset = {
        //CD：分
        CDassociation: xiuxianConfigData.CD.association,
        CDjoinassociation: xiuxianConfigData.CD.joinassociation,
        CDassociationbattle: xiuxianConfigData.CD.associationbattle,
        CDrob: xiuxianConfigData.CD.rob,
        CDgambling: xiuxianConfigData.CD.gambling,
        CDcouple: xiuxianConfigData.CD.couple,
        CDgarden: xiuxianConfigData.CD.garden,
        CDlevel_up: xiuxianConfigData.CD.level_up,
        CDsecretplace: xiuxianConfigData.CD.secretplace,
        CDtimeplace: xiuxianConfigData.CD.timeplace,
        CDforbiddenarea: xiuxianConfigData.CD.forbiddenarea,
        CDreborn: xiuxianConfigData.CD.reborn,
        CDtransfer: xiuxianConfigData.CD.transfer,
        CDhonbao: xiuxianConfigData.CD.honbao,
        CDboss: xiuxianConfigData.CD.boss,
        //手续费
        percentagecost: xiuxianConfigData.percentage.cost,
        percentageMoneynumber: xiuxianConfigData.percentage.Moneynumber,
        percentagepunishment: xiuxianConfigData.percentage.punishment,
        //出千控制
        sizeMoney: xiuxianConfigData.size.Money,
        //开关
        switchplay: xiuxianConfigData.switch.play,
        switchMoneynumber: xiuxianConfigData.switch.play,
        switchcouple: xiuxianConfigData.switch.couple,
        switchXiuianplay_key: xiuxianConfigData.switch.Xiuianplay_key,
        //倍率
        biguansize: xiuxianConfigData.biguan.size,
        biguantime: xiuxianConfigData.biguan.time,
        biguancycle: xiuxianConfigData.biguan.cycle,
        //
        worksize: xiuxianConfigData.work.size,
        worktime: xiuxianConfigData.work.time,
        workcycle: xiuxianConfigData.work.cycle,

        //出金倍率
        SecretPlaceone: xiuxianConfigData.SecretPlace.one,
        SecretPlacetwo: xiuxianConfigData.SecretPlace.two,
        SecretPlacethree: xiuxianConfigData.SecretPlace.three,
    }
    const data1 = await new Show(e).get_adminsetData(adminset);
    return await puppeteer.screenshot("adminset", {
        ...data1,
    });
}

export async function get_ranking_power_img(e, Data, usr_paiming, thisplayer) {
    let usr_qq = e.user_id;
    let level = data.Level_list.find(item => item.level_id == thisplayer.level_id).level;
    let ranking_power_data = {
        user_id: usr_qq,
        mdz: thisplayer.魔道值,
        nickname: thisplayer.名号,
        exp: thisplayer.修为,
        level: level,
        usr_paiming: usr_paiming,
        allplayer: Data
    }
    const data1 = await new Show(e).get_ranking_powerData(ranking_power_data);
    return await puppeteer.screenshot("ranking_power", {
        ...data1,
    });
}

export async function get_ranking_money_img(e, Data, usr_paiming, thisplayer, thisnajie) {
    let usr_qq = e.user_id;
    const najie_lingshi = Math.trunc(thisnajie.灵石);
    const lingshi = Math.trunc(thisplayer.灵石 + thisnajie.灵石);
    let ranking_money_data = {
        user_id: usr_qq,
        nickname: thisplayer.名号,
        lingshi: lingshi,
        najie_lingshi: najie_lingshi,
        usr_paiming: usr_paiming,
        allplayer: Data
    }
    const data1 = await new Show(e).get_ranking_moneyData(ranking_money_data);
    return await puppeteer.screenshot("ranking_money", {
        ...data1,
    });
}

async function getPlayerAction(usr_qq) {
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
            arr.time = m + "分" + s + "秒";//剩余时间
            return arr;
        }
    }
    arr.action = "空闲";
    return arr;
}

/**
 * @description: 进度条渲染
 * @param {Number} res 百分比小数
 * @return {*} css样式
 */
function Strand(now, max) {
    let num = (now / max * 100).toFixed(0);
    let mini
    if (num > 100) {
        mini = 100
    } else {
        mini = num
    }
    let strand = {
        style: `style=width:${mini}%`,
        num: num
    };
    return strand
}

/**
 * 大数字转换，将大额数字转换为万、千万、亿等
 * @param value 数字值
 */
export function bigNumberTransform(value) {
    const newValue = ['', '', '']
    let fr = 1000
    let num = 3
    let text1 = ''
    let fm = 1
    while (value / fr >= 1) {
        fr *= 10
        num += 1
        // console.log('数字', value / fr, 'num:', num)
    }
    if (num <= 4) { // 千
        newValue[0] = parseInt(value / 1000) + ''
        newValue[1] = '千'
    } else if (num <= 8) { // 万
        text1 = parseInt(num - 4) / 3 > 1 ? '千万' : '万'
        // tslint:disable-next-line:no-shadowed-variable
        fm = text1 === '万' ? 10000 : 10000000
        if (value % fm === 0) {
            newValue[0] = parseInt(value / fm) + ''
        } else {
            newValue[0] = parseFloat(value / fm).toFixed(2) + ''
        }
        newValue[1] = text1
    } else if (num <= 16) { // 亿
        text1 = (num - 8) / 3 > 1 ? '千亿' : '亿'
        text1 = (num - 8) / 4 > 1 ? '万亿' : text1
        text1 = (num - 8) / 7 > 1 ? '千万亿' : text1
        // tslint:disable-next-line:no-shadowed-variable
        fm = 1
        if (text1 === '亿') {
            fm = 100000000
        } else if (text1 === '千亿') {
            fm = 100000000000
        } else if (text1 === '万亿') {
            fm = 1000000000000
        } else if (text1 === '千万亿') {
            fm = 1000000000000000
        }
        if (value % fm === 0) {
            newValue[0] = parseInt(value / fm) + ''
        } else {
            newValue[0] = parseFloat(value / fm).toFixed(2) + ''
        }
        newValue[1] = text1
    }
    if (value < 1000) {
        newValue[0] = value + ''
        newValue[1] = ''
    }
    return newValue.join('')
}

/**
 * 计算战力
 */
export function GetPower(atk, def, hp, bao) {
    let power = (atk + def * 0.8 + hp * 0.6) * (bao + 1);
    power = parseInt(power)
    return power
}