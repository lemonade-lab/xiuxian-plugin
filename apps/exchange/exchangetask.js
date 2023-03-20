import { plugin } from '../../api/api.js'
import config from "../../model/config.js"
import fs from "fs"
import { Read_exchange, Write_exchange } from '../../model/xiuxian.js'
import { AppName } from '../../app.config.js'
export class exchangetask extends plugin {
    constructor() {
        super({
            name: 'exchangetask',
            dsc: 'exchangetask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.set = config.getdefSet('task', 'task')
        this.task = {
            cron: this.set.exchangeTask,
            name: 'exchangeTask',
            fnc: () => this.exchangetask()
        }
    }
    async exchangetask() {
        let exchange;
        try {
            exchange = await Read_exchange();
        }
        catch {
            //没有表要先建立一个！
            await Write_exchange([]);
            exchange = await Read_exchange();
        }

        for (var i = 0; i < exchange.length; i++) {
            //自我清除
            exchange = exchange.filter(item => item.qq != exchange[i].qq);
            await Write_exchange(exchange);
        }

        //遍历所有人，清除redis
        let playerList = [];
        let files = fs
            .readdirSync("./plugins/" + AppName + "/resources/data/xiuxian_player")
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            await redis.set("xiuxian:player:" + player_id + ":exchange", 0);
        }
        return;
    }
}
