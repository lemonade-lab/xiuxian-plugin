import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fs from "fs"
import {Go,Read_player,GenerateCD,Add_experiencemax,Read_equipment,
    Write_equipment,Add_HP,Add_experience,__PATH} from '../Xiuxian/Xiuxian.js'

/**
 * 境界模块
 */
export class Level extends plugin {
    constructor() {
        super({
            name: 'Yunzai_Bot_Level',
            dsc: 'Yunzai_Bot_Level',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#突破$',
                    fnc: 'Level_up'
                },
                {
                    reg: '^#破体$',
                    fnc: 'LevelMax_up'
                },
                {
                    reg: '^#渡劫$',
                    fnc: 'fate_up'
                },
                {
                    reg: '^#羽化登仙$',
                    fnc: 'Level_up_Max'
                },
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    async LevelMax_up(e) {
        let good=await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let player = await Read_player(usr_qq);
        let now_level_id = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level_id;
        let now_exp = player.experiencemax;
        let need_exp = data.LevelMax_list.find(item => item.level_id == player.Physique_id).exp;
        if (now_exp < need_exp) {
            e.reply(`气血不足,再积累${need_exp - now_exp}气血后方可突破`);
            return;
        }
        let CDTime = this.xiuxianConfigData.CD.level_up;
        let ClassCD = ":last_LevelMaxup_time";
        let now_time = new Date().getTime();
        let CD = await GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time); 
        let rand = Math.random();
        let prob = 1 - now_level_id / 60;
        if (rand > prob) {
            let bad_time = Math.random();
            if (bad_time > 0.9) {
                await Add_experiencemax(usr_qq, -1 * need_exp * 0.4);
                await redis.set("xiuxian:player:" + usr_qq + ":last_LevelMaxup_time", now_time);
                e.reply(`突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美！！！是翠翎恐蕈，此地不适合突破，快跑！险些走火入魔，丧失了` + (need_exp) * 0.4 + "气血");
                return;
            }
            else if (bad_time > 0.8) {
                await Add_experiencemax(usr_qq, -1 * need_exp * 0.2);
                await redis.set("xiuxian:player:" + usr_qq + ":last_LevelMaxup_time", now_time);
                e.reply(`突破瓶颈时想到树脂满了,险些走火入魔，丧失了` + (need_exp) * 0.2 + "气血");
                return;
            }
            else if (bad_time > 0.7) {
                await Add_experiencemax(usr_qq, -1 * need_exp * 0.1);
                await redis.set("xiuxian:player:" + usr_qq + ":last_LevelMaxup_time", now_time);
                e.reply(`突破瓶颈时想起背后是药园，刚种下掣电树种子，不能被破坏了，打断突破，嘴角流血，丧失了` + (need_exp) * 0.1 + "气血");
                return;
            }
            else if (bad_time > 0.1) {
                await redis.set("xiuxian:player:" + usr_qq + ":last_LevelMaxup_time", now_time);
                e.reply(`憋红了脸，境界突破失败,等到${Time}分钟后再尝试吧`);
                return;
            }
            else {
                await Add_experiencemax(usr_qq, -1 * need_exp * 0.2);
                await redis.set("xiuxian:player:" + usr_qq + ":last_LevelMaxup_time", now_time);
                e.reply(`突破瓶颈时想起怡红院里的放肆,想起了金银坊里的狂热,险些走火入魔，丧失了` + (need_exp) * 0.2 + "气血");
                return;
            }
        }
        player.Physique_id = now_level_id + 1;
        player.experiencemax -= need_exp;
        await Write_player(usr_qq, player);
        let equipment = await Read_equipment(usr_qq);
        await Write_equipment(usr_qq, equipment);
        await Add_HP(usr_qq, 99999999);
        let level = data.LevelMax_list.find(item => item.level_id == player.Physique_id).level;
        e.reply(`突破成功至${level}`);
        await redis.set("xiuxian:player:" + usr_qq + ":last_LevelMaxup_time", now_time);
        return;

    }



    //突破
    async Level_up(e) {
        let good=await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let player = await Read_player(usr_qq);
        let now_level = data.Level_list.find(item => item.level_id == player.level_id).level;
        if (now_level == "渡劫期") {
            if (player.power_place == 0) {
                e.reply("你已度过雷劫，请感应仙门#羽化登仙");
            }
            else {
                e.reply(`请先渡劫！`);
            }
            return;
        }
        let now_level_id;
        now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id == 53) {
            let LevelUP = await fanren();
            if (LevelUP != 1) {
                e.reply(`这方世界已有化凡！`);
                return;
            }
        }
        if (now_level_id == 54) {
            return;
        }
        let now_exp = player.experience;
        let need_exp = data.Level_list.find(item => item.level_id == player.level_id).exp;
        if (now_exp < need_exp) {
            e.reply(`修为不足,再积累${need_exp - now_exp}修为后方可突破`);
            return;
        }
        let CDTime = this.xiuxianConfigData.CD.level_up;
        let ClassCD = ":last_Levelup_time";
        let now_time = new Date().getTime();
        let CD = await GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time); 
        let rand = Math.random();
        let prob = 1 - now_level_id / 60;
        if (rand > prob) {
            let bad_time = Math.random();//增加多种突破失败情况，顺滑突破丢失experience曲线
            if (bad_time > 0.9) {
                await Add_experience(usr_qq, -1 * need_exp * 0.4);
                await redis.set("xiuxian:player:" + usr_qq + ":last_Levelup_time", now_time);//获得上次的时间戳
                e.reply(`突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美！！！是翠翎恐蕈，此地不适合突破，快跑！险些走火入魔，丧失了` + (need_exp) * 0.4 + "修为");
                return;
            }
            else if (bad_time > 0.8) {
                await Add_experience(usr_qq, -1 * need_exp * 0.2);
                await redis.set("xiuxian:player:" + usr_qq + ":last_Levelup_time", now_time);//获得上次的时间戳
                e.reply(`突破瓶颈时想到树脂满了,险些走火入魔，丧失了` + (need_exp) * 0.2 + "修为");
                return;
            }
            else if (bad_time > 0.7) {
                await Add_experience(usr_qq, -1 * need_exp * 0.1);
                await redis.set("xiuxian:player:" + usr_qq + ":last_Levelup_time", now_time);//获得上次的时间戳
                e.reply(`突破瓶颈时想起背后是药园，刚种下掣电树种子，不能被破坏了，打断突破，嘴角流血，丧失了` + (need_exp) * 0.1 + "修为");
                return;
            }
            else if (bad_time > 0.1) {
                await redis.set("xiuxian:player:" + usr_qq + ":last_Levelup_time", now_time);//获得上次的时间戳
                e.reply(`憋红了脸，境界突破失败,等到${Time}分钟后再尝试吧`);
                return;
            }
            else {
                await Add_experience(usr_qq, -1 * need_exp * 0.2);
                await redis.set("xiuxian:player:" + usr_qq + ":last_Levelup_time", now_time);//获得上次的时间戳
                e.reply(`突破瓶颈时想起怡红院里的放肆,想起了金银坊里的狂热,险些走火入魔，丧失了` + (need_exp) * 0.2 + "修为");
                return;
            }
        }
        player.level_id = now_level_id + 1;
        player.experience -= need_exp;
        await Write_player(usr_qq, player);
        let equipment = await Read_equipment(usr_qq);
        await Write_equipment(usr_qq, equipment);
        await Add_HP(usr_qq, 99999999);
        let level = data.Level_list.find(item => item.level_id == player.level_id).level;
        e.reply(`突破成功,当前境界为${level}`);
        await redis.set("xiuxian:player:" + usr_qq + ":last_Levelup_time", now_time);
        return;
    }



    //渡劫
    async fate_up(e) {
        let good=await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let player = await Read_player(usr_qq);
        let now_level = data.Level_list.find(item => item.level_id == player.level_id).level;
        if (now_level != "渡劫期") {
            e.reply(`你非渡劫期修士！`);
            return;
        }
        if (player.power_place == 0) {
            e.reply("你已度过雷劫，请感应仙门#羽化登仙");
            return;
        }
        let now_HP = player.nowblood;
        let list_HP = data.Level_list.find(item => item.level == now_level).基础血量;
        if (now_HP < list_HP * 0.9) {
            player.nowblood = 1;
            await Write_player(usr_qq, player);
            e.reply(player.name + "血量亏损，强行渡劫后晕倒在地！");
            return;
        }
        let now_level_id = data.Level_list.find(item => item.level == now_level).level_id;
        if (now_level_id == 54) {
            e.reply(`您已是此界凡人`);
            return;
        }
        let now_exp = player.experience;
        let need_exp;
        try {
            need_exp = data.Level_list.find(item => item.level == now_level).exp;
        }
        catch {
            need_exp = data.Level_list.find(item => item.level_id == now_level_id).exp;
        }
        if (now_exp < need_exp) {
            e.reply(`修为不足,再积累${need_exp - now_exp}修为后方可突破`);
            return;
        }
        let x = await dujie(usr_qq);
        var y = 3;
        var n = 1380;//最低
        var p = 280;//变动
        var m = n + p;
        if (x <= n) {
            player.nowblood = 0;
            player.experience -= parseInt(need_exp / 4);
            await Write_player(usr_qq, player);
            e.reply("天空一声巨响，未降下雷劫，就被天道的气势震死了。");
            return;
        }
        var l = (x - n) / (p + y * 0.1);
        l = l * 100;
        l = l.toFixed(2);
        e.reply("天道：就你，也敢逆天改命？");
        e.reply("[" + player.name + "]" + "\n雷抗：" + x + "\n成功率：" + l + "\n需渡" + y + "道雷劫\n将在一分钟后落下\n[温馨提示]\n请把其他渡劫期打死后再渡劫！");
        var time = 60;//时间(分)九个雷，//60分钟。防延迟。
        let action_time = 60000 * time;//持续时间，单位毫秒
        let arr = {
            "action": "渡劫",//动作
            "end_time": new Date().getTime() + action_time,//结束时间
            "time": action_time,//持续时间
            "shutup": "1",//闭关状态-关闭
            "working": "1",//降妖状态-关闭
            "Place_action": "1",//秘境状态---关闭
            "Place_actionplus": "1",//沉迷---关闭
            "power_up": "0",//渡劫状态--开启
            ///以下都不是基础字段
            "power_Grade": y,//雷等级，也就是最多次数限制
            "power_n": n,//雷畸变最小区间
            "power_m": m,//雷畸变最大区间
        };
        if (e.isGroup) {
            arr.group_id = e.group_id
        }
        redis.set("xiuxian:player:" + usr_qq + ":power_aconut", 1);
        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));
        return;
    }



    //#羽化登仙
    async Level_up_Max(e) {
        let good=await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let player = await Read_player(usr_qq);
        let now_level = data.Level_list.find(item => item.level_id == player.level_id).level;
        if (now_level != "渡劫期") {
            e.reply(`你非渡劫期修士！`);
            return;
        }
        if (player.power_place != 0) {
            e.reply("请先渡劫！");
            return;
        }
        let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        let now_exp = player.experience;
        let need_exp = data.Level_list.find(item => item.level_id == player.level_id).exp;
        if (now_exp < need_exp) {
            e.reply(`修为不足,再积累${need_exp - now_exp}修为后方可成仙！`);
            return;
        }
        if (player.power_place == 0) {
            e.reply("天空一声巨响，一道虚影从眼中浮现，突然身体微微颤抖，似乎感受到了什么，" + player.name + "来不及思索，立即向前飞去！只见万物仰头相望，似乎感觉到了，也似乎没有感觉，殊不知......");
            now_level_id = now_level_id + 1;
            player.level_id = now_level_id;
            player.experience -= need_exp;
            await Write_player(usr_qq, player);
            let equipment = await Read_equipment(usr_qq);
            await Write_equipment(usr_qq, equipment);
            await Add_HP(usr_qq, 99999999);
            return;
        }
        return;
    }
}


export async function dujie(user_qq) {
    let usr_qq = user_qq;
    let player = await Read_player(usr_qq);
    var new_blood = player.nowblood;
    var new_defense = player.nowdefense; 
    var new_attack = player.nowattack;
    new_blood = new_blood / 100000;
    new_defense = new_defense / 100000;
    new_attack = new_attack / 100000;
    new_blood = (new_blood * 4) / 10;
    new_defense = (new_defense * 6) / 10;
    new_attack = (new_attack * 2) / 10;
    var N = new_blood + new_defense;
    var x = N * new_attack;
    x = x.toFixed(2);
    return x;
}

/**
 * 
 * 查找是否有凡人
 */

export async function fanren() {
    let playerList = [];
    let files = fs
        .readdirSync(__PATH.player)
        .filter((file) => file.endsWith(".json"));
    for (let file of files) {
        file = file.replace(".json", "");
        playerList.push(file);
    }
    let x = "1";
    for (let player_id of playerList) {
        let player = data.getData("player", player_id);
        let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id == 54) {
            x = "0";
        }
    }
    return x;
}