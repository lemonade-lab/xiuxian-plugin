import plugin from '../../../../lib/plugins/plugin.js';
import config from '../../model/Config.js';
import { offaction, Read_Life, Write_Life, __PATH } from '../Xiuxian/Xiuxian.js';
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
        this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian');
        this.set = config.getConfig('task', 'task');
        this.task = {
            cron: this.set.LifeTask,
            name: 'LifeTask',
            fnc: () => this.LevelTask()
        };
    };
    LevelTask = async () => {
        const life = await Read_Life();
        const x = [];
        life.forEach((item) => {
            item.Age = item.Age + this.xiuxianConfigData.Age.size;
            if (item.Age >= item.life) {
                x.push(item.qq);
                item.status = 0;
            };
        });
        for (var i = 0; i < x.length; i++) {
            await offaction(x[i]);
        };
        await Write_Life(life);
    };
};