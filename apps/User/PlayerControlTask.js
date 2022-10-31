
import plugin from '../../../../lib/plugins/plugin.js'
import common from "../../../../lib/common/common.js"
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import {__PATH,isNotNull,Numbers,offaction} from '../Xiuxian/Xiuxian.js'
import { segment } from "oicq";
/**
 * 定时任务
 */
export class PlayerControlTask extends plugin {
    constructor() {
        super({
            name: 'PlayerControlTask',
            dsc: 'PlayerControlTask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
        this.set = config.getConfig('task', 'task')
        this.task = {
            cron: this.set.action_task,
            name: 'PlayerControlTask',
            fnc: () => this.Playercontroltask()
        }
    }

    async Playercontroltask() {
        let playerList = [];
        let files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let log_mag = "";
            log_mag = log_mag + "查询" + player_id + "是否有动作,";
            let action = await redis.get("xiuxian:player:" + player_id + ":action");
            action = JSON.parse(action);
            if (action != null) {
                let push_address;//消息推送地址
                let is_group = false;//是否推送到群
                if (action.hasOwnProperty("group_id")) {
                    if (isNotNull(action.group_id)) {
                        is_group = true;
                        push_address = action.group_id;
                    }
                }
                let msg = [segment.at(player_id)];
                let end_time = action.end_time;
                let now_time = new Date().getTime();
                if (action.shutup == "0") {
                    end_time = end_time - 60000 * 2;
                    if (now_time > end_time) {
                        log_mag += "当前人物未结算，结算状态";
                        let player = data.getData("player", player_id);
                        let now_level_id  = data.Level_list.find(item => item.level_id == player.level_id).level_id;
                        var size = this.xiuxianConfigData.biguan.size;
                        let xiuwei = parseInt((size * now_level_id) * (player.talentsize + 1));//增加的experience
                        let blood = parseInt(player.hpmax * 0.02);
                        let time = parseInt(action.time) / 1000 / 60;//分钟
                        let rand = Math.random();
                        let other_xiuwei = 0;
                        if (rand < 0.2) {
                            rand = Math.trunc(rand * 10) + 45;
                            other_xiuwei = rand * time;
                            msg.push("\n本次闭关顿悟,额外增加修为:" + rand * time);
                        } else if (rand > 0.8) {
                            rand = Math.trunc(rand * 10) + 5;
                            other_xiuwei = -1 * rand * time;
                            msg.push("\n由于你闭关时隔壁装修,导致你差点走火入魔,修为下降" + rand * time);
                        }
                        xiuwei=await Numbers(xiuwei * time);
                        blood=await Numbers(blood * time);
                        await this.setFileValue(player_id, xiuwei + other_xiuwei, "experience");
                        await this.setFileValue(player_id, blood, "nowblood");
                        await offaction(player_id);
                        msg.push("\n增加修为:" + xiuwei * time, "血量增加:" + blood * time);
                        if (is_group) {
                            await this.pushInfo(push_address, is_group, msg)
                        } else {
                            await this.pushInfo(player_id, is_group, msg);
                        }

                    }
                }

                //降妖
                if (action.working == "0") {
                    end_time = end_time - 60000 * 2;
                    //时间过了
                    if (now_time > end_time) {
                        log_mag = log_mag + "当前人物未结算，结算状态";
                        let player = data.getData("player", player_id);
                        let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
                        var size = this.xiuxianConfigData.work.size;
                        let lingshi = size * now_level_id;
                        let time = (parseInt(action.time) / 1000 / 60) * 2;//分钟
                        let other_lingshi = 0;
                        let rand = Math.random();
                        if (rand < 0.2) {
                            rand = Math.trunc(rand * 10) + 40;
                            other_lingshi = rand * time;
                            msg.push("\n本次降妖: " + rand * time);
                        } else if (rand > 0.8) {
                            rand = Math.trunc(rand * 10) + 5;
                            other_lingshi = -1 * rand * time;
                            msg.push("\n由于你的疏忽,货物被人顺手牵羊,老板大发雷霆,灵石减少" + rand * time);
                        }
                        let get_lingshi = lingshi * time + other_lingshi;
                        get_lingshi=await Numbers(get_lingshi);
                        await this.setFileValue(player_id,get_lingshi, "lingshi");
                        await offaction(player_id);
                        msg.push("\n降妖得到" + get_lingshi);
                        log_mag += "收入" + get_lingshi;
                        if (is_group) {
                            await this.pushInfo(push_address, is_group, msg)
                        } else {
                            await this.pushInfo(player_id, is_group, msg);
                        }

                    }
                }

            }
        }

    }

    async setFileValue(user_qq, num, type) {
        let user_data = data.getData("player", user_qq);
        let current_num = user_data[type];//当前lingshi数量
        let new_num = current_num + num;
        if (type == "nowblood" && new_num > user_data.hpmax) {
            new_num = user_data.hpmax;//治疗血量需要判读上限
        }
        new_num=await Numbers(new_num);
        user_data[type] = new_num;
        data.setData("player", user_qq, user_data);
        return;
    }

    async pushInfo(id, is_group, msg) {
        if (is_group) {
            await Bot.pickGroup(id)
                .sendMsg(msg)
                .catch((err) => {
                    Bot.logger.mark(err);
                });
        }
        else {
            await common.relpyPrivate(id, msg);
        }
    }
}
