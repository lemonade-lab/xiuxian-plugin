
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import {__PATH} from '../Xiuxian/Xiuxian.js'
/**
 * 定时任务渡劫
 */
export class UserTask extends plugin {
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
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            //每天检查寿命
        }

    }

}
