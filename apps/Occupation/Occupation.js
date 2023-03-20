//插件加载
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fs from "fs"
import {
    existplayer, Write_player, isNotNull, exist_najie_thing, Add_najie_thing, Add_职业经验, Add_灵石, sleep, ForwardMsg,
    convert2integer
} from '../Xiuxian/xiuxian.js'
import { Read_player, __PATH, Read_danyao } from '../Xiuxian/xiuxian.js'
import Show from "../../model/show.js"
import puppeteer from "../../../../lib/puppeteer/puppeteer.js"
import { segment } from "oicq"
import { zd_battle } from "../Battle/Battle.js"
/**
 * 全局变量
 */
/**
 * 境界模块
 */
let allaction = false;
export class Occupation extends plugin {
    constructor() {
        super({
            name: 'Yunzai_Bot_Occupation',
            dsc: '修仙模块',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#转职.*$',
                    fnc: 'chose_occupation'
                },
                {
                    reg: '^#转换副职$',
                    fnc: 'chose_occupation2'
                },
                {
                    reg: '^#猎户转.*$',
                    fnc: 'zhuanzhi'
                },
                {
                    reg: '(^#采药$)|(^#采药(.*)(分|分钟)$)',
                    fnc: 'plant'
                },
                {
                    reg: '^#结束采药$',
                    fnc: 'plant_back'
                },
                {
                    reg: '(^#采矿$)|(^#采矿(.*)(分|分钟)$)',
                    fnc: 'mine'
                },
                {
                    reg: '^#结束采矿$',
                    fnc: 'mine_back'
                },
                {
                    reg: '^#丹药配方$',
                    fnc: 'show_danfang'
                },
                {
                    reg: '^#我的药效$',
                    fnc: 'yaoxiao',
                },
                {
                    reg: '^#装备图纸$',
                    fnc: 'show_tuzhi'
                },
                {
                    reg: '^#炼制.*(\\*[0-9]*)?$',
                    fnc: 'liandan'
                },
                {
                    reg: '^#打造.*(\\*[0-9]*)?$',
                    fnc: 'lianqi'
                },
                {
                    reg: '^#悬赏目标$',
                    fnc: 'search_sb'
                },
                {
                    reg: '^#讨伐目标.*$',
                    fnc: 'taofa_sb'
                },
                {
                    reg: '^#悬赏.*$',
                    fnc: 'xuanshang_sb'
                },
                {
                    reg: '^#赏金榜$',
                    fnc: 'shangjingbang'
                },
                {
                    reg: '^#刺杀目标.*$',
                    fnc: 'cisha_sb'
                },
                {
                    reg: '^#清空赏金榜$',
                    fnc: 'qingchushangjinbang'
                }
            ]
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }
    async zhuanzhi(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = await Read_player(usr_qq);
        if (player.occupation != "猎户") {
            e.reply("你不是猎户,无法自选职业");
            return;
        }
        let occupation = e.msg.replace("#猎户转", "");
        let x = data.occupation_list.find(item => item.name == occupation);
        if (!isNotNull(x)) {
            e.reply(`没有[${occupation}]这项职业`);
            return;
        }
        player.occupation = occupation;
        await Write_player(usr_qq, player);
        e.reply(`恭喜${player.名号}转职为[${occupation}]`);
        return;
    }
    async chose_occupation(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        await Go(e);
        if (!allaction) {
            return;
        }
        allaction = false;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }

        let occupation = e.msg.replace("#转职", "");
        let player = await Read_player(usr_qq);
        let player_occupation = player.occupation;
        let x = data.occupation_list.find(item => item.name == occupation);
        if (!isNotNull(x)) {
            e.reply(`没有[${occupation}]这项职业`);
            return;
        }
        let now_level_id
        now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 17 && occupation == "采矿师") {
            e.reply("包工头:就你这小身板还来挖矿？再去修炼几年吧")
            return
        }
        let thing_name = occupation + "转职凭证"
        let thing_class = "道具"
        let n = -1
        let thing_quantity = await exist_najie_thing(usr_qq, thing_name, thing_class);
        if (!thing_quantity) {//没有
            e.reply(`你没有【${thing_name}】`);
            return;
        }
        if (player_occupation == occupation) {
            e.reply(`你已经是[${player_occupation}]了，可使用[职业转化凭证]重新转职`);
            return;
        }
        await Add_najie_thing(usr_qq, thing_name, thing_class, n);
        if (player.occupation.length == 0) {
            player.occupation = occupation;
            player.occupation_level = 1;
            player.occupation_exp = 0;
            await Write_player(usr_qq, player);
            e.reply(`恭喜${player.名号}转职为[${occupation}]`);
            return;
        }
        let action = await redis.get("xiuxian:player:" + usr_qq + ":fuzhi");//副职
        action = await JSON.parse(action);
        if (action == null) {
            action = [];
        }
        var arr = {
            职业名: player.occupation,
            职业经验: player.occupation_exp,
            职业等级: player.occupation_level,
        }
        action = arr;
        await redis.set("xiuxian:player:" + usr_qq + ":fuzhi", JSON.stringify(action));
        player.occupation = occupation;
        player.occupation_level = 1;
        player.occupation_exp = 0;
        await Write_player(usr_qq, player);
        e.reply(`恭喜${player.名号}转职为[${occupation}],您的副职为${arr.职业名}`);
        return;
    }
    async chose_occupation2(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        await Go(e);
        if (!allaction) {
            return;
        }
        allaction = false;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }

        let player = await Read_player(usr_qq);
        let action = await redis.get("xiuxian:player:" + usr_qq + ":fuzhi");//副职
        action = await JSON.parse(action);
        if (action == null) {
            action = [];
            e.reply(`您还没有副职哦`);
            return;
        }
        let a, b, c;
        a = action.职业名;
        b = action.职业经验;
        c = action.职业等级;
        action.职业名 = player.occupation;
        action.职业经验 = player.occupation_exp;
        action.职业等级 = player.occupation_level;
        player.occupation = a;
        player.occupation_exp = b;
        player.occupation_level = c;
        await redis.set("xiuxian:player:" + usr_qq + ":fuzhi", JSON.stringify(action));
        await Write_player(usr_qq, player);
        e.reply(`恭喜${player.名号}转职为[${player.occupation}],您的副职为${action.职业名}`);
        return;
    }

    async plant(e) {
        let usr_qq = e.user_id;//用户qq
        //有无存档
        if (!await existplayer(usr_qq)) {
            return;
        }
        //不开放私聊
        if (!e.isGroup) {
            return;
        }
        //获取游戏状态
        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
        //防止继续其他娱乐行为
        if (game_action == 0) {
            e.reply("修仙：游戏进行中...");
            return;
        }
        let player = await Read_player(usr_qq);
        if (player.occupation != "采药师") {
            e.reply("您采药，您配吗?")
            return
        }
        //获取时间
        let time = e.msg.replace("#采药", "");
        time = time.replace("分钟", "");
        if (parseInt(time) == parseInt(time)) {
            time = parseInt(time);
            var y = 15;//时间
            var x = 48;//循环次数
            //如果是 >=16*33 ----   >=30
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            //如果<30，修正。
            if (time < 30) {
                time = 30;
            }
        }
        else {
            //不设置时间默认30分钟
            time = 30;
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
                e.reply("正在" + action.action + "中，剩余时间:" + m + "分" + s + "秒");
                return;
            }
        }

        let action_time = time * 60 * 1000;//持续时间，单位毫秒
        let arr = {
            "action": "采药",//动作
            "end_time": new Date().getTime() + action_time,//结束时间
            "time": action_time,//持续时间
            "plant": "0",//采药-开启
            "shutup": "1",//闭关状态-开启
            "working": "1",//降妖状态-关闭
            "Place_action": "1",//秘境状态---关闭
            "Place_actionplus": "1",//沉迷---关闭
            "power_up": "1",//渡劫状态--关闭
            "mojie": "1",//魔界状态---关闭
            "xijie": "1", //洗劫状态开启
            "mine": "1",//采矿-开启

        };
        if (e.isGroup) {
            arr.group_id = e.group_id
        }

        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));//redis设置动作
        e.reply(`现在开始采药${time}分钟`);

        return true;
    }

    async qingchushangjinbang(e) {
        if (!e.isMaster) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let action = await redis.get("xiuxian:player:" + 1 + ":shangjing");
        action = await JSON.parse(action);
        action = null;
        e.reply("清除完成")
        await redis.set("xiuxian:player:" + 1 + ":shangjing", JSON.stringify(action));
        return;
    }

    async plant_back(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let action = await this.getPlayerAction(e.user_id);
        let state = await this.getPlayerState(action);
        if (state == "空闲") {
            return;
        }
        if (action.action != "采药") {
            return;
        }
        //结算
        let end_time = action.end_time;
        let start_time = action.end_time - action.time;
        let now_time = new Date().getTime();
        let time;
        var y = 15;//固定时间
        var x = 48;//循环次数

        if (end_time > now_time) {//属于提前结束
            time = parseInt((new Date().getTime() - start_time) / 1000 / 60);
            //超过就按最低的算，即为满足30分钟才结算一次
            //如果是 >=16*33 ----   >=30
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            //如果<15，不给收益
            if (time < y) {
                time = 0;
            }
        } else {//属于结束了未结算
            time = parseInt((action.time) / 1000 / 60);
            //超过就按最低的算，即为满足30分钟才结算一次
            //如果是 >=16*33 ----   >=30
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            //如果<15，不给收益
            if (time < y) {
                time = 0;
            }
        }
        if (e.isGroup) {
            await this.plant_jiesuan(e.user_id, time, false, e.group_id);//提前闭关结束不会触发随机事件
        } else {
            await this.plant_jiesuan(e.user_id, time, false);//提前闭关结束不会触发随机事件
        }
        let arr = action;
        arr.is_jiesuan = 1;//结算状态
        arr.plant = 1;//采药状态
        arr.shutup = 1;//闭关状态
        arr.working = 1;//降妖状态
        arr.power_up = 1;//渡劫状态
        arr.Place_action = 1;//秘境
        //结束的时间也修改为当前时间
        arr.end_time = new Date().getTime();
        delete arr.group_id;//结算完去除group_id
        await redis.set("xiuxian:player:" + e.user_id + ":action", JSON.stringify(arr));
    }
    async mine(e) {
        let usr_qq = e.user_id;//用户qq
        //有无存档
        if (!await existplayer(usr_qq)) {
            return;
        }
        //不开放私聊
        if (!e.isGroup) {
            return;
        }
        //获取游戏状态
        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
        //防止继续其他娱乐行为
        if (game_action == 0) {
            e.reply("修仙：游戏进行中...");
            return;
        }
        let player = await Read_player(usr_qq);
        if (player.occupation != "采矿师") {
            e.reply("你挖矿许可证呢？非法挖矿，罚款200灵石")
            await Add_灵石(usr_qq, -200)
            return
        }
        //获取时间
        let time = e.msg.replace("#采矿", "");
        time = time.replace("分钟", "");
        if (parseInt(time) == parseInt(time)) {
            time = parseInt(time);
            var y = 30;//时间
            var x = 24;//循环次数
            //如果是 >=16*33 ----   >=30
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            //如果<30，修正。
            if (time < 30) {
                time = 30;
            }
        }
        else {
            //不设置时间默认30分钟
            time = 30;
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
                e.reply("正在" + action.action + "中，剩余时间:" + m + "分" + s + "秒");
                return;
            }
        }

        let action_time = time * 60 * 1000;//持续时间，单位毫秒
        let arr = {
            "action": "采矿",//动作
            "end_time": new Date().getTime() + action_time,//结束时间
            "time": action_time,//持续时间
            "plant": "1",//采药-开启
            "mine": "0",//采药-开启
            "shutup": "1",//闭关状态-开启
            "working": "1",//降妖状态-关闭
            "Place_action": "1",//秘境状态---关闭
            "Place_actionplus": "1",//沉迷---关闭
            "power_up": "1",//渡劫状态--关闭
            "mojie": "1",//魔界状态---关闭
            "xijie": "1", //洗劫状态开启
        };
        if (e.isGroup) {
            arr.group_id = e.group_id
        }

        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));//redis设置动作
        e.reply(`现在开始采矿${time}分钟`);

        return true;
    }



    async mine_back(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let action = await this.getPlayerAction(e.user_id);
        let state = await this.getPlayerState(action);
        if (state == "空闲") {
            return;
        }
        if (action.action != "采矿") {
            return;
        }
        //结算
        let end_time = action.end_time;
        let start_time = action.end_time - action.time;
        let now_time = new Date().getTime();
        let time;
        if (end_time > now_time) {//属于提前结束
            time = parseInt((new Date().getTime() - start_time) / 1000 / 60);
            var y = 30;//时间
            var x = 24;//循环次数
            //超过就按最低的算，即为满足30分钟才结算一次
            //如果是 >=16*33 ----   >=30
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            //如果<15，不给收益
            if (time < y) {
                time = 0;
            }
        } else {//属于结束了未结算
            time = parseInt((action.time) / 1000 / 60);
            //超过就按最低的算，即为满足30分钟才结算一次
            //如果是 >=16*33 ----   >=30
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            //如果<15，不给收益
            if (time < y) {
                time = 0;
            }
        }

        if (e.isGroup) {
            await this.mine_jiesuan(e.user_id, time, false, e.group_id);//提前闭关结束不会触发随机事件
        } else {
            await this.mine_jiesuan(e.user_id, time, false);//提前闭关结束不会触发随机事件
        }

        let arr = action;
        arr.is_jiesuan = 1;//结算状态
        arr.mine = 1;//采药状态
        arr.plant = 1;//采药状态
        arr.shutup = 1;//闭关状态
        arr.working = 1;//降妖状态
        arr.power_up = 1;//渡劫状态
        arr.Place_action = 1;//秘境
        //结束的时间也修改为当前时间
        arr.end_time = new Date().getTime();
        delete arr.group_id;//结算完去除group_id
        await redis.set("xiuxian:player:" + e.user_id + ":action", JSON.stringify(arr));
    }


    async plant_jiesuan(user_id, time, is_random, group_id) {

        let usr_qq = user_id;
        let player = data.getData("player", usr_qq);
        let msg = [segment.at(usr_qq)];
        let exp = 0;
        exp = time * 10;
        let k = 1;
        if (player.level_id < 22) {
            k = 0.5;
        }
        let sum = (time / 480) * (player.occupation_level * 2 + 12) * k;
        if (player.level_id >= 36) {
            sum = (time / 480) * (player.occupation_level * 3 + 11);
        }
        let names = [
            '万年凝血草',
            '万年何首乌',
            '万年血精草',
            '万年甜甜花',
            '万年清心草',
            '古神藤',
            '万年太玄果',
            '炼骨花',
            '魔蕴花',
            '万年清灵草',
            '万年天魂菊',
            "仙蕴花",
            '仙缘草',
            '太玄仙草',
        ];
        const sum2 = [0.2, 0.3, 0.2, 0.2, 0.2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const sum3 = [0.17, 0.22, 0.17, 0.17, 0.17, 0.024, 0.024, 0.024, 0.024, 0.024, 0.024, 0.024, 0.012, 0.011];
        msg.push(` 恭喜你获得了经验${exp},草药:`);
        let newsum = sum3.map(item => item * sum);
        if (player.level_id < 36) {
            newsum = sum2.map(item => item * sum);
        }
        for (let item in sum3) {
            if (newsum[item] < 1) {
                continue;
            }
            msg.push(`\n${names[item]}${Math.floor(newsum[item])}个`);
            await Add_najie_thing(
                usr_qq,
                names[item],
                '草药',
                Math.floor(newsum[item])
            );
        }
        await Add_职业经验(usr_qq, exp);
        if (group_id) {
            await this.pushInfo(group_id, true, msg)
        } else {
            await this.pushInfo(usr_qq, false, msg);
        }

        return;
    }

    async mine_jiesuan(user_id, time, is_random, group_id) {

        let usr_qq = user_id;
        let player = data.getData("player", usr_qq);
        let msg = [segment.at(usr_qq)];
        let mine_amount1 = Math.floor((1.8 + Math.random() * 0.4) * time);
        let rate = data.occupation_exp_list.find(item => item.id == player.occupation_level).rate * 10;
        let exp = 0;
        let ext = "";
        exp = time * 10;
        ext = `你是采矿师，获得采矿经验${exp}，额外获得矿石${Math.floor(rate * 100)}%,`;
        let end_amount = Math.floor(4 * (rate + 1) * mine_amount1); //普通矿石
        let num = Math.floor((rate / 12) * time / 30); //锻造
        const A = ["金色石胚","棕色石胚","绿色石胚","红色石胚","蓝色石胚","金色石料","棕色石料","绿色石料","红色石料","蓝色石料"];
        const B=["金色妖石","棕色妖石","绿色妖石","红色妖石","蓝色妖石","金色妖丹","棕色妖丹","绿色妖丹","红色妖丹","蓝色妖丹"]
        let xuanze = Math.trunc(Math.random() * A.length);
        end_amount *= player.level_id / 40;
        end_amount = Math.floor(end_amount);
        await Add_najie_thing(usr_qq, '庚金', '材料', end_amount);
        await Add_najie_thing(usr_qq, '玄土', '材料', end_amount);
        await Add_najie_thing(usr_qq, A[xuanze], '材料', num);
        await Add_najie_thing(usr_qq, B[xuanze], '材料', Math.trunc(num/50));
        await Add_职业经验(usr_qq, exp);
        msg.push(`\n采矿归来，${ext}\n收获庚金×${end_amount}\n玄土×${end_amount}`);
        msg.push(`\n${A[xuanze]}x${num}\n${B[xuanze]}x${Math.trunc(num/50)}`);
        if (group_id) {
            await this.pushInfo(group_id, true, msg)
        } else {
            await this.pushInfo(usr_qq, false, msg);
        }
        return;
    }

    async show_danfang(e) {
        if (!e.isGroup) {
            return;
        }
        let img = await get_danfang_img(e);
        e.reply(img);
        return;
    }
    async yaoxiao(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let dy = await Read_danyao(usr_qq);
        let player = await Read_player(usr_qq);
        let m = '丹药效果:';
        if (dy.ped > 0) {
            m += `\n仙缘丹药力${dy.beiyong1 * 100}%药效${dy.ped}次`;
        }
        if (dy.lianti > 0) {
            m += `\n炼神丹药力${dy.beiyong4 * 100}%药效${dy.lianti
                }次`;
        }
        if (dy.beiyong2 > 0) {
            m += `\n神赐丹药力${dy.beiyong3 * 100}% 药效${dy.beiyong2
                }次`;
        }
        if (dy.biguan > 0) {
            m += `\n辟谷丹药力${dy.biguanxl * 100}%药效${dy.biguan
                }次`;
        }
        if (player.islucky > 0) {
            m += `\n福源丹药力${player.addluckyNo * 100}%药效${player.islucky}次`;
        }
        if (player.breakthrough == true) {
            m += `\n破境丹生效中`;
        }
        if (dy.xingyun>0)
        {
            m += `\n真器丹药力${dy.beiyong5}药效${dy.xingyun}次`;
        }
        e.reply(m);
        return;
    }

    async show_tuzhi(e) {
        if (!e.isGroup) {
            return;
        }
        let img = await get_tuzhi_img(e);
        e.reply(img);
        return;
    }


    async liandan(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = await Read_player(usr_qq);
        if (player.occupation != "炼丹师") {
            e.reply("丹是上午炼的,药是中午吃的,人是下午走的")
            return
        }
        let t = e.msg.replace("#炼制", "").split("*");
        if (t <= 0) {
            t = 1
        }
        let danyao = t[0];
        let n = await convert2integer(t[1]);
        let tmp_msg = "";
        let danfang = data.danfang_list.find(item => item.name == danyao);
        if (!isNotNull(danfang)) {
            e.reply(`世界上没有丹药[${danyao}]的配方`);
            return;
        }
        if (danfang.level_limit > player.occupation_level) {
            e.reply(`${danfang.level_limit}级炼丹师才能炼制${danyao}`);
            return;
        }
        let materials = danfang.materials;
        let exp = danfang.exp;
        tmp_msg += "消耗";
        for (let i in materials) {
            let material = materials[i];
            let x = await exist_najie_thing(usr_qq, material.name, "草药");
            if (x == false) {
                x = 0;
            }
            if (x < material.amount * n) {
                e.reply(`纳戒中拥有${material.name}${x}份，炼制需要${material.amount * n}份`);
                return;
            }
        }
        for (let i in materials) {
            let material = materials[i];
            tmp_msg += `${material.name}×${material.amount * n}，`;
            await Add_najie_thing(usr_qq, material.name, "草药", -material.amount * n);
        }
        let total_exp = exp[1]*n;
        if (player.仙宠.type == "炼丹") {
            let random = Math.random()
            if (random < player.仙宠.加成) {
                n *= 2
                e.reply("你的仙宠" + player.仙宠.name + "辅佐了你进行炼丹,成功获得了双倍丹药")
            } else {
                e.reply("你的仙宠只是在旁边看着")
            }
        }
        if (danyao == "神心丹" || danyao == "九阶淬体丹" || danyao == "九阶玄元丹" || danyao == "起死回生丹") {
            await Add_najie_thing(usr_qq, danyao, "丹药", n);
            e.reply(`${tmp_msg}得到${danyao}${n}颗，获得炼丹经验${total_exp}`);
        } else {
            let dengjixiuzheng = player.occupation_level
            let newrandom = Math.random()
            let newrandom2 = Math.random()
            if (newrandom >= 0.1 + dengjixiuzheng * 3 / 100) {
                await Add_najie_thing(usr_qq, "凡品" + danyao, "丹药", n);
                e.reply(`${tmp_msg}得到"凡品"${danyao}${n}颗，获得炼丹经验${total_exp}`);
            } else {
                if (newrandom2 >= 0.4) {
                    await Add_najie_thing(usr_qq, "极品" + danyao, "丹药", n);
                    e.reply(`${tmp_msg}得到"极品"${danyao}${n}颗，获得炼丹经验${total_exp}`);
                } else {
                    await Add_najie_thing(usr_qq, "仙品" + danyao, "丹药", n);
                    e.reply(`${tmp_msg}得到"仙品"${danyao}${n}颗，获得炼丹经验${total_exp}`);
                }
            }
        }
        await Add_职业经验(usr_qq, total_exp);
    }



    async lianqi(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = await Read_player(usr_qq);
        if (player.occupation != "炼器师") {
            e.reply("铜都不炼你还炼器？")
            return
        }
        let t = e.msg.replace("#打造", "").split("*");
        let equipment_name = t[0];
        let suc_rate = 0;
        let tmp_msg1 = "";
        let tmp_msg2 = "";
        let tuzhi = data.tuzhi_list.find(item => item.name == equipment_name);
        if (!tuzhi) {
            e.reply(`世界上没有[${equipment_name}]的图纸`);
            return;
        }
        let materials = tuzhi.materials;
        let exp = tuzhi.exp;
        let res_exp;
        suc_rate += tuzhi.rate;

        let rate = 0;

        if (player.occupation_level > 0) {
            rate = data.occupation_exp_list.find(item => item.id == player.occupation_level).rate;
            rate = rate * 10
            rate = rate * 0.025
        }
        if (player.occupation == "炼器师") {
            tmp_msg1 += `你是炼器师，额外增加成功率${Math.floor(rate * 10)}%(以乘法算)，`;
            suc_rate *= 1 + rate;
            if (player.occupation_level >= 24) { suc_rate = 0.8 }
            res_exp = exp[0];
            tmp_msg2 += `，获得炼器经验${res_exp}`
        }
        tmp_msg1 += "消耗";
        for (let i in materials) {
            let material = materials[i];
            let x = await exist_najie_thing(usr_qq, material.name, "材料");
            if (x < material.amount || !x) {
                e.reply(`纳戒中拥有${material.name}×${x}，打造需要${material.amount}份`);
                return;
            }
        }
        for (let i in materials) {
            let material = materials[i];
            tmp_msg1 += `${material.name}×${material.amount}，`;
            await Add_najie_thing(usr_qq, material.name, "材料", -material.amount);
        }
        let rand1 = Math.random();
        if (rand1 > suc_rate) {
            let random = Math.random()
            if (random < 0.5) {
                e.reply(`打造装备时不小心锤断了刃芯，打造失败！`);
            } else {
                e.reply(`打造装备时没有把控好火候，烧毁了，打造失败！`);
            }
            return;
        }
        let pinji = Math.trunc(Math.random() * 7);
        if (pinji > 5) {
            e.reply("在你细致的把控下，一把绝世极品即将问世！！！！")
            await sleep(10000)
        }
        await Add_najie_thing(usr_qq, equipment_name, "装备", 1, pinji);
        await Add_职业经验(usr_qq, res_exp);
        e.reply(`${tmp_msg1}打造成功，获得${equipment_name}(${['劣', '普', '优', '精', '极', '绝', '顶'][pinji]})×1${tmp_msg2}`);
    }
    async search_sb(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = await Read_player(usr_qq);
        if (player.occupation != "侠客") {
            e.reply("只有专业的侠客才能获取悬赏")
            return
        }
        let msg = [];
        let action = await redis.get("xiuxian:player:" + usr_qq + ":shangjing");
        action = await JSON.parse(action);
        let type = 0;
        if (action != null) {
            if (action.end_time > new Date().getTime()) {
                msg = action.arm;
                var msg_data = {
                    msg,
                    type
                }
                const data1 = await new Show(e).get_msg(msg_data);
                let img = await puppeteer.screenshot("msg", {
                    ...data1,
                });
                e.reply(img);
                return;
            }
        }
        let mubiao = [];
        let i = 0;
        let File = fs.readdirSync(__PATH.player_path);
        File = File.filter(file => file.endsWith(".json"));
        let File_length = File.length;
        for (var k = 0; k < File_length; k++) {
            let this_qq = File[k].replace(".json", '');
            this_qq = parseInt(this_qq);
            let players = await Read_player(this_qq);
            if (players.魔道值 > 999 && this_qq != usr_qq) {
                mubiao[i] = {
                    名号: players.名号,
                    赏金: Math.trunc(1000000 * (1.2 + 0.05 * player.occupation_level) * player.level_id * player.Physique_id / 42 / 42 / 4),
                    QQ: this_qq
                }
                i++;
            }
        }
        while (i < 4) {
            mubiao[i] = {
                名号: "DD大妖王",
                赏金: Math.trunc(1000000 * (1.2 + 0.05 * player.occupation_level) * player.level_id * player.Physique_id / 42 / 42 / 4),
                QQ: 1
            }
            i++;
        }
        for (var k = 0; k < 3; k++) {
            msg.push(mubiao[Math.trunc(Math.random() * i)]);
        }
        let arr = {
            "arm": msg,
            "end_time": new Date().getTime() + 60000 * 60 * 20,//结束时间
        };
        await redis.set("xiuxian:player:" + usr_qq + ":shangjing", JSON.stringify(arr));
        var msg_data = {
            msg,
            type
        }
        const data1 = await new Show(e).get_msg(msg_data);
        let img = await puppeteer.screenshot("msg", {
            ...data1,
        });
        e.reply(img);
        return;
    }
    async taofa_sb(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let A_action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        A_action = JSON.parse(A_action);
        if (A_action != null) {
            let now_time = new Date().getTime();
            //人物任务的动作是否结束
            let A_action_end_time = A_action.end_time;
            if (now_time <= A_action_end_time) {
                let m = parseInt((A_action_end_time - now_time) / 1000 / 60);
                let s = parseInt(((A_action_end_time - now_time) - m * 60 * 1000) / 1000);
                e.reply("正在" + A_action.action + "中,剩余时间:" + m + "分" + s + "秒");
                return;
            }
        }
        let player = await Read_player(usr_qq);
        if (player.occupation != "侠客") {
            e.reply("侠客资质不足,需要进行训练")
            return
        }
        let action = await redis.get("xiuxian:player:" + usr_qq + ":shangjing");
        action = await JSON.parse(action);
        if (action == null) {
            e.reply("还没有接取到悬赏,请查看后再来吧")//没接取悬赏
            return
        }
        if (action.arm.length == 0) {
            e.reply("每日限杀,请等待20小时后新的赏金目标")//悬赏做完了(20h后刷新)
            return
        }
        var num = e.msg.replace("#讨伐目标", '');
        num = num.trim() - 1;
        let qq;
        try {
            qq = action.arm[num].QQ;
        }
        catch
        {
            e.reply("不要伤及无辜")//输错了，没有该目标
            return
        }
        let last_msg = "";
        if (qq != 1) {
            let player_B = await Read_player(qq);
            player_B.当前血量 = player_B.血量上限;

            player_B.法球倍率 = player_B.灵根.法球倍率;
            let buff = 1 + player.occupation_level * 0.055;
            let player_A = {
                id: player.id,
                名号: player.名号,
                攻击: parseInt(player.攻击 * buff),
                防御: parseInt(player.防御),
                当前血量: parseInt(player.血量上限* buff),
                暴击率: player.暴击率,
                学习的功法: player.学习的功法,
                魔道值: player.魔道值,
                灵根: player.灵根,
                法球倍率: player.灵根.法球倍率,
                仙宠: player.仙宠,
                神石: player.神石
            }
            let Data_battle = await zd_battle(player_A, player_B);
            let msg = Data_battle.msg;
            let A_win = `${player_A.名号}击败了${player_B.名号}`;
            let B_win = `${player_B.名号}击败了${player_A.名号}`;
            if (msg.find(item => item == A_win)) {
                player_B.魔道值 -= 50;
                player_B.灵石 -= 1000000;
                player_B.当前血量 = 0;
                await Write_player(qq, player_B);
                player.灵石 += action.arm[num].赏金;
                player.魔道值 -= 5;
                await Write_player(usr_qq, player);
                await Add_职业经验(usr_qq, 2255);
                last_msg += "【全服公告】" + player_B.名号 + "失去了1000000灵石,罪恶得到了洗刷,魔道值-50,无名侠客获得了部分灵石,自己的正气提升了,同时获得了更多的悬赏加成";
            }
            else if (msg.find(item => item == B_win)) {
                var shangjing = Math.trunc(action.arm[num].赏金 * 0.8);
                player.当前血量 = 0;
                player.灵石 += shangjing;
                player.魔道值 -= 5;
                await Write_player(usr_qq, player);
                await Add_职业经验(usr_qq, 1100);
                last_msg += "【全服公告】" + player_B.名号 + "反杀了无名侠客,无名侠客只获得了部分辛苦钱";
            }
            if (msg.length > 100) {
            } else {
                await ForwardMsg(e, msg);
            }
        }
        else {
            player.灵石 += action.arm[num].赏金;
            player.魔道值 -= 5;
            await Write_player(usr_qq, player);
            await Add_职业经验(usr_qq, 2255);
            last_msg += "你惩戒了仙路窃贼,获得了部分灵石";//直接获胜
        }
        action.arm.splice(num, 1);
        await redis.set("xiuxian:player:" + usr_qq + ":shangjing", JSON.stringify(action));
        if (last_msg == "你惩戒了仙路窃贼,获得了部分灵石") {
            e.reply(last_msg);
        }
        else {
            const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
            const groupList = await redis.sMembers(redisGlKey);
            for (const group_id of groupList) {
                this.pushInfo(group_id, true, last_msg);
            }
        }
    }

    async xuanshang_sb(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = await Read_player(usr_qq);
        let qq = e.msg.replace("#悬赏", '');
        let code = qq.split("\*");
        qq = code[0];
        let money = await convert2integer(code[1]);
        if (money < 300000) {
            money = 300000;
        }
        if (player.灵石 < money) {
            e.reply("您手头这点灵石,似乎在说笑");
            return;
        }
        let player_B;
        try {
            player_B = await Read_player(qq);
        }
        catch
        {
            e.reply("世间没有这人")//查无此人
            return;
        }
        var arr = {
            名号: player_B.名号,
            QQ: qq,
            赏金: money,
        }
        let action = await redis.get("xiuxian:player:" + 1 + ":shangjing");
        action = await JSON.parse(action);
        if (action != null) {
            action.push(arr);
        }
        else {
            action = [];
            action.push(arr);
        }
        player.灵石 -= money;
        await Write_player(usr_qq, player);
        e.reply("悬赏成功!");
        let msg = "";
        msg += "【全服公告】" + player_B.名号 + "被悬赏了" + money + "灵石";
        const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
        const groupList = await redis.sMembers(redisGlKey);
        for (const group_id of groupList) {
            this.pushInfo(group_id, true, msg);
        }
        await redis.set("xiuxian:player:" + 1 + ":shangjing", JSON.stringify(action));
        return;
    }
    async shangjingbang(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let action = await redis.get("xiuxian:player:" + 1 + ":shangjing");
        action = await JSON.parse(action);
        if (action == null) {
            e.reply("悬赏已经被抢空了");//没人被悬赏
            return;
        }
        for (var i = 0; i < action.length - 1; i++) {
            var count = 0;
            for (var j = 0; j < action.length - i - 1; j++) {
                if (action[j].赏金 < action[j + 1].赏金) {
                    var t;
                    t = action[j];
                    action[j] = action[j + 1];
                    action[j + 1] = t;
                    count = 1;
                }
            }
            if (count == 0)
                break;
        }
        await redis.set("xiuxian:player:" + 1 + ":shangjing", JSON.stringify(action));
        let type = 1;
        var msg_data = {
            msg: action,
            type
        }
        const data1 = await new Show(e).get_msg(msg_data);
        let img = await puppeteer.screenshot("msg", {
            ...data1,
        });
        e.reply(img);
        return;
    }
    async cisha_sb(e) {
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let A_action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        A_action = JSON.parse(A_action);
        if (A_action != null) {
            let now_time = new Date().getTime();
            //人物任务的动作是否结束
            let A_action_end_time = A_action.end_time;
            if (now_time <= A_action_end_time) {
                let m = parseInt((A_action_end_time - now_time) / 1000 / 60);
                let s = parseInt(((A_action_end_time - now_time) - m * 60 * 1000) / 1000);
                e.reply("正在" + A_action.action + "中,剩余时间:" + m + "分" + s + "秒");
                return;
            }
        }
        let action = await redis.get("xiuxian:player:" + 1 + ":shangjing");
        action = await JSON.parse(action);
        var num = e.msg.replace("#刺杀目标", '');
        num = num.trim() - 1;
        let qq;
        try {
            qq = action[num].QQ;
        }
        catch
        {
            e.reply("不要伤及无辜")//输错了，没有该目标
            return
        }
        if (qq == usr_qq) {
            e.reply("咋的，自己干自己？");
            return;
        }
        let player = await Read_player(usr_qq);
        let buff = 1;
        if (player.occupation == "侠客") {
            buff = 1 + player.occupation_level * 0.055;
        }
        let last_msg = "";
        let player_B = await Read_player(qq);
        if (player_B.当前血量 == 0) {
            e.reply(`对方已经没有血了,请等一段时间再刺杀他吧`)
            return;
        }
        let B_action = await redis.get("xiuxian:player:" + qq + ":action");
        B_action = JSON.parse(B_action);
        if (B_action != null) {
            let now_time = new Date().getTime();
            //人物任务的动作是否结束
            let B_action_end_time = B_action.end_time;
            if (now_time <= B_action_end_time) {
                let ishaveyss = await exist_najie_thing(usr_qq, "隐身水", "道具");
                if (!ishaveyss) {//如果A没有隐身水，直接返回不执行
                    let m = parseInt((B_action_end_time - now_time) / 1000 / 60);
                    let s = parseInt(((B_action_end_time - now_time) - m * 60 * 1000) / 1000);
                    e.reply("对方正在" + B_action.action + "中,剩余时间:" + m + "分" + s + "秒");
                    return;
                }
            }
        }
        player_B.法球倍率 = player_B.灵根.法球倍率;
        player_B.当前血量 = player_B.血量上限;
        let player_A = {
            id: player.id,
            名号: player.名号,
            攻击: parseInt(player.攻击 * buff),
            防御: parseInt(player.防御),
            当前血量: parseInt(player.血量上限),
            暴击率: player.暴击率,
            学习的功法: player.学习的功法,
            灵根: player.灵根,
            魔道值: player.魔道值,
            神石: player.神石,
            法球倍率: player.灵根.法球倍率,
            仙宠: player.仙宠
        }
        let Data_battle = await zd_battle(player_A, player_B);
        let msg = Data_battle.msg;
        let A_win = `${player_A.名号}击败了${player_B.名号}`;
        let B_win = `${player_B.名号}击败了${player_A.名号}`;
        if (msg.find(item => item == A_win)) {
            player_B.当前血量 = 0;
            player_B.修为 -= action[num].赏金;
            await Write_player(qq, player_B)
            player.灵石 += Math.trunc(action[num].赏金 * 0.3);
            await Write_player(usr_qq, player);
            last_msg += "【全服公告】" + player_B.名号 + "被" + player.名号 + "悄无声息的刺杀了"
            //优化下文案，比如xxx在刺杀xxx中
            action.splice(num, 1);
            await redis.set("xiuxian:player:" + 1 + ":shangjing", JSON.stringify(action));

        }
        else if (msg.find(item => item == B_win)) {
            player.当前血量 = 0;
            await Write_player(usr_qq, player);
            last_msg += "【全服公告】" + player.名号 + "刺杀失败," + player_B.名号 + "勃然大怒,单手就反杀了" + player.名号;//优化下文案，比如xxx在刺杀xxx中
        }
        if (msg.length > 100) {
        } else {
            await ForwardMsg(e, msg);
        }
        const redisGlKey = 'xiuxian:AuctionofficialTask_GroupList';
        const groupList = await redis.sMembers(redisGlKey);
        for (const group_id of groupList) {
            this.pushInfo(group_id, true, last_msg);
        }
        return;
    }

    /**
     * 获取缓存中的人物状态信息
     * @param usr_qq
     * @returns {Promise<void>}
     */
    async getPlayerAction(usr_qq) {
        let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        action = JSON.parse(action);//转为json格式数据
        return action;
    }

    /**
     * 获取人物的状态，返回具体的状态或者空闲
     * @param action
     * @returns {Promise<void>}
     */
    async getPlayerState(action) {
        if (action == null) {
            return "空闲";
        }
        let now_time = new Date().getTime();
        let end_time = action.end_time;
        //当前时间>=结束时间，并且未结算 属于已经完成任务，却并没有结算的
        //当前时间<=完成时间，并且未结算 属于正在进行
        if (!((now_time >= end_time && (action.shutup == 0 || action.working == 0 || action.plant == 0 || action.min == 0)) || (now_time <= end_time && (action.shutup == 0 || action.working == 0 || action.plant == 0 || action.mine == 0 || action.shoulie == 0)))) {

            return "空闲";
        }
        return action.action;
    }

    async pushInfo(id, is_group, msg) {
        if (is_group) {
            await Bot.pickGroup(id)
                .sendMsg(msg)
                .catch((err) => {
                    Bot.logger.mark(err);
                });
        } else {
            await common.relpyPrivate(id, msg);
        }
    }
}

export async function get_danfang_img(e) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }


    let danfang_list = data.danfang_list;

    let danfang_data = {
        user_id: usr_qq,
        danfang_list: danfang_list
    }
    const data1 = await new Show(e).get_danfangData(danfang_data);
    let img = await puppeteer.screenshot("danfang", {
        ...data1,
    });
    return img;
}


export async function get_tuzhi_img(e, all_level) {
    let usr_qq = e.user_id;
    let ifexistplay = data.existData("player", usr_qq);
    if (!ifexistplay) {
        return;
    }


    let tuzhi_list = data.tuzhi_list;

    let tuzhi_data = {
        user_id: usr_qq,
        tuzhi_list: tuzhi_list
    }
    const data1 = await new Show(e).get_tuzhiData(tuzhi_data);
    let img = await puppeteer.screenshot("tuzhi", {
        ...data1,
    });
    return img;
}
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
        e.reply("修仙：游戏进行中...");
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
    allaction = true;
    return;
}
