
import plugin from '../../../../lib/plugins/plugin.js'
import common from "../../../../lib/common/common.js"
import config from "../../model/Config.js"
import {Gomini,Go,offaction, Read_battle, Read_level, Read_talent, Add_experience, Add_HP, Add_lingshi} from '../Xiuxian/Xiuxian.js'
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
                    reg: '(^#降妖$)|(^#降妖(.*)(分|分钟)$)',
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
                    reg: '^#归来$',
                    fnc: 'endWork'
                }
            ]
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }


    //闭关
    async Biguan(e) {
        let good = await Gomini(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let time = e.msg.replace("#", "");
        time = time.replace("闭关", "");
        time = time.replace("分", "");
        time = time.replace("钟", "");
        if (parseInt(time) != parseInt(time)) {
            time = 30;
        }
        var y = 30;//时间
        var x = 24;//循环次数
        time = parseInt(time);
        for (var i = x; i > 0; i--) {
            if (time >= y * i) {
                time = y * i;
                break;
            }
        }
        if (time < 30) {
            time = 30;
        }
        let action_time = time * 60 * 1000;
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
        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(arr));
        e.reply(`现在开始闭关${time}分钟,两耳不闻窗外事了`);
        return true;
    }

    //降妖
    async Dagong(e) {
        let good = await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let time = e.msg.replace("#", "");
        time = time.replace("降妖", "");
        time = time.replace("分", "");
        time = time.replace("钟", "");
        if (parseInt(time) != parseInt(time)) {
            time = 30;
        }
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
        let action_time = time * 60 * 1000;
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

    async chuGuan(e) {
        if (!e.isGroup) {
            return;
        }
        let user_id=e.user_id;
        let action = await this.getPlayerAction(user_id);
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
        } 
        else {
            time = parseInt((action.time) / 1000 / 60);
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
        }
        if (e.isGroup) {
            await this.biguan_jiesuan(user_id, time, false, e.group_id);
        } else {
            await this.biguan_jiesuan(user_id, time, false);
        }
        await offaction(user_id);
        return;
    }


    async endWork(e) {
        if (!e.isGroup) {
            return;
        }
        let user_id=e.user_id;
        let action = await this.getPlayerAction(user_id);
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
        } 
        else {
            time = parseInt((action.time) / 1000 / 60);
            for (var i = x; i > 0; i--) {
                if (time >= y * i) {
                    time = y * i;
                    break;
                }
            }
        }
        if (e.isGroup) {
            await this.dagong_jiesuan(user_id, time, false, e.group_id);
        } else {
            await this.dagong_jiesuan(user_id, time, false);
        }
        await offaction(user_id);
    }


    async biguan_jiesuan(user_id, time, is_random, group_id) {
        let usr_qq = user_id;
        let player = await Read_level(usr_qq);
        let ta=await Read_talent(usr_qq);
        let ba=await Read_battle(usr_qq);
        

        var size = this.xiuxianConfigData.biguan.size;
        let xiuwei = parseInt((size * player.level_id) * (ta.talentsize + 1));
        let blood = parseInt(ba.blood * 0.02);
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
        await Add_experience(usr_qq,xiuwei * time + other_xiuwei);
        await Add_HP(usr_qq,blood * time);
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


    async dagong_jiesuan(user_id, time, is_random, group_id) {
        let usr_qq = user_id;
        let player =  await Read_level();
        var size = this.xiuxianConfigData.work.size;
        let lingshi = size * player.level_id;
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
        await Add_lingshi(usr_qq, get_lingshi);
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

    async getPlayerAction(usr_qq) {
        let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        action = JSON.parse(action);
        return action;
    }

    async getPlayerState(action) {
        if (action == null) {
            return "空闲";
        }
        let now_time = new Date().getTime();
        let end_time = action.end_time;
        if (!((now_time >= end_time && (action.shutup == 0 || action.working == 0)) || (now_time <= end_time && (action.shutup == 0 || action.working == 0)))) {
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
