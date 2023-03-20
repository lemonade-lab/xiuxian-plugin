import { plugin } from '../../api/api.js'
import fs from "fs"
import data from '../../model/xiuxiandata.js'
import config from "../../model/config.js"
import { get_player_img } from '../../model/information.js'
import { AppName } from '../../app.config.js'
import {
    Read_player,
    existplayer,
    isNotNull,
    Write_player,
    Read_equipment,
    Write_equipment,
    ForwardMsg,
    Read_forum,
    Write_forum,
    Read_exchange,
    Write_exchange
} from '../../model/xiuxian.js'

export class adminsuper extends plugin {
    constructor() {
        super({
            name: "adminsuper",
            dsc: "adminsuper",
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
                    fnc: 'Deleteforum'
                },
                {
                    reg: '^#修仙世界$',
                    fnc: 'Worldstatistics'
                }
            ],
        });
    }


    async synchronization(e) {
        if (!e.isMaster) return
        if (!e.isGroup) return

        e.reply("开始同步");

        let playerList = [];
        let files = fs
            .readdirSync("./plugins/" + AppName + "/resources/data/xiuxian_player")
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {

            let usr_qq = player_id;
            let player = await data.getData("player", usr_qq);

            if (!isNotNull(player.level_id)) {
                e.reply("版本升级错误！重装吧，旧版本不支持1.1.6版本之前的存档升级！")
                return;
            }

            //删
            if (isNotNull(player.境界)) {
                player.境界 = undefined;
            }
            if (isNotNull(player.基础血量)) {
                player.基础血量 = undefined;
            }
            if (isNotNull(player.基础防御)) {
                player.基础防御 = undefined;
            }
            if (isNotNull(player.基础攻击)) {
                player.基础攻击 = undefined;
            }
            if (isNotNull(player.基础暴击)) {
                player.基础暴击 = undefined;
            }
            if (isNotNull(player.now_level_id)) {
                player.now_level_id = undefined;
            }

            //补

            if (!isNotNull(player.Physique_id)) {
                player.Physique_id = 1;
            }
            if (!isNotNull(player.血气)) {
                player.血气 = 1;
            }
            if (!isNotNull(player.linggen)) {
                player.linggen = [];
            }
            if (!isNotNull(player.linggenshow)) {
                player.linggenshow = 1;
            }
            if (!isNotNull(player.power_place)) {
                player.power_place = 1;
            }
            if (!isNotNull(player.occupation)) {
                player.occupation = [];
            }


            //重新根据id去重置仙门
            let now_level_id = await data.level_list.find(item => item.level_id == player.level_id).level_id;
            if (now_level_id < 42) {
                player.power_place = 1;
            } else {
                player.power_place = 0;
            }

            await Write_player(usr_qq, player);
            //更新面板
            let equipment = await Read_equipment(usr_qq);
            await Write_equipment(usr_qq, equipment); 0

        }

        e.reply("同步结束");
        return;
    }

    async Worldstatistics(e) {
        if (!e.isGroup) return
        if (!e.isMaster) return
        let acount = 0;
        let lower = 0;
        let senior = 0;
        lower = Number(lower);
        senior = Number(senior);
        //获取缓存中人物列表
        let playerList = [];
        let files = fs
            .readdirSync("./plugins/" + AppName + "/resources/data/xiuxian_player")
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let player = await Read_player(player_id);
            let now_level_id;
            if (!isNotNull(player.level_id)) {
                e.reply("请先#同步信息");
                return;
            }
            now_level_id = data.level_list.find(item => item.level_id == player.level_id).level_id;
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
                "\n人数:" + acount +
                "\n修道者:" + senior +
                "\n修仙者:" + lower +
                "\n财富:" + Worldmoney +
                "\n人均:" + (Worldmoney / acount).toFixed(3)
            ];
        }
        else if (Worldmoney > 10000 && Worldmoney < 1000000) {
            Worldmoney = Worldmoney / 10000;
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数:" + acount +
                "\n修道者:" + senior +
                "\n修仙者:" + lower +
                "\n财富:" + Worldmoney + "万" +
                "\n人均:" + (Worldmoney / acount).toFixed(3) + "万"
            ];
        }
        else if (Worldmoney > 1000000 && Worldmoney < 100000000) {
            Worldmoney = Worldmoney / 1000000;
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数:" + acount +
                "\n修道者:" + senior +
                "\n修仙者:" + lower +
                "\n财富:" + Worldmoney + "百万" +
                "\n人均:" + (Worldmoney / acount).toFixed(3) + "百万"
            ];
        }
        else if (Worldmoney > 100000000) {
            Worldmoney = Worldmoney / 100000000;
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数:" + acount +
                "\n修道者:" + senior +
                "\n修仙者:" + lower +
                "\n财富:" + Worldmoney + "亿" +
                "\n人均:" + (Worldmoney / acount).toFixed(3) + "亿"
            ];
        }
        await ForwardMsg(e, msg);
        return;
    }



    async Deleteforum(e) {
        if (!e.isMaster) return
        if (!e.isGroup) return
        let forum;
        try {
            forum = await Read_forum();
        }
        catch {
            await Write_forum([]);
            forum = await Read_forum();
        }
        for (var i = 0; i < forum.length; i++) {
            forum = forum.filter(item => item.qq != forum[i].qq);
            Write_forum(forum);
        }
        e.reply("已清理！");
        return;
    }

    async DeleteBoss(e) {
        if (!e.isMaster) return
        if (!e.isGroup) return
        //boss分为金角大王、银角大王、魔王
        //魔王boss
        await redis.set("BossMaxplus", 1);
        await redis.del("BossMaxplus");
        //金角大王
        await redis.set("BossMax", 1);
        await redis.del("BossMax");
        //银角大王
        await redis.set("BossMini", 1);
        await redis.del("BossMini");
        e.reply("关闭成功");
        return;
    }

    async OpenBoss(e) {
        if (!e.isMaster) return
        if (!e.isGroup) return
        let User_maxplus = 1;//所有仙人数
        User_maxplus = Number(User_maxplus);
        let User_max = 1;//所有高段
        User_max = Number(User_max);
        let User_mini = 1;//所有低段
        User_mini = Number(User_mini);
        let playerList = [];
        let files = fs
            .readdirSync("./plugins/" + AppName + "/resources/data/xiuxian_player")
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let usr_qq = player_id;
            //读取信息
            let player = await Read_player(usr_qq);
            let now_level_id;
            if (!isNotNull(player.level_id)) {
                return;
            }
            now_level_id = data.level_list.find(item => item.level_id == player.level_id).level_id;

            if (now_level_id > 41) {
                User_maxplus++;
            }
            else if (now_level_id > 21 && now_level_id <= 41) {
                User_max++;
            }
            else {
                User_mini++;
            }
        }
        //打一下多少灵石
        //魔王初始化
        let money = 1000 * config.getconfig("xiuxian", "xiuxian").Boss.Boss;
        let attack = money * 2;
        let defense = money * 2;
        let blood = money * 2;
        //限制最高人数
        if (User_maxplus >= 30) {
            User_maxplus = 30;
        }
        //这里判断一下，为1就不丢数据了。
        await redis.set("BossMaxplus", 1);
        if (User_maxplus != 1) {
            //初始化属性
            let BossMaxplus = {
                "name": "魔王",
                "attack": attack * User_maxplus * 3,
                "defense": defense * User_maxplus * 3,
                "blood": blood * User_maxplus * 3,
                "probability": "0.7",
                "money": money * User_maxplus * 3
            };
            //redis初始化
            await redis.set("xiuxian:BossMaxplus", JSON.stringify(BossMaxplus));
            await redis.set("BossMaxplus", 0);
        }
        if (User_max >= 25) {
            User_max = 25;
        }
        await redis.set("BossMax", 1);
        if (User_max != 1) {
            //初始化属性
            let BossMax = {
                "name": "金角大王",
                "attack": attack * User_max * 2,
                "defense": defense * User_max * 2,
                "blood": blood * User_max * 2,
                "probability": "0.5",
                "money": money * User_max * 2
            };
            //redis初始化
            await redis.set("xiuxian:BossMax", JSON.stringify(BossMax));
            //金角大王
            await redis.set("BossMax", 0);
        }
        if (User_mini >= 20) {
            User_mini = 20;
        }
        await redis.set("BossMini", 1);
        if (User_mini != 1) {
            //初始化属性
            let BossMini = {
                "name": "银角大王",
                "attack": attack * User_mini,
                "defense": defense * User_mini,
                "blood": blood * User_mini,
                "probability": "0.3",
                "money": money * User_mini
            };
            //redis初始化
            await redis.set("xiuxian:BossMini", JSON.stringify(BossMini));
            //银角大王
            await redis.set("BossMini", 0);
        }
        e.reply("开启成功");
        return;
    }


    async Deletepurchase(e) {
        if (!e.isMaster) return
        if (!e.isGroup) return

        let thingqq = e.msg.replace("#", '');
        //拿到物品与数量
        thingqq = thingqq.replace("清除", '');
        if (thingqq == "") {
            return;
        }

        let x = 888888888;
        //根据物品的qq主人来购买
        let exchange;
        try {
            exchange = await Read_exchange();
        }
        catch {
            //没有表要先建立一个！
            await Write_exchange([]);
            exchange = await Read_exchange();
        }
        for (var i = 0; i < exchange.length; i++) {
            //对比编号
            if (exchange[i].qq == thingqq) {
                x = i;
                break;
            }
        }

        if (x == 888888888) {
            e.reply("找不到该商品编号！");
            return;
        }
        //删除该位置信息
        exchange = exchange.filter(item => item.qq != thingqq);
        await Write_exchange(exchange);
        //改状态
        await redis.set("xiuxian:player:" + thingqq + ":exchange", 0);
        e.reply("清除" + thingqq);
        return;
    }


    async Deleteexchange(e) {
        if (!e.isMaster) return
        if (!e.isGroup) return
        e.reply("开始清除！");
        let exchange;
        try {
            exchange = await Read_exchange();
        }
        catch {
            //没有表要先建立一个！
            await Write_exchange([]);
            exchange = await Read_exchange();
        }
        for (var i = 0; i < exchange.length; i++) {
            //自我清除
            exchange = exchange.filter(item => item.qq != exchange[i].qq);
            Write_exchange(exchange);
        }
        //遍历所有人，清除redis
        let playerList = [];
        let files = fs
            .readdirSync("./plugins/" + AppName + "/resources/data/xiuxian_player")
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            await redis.set("xiuxian:player:" + player_id + ":exchange", 0);
        }
        e.reply("清除完成！");
        return;
    }


    //#我的信息
    async Show_player(e) {
        let usr_qq = e.user_id;
        //有无存档
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        //不开放私聊功能
        if (!e.isGroup) {
            e.reply("此功能暂时不开放私聊");
            return;
        }
        let img = await get_player_img(e);
        e.reply(img);
        return;
    }



    async Allrelieve(e) {
        if (!e.isMaster) return
        if (!e.isGroup) return
        e.reply("开始行动！");
        let playerList = [];
        let files = fs
            .readdirSync("./plugins/" + AppName + "/resources/data/xiuxian_player")
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            //清除游戏状态
            await redis.set("xiuxian:player:" + player_id + ":game_action", 1);
            let action = await redis.get("xiuxian:player:" + player_id + ":action");
            action = JSON.parse(action);
            //不为空，存在动作
            if (action != null) {
                await redis.del("xiuxian:player:" + player_id + ":action");
                let arr = action;
                arr.is_jiesuan = 1;//结算状态
                arr.shutup = 1;//闭关状态
                arr.working = 1;//降妖状态
                arr.power_up = 1;//渡劫状态
                arr.Place_action = 1;//秘境
                arr.Place_actionplus = 1;//沉迷状态
                arr.end_time = new Date().getTime();//结束的时间也修改为当前时间
                delete arr.group_id;//结算完去除group_id
                await redis.set("xiuxian:player:" + player_id + ":action", JSON.stringify(arr));
            }
        }
        e.reply("行动结束！");
    }




    async relieve(e) {
        if (!e.isMaster) return
        if (!e.isGroup) return
        //没有at信息直接返回,不执行
        let isat = e.message.some((item) => item.type === "at");
        if (!isat) {
            return;
        }
        //获取at信息
        let atItem = e.message.filter((item) => item.type === "at");
        //对方qq
        let qq = atItem[0].qq;
        //检查存档
        let ifexistplay = await existplayer(qq);
        if (!ifexistplay) {
            return;
        }

        //清除游戏状态
        await redis.set("xiuxian:player:" + qq + ":game_action", 1);
        //查询redis中的人物动作
        let action = await redis.get("xiuxian:player:" + qq + ":action");
        action = JSON.parse(action);
        //不为空，有状态
        if (action != null) {
            //把状态都关了
            let arr = action;
            arr.is_jiesuan = 1;//结算状态
            arr.shutup = 1;//闭关状态
            arr.working = 1;//降妖状态
            arr.power_up = 1;//渡劫状态
            arr.Place_action = 1;//秘境
            arr.Place_actionplus = 1;//沉迷状态
            arr.end_time = new Date().getTime();//结束的时间也修改为当前时间
            delete arr.group_id;//结算完去除group_id
            await redis.set("xiuxian:player:" + qq + ":action", JSON.stringify(arr));
            e.reply("已解除！");
            return;
        }
        //是空的
        e.reply("不需要解除！");
        return;
    }

    async Knockdown(e) {
        if (!e.isMaster) return
        if (!e.isGroup) return
        //没有at信息直接返回,不执行
        let isat = e.message.some((item) => item.type === "at");
        if (!isat) {
            return;
        }
        //获取at信息
        let atItem = e.message.filter((item) => item.type === "at");
        //对方qq
        let qq = atItem[0].qq;
        //检查存档
        let ifexistplay = await existplayer(qq);
        if (!ifexistplay) {
            e.reply("没存档你打个锤子！");
            return;
        }

        let player = await Read_player(qq);
        if (!isNotNull(player.power_place)) {
            e.reply("请#同步信息");
            return;
        }

        player.power_place = 1;
        e.reply("已打落凡间！");
        await Write_player(usr_qq, player);
        return;
    }
}