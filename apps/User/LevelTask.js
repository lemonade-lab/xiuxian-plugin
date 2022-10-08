
import plugin from '../../../../lib/plugins/plugin.js'
import common from "../../../../lib/common/common.js"
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
import { segment } from "oicq"
import { dujie } from "./Level.js"
/**
 * 定时任务渡劫
 */
export class LevelTask extends plugin {
    constructor() {
        super({
            name: 'LevelTask',
            dsc: 'LevelTask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.set = config.getConfig('task', 'task')
        this.task = {
            cron: this.set.action_task,
            name: 'LevelTask',
            fnc: () => this.LevelTask()
        }
    }

    async LevelTask() {
        let playerList = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let log_mag = "";//查询当前人物动作日志信息
            log_mag = log_mag + "查询" + player_id + "是否有动作,";
            let action = await redis.get("xiuxian:player:" + player_id + ":action");
            action = JSON.parse(action);
            if (action != null) {
                let push_address;//消息推送地址
                let is_group = false;//是否推送到群
                if (action.hasOwnProperty("group_id")) {
                    if (Xiuxian.isNotNull(action.group_id)) {
                        is_group = true;
                        push_address = action.group_id;
                    }
                }
                let msg = [segment.at(player_id)];
                let end_time = action.end_time;
                let now_time = new Date().getTime();
                let player = await Xiuxian.Read_player(player_id);
                if (action.power_up == "0") {
                    if (player.power_place == "1") {
                        let power_n = action.power_n;
                        let power_m = action.power_m;
                        var aconut = await redis.get("xiuxian:player:" + player_id + ":power_aconut");
                        let power_distortion = await dujie(player_id);
                        let power_Grade = action.power_Grade;
                        if (now_time <= end_time) {
                            var variable = Math.random() * (power_m - power_n) + power_n;
                            variable = variable + aconut / 10;
                            if (power_distortion >= variable) {
                                if (aconut >= power_Grade) {
                                    msg.push("\n" + player.name + "成功度过了第" + aconut + "道雷劫！可以#羽化登仙，飞升仙界啦！");
                                    await redis.set("xiuxian:player:" + player_id + ":power_aconut", 1);
                                    await Xiuxian.Write_player(player_id, player);
                                    await Xiuxian.offaction(player_id);
                                    if (is_group) {
                                        await this.pushInfo(push_address, is_group, msg)
                                    } else {
                                        await this.pushInfo(player_id, is_group, msg);
                                    }
                                } else {
                                    let act = (variable - power_n)
                                    act = act / (power_m - power_n);
                                    player.nowblood = player.nowblood - player.nowblood * act;
                                    player.nowblood = Math.trunc(player.nowblood);
                                    await Xiuxian.Write_player(player_id, player);
                                    variable = Number(variable);
                                    power_distortion = Number(power_distortion);
                                    msg.push("\n本次雷伤：" + variable.toFixed(2) + "\n本次雷抗：" + power_distortion.toFixed(2) + "\n" + player.name + "成功度过了第" + aconut + "道雷劫！\n下一道雷劫在一分钟后落下！");
                                    aconut = Number(aconut);
                                    aconut++;
                                    await redis.set("xiuxian:player:" + player_id + ":power_aconut", aconut);
                                    aconut = await redis.get("xiuxian:player:" + player_id + ":power_aconut");
                                    if (is_group) {
                                        await this.pushInfo(push_address, is_group, msg)
                                    } else {
                                        await this.pushInfo(player_id, is_group, msg);
                                    }
                                }
                            }
                            else {
                                player.nowblood = 1;
                                player.experience = player.experience * 0.5;
                                player.experience = Math.trunc(player.experience);
                                player.power_place = 1;
                                variable = Number(variable);
                                power_distortion = Number(power_distortion);
                                msg.push("\n本次雷伤" + variable.toFixed(2) + "\n本次雷抗：" + power_distortion + "\n第" + aconut + "道雷劫落下了，可惜" + player.name + "未能抵挡，渡劫失败了！");
                                await redis.set("xiuxian:player:" + player_id + ":power_aconut", 1);
                                await Xiuxian.Write_player(player_id, player);
                                await Xiuxian.offaction(player_id);
                                if (is_group) {
                                    await this.pushInfo(push_address, is_group, msg)
                                } else {
                                    await this.pushInfo(player_id, is_group, msg);
                                }
                            }
                        }
                        else {
                            msg.push(player.name + "陷入了时间轮回，正在拉回！");
                            player.nowblood = 1;
                            player.experience = player.experience * 0.5;
                            player.experience = Math.trunc(player.experience);
                            player.power_place = 1;
                            await redis.set("xiuxian:player:" + player_id + ":power_aconut", 1);
                            await Xiuxian.Write_player(player_id, player);
                            await Xiuxian.offaction(player_id);
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
        user_data[type] = new_num;
        await data.setData("player", user_qq, user_data);
        return;
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
        }
        else {
            await common.relpyPrivate(id, msg);
        }
    }
}
