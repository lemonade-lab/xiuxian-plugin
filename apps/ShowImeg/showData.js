import plugin from "../../../../lib/plugins/plugin.js"
import Show from "../../model/show.js"
import puppeteer from "../../../../lib/puppeteer/puppeteer.js"
import config from "../../model/Config.js"
import data from '../../model/XiuxianData.js'
import {talentname,Read_battle,
    Read_player, Read_wealth,Read_talent,
    Read_equipment,Read_level, Read_najie, Read_Life} from '../Xiuxian/Xiuxian.js'

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

    async show_adminset(e) {
        if (!e.isMaster) {
            return;
        }
        let img = await get_adminset_img(e);
        e.reply(img);
        return;
    }
    async show_Level(e) {
        let img = await get_state_img(e);
        e.reply(img);
        return;
    }
    async show_LevelMax(e) {
        let img = await get_statemax_img(e);
        e.reply(img);
        return;
    }
    async show_updata(e) {
        let img = await get_updata_img(e);
        e.reply(img);
        return;
    }

}

export async function get_player_img(e) {
    let usr_qq = e.user_id;
    let player = await Read_player(usr_qq);
    let life=await Read_Life();
    life =life.find(item => item.qq == usr_qq);
    let wealt = await Read_wealth(usr_qq);
    let equipment = await Read_equipment(usr_qq);
    let talent = await Read_talent(usr_qq);
    let level = await Read_level(usr_qq);
    let battle = await Read_battle(usr_qq);
    let linggenname = await talentname(talent);
    let name = "";
    for (var i = 0; i < linggenname.length; i++) {
        name = name + linggenname[i];
    }
    if (await talent.talentshow != 0) {
        talent.talentsize = "0";
        name = "未知";
    }
    let myData = {
        user_id: usr_qq,
        life:life,
        player: player,
        level: level,
        linggenname: name,
        battle:battle,
        equipment:equipment,
        lingshi: Math.trunc(wealt.lingshi),
        xianshi: Math.trunc(wealt.xianshi),
        talent:talent,
        talentsize: parseInt(talent.talentsize * 100)
    }
    const data1 = await new Show(e).get_Data("User/player","player",myData);
    let img = await puppeteer.screenshot("player", {
        ...data1,
    });
    return img;

}
/**
 * 返回该玩家的装备图片
 */
export async function get_equipment_img(e) {
    let usr_qq = e.user_id;
    let life=await Read_Life();
    life =life.find(item => item.qq == usr_qq);
    let equipment = await Read_equipment(usr_qq);
    let battle = await Read_battle(usr_qq);
    let myData = {
        user_id: usr_qq,
        battle:battle,
        life:life,
        equipment:equipment
    }
    const data1 = await new Show(e).get_Data("User/equipment","equipment",myData);
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
    let life=await Read_Life();
    life =life.find(item => item.qq == usr_qq);
    let player = await Read_player(usr_qq);
    let najie = await Read_najie(usr_qq);
    let battle = await Read_battle(usr_qq);
    let myData = {
        user_id: usr_qq,
        player: player,
        life:life,
        battle:battle,
        najie: najie
    }
    const data1 = await new Show(e).get_Data("User/najie", "najie",myData);
    let img = await puppeteer.screenshot("najie", {
        ...data1,
    });
    return img;
}

/**
 * 返回练气
 */
export async function get_state_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }
     let player = await Read_level(usr_qq);
     let Level_id=player.level_id;
     let Level_list = data.Level_list;
    //循环删除表信息
    for(var i=1;i<=60;i++){
        if(i>Level_id&&i<Level_id+5){
            console.log(i);
            continue;
        }
        Level_list = await Level_list.filter(item => item.id != i);
    }
    let myData = {
        user_id: usr_qq,
        Level_list: Level_list
    }
    const data1 = await new Show(e).get_Data("state", "state",myData);
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
    let player = await Read_level(usr_qq);
    let Level_id=player.levelmax_id;
    let LevelMax_list = data.LevelMax_list;
   //循环删除表信息
   for(var i=1;i<=60;i++){
       if(i>Level_id&&i<Level_id+5){
           continue;
       }
       LevelMax_list = await LevelMax_list.filter(item => item.id != i);
   }
    let myData = {
        user_id: usr_qq,
        LevelMax_list: LevelMax_list
    }
    const data1 = await new Show(e).get_Data("statemax", "statemax",myData);
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
    let myData = {
        version:updata
    }
    const data1 = await new Show(e).get_Data("updata", "updata",myData);
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
    let myData = {
        /**
         * 改成数组展示
         */
        xiuxianConfigData: xiuxianConfigData,
    }
    const data1 = await new Show(e).get_Data("adminset", "adminset",myData);
    let img = await puppeteer.screenshot("adminset", {
        ...data1,
    });
    return img;

}

