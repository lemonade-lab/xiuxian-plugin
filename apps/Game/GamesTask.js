

import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import { __PATH} from '../Xiuxian/Xiuxian.js'

/**
 * 定时任务
 */
export class GamesTask extends plugin {
    constructor() {
        super({
            name: 'GamesTask',
            dsc: 'GamesTask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.set = config.getConfig('task', 'task')
        this.task = {
            cron: this.set.GamesTask,
            name: 'GamesTask',
            fnc: () => this.Gamestask()
        }
    }

    async Gamestask() {
        let playerList = [];
        let files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let game_action = await redis.get("xiuxian:player:" + player_id + ":game_action");
            if (game_action == 0) {
                await redis.set("xiuxian:player:" + player_id + ":game_action", 1);
                return;
            }
        }
    }
}
