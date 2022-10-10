
import plugin from '../../../../lib/plugins/plugin.js'
import common from "../../../../lib/common/common.js"
import config from "../../model/Config.js"
import fs from "node:fs"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
import { segment } from "oicq"
/**
 * 定时任务
 */
export class SecretPlaceTask extends plugin {
    constructor() {
        super({
            name: 'SecretPlaceTask',
            dsc: 'SecretPlaceTask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
        this.set = config.getConfig('task', 'task')
        this.task = {
            cron: this.set.action_task,
            name: 'SecretPlaceTask',
            fnc: () => this.Secretplacetask()
        }
    }

    async Secretplacetask() {
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
            action = await JSON.parse(action);
            if (action != null) {
                let push_address;//消息推送地址
                let is_group = false;//是否推送到群
                if (await action.hasOwnProperty("group_id")) {
                    if (Xiuxian.isNotNull(action.group_id)) {
                        is_group = true;
                        push_address = action.group_id;
                    }
                }
                let msg = [segment.at(player_id)];
                let end_time = action.end_time;
                let now_time = new Date().getTime();
                let player = await Xiuxian.Read_player(player_id);
                if (action.Place_action == "0") {
                    end_time = end_time - 60000 * 2;
                    if (now_time > end_time) {
                        let variable = Math.random() * (9 - 0) + 0;
                        let monster_list=data.monster_list[variable];
                        monster_list.nowattack=player.nowattack*monster_list.nowattack;
                        monster_list.nowdefense=player.nowdefense*monster_list.nowdefense;
                        monster_list.nowblood=player.nowblood*monster_list.nowblood;
                        monster_list.bursthurt=player.bursthurt*monster_list.bursthurt;
                        let Data_battle =  await Xiuxian.battlemax(player_id, monster_list);
                        let msg0 = Data_battle.msg;
                        if (msg0.length < 30) {
                            await Xiuxian.ForwardMsg(e, msg0);
                        } 
                        if (Data_battle.victory == player_id) {
                            msg.push("你击败了对方，并夺走了他的宝物");
                        } 
                        else {
                            msg.push("你被对方打败了！并被抢走了1灵石");
                        }
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
