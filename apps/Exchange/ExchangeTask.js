

import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
/**
 * 定时任务
 */
export class ExchangeTask extends plugin {
    constructor() {
        super({
            name: 'ExchangeTask',
            dsc: 'ExchangeTask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.set = config.getConfig('task', 'task')
        this.task = {
            cron: this.set.ExchangeTask,
            name: 'ExchangeTask',
            fnc: () => this.Exchangetask()
        }
    }

    async Exchangetask() {
        await offExchange();
        return;
    }
}

export async function offExchange() {
    let Exchange = await Xiuxian.Read_Exchange();
    for (var i = 0; i < Exchange.length; i++) {
        Exchange = Exchange.filter(item => item.qq != Exchange[i].qq);
        await Xiuxian.Write_Exchange(Exchange);
    }
    let playerList = [];
    let files = fs
        .readdirSync(Xiuxian.__PATH.player)
        .filter((file) => file.endsWith(".json"));
    for (let file of files) {
        file = file.replace(".json", "");
        playerList.push(file);
    }
    for (let player_id of playerList) {
        await redis.set("xiuxian:player:" + player_id + ":Exchange", 0);
    }
    return;
}
