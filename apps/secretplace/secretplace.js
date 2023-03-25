import { plugin } from '../../api/api.js'
import data from '../../model/xiuxiandata.js'
import config from "../../model/config.js"
import {
    Read_player,
    existplayer,
    ForwardMsg,
    isNotNull,
    Add_灵石,
    Add_修为,
    Go
} from '../../model/xiuxian.js'
export class secretplace extends plugin {
    constructor() {
        super({
            name: 'SecretPlace',
            dsc: 'SecretPlace',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#秘境$',
                    fnc: 'Secretplace'
                },
                {
                    reg: '^#降临秘境.*$',
                    fnc: 'Gosecretplace'
                },
                {
                    reg: '^#禁地$',
                    fnc: 'Forbiddenarea'
                },
                {
                    reg: '^#前往禁地.*$',
                    fnc: 'Goforbiddenarea'
                },
                {
                    reg: '^#仙府$',
                    fnc: 'Timeplace'
                },
                {
                    reg: '^#探索仙府$',
                    fnc: 'GoTimeplace'
                },
                {
                    reg: '^#仙境$',
                    fnc: 'Fairyrealm'
                },
                {
                    reg: '^#镇守仙境.*$',
                    fnc: 'Gofairyrealm'
                },
                {
                    reg: '^#逃离',
                    fnc: 'Giveup'
                }
            ]
        })
    }

    //秘境地点
    async Secretplace(e) {
        if (!e.isGroup) return
        let addres = "秘境";
        let weizhi = data.didian_list;
        Goweizhi(e, weizhi, addres);
    }

    //禁地
    async Forbiddenarea(e) {
        if (!e.isGroup) return
        let addres = "禁地";
        let weizhi = data.forbiddenarea_list;
        Goweizhi(e, weizhi, addres);
    }

    //限定仙府
    async Timeplace(e) {
        if (!e.isGroup) return
        let addres = "仙府";
        let weizhi = data.timeplace_list;
        Goweizhi(e, weizhi, addres);
    }

    //仙境
    async Fairyrealm(e) {
        if (!e.isGroup) return
        let addres = "仙境";
        let weizhi = data.Fairyrealm_list;
        Goweizhi(e, weizhi, addres);
    }




    //降临秘境
    async Gosecretplace(e) {
        if (!e.isGroup) return
        let usr_qq = e.user_id;
        const T = await Go(e);
        if (!T) {
            return
        }
        let player = await Read_player(usr_qq);
        var didian = e.msg.replace("#降临秘境", '');
        didian = didian.trim();
        let weizhi = await data.didian_list.find(item => item.name == didian);
        if (!isNotNull(weizhi)) {
            return;
        }
        if (player.灵石 < weizhi.Price) {
            e.reply("没有灵石寸步难行,攒到" + weizhi.Price + "灵石才够哦~");
            return true;
        }
        let now_level_id;
        if (!isNotNull(player.level_id)) {
            e.reply("请先#同步信息");
            return;
        }
        now_level_id = data.level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id > 42) {
            e.reply("境界不符！");
            return;
        }
        let Price = weizhi.Price;
        await Add_灵石(usr_qq, -Price);
        var time = config.getconfig("xiuxian", "xiuxian").CD.secretplace;//时间（分钟）
        let action_time = 60000 * time;//持续时间，单位毫秒
        let arr = {
            "action": "历练",//动作
            "end_time": new Date().getTime() + action_time,//结束时间
            "time": action_time,//持续时间
            "shutup": "1",//闭关
            "working": "1",//降妖
            "Place_action": "0",//秘境状态---开启
            "Place_actionplus": "1",//沉迷秘境状态---关闭
            "power_up": "1",//渡劫状态--关闭
            //这里要保存秘境特别需要留存的信息
            "Place_address": weizhi,
        };
        if (e.isGroup) {
            arr.group_id = e.group_id
        }
        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));
        e.reply("开始降临" + didian + "," + time + "分钟后归来!");
        return;
    }



    //前往禁地
    async Goforbiddenarea(e) {
        if (!e.isGroup) return
        let usr_qq = e.user_id;
        const T = await Go(e);
        if (!T) {
            return
        }
        let player = await Read_player(usr_qq);
        let now_level_id;
        if (!isNotNull(player.level_id)) {
            e.reply("请先#同步信息");
            return;
        }
        if (!isNotNull(player.power_place)) {
            e.reply("请#同步信息");
            return;
        }
        if (player.power_place == 0) {
            return;
        }
        now_level_id = data.level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 22) {
            return;
        }
        var didian = await e.msg.replace("#前往禁地", '');
        didian = didian.trim();
        let weizhi = await data.forbiddenarea_list.find(item => item.name == didian);
        if (!isNotNull(weizhi)) {
            return;
        }
        if (player.灵石 < weizhi.Price) {
            e.reply("没有灵石寸步难行,攒到" + weizhi.Price + "灵石才够哦~");
            return true;
        }
        if (player.修为 < weizhi.experience) {
            e.reply("你需要积累" + weizhi.experience + "修为，才能抵抗禁地魔气！");
            return true;
        }
        let Price = weizhi.Price;
        await Add_灵石(usr_qq, -Price);
        await Add_修为(usr_qq, -weizhi.experience);
        var time = config.getconfig("xiuxian", "xiuxian").CD.forbiddenarea;//时间（分钟）
        let action_time = 60000 * time;//持续时间，单位毫秒
        let arr = {
            "action": "禁地",//动作
            "end_time": new Date().getTime() + action_time,//结束时间
            "time": action_time,//持续时间
            "shutup": "1",//闭关
            "working": "1",//降妖
            "Place_action": "0",//秘境状态---开启
            "Place_actionplus": "1",//沉迷秘境状态---关闭
            "power_up": "1",//渡劫状态--关闭
            //这里要保存秘境特别需要留存的信息
            "Place_address": weizhi,
        };
        if (e.isGroup) {
            arr.group_id = e.group_id
        }
        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));
        e.reply("正在前往" + weizhi.name + "," + time + "分钟后归来!");
        return;
    }



    //探索仙府
    async GoTimeplace(e) {
        if (!e.isGroup) return
        let usr_qq = e.user_id;
        const T = await Go(e);
        if (!T) {
            return
        }
        let player = await Read_player(usr_qq);
        let didian = "无欲天仙";
        let now_level_id;
        if (!isNotNull(player.level_id)) {
            e.reply("请先#同步信息");
            return;
        }
        now_level_id = data.level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 21) {
            return;
        }
        let weizhi = await data.timeplace_list.find(item => item.name == didian);
        if (!isNotNull(weizhi)) {
            return;
        }
        if (player.灵石 < weizhi.Price) {
            e.reply("没有灵石寸步难行,攒到" + weizhi.Price + "灵石才够哦~");
            return;
        }
        if (player.修为 < 100000) {
            e.reply("你需要消耗" + 100000 + "修为，才能抵御仙威！");
            return true;
        }
        let Price = weizhi.Price;
        await Add_灵石(usr_qq, -Price);
        var time = config.getconfig("xiuxian", "xiuxian").CD.timeplace;//时间（分钟）
        let action_time = 60000 * time;//持续时间，单位毫秒
        let arr = {
            "action": "探索",//动作
            "end_time": new Date().getTime() + action_time,//结束时间
            "time": action_time,//持续时间
            "shutup": "1",//闭关
            "working": "1",//降妖
            "Place_action": "0",//秘境状态---开启
            "Place_actionplus": "1",//沉迷秘境状态---关闭
            "power_up": "1",//渡劫状态--关闭
            //这里要保存秘境特别需要留存的信息
            "Place_address": weizhi,
        };
        if (e.isGroup) {
            arr.group_id = e.group_id;
        }
        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));
        await Add_修为(usr_qq, -100000);
        e.reply("开始探索" + weizhi.name + "的仙府," + time + "分钟后归来!");
        return;

    }

    //前往仙境
    async Gofairyrealm(e) {
        if (!e.isGroup) return
        let usr_qq = e.user_id;
        const T = await Go(e);
        if (!T) {
            return
        }
        let player = await Read_player(usr_qq);
        var didian = e.msg.replace("#镇守仙境", '');
        didian = didian.trim();
        let weizhi = await data.Fairyrealm_list.find(item => item.name == didian);
        if (!isNotNull(weizhi)) {
            return;
        }
        if (player.灵石 < weizhi.Price) {
            e.reply("没有灵石寸步难行,攒到" + weizhi.Price + "灵石才够哦~");
            return true;
        }
        let now_level_id;
        if (!isNotNull(player.level_id)) {
            e.reply("请先#同步信息");
            return;
        }
        now_level_id = data.level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 42) {
            return;
        }
        else {
            if (!isNotNull(player.power_place)) {
                e.reply("请#同步信息");
                return;
            }
            if (player.power_place != 0) {
                e.reply("你已无法重返仙界！");
                return;
            }
        }
        let Price = weizhi.Price;
        await Add_灵石(usr_qq, -Price);
        var time = config.getconfig("xiuxian", "xiuxian").CD.secretplace;//时间（分钟）
        let action_time = 60000 * time;//持续时间，单位毫秒
        let arr = {
            "action": "历练",//动作
            "end_time": new Date().getTime() + action_time,//结束时间
            "time": action_time,//持续时间
            "shutup": "1",//闭关
            "working": "1",//降妖
            "Place_action": "0",//秘境状态---开启
            "Place_actionplus": "1",//沉迷秘境状态---关闭
            "power_up": "1",//渡劫状态--关闭
            //这里要保存秘境特别需要留存的信息
            "Place_address": weizhi,
        };
        if (e.isGroup) {
            arr.group_id = e.group_id
        }
        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));
        e.reply("开始镇守" + didian + "," + time + "分钟后归来!");
        return;
    }


    async Giveup(e) {
        if (!e.isGroup) return
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            e.reply("没存档你逃个锤子!");
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
        //不为空，有状态
        if (action != null) {
            //是在秘境状态
            if (action.Place_action == "0") {
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
                await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));
                e.reply("你已逃离！");
                return;
            }
        }
        return;
    }

}

/**
     * 地点查询
 */
async function Goweizhi(e, weizhi, addres) {
    let adr = addres;
    let msg = [
        "***" + adr + "***"
    ];
    for (var i = 0; i < weizhi.length; i++) {
        msg.push(weizhi[i].name + "\n" + "等级:" + weizhi[i].Grade + "\n" + "极品:" + weizhi[i].Best[0] + "\n" + "灵石:" + weizhi[i].Price + "灵石")
    }
    await ForwardMsg(e, msg);
}