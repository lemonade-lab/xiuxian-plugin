

import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import {Write_Forum,Read_Forum} from '../Xiuxian/Xiuxian.js'


/**
 * 定时任务
 */
export class ForumTask extends plugin {
    constructor() {
        super({
            name: 'ForumTask',
            dsc: 'ForumTask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.set = config.getConfig('task', 'task')
        this.task = {
            cron: this.set.ForumTask,
            name: 'ForumTask',
            fnc: () => this.Forumtask()
        }
    }

    async Forumtask() {
        let Forum = await Read_Forum();
        for (var i = 0; i < Forum.length; i++) {
            Forum = Forum.filter(item => item.qq != Forum[i].qq);
            Write_Forum(Forum);
        }
        return;
    }
}
