
import plugin from '../../../../lib/plugins/plugin.js'
import common from "../../../../lib/common/common.js"
import config from "../../model/Config.js"
import {Gomini,Go,offaction, Read_battle, Read_level, Read_talent, Add_experience, Add_HP, Add_lingshi,existplayer} from '../Xiuxian/Xiuxian.js'
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
        let user_id=e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }

        let exists = await redis.exists("xiuxian:player:" + usr_qq + ":action");
        if (exists == 0) {
           return ;
        }

        let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        action = JSON.parse(action);
        if(action.actionName != "闭关"){
            return ;
        }


        let startTime = action.startTime;
        var timeUnit = this.xiuxianConfigData.biguan.time;
        let time = Math.trunc((new Date().getTime() - startTime) / 1000 / 60);

        let snippetNums = Math.trunc(time/timeUnit);

        if (e.isGroup) {
            await this.biguan_jiesuan(user_id, snippetNums, e.group_id);
        } else {
            await this.biguan_jiesuan(user_id, snippetNums);
        }

        await offaction(user_id);
        return;
    }


    async endWork(e) {
        if (!e.isGroup) {
            return;
        }
        let user_id=e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }

        let exists = await redis.exists("xiuxian:player:" + usr_qq + ":action");
        if (exists == 0) {
            return ;
        }

        let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
        action = JSON.parse(action);
        if(action.actionName != "降妖"){
            return ;
        }


        let startTime = action.startTime;
        var timeUnit = this.xiuxianConfigData.work.time;
        let time = Math.trunc((new Date().getTime() - startTime) / 1000 / 60);



        //todo
        //打工与闭关逻辑类似，不过多赘述
        //该值为时间分段数，例如 打工了60+分钟，最低收益点是15分钟，这个值就是4 ，以此限制数值的膨胀
        //打工和降妖均没有限制最大收益时间，如果要设置，在这里判断   snippetNums = snippetNums > cycle ? cycle : snippetNums   即可
        let snippetNums = Math.trunc(time/timeUnit);




        if (e.isGroup) {
            await this.dagong_jiesuan(user_id, snippetNums, e.group_id);
        } else {
            await this.dagong_jiesuan(user_id, snippetNums);
        }

        await offaction(user_id);
        return;

    }


    async biguan_jiesuan(user_id, time, group_id) {
        let usr_qq = user_id;
        let player = await Read_level(usr_qq);
        let ta=await Read_talent(usr_qq);
        let ba=await Read_battle(usr_qq);
        

        var size = this.xiuxianConfigData.biguan.size;
        let xiuwei = parseInt((size * player.level_id) * (ta.talentsize + 1));
        let blood = parseInt(ba.blood * 0.02);
        let other_xiuwei = 0;
        let msg = [segment.at(usr_qq)];
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

        await Add_experience(usr_qq,xiuwei * time + other_xiuwei);
        await Add_HP(usr_qq,blood * time);
        msg.push("\n增加修为:" + xiuwei * time, "  获得治疗,血量增加:" + blood * time);

        if (group_id) {
            await this.pushInfo(group_id, true, msg)
        } else {
            await this.pushInfo(usr_qq, false, msg);
        }
        return;
    }


    async dagong_jiesuan(user_id, time, group_id) {
        let usr_qq = user_id;
        let player = await Read_level(usr_qq);
        var size = this.xiuxianConfigData.work.size;
        let lingshi = size * player.level_id;
        let other_lingshi = 0;//额外的灵石
        let Time = time * 2;
        let msg = [segment.at(usr_qq)];
        let rand = Math.random();
        if (rand < 0.2) {
            rand = Math.trunc(rand * 10) + 40;
            other_lingshi = rand * Time;
            msg.push("\n降妖击败为祸一方的强大怪物，得到额外悬赏" + rand * Time);
        } else if (rand > 0.8) {
            rand = Math.trunc(rand * 10) + 5;
            other_lingshi = -1 * rand * Time;
            msg.push("\n降妖中不巧碰到兽潮暴动，躲避兽潮浪费时间，导致收益减少" + rand * Time);
        }

        let get_lingshi = lingshi * Time + other_lingshi;//最后获取到的灵石
        await Add_lingshi(usr_qq, get_lingshi);
        msg.push("\n增加灵石" + get_lingshi);

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
