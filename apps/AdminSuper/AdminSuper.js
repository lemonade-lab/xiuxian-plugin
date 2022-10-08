
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
/**
 * 全局变量
 */
let xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
/**
 * 修仙设置
 */
export class AdminSuper extends plugin {
    constructor() {
        super({
            name: "AdminSuper",
            dsc: "AdminSuper",
            event: "message",
            priority: 100,
            rule: [
                {
                    reg: "^#同步信息$",
                    fnc: "synchronization",
                },
                {
                    reg: "^#解封.*$",
                    fnc: "relieve",
                },
                {
                    reg: "^#解除所有$",
                    fnc: "Allrelieve",
                },
                {
                    reg: "^#打落凡间.*$",
                    fnc: "Knockdown",
                },
                {
                    reg: "^#清除冲水堂$",
                    fnc: "Deleteexchange",
                },
                {
                    reg: '^#清除.*$',
                    fnc: 'Deletepurchase'
                },
                {
                    reg: '^#放出怪物$',
                    fnc: 'OpenBoss'
                },
                {
                    reg: '^#关上怪物$',
                    fnc: 'DeleteBoss'
                },
                {
                    reg: '^#打扫客栈$',
                    fnc: 'DeleteForum'
                },
                {
                    reg: '^#修仙世界$',
                    fnc: 'Worldstatistics'
                },
                {
                    reg: '^#删除世界$',
                    fnc: 'deleteallusers'
                }
            ],
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }
    async deleteallusers(e){
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        e.reply("开始崩碎世界");
        let playerList = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            fs.rmSync(`${Xiuxian.__PATH.player}/${player_id}.json`);
            fs.rmSync(`${Xiuxian.__PATH.equipment}/${player_id}.json`);
            fs.rmSync(`${Xiuxian.__PATH.najie}/${player_id}.json`);
            await Xiuxian.offaction(player_id);
        }
        e.reply("世界已崩碎");
        return;
    }





    async synchronization(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        e.reply("开始同步");
        let playerList = [];
        let x = 0;
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let usr_qq = player_id;
            let equipment = await Xiuxian.Read_equipment(usr_qq);
            await Xiuxian.Write_equipment(usr_qq, equipment);
        }
        e.reply("同步结束");
        return;
    }

    async Worldstatistics(e) {
        if (!e.isGroup) {
            return;
        }
        if (!e.isMaster) {
            return;
        }
        let acount = 0;
        let lower = 0;
        let senior = 0;
        lower = Number(lower);
        senior = Number(senior);
        let playerList = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let player = await Xiuxian.Read_player(player_id);
            let now_level_id;
            now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
            if (now_level_id <= 41) {
                lower++;
            }
            else {
                senior++;
            }
            acount++;
        }
        let msg = [];
        var Worldmoney = await redis.get("Xiuxian:Worldmoney");
        if (Worldmoney == null || Worldmoney == undefined || Worldmoney <= 0 || Worldmoney == NaN) {
            Worldmoney = 1;
        }
        Worldmoney = Number(Worldmoney);
        if (Worldmoney < 10000) {
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数：" + acount +
                "\n修道者：" + senior +
                "\n修仙者：" + lower +
                "\n财富：" + Worldmoney +
                "\n人均：" + (Worldmoney / acount).toFixed(3)
            ];
        }
        else if (Worldmoney > 10000 && Worldmoney < 1000000) {
            Worldmoney = Worldmoney / 10000;
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数：" + acount +
                "\n修道者：" + senior +
                "\n修仙者：" + lower +
                "\n财富：" + Worldmoney + "万" +
                "\n人均：" + (Worldmoney / acount).toFixed(3) + "万"
            ];
        }
        else if (Worldmoney > 1000000 && Worldmoney < 100000000) {
            Worldmoney = Worldmoney / 1000000;
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数：" + acount +
                "\n修道者：" + senior +
                "\n修仙者：" + lower +
                "\n财富：" + Worldmoney + "百万" +
                "\n人均：" + (Worldmoney / acount).toFixed(3) + "百万"
            ];
        }
        else if (Worldmoney > 100000000) {
            Worldmoney = Worldmoney / 100000000;
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数：" + acount +
                "\n修道者：" + senior +
                "\n修仙者：" + lower +
                "\n财富：" + Worldmoney + "亿" +
                "\n人均：" + (Worldmoney / acount).toFixed(3) + "亿"
            ];
        }
        await Xiuxian.ForwardMsg(e, msg);
        return;
    }

    async DeleteForum(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        let Forum = await Xiuxian.Read_Forum();
        for (var i = 0; i < Forum.length; i++) {
            Forum = Forum.filter(item => item.qq != Forum[i].qq);
            Xiuxian.Write_Forum(Forum);
        }
        e.reply("已清理！");
        return;
    }

    async DeleteBoss(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
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
        if (!e.isGroup) {
            return;
        }
        await monster();
        e.reply("开启成功");
        return;
    }


    async Deletepurchase(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        let thingqq = e.msg.replace("#", '');
        thingqq = thingqq.replace("清除", '');
        if (thingqq == "") {
            return;
        }
        let x = 888888888;
        let Exchange  = await Xiuxian.Read_Exchange();
        for (var i = 0; i < Exchange.length; i++) {
            if (Exchange[i].qq == thingqq) {
                x = i;
                break;
            }
        }
        if (x == 888888888) {
            e.reply("找不到该商品编号！");
            return;
        }
        Exchange = Exchange.filter(item => item.qq != thingqq);
        await Xiuxian.Write_Exchange(Exchange);
        await redis.set("xiuxian:player:" + thingqq + ":Exchange", 0);
        e.reply("清除" + thingqq);
        return;
    }


    async Deleteexchange(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        e.reply("开始清除！");
        let Exchange  = await Xiuxian.Read_Exchange();
        for (var i = 0; i < Exchange.length; i++) {
            Exchange = Exchange.filter(item => item.qq != Exchange[i].qq);
            Xiuxian.Write_Exchange(Exchange);
        }
        let playerList = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            await redis.set("xiuxian:player:" + player_id + ":Exchange", 0);
        }
        e.reply("清除完成！");
        return;
    }


    async Allrelieve(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        e.reply("开始行动！");
        let playerList = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            await Xiuxian.offaction(player_id);
        }
        e.reply("行动结束！");
    }


    async relieve(e) {
        if (!e.isMaster) {
            return;
        }
        let qq=await Xiuxian.At(e);
        if(qq==0){
            return;
        }
        await Xiuxian.offaction(qq);
        e.reply("执行结束");
        return;
    }

    async Knockdown(e) {
        if (!e.isMaster) {
            return;
        }
        let qq=await Xiuxian.At(e);
        if(qq==0){
            return;
        }
        let player = await Xiuxian.Read_player(qq);
        player.power_place = 1;
        await Xiuxian.Write_player(usr_qq, player);
        e.reply("已打落凡间！");
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
                "attack": attack * User_maxplus * 3,
                "defense": defense * User_maxplus * 3,
                "blood": blood * User_maxplus * 3,
                "probability": "0.7",
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
                "attack": attack * User_max * 2,
                "defense": defense * User_max * 2,
                "blood": blood * User_max * 2,
                "probability": "0.5",
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
                "attack": attack * User_mini,
                "defense": defense * User_mini,
                "blood": blood * User_mini,
                "probability": "0.3",
                "money": money * User_mini
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
