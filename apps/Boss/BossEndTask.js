

import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import * as AdminSuper from '../AdminSuper/AdminSuper.js'
/**
 * 定时任务
 */
export class BossEndTask extends plugin {
    constructor() {
        super({
            name: 'BossEndTask',
            dsc: 'BossEndTask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.set = config.getConfig('task', 'task')
        this.task = {
            cron: this.set.BossEndTask,
            name: 'BossEndTask',
            fnc: () => this.Bossendtask()
        }
    }
    async Bossendtask() {
        await AdminSuper.offmonster();
        return;
    }
}
