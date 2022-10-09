import plugin from "../../../../lib/plugins/plugin.js"
import Show from "../../model/show.js"
import puppeteer from "../../../../lib/puppeteer/puppeteer.js"
import config from "../../model/Config.js"
import data from '../../model/XiuxianData.js'
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
/**
 * 生图模块
 * 
 */
let xiuxianConfigData = config.getConfig("xiuxian", "xiuxian")
export class showData extends plugin {
    constructor(e) {
        super({
            name: "showData",
            dsc: "showData",
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
                    reg: "^#炼体境界$",
                    fnc: "show_LevelMax",
                },
                {
                    reg: "^#修仙版本$",
                    fnc: "show_updata",
                },
                {
                    reg: "^#修仙设置$",
                    fnc: "show_adminset",
                }
            ]
        })
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

        if (!e.isGroup) {
            return;
        }
        let img = await get_equipment_img(e);
        e.reply(img);
        return;
    }


    async show_Level(e) {

        if (!e.isGroup) {
            return;
        }
        let img = await get_state_img(e);
        e.reply(img);
        return;
    }

    async show_LevelMax(e) {

        if (!e.isGroup) {
            return;
        }
        let img = await get_statemax_img(e);
        e.reply(img);
        return;
    }




    async show_updata(e) {
        if (!e.isGroup) {
            return;
        }
        let img = await get_updata_img(e);
        e.reply(img);
        return;
    }

}


/**
 * 返回该玩家的存档图片
 * @return image
 */
export async function get_player_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let player = await data.getData("player", usr_qq);
    let equipment = await data.getData("equipment", usr_qq);
    let wuqi_name  = data.wuqi_list.find(item => item.id == equipment.arms.id).name;
    let juju_name  = data.huju_list.find(item => item.id == equipment.huju.id).name;
    let fabao_name = data.fabao_list.find(item => item.id == equipment.fabao.id).name;
    let player_status = await Xiuxian.getPlayerAction(usr_qq);
    let status = "空闲";
    if (player_status.time != null) {
        status = player_status.action + "(剩余时间:" + player_status.time + ")";
    }
    let lingshi = Math.trunc(player.lingshi);
    if (player.lingshi > 999999999999) {
        lingshi = 999999999999;
    }
    data.setData("player", usr_qq, player);
    await Xiuxian.player_efficiency(usr_qq);
    /**
     * 灵根
     */
    let linggenname = "未知";
    linggenname = await Xiuxian.talentname(player);
    let name = "";
    for (var i = 0; i < linggenname.length; i++) {
        name = name + linggenname[i];
    }
    if (await player.talentshow != 0) {
        player.talentsize = "0";
        name = "未知";
    }
    /**
     * 境界
     */

    let level = data.Level_list.find(item => item.level_id == player.level_id).level;
    let player_data = {
        user_id: usr_qq,
        nickname: player.name,
        linggenname: name,
        declaration: player.autograph,
        exp: player.experience,

        level: level,
        lingshi: lingshi,
        wuqi_name:wuqi_name,
        juju_name:juju_name,
        fabao_name:fabao_name,
        player_maxHP: player.hpmax,
        player_nowHP: player.nowblood,
        talent: parseInt(player.talentsize * 100),
        player_action: status,
    }
    const data1 = await new Show(e).get_playerData(player_data);
    let img = await puppeteer.screenshot("player", {
        ...data1,
    });
    return img;
}


/**
 * 返回该玩家体
 */
 export async function get_power_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let player = await data.getData("player", usr_qq);
    let lingshi = Math.trunc(player.lingshi);
    if (player.lingshi > 999999999999) {
        lingshi = 999999999999;
    }
    data.setData("player", usr_qq, player);
    await Xiuxian.player_efficiency(usr_qq);
    let levelMax = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level;

    let AllSorcery=[];
    for(var i=0;i<player.AllSorcery.length;i++){
        let ifexist2 = data.gongfa_list.find(item => item.id == player.AllSorcery[i]);
        if (ifexist2 == undefined) {
            ifexist2 = data.timegongfa_list.find(item => item.id == player.AllSorcery[i]);
        }
        AllSorcery.push(ifexist2.name);
    }

    let playercopy = {
        user_id: usr_qq,
        nickname: player.name,
        expMax: player.experiencemax,
        levelMax: levelMax,
        lingshi: lingshi,
        player_maxHP: player.hpmax,
        player_nowHP: player.nowblood,
        learned_gongfa: AllSorcery,
    }
    const data1 = await new Show(e).get_playercopyData(playercopy);
    let img = await puppeteer.screenshot("playercopy", {
        ...data1,
    });
    return img;
}



/**
 * 返回该玩家的装备图片
 */
export async function get_equipment_img(e) {

    let usr_qq = e.user_id;

    let player = await data.getData("player", usr_qq);

    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }

    var burst = Math.trunc(parseInt(player.burst * 100))
    
    let equipment = await data.getData("equipment", usr_qq);
    let arms = data.wuqi_list.find(item => item.id == equipment.arms.id);
    if (arms == undefined) {
        arms = data.timewuqi_list.find(item => item.id == equipment.arms.id);
    }
    let huju= data.huju_list.find(item => item.id ==  equipment.huju.id);
    if (huju == undefined) {
        huju = data.timehuju_list.find(item => item.id ==  equipment.huju.id);
    }
    let fabao= data.fabao_list.find(item => item.id == equipment.fabao.id  );
    if (fabao == undefined) {
        fabao = data.timefabao_list.find(item => item.id == equipment.fabao.id  );
    }

    let player_data = {
        user_id: usr_qq,
        /**
         * 装备面板
         */
        arms: arms,
        huju: huju,
        fabao: fabao,
        /**
         * 用户面板
         */
        nickname: player.name,
        player_atk: player.nowattack,
        player_def: player.nowdefense,
        player_burst: burst,
        player_maxHP: player.hpmax,
        player_nowHP: player.nowblood

    }
    const data1 = await new Show(e).get_equipmnetData(player_data);
    let img = await puppeteer.screenshot("equipment", {
        ...data1,
    });
    return img;
}

/**
 * 返回该玩家的纳戒图片
 */
export async function get_najie_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
    let player = await data.getData("player", usr_qq);
    let najie = await data.getData("najie", usr_qq);
    
    let arms=[];
    let huju=[];
    let fabao=[];
    let danyao=[];
    let daoju=[];
    let gonfa=[];
    let ring=[];
    
    for(var i=0;i<najie.arms.length;i++){
        let name=await Xiuxian.exist_thing(najie.arms[i].id,najie.arms[i].class);
        name.acount=najie.arms[i].acount;
        arms.push(name);
    }
    for(var i=0;i<najie.huju.length;i++){
        let name=await Xiuxian.exist_thing(najie.huju[i].id,najie.huju[i].class)
        name.acount=najie.huju[i].acount;
        huju.push(name);
    }
    for(var i=0;i<najie.fabao.length;i++){
        let name=await Xiuxian.exist_thing(najie.fabao[i].id,najie.fabao[i].class)
        name.acount=najie.fabao[i].acount;
        fabao.push(name);
    }
    for(var i=0;i<najie.danyao.length;i++){
        let name=await Xiuxian.exist_thing(najie.danyao[i].id,najie.danyao[i].class);
        name.acount=najie.danyao[i].acount;
        danyao.push(name);
    }
    for(var i=0;i<najie.daoju.length;i++){
        let name=await Xiuxian.exist_thing(najie.daoju[i].id,najie.daoju[i].class);
        name.acount=najie.daoju[i].acount;
        daoju.push(name);
    }
    for(var i=0;i<najie.gonfa.length;i++){
        let name=await Xiuxian.exist_thing(najie.gonfa[i].id,najie.gonfa[i].class);
        name.acount=najie.gonfa[i].acount;
        gonfa.push(name);
    }
    for(var i=0;i<najie.ring.length;i++){
        let name=await Xiuxian.exist_thing(najie.ring[i].id,najie.ring[i].class);
        name.acount=najie.ring[i].acount;
        ring.push(name);
    }

    var lingshi = Math.trunc(najie.lingshi);
    var lingshi2 = Math.trunc(najie.lingshimax);
    let player_data = {
        user_id: usr_qq,
        nickname: player.name,
        player_maxHP: player.hpmax,
        player_nowHP: player.nowblood,
        najie_lv: najie.grade,
        najie_maxlingshi: lingshi2,
        najie_lingshi: lingshi,
        najie_arms: arms,
        najie_huju: huju,
        najie_fabao: fabao,
        najie_danyao: danyao,
        najie_daoju: daoju,
        najie_gongfa: gonfa,
        najie_ring: ring
    }
    const data1 = await new Show(e).get_najieData(player_data);
    let img = await puppeteer.screenshot("najie", {
        ...data1,
    });

    return img;

}


/**
 * 返回境界列表图片
 */

export async function get_state_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }

     let player = await data.getData("player", usr_qq);
     let Level_id=player.level_id;
     let Level_list = data.Level_list;

    //循环删除表信息
    for(var i=1;i<=60;i++){
        if(i>Level_id-6&&i<Level_id+6){
            continue;
        }
        Level_list = await Level_list.filter(item => item.level_id != i);
    }

    let state_data = {
        user_id: usr_qq,
        Level_list: Level_list
    }

    const data1 = await new Show(e).get_stateData(state_data);
    let img = await puppeteer.screenshot("state", {
        ...data1,
    });
    return img;

}

/**
 * 返回境界列表图片
 */

export async function get_statemax_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }

    let player = await data.getData("player", usr_qq);

    let Level_id=player.Physique_id;

    let LevelMax_list = data.LevelMax_list;

   //循环删除表信息
   for(var i=1;i<=60;i++){
       if(i>Level_id-6&&i<Level_id+6){
           continue;
       }
       LevelMax_list = await LevelMax_list.filter(item => item.level_id != i);
   }

    let statemax_data = {
        user_id: usr_qq,
        LevelMax_list: LevelMax_list
    }
    const data1 = await new Show(e).get_statemaxData(statemax_data);
    let img = await puppeteer.screenshot("statemax", {
        ...data1,
    });
    return img;

}

let updata = config.getdefSet("version", "version");

/**
 * 返回修仙版本
 * @return image
 */
export async function get_updata_img(e) {

    let updata_data = {
        version:updata
    }
    const data1 = await new Show(e).get_updataData(updata_data);
    let img = await puppeteer.screenshot("updata", {
        ...data1,
    });
    return img;

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
        //  
        BossBoss: xiuxianConfigData.Boss.Boss,
        //出金倍率
        SecretPlaceone: xiuxianConfigData.SecretPlace.one,
        SecretPlacetwo: xiuxianConfigData.SecretPlace.two,
        SecretPlacethree: xiuxianConfigData.SecretPlace.three,
    }
    const data1 = await new Show(e).get_adminsetData(adminset);
    let img = await puppeteer.screenshot("adminset", {
        ...data1,
    });
    return img;

}



export async function get_ranking_power_img(e, Data, usr_paiming, thisplayer) {
    let usr_qq = e.user_id;
    let level = data.Level_list.find(item => item.level_id == thisplayer.level_id).level;
    let ranking_power_data = {
        user_id: usr_qq,
        nickname: thisplayer.name,
        exp: thisplayer.experience,
        level: level,
        usr_paiming: usr_paiming,
        allplayer: Data
    }
    const data1 = await new Show(e).get_ranking_powerData(ranking_power_data);
    let img = await puppeteer.screenshot("ranking_power", {
        ...data1,
    });
    return img;
}

export async function get_ranking_money_img(e, Data, usr_paiming, thisplayer, thisnajie) {
    let usr_qq = e.user_id;
    var najie_lingshi = Math.trunc(thisnajie.lingshi);
    var lingshi = Math.trunc(thisplayer.lingshi + thisnajie.lingshi);
    let ranking_money_data = {
        user_id: usr_qq,
        nickname: thisplayer.name,
        lingshi: lingshi,
        najie_lingshi: najie_lingshi,
        usr_paiming: usr_paiming,
        allplayer: Data
    }
    const data1 = await new Show(e).get_ranking_moneyData(ranking_money_data);
    let img = await puppeteer.screenshot("ranking_money", {
        ...data1,
    });
    return img;
}
