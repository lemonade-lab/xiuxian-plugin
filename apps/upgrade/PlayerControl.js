
import plugin from '../../../../lib/plugins/plugin.js'
import common from "../../../../lib/common/common.js"
import config from "../../model/Config.js"
import { segment } from "oicq"
import {Gomini,Go,offaction, Read_battle, Add_experience, Add_HP, Add_lingshi,existplayer} from '../Xiuxian/Xiuxian.js'
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
                    reg: '#降妖$',
                    fnc: 'Dagong'
                },
                {
                    reg: '#闭关$',
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
        let now_time = new Date().getTime();
        let actionObject = {
            "actionName": "闭关",
            "startTime": now_time
        }
        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(actionObject));
        e.reply(`现在开始闭关,两耳不闻窗外事了`);
        return true;
    }

    //降妖
    async Dagong(e) {
        let good = await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let now_time = new Date().getTime();
        let actionObject = {
            "actionName": "降妖",
            "startTime": now_time
        }
        await redis.set("xiuxian:player:" + usr_qq + ":action", JSON.stringify(actionObject));
        e.reply(`现在开始外出降妖赚取灵石`);
        return true;
    }

    async chuGuan(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq=e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        if(action==undefined){
            return;
        }
        action = JSON.parse(action);
        if(action.actionName != "闭关"){
            return ;
        }
        let startTime = action.startTime;
        var timeUnit = this.xiuxianConfigData.biguan.time;
        let time = Math.trunc((new Date().getTime() - startTime) / 1000 / 60);
        let snippetNums = Math.trunc(time/timeUnit);
        if (e.isGroup) {
            await this.upgrade(usr_qq, snippetNums,action.actionName, e.group_id);
        } else {
            await this.upgrade(usr_qq, snippetNums,action.actionName);
        }
        await offaction(usr_qq);
        return;
    }


    async endWork(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq=e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        if(action==undefined){
            return;
        }
        action = JSON.parse(action);
        if(action.actionName != "降妖"){
            return;
        }
        let startTime = action.startTime;
        var timeUnit = this.xiuxianConfigData.work.time;
        let time = Math.trunc((new Date().getTime() - startTime) / 1000 / 60);
        let snippetNums = Math.trunc(time/timeUnit);
        if (e.isGroup) {
            await this.upgrade(usr_qq, snippetNums,action.actionName, e.group_id);
        } else {
            await this.upgrade(usr_qq, snippetNums,action.actionName);
        }
        await offaction(usr_qq);
        return;
    }

    async upgrade(user_id,time,name,group_id){
        let usr_qq = user_id;
        let player = await Read_battle(usr_qq);
        let other=0;
        let msg = [segment.at(usr_qq)];
        let rand = Math.random();
        if (rand < 0.2) {
            rand = Math.trunc(rand * 10) + 45;
            other = rand * time*player.level_id;
            msg.push("\n"+name+"获得"+other);
        }
        else {
            rand = Math.trunc(rand * 10) + 5;
            other = -1 * rand * time*player.level_id;
            msg.push("\n"+name+"获得"+other);
        }

        if(name=="闭关"){
            await Add_experience(usr_qq,other);
            await Add_HP(usr_qq,100);
            msg.push("\n血量恢复");
        }
        else{
            await Add_lingshi(usr_qq, other);
        }

        if (group_id) {
            await this.pushInfo(group_id, true, msg)
        } else {
            await this.pushInfo(usr_qq, false, msg);
        }
        return;
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
