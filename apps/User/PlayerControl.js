
import plugin from '../../../../lib/plugins/plugin.js'
import common from "../../../../lib/common/common.js"
import config from "../../model/Config.js"
import data from '../../model/XiuxianData.js'
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
import { segment } from "oicq"
/**
 * 定时任务
 */
export class PlayerControl extends plugin {
    constructor() {
        super({
            name: 'PlayerControl',
            dsc: 'PlayerControl',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '(^#*降妖$)|(^#*降妖(.*)(分|分钟)$)',
                    fnc: 'Dagong'
                },
                {
                    reg: '(^#闭关$)|(^#闭关(.*)(分|分钟)$)',
                    fnc: 'Biguan'
                },
                {
                    reg: '^#出关$',
                    fnc: 'chuGuan'
                },
                {
                    reg: '^#降妖归来$',
                    fnc: 'endWork'
                }
            ]
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }


    //闭关
    async Biguan(e) {
        let usr_qq = e.user_id;
        if (!await Xiuxian.existplayer(usr_qq)) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
        if (game_action == 0) {
            e.reply("游戏进行中...");
            return;
        }
        let time = e.msg.replace("#", "");
        time = time.replace("闭关", "");
        time = time.replace("分", "");
        time = time.replace("钟", "");
        if (parseInt(time) == parseInt(time)) {
            time = parseInt(time);
            var y = 30;//时间
            var x = 24;//循环次数
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            if (time < 30) {
                time = 30;
            }
        }
        else {
            time = 30;
        }
        let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        action = JSON.parse(action);
        if (action != null) {
            let action_end_time = action.end_time;
            let now_time = new Date().getTime();
            if (now_time <= action_end_time) {
                let m = parseInt((action_end_time - now_time) / 1000 / 60);
                let s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
                e.reply("正在" + action.action + "中,剩余时间:" + m + "分" + s + "秒");
                return;
            }
        }
        let action_time = time * 60 * 1000;//持续时间，单位毫秒
        let arr = {
            "action": "闭关",//动作
            "end_time": new Date().getTime() + action_time,//结束时间
            "time": action_time,//持续时间
            "shutup": "0",//闭关状态-开启
            "working": "1",//降妖状态-关闭
            "Place_action": "1",//秘境状态---关闭
            "Place_actionplus": "1",//沉迷---关闭
            "power_up": "1",//渡劫状态--关闭
        };
        if (e.isGroup) {
            arr.group_id = e.group_id
        }
        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));//redis设置动作
        e.reply(`现在开始闭关${time}分钟,两耳不闻窗外事了`);
        return true;
    }




    //降妖
    async Dagong(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;//用户qq
        if (!await Xiuxian.existplayer(usr_qq)) {
            return;
        }
        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
        if (game_action == 0) {
            e.reply("修仙：游戏进行中...");
            return;
        }
        let time = e.msg.replace("#", "");
        time = time.replace("降妖", "");
        time = time.replace("分", "");
        time = time.replace("钟", "");
        if (parseInt(time) == parseInt(time)) {
            time = parseInt(time);//你选择的时间
            var y = 15;//固定时间
            var x = 32;//循环次数
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            if (time < 15) {
                time = 15;
            }
        }
        else {
            time = 30;
        }
        let player = await Xiuxian.Read_player(usr_qq);
        if (player.nowblood < 200) {
            e.reply("你都伤成这样了,先去疗伤吧");
            return;
        }
        let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        action = JSON.parse(action);
        if (action != null) {
            let action_end_time = action.end_time;
            let now_time = new Date().getTime();
            if (now_time <= action_end_time) {
                let m = parseInt((action_end_time - now_time) / 1000 / 60);
                let s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
                e.reply("正在" + action.action + "中,剩余时间:" + m + "分" + s + "秒");
                return;
            }
        }
        let action_time = time * 60 * 1000;//持续时间，单位毫秒
        let arr = {
            "action": "降妖",//动作
            "end_time": new Date().getTime() + action_time,//结束时间
            "time": action_time,//持续时间
            "shutup": "1",//闭关状态-关闭
            "working": "0",//降妖状态-开启
            "Place_action": "1",//秘境状态---关闭
            "Place_actionplus": "1",//沉迷---关闭
            "power_up": "1",//渡劫状态--关闭
        };
        if (e.isGroup) {
            arr.group_id = e.group_id;
        }
        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));//redis设置动作
        e.reply(`现在开始降妖${time}分钟`);
        return true;
    }


    /**
     * 人物结束闭关
     * @param e
     * @returns {Promise<void>}
     */
    async chuGuan(e) {
        if (!e.isGroup) {
            return;
        }
        let action = await this.getPlayerAction(e.user_id);
        let state = await this.getPlayerState(action);
        if (state == "空闲") {
            return;
        }
        if (action.action != "闭关") {
            return;
        }
        let end_time = action.end_time;
        let start_time = action.end_time - action.time;
        let now_time = new Date().getTime();
        let time;
        var y = this.xiuxianConfigData.biguan.time;//固定时间
        var x = this.xiuxianConfigData.biguan.cycle;//循环次数
        if (end_time > now_time) {
            time = parseInt((new Date().getTime() - start_time) / 1000 / 60);
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            if (time < y) {
                time = 0;
            }
        } else {//属于结束了未结算
            time = parseInt((action.time) / 1000 / 60);
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            if (time < y) {
                time = 0;
            }
        }
        if (e.isGroup) {
            await this.biguan_jiesuan(e.user_id, time, false, e.group_id);//提前闭关结束不会触发随机事件
        } else {
            await this.biguan_jiesuan(e.user_id, time, false);//提前闭关结束不会触发随机事件
        }
        let arr = action;
        arr.shutup = 1;//闭关状态
        arr.working = 1;//降妖状态
        arr.power_up = 1;//渡劫状态
        arr.Place_action = 1;//秘境
        arr.end_time = new Date().getTime();//结束的时间也修改为当前时间
        delete arr.group_id;//结算完去除group_id
        await redis.set("xiuxian:player:" + e.user_id + ":action", JSON.stringify(arr));
    }



    /**
     * 人物结束降妖
     * @param e
     * @returns {Promise<void>}
     */
    async endWork(e) {
        if (!e.isGroup) {
            return;
        }
        let action = await this.getPlayerAction(e.user_id);
        let state = await this.getPlayerState(action);
        if (state == "空闲") {
            return;
        }
        if (action.action != "降妖") {
            return;
        }
        let end_time = action.end_time;
        let start_time = action.end_time - action.time;
        let now_time = new Date().getTime();
        let time;
        var y = this.xiuxianConfigData.work.time;//固定时间
        var x = this.xiuxianConfigData.work.cycle;//循环次数
        if (end_time > now_time) {
            time = parseInt((new Date().getTime() - start_time) / 1000 / 60);
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            if (time < y) {
                time = 0;
            }
        } else {
            time = parseInt((action.time) / 1000 / 60);
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
            if (time < y) {
                time = 0;
            }
        }
        if (e.isGroup) {
            await this.dagong_jiesuan(e.user_id, time, false, e.group_id);//提前结束不会触发
        } else {
            await this.dagong_jiesuan(e.user_id, time, false);
        }
        let arr = action;
        arr.is_jiesuan = 1;//结算状态
        arr.shutup = 1;//闭关状态
        arr.working = 1;//降妖状态
        arr.power_up = 1;//渡劫状态
        arr.Place_action = 1;//秘境
        arr.end_time = new Date().getTime();
        delete arr.group_id;//结算完去除group_id
        await redis.set("xiuxian:player:" + e.user_id + ":action", JSON.stringify(arr));
    }



    /**
     * 闭关结算
     * @param usr_qq
     * @param time持续时间(单位用分钟)
     * @param is_random是否触发随机事件  true,false
     * @param group_id  回复消息的地址，如果为空，则私聊
     * @returns {Promise<void>}
     */
    async biguan_jiesuan(user_id, time, is_random, group_id) {
        let usr_qq = user_id;
        await Xiuxian.player_efficiency(usr_qq);
        let player = data.getData("player", usr_qq);
        let now_level_id  = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        var size = this.xiuxianConfigData.biguan.size;
        let xiuwei = parseInt((size * now_level_id) * (player.talentsize + 1));
        let blood = parseInt(player.hpmax * 0.02);
        let other_xiuwei = 0; 
        let msg = [segment.at(usr_qq)];
        if (is_random) {
            let rand = Math.random();
            if (rand < 0.2) {
                rand = Math.trunc(rand * 10) + 45;
                other_xiuwei = rand * time;
                msg.push("\n本次闭关顿悟,额外增加修为:" + rand * time);
            }
            else if (rand > 0.8) {
                rand = Math.trunc(rand * 10) + 5;
                other_xiuwei = -1 * rand * time;
                msg.push("\n由于你闭关时隔壁装修,导致你差点走火入魔,修为下降" + rand * time);
            }
        }
        await this.setFileValue(usr_qq, xiuwei * time + other_xiuwei, "experience");
        await this.setFileValue(usr_qq, blood * time, "nowblood");
        if (is_random) {
            msg.push("\n增加修为:" + xiuwei * time, "  获得治疗,血量增加:" + blood * time);
        } else {
            msg.push("\n增加修为:" + xiuwei * time, "  获得治疗,血量增加:" + blood * time);
        }

        if (group_id) {
            await this.pushInfo(group_id, true, msg)
        } else {
            await this.pushInfo(usr_qq, false, msg);
        }

        return;
    }



    /**
     * 降妖结算
     * @param usr_qq
     * @param time持续时间(单位用分钟)
     * @param is_random是否触发随机事件  true,false
     * @param group_id  回复消息的地址，如果为空，则私聊
     * @returns {Promise<void>}
     */
    async dagong_jiesuan(user_id, time, is_random, group_id) {
        let usr_qq = user_id;
        let player = data.getData("player", usr_qq);
        let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        var size = this.xiuxianConfigData.work.size;
        let lingshi = size * now_level_id;
        let other_lingshi = 0;//额外的灵石
        let Time = time * 2;
        let msg = [segment.at(usr_qq)];
        if (is_random) {//随机事件预留空间
            let rand = Math.random();
            if (rand < 0.2) {
                rand = Math.trunc(rand * 10) + 40;
                other_lingshi = rand * Time;
                msg.push("\n本次增加灵石" + rand * Time);
            } else if (rand > 0.8) {
                rand = Math.trunc(rand * 10) + 5;
                other_lingshi = -1 * rand * Time;
                msg.push("\n由于你的疏忽,货物被人顺手牵羊,老板大发雷霆,灵石减少" + rand * Time);
            }
        }
        let get_lingshi = lingshi * Time + other_lingshi;//最后获取到的灵石
        await this.setFileValue(usr_qq, get_lingshi, "lingshi");
        if (is_random) {
            msg.push("\n增加灵石" + get_lingshi);
        } else {
            msg.push("\n增加灵石" + get_lingshi);
        }

        if (group_id) {
            await this.pushInfo(group_id, true, msg)
        } else {
            await this.pushInfo(usr_qq, false, msg);
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
        if (!((now_time >= end_time && (action.shutup == 0 || action.working == 0)) || (now_time <= end_time && (action.shutup == 0 || action.working == 0)))) {

            return "空闲";
        }
        return action.action;
    }


    /**
     * 推送消息，群消息推送群，或者推送私人
     * @param id
     * @param is_group
     * @returns {Promise<void>}
     */
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


    /**
     * 增加player文件某属性的值（在原本的基础上增加）
     * @param user_qq
     * @param num 属性的value
     * @param type 修改的属性
     * @returns {Promise<void>}
     */
    async setFileValue(user_qq, num, type) {
        let user_data = data.getData("player", user_qq);
        let current_num = user_data[type];//当前灵石数量
        let new_num = current_num + num;
        if (type == "nowblood" && new_num > user_data.hpmax) {
            new_num = user_data.hpmax;//治疗血量需要判读上限
        }
        new_num=await Xiuxian.Numbers(new_num);
        user_data[type] = new_num;
         data.setData("player", user_qq, user_data);
        return;
    }
}
