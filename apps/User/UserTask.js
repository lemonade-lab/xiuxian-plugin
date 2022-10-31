
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import { offaction, Read_Life, Write_Life, __PATH } from '../Xiuxian/Xiuxian.js'
/**
 * 定时任务渡劫
 */
export class UserTask extends plugin {
    constructor() {
        super({
            name: 'LifeTask',
            dsc: 'LifeTask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.set = config.getConfig('task', 'task')
        this.task = {
            cron: this.set.LifeTask,
            name: 'LifeTask',
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
            let life = await Read_Life();
            //每1小时+1
            life = life.find(item => item.qq == player_id);
            life.forEach((item) => {
                if (item.qq == usr_qq) {
                    item.Age = item.Age + 1;
                }
            });
            if (life.Age >= life.life) {
                //删信息，删账号
                fs.rmSync(`${__PATH.player}/${player_id}.json`);
                await offaction(player_id);
                life = await life.filter(item => item.qq != player_id);
            }
            //保存新信息
            await Write_Life(life);
        }

    }

}
