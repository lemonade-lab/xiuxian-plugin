
import plugin from '../../../../lib/plugins/plugin.js'
import common from "../../../../lib/common/common.js"
import config from "../../model/Config.js"
import fs from "node:fs"
import data from '../../model/XiuxianData.js'
import {__PATH,isNotNull,Read_player,Numbers,battlemax,search_thing,offaction,Read_najie } from '../Xiuxian/Xiuxian.js'
import { Add_najie_thing_ring,Add_najie_thing_arms,Add_najie_thing_huju,Add_najie_thing_fabao,Add_najie_thing_danyao,Add_najie_thing_gonfa,Add_najie_thing_daoju } from '../Xiuxian/Xiuxian.js'

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
            .readdirSync(__PATH.player)
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
                    if (isNotNull(action.group_id)) {
                        is_group = true;
                        push_address = action.group_id;
                    }
                }
                let msg = [player_id];
                let end_time = action.end_time;
                let now_time = new Date().getTime();
                let player = await Read_player(player_id);
                if (action.Place_action == "0") {
                    end_time = end_time - 60000 * 2;
                    if (now_time > end_time) {
                        let variable = Math.random() * (10 - 1) + 1;
                        variable = await Numbers(variable);
                        variable = variable - 1;
                        let monster_list = data.monster_list[variable];
                        monster_list.nowattack = player.nowattack * monster_list.nowattack;
                        monster_list.nowdefense = player.nowdefense * monster_list.nowdefense;
                        monster_list.nowblood = player.nowblood * monster_list.nowblood;
                        monster_list.bursthurt = player.bursthurt * monster_list.bursthurt;
                        let Data_battle = await battlemax(player_id, monster_list);
                        let msg0 = Data_battle.msg;
                        if (msg0.length < 30) {
                            msg.push(msg0);
                        }
                        if (Data_battle.victory == player_id) {
                            var x = this.xiuxianConfigData.SecretPlace.one;
                            let random1 = Math.random();
                            var y = this.xiuxianConfigData.SecretPlace.two;
                            let random2 = Math.random();
                            var z = this.xiuxianConfigData.SecretPlace.three;
                            let random3 = Math.random();
                            let random4;
                            if (random1 <= x) {
                                let weizhi = action.Place_address;
                                let thing_name;
                                if (random2 <= y) {
                                    if (random3 <= z) {
                                        random4 = Math.floor(Math.random() * (weizhi.three.length));
                                        thing_name = weizhi.three[random4].name;
                                        msg.push("蹲在草丛中躲避妖兽，不巧撞见深入陷阱的" + monster_list.name + "，决定趁机打劫，并夺走了他的"+thing_name);
                                    }
                                    else {
                                        random4 = Math.floor(Math.random() * (weizhi.two.length));
                                        thing_name = weizhi.two[random4].name;
                                        msg.push("蹲在草丛中躲避妖兽，不巧撞见蹲在旁边的" + monster_list.name + "，决定趁机打劫，并夺走了他的"+thing_name);
                                    }
                                }
                                else {
                                    random4 = Math.floor(Math.random() * (weizhi.one.length));
                                    thing_name = weizhi.one[random4].name;
                                    msg.push("蹲在草丛中躲避妖兽，不巧撞见走在路上的" + monster_list.name + "，决定趁机打劫，并夺走了他的"+thing_name);
                                }
                                //得宝物
                                let searchsthing = await search_thing(thing_name);
                                let najie = await Read_najie(player_id);player_id
                                if (searchsthing.class == 1) {
                                    najie = await Add_najie_thing_arms(najie, searchsthing, 1);
                                }
                                else if (searchsthing.class == 2) {
                                    najie = await Add_najie_thing_huju(najie, searchsthing, 1);
                                }
                                else if (searchsthing.class == 3) {
                                    najie = await Add_najie_thing_fabao(najie, searchsthing, 1);
                                }
                                else if (searchsthing.class == 4) {
                                    najie = await Add_najie_thing_danyao(najie, searchsthing, 1);
                                }
                                else if (searchsthing.class == 5) {
                                    najie = await Add_najie_thing_gonfa(najie, searchsthing, 1);
                                }
                                else if (searchsthing.class == 6) {
                                    najie = await Add_najie_thing_daoju(najie, searchsthing, 1);
                                }
                                else if (searchsthing.class == 7) {
                                    najie = await Add_najie_thing_ring(najie, searchsthing, 1);
                                }
                                await Write_najie(player_id, najie);
                            }
                            else {
                                msg.push("蹲在草丛中躲避妖兽，不巧撞见走在路上的" + monster_list.name + "，决定趁机打劫，却发现对方是个穷逼！");
                            }
                        }
                        else {
                            let lingshi=1;
                            if(player.lingshi>=2){
                                lingshi=player.lingshi-1;
                                if(lingshi>10000){
                                    lingshi=10000;
                                }
                                msg.push("蹲在草丛中躲避妖兽，不巧撞见走在路上的" + monster_list.name + "，决定趁机打劫，却被对方夺走了"+lingshi+"灵石！");
                                await Add_lingshi(player_id, -10000);
                            }else{
                                msg.push("蹲在草丛中躲避妖兽，不巧撞见走在路上的" + monster_list.name + "，撒腿就跑！");
                            }
                        }
                        
                        await Add_experiencemax(player_id, 800);
                        await offaction(player_id);
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
