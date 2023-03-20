import { plugin } from '../../api/api.js'
import config from "../../model/config.js"
import { AppName } from '../../app.config.js';
import fs from "fs"
export class gamestask extends plugin {
    constructor() {
        super({
            name: 'gamestask',
            dsc: 'gamestask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.set = config.getdefSet('task', 'task')
        this.task = {
            cron: this.set.GamesTask,
            name: 'GamesTask',
            fnc: () => this.Gamestask()
        }
    }

    async Gamestask() {
        //获取缓存中人物列表
        let playerList = [];
        let files = fs
            .readdirSync("./plugins/" + AppName + "/resources/data/xiuxian_player")
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            //获取游戏状态
            let game_action = await redis.get("xiuxian:player:" + player_id + ":game_action");
            //防止继续其他娱乐行为
            if (game_action == 0) {
                await redis.set("xiuxian:player:" + player_id + ":game_action", 1);
                return;
            }
        }
    }
}
