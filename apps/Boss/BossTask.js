

import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import * as AdminSuper from '../AdminSuper/AdminSuper.js'
/**
 * 定时任务
 */
export class BossTask extends plugin {
    constructor() {
        super({
            name: 'BossTask',
            dsc: 'BossTask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.set = config.getConfig('task', 'task')
        this.task = {
            cron: this.set.BossTask,
            name: 'BossTask',
            fnc: () => this.Bosstask()
        }
    }

    async Bosstask() {
        await AdminSuper.monster();
        return;
    }
}

