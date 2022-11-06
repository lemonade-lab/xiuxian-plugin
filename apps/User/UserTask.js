
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import { offaction, Read_Life, Write_Life, __PATH } from '../Xiuxian/Xiuxian.js'
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
        let life = await Read_Life();
        let x=[];
        life.forEach((item,index,arr) => {
            item.Age = item.Age + 6;
            if (item.Age >= item.life) {
                fs.rmSync(`${__PATH.player}/${item.qq}.json`);
                x.push(item.qq)
                arr.splice(index,1);
                x.push()
            }
        });
        for(var i=0;i<x.length;i++){
            await offaction(x[i]);
        }
        await Write_Life(life);
    }
}
