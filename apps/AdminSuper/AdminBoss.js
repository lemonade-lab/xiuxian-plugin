
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
let xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
export class AdminBoss extends plugin {
    constructor() {
        super({
            name: "AdminBoss",
            dsc: "AdminBoss",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: '^#放出怪物$',
                    fnc: 'OpenBoss'
                },
                {
                    reg: '^#关上怪物$',
                    fnc: 'DeleteBoss'
                }
            ],
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }


    async DeleteBoss(e) {
        if (!e.isMaster) {
            return;
        }
        await offmonster();
        e.reply("关闭成功");
        return;
    }

    async OpenBoss(e) {
        if (!e.isMaster) {
            return;
        }
        await monster();
        e.reply("开启成功");
        return;
    }


  
}


export async function monster() {
    let User_maxplus = 1;
        User_maxplus = Number(User_maxplus);
        let User_max = 1;
        User_max = Number(User_max);
        let User_mini = 1;
        User_mini = Number(User_mini);
        let playerList = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let usr_qq = player_id;
            let player = await Xiuxian.Read_player(usr_qq);
            let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;

            if (now_level_id >= 42) {
                User_maxplus++;
            }
            else if (now_level_id > 21 && now_level_id < 42) {
                User_max++;
            }
            else {
                User_mini++;
            }
        }
        let money = 1000 *xiuxianConfigData.Boss.Boss;
        let attack = money * 2;
        let defense = money * 2;
        let blood = money * 2;
        if (User_maxplus >= 30) {
            User_maxplus = 30;
        }
        await redis.set("BossMaxplus", 1);
        if (User_maxplus != 1) {
            let BossMaxplus = {
                "name": "魔王",
                "nowattack": attack * User_maxplus * 3,
                "nowdefense": defense * User_maxplus * 3,
                "nowblood": blood * User_maxplus * 3,
                "speed":User_maxplus,
                "burst": "0.7",
                "bursthurt": 3,
                "money": money * User_maxplus * 3
            };
            await redis.set("xiuxian:BossMaxplus", JSON.stringify(BossMaxplus));
            await redis.set("BossMaxplus", 0);
        }
        if (User_max >= 25) {
            User_max = 25;
        }
        await redis.set("BossMax", 1);
        if (User_max != 1) {
            let BossMax = {
                "name": "金角大王",
                "nowattack": attack * User_max * 2,
                "nowdefense": defense * User_max * 2,
                "nowblood": blood * User_max * 2,
                "speed":User_max,
                "burst": "0.5",
                "bursthurt": 2,
                "money": money * User_max * 2
            };
            await redis.set("xiuxian:BossMax", JSON.stringify(BossMax));
            await redis.set("BossMax", 0);
        }
        if (User_mini >= 20) {
            User_mini = 20;
        }
        await redis.set("BossMini", 1);
        if (User_mini != 1) {
            let BossMini = {
                "name": "银角大王",
                "nowattack": attack * User_mini * 2,
                "nowdefense": defense * User_mini * 2, 
                "nowblood": blood * User_mini * 2,
                "speed":User_mini,
                "burst": "0.3",
                "bursthurt": 2,
                "money": money * User_mini * 2
            };
            await redis.set("xiuxian:BossMini", JSON.stringify(BossMini));
            await redis.set("BossMini", 0);
        }
    return;
}



export async function offmonster() {
    await redis.set("BossMaxplus", 1);
    await redis.del("BossMaxplus");
    await redis.set("BossMax", 1);
    await redis.del("BossMax");
    await redis.set("BossMini", 1);
    await redis.del("BossMini");
    return;
}
