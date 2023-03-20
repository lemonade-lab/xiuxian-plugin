import { plugin } from '../../api/api.js'
import config from "../../model/config.js"
import { Read_forum, Write_forum } from '../../model/xiuxian.js'
export class forumtask extends plugin {
    constructor() {
        super({
            name: 'forumTask',
            dsc: 'forumTask',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.set = config.getdefSet('task', 'task')
        this.task = {
            cron: this.set.forumTask,
            name: 'forumTask',
            fnc: () => this.forumtask()
        }
    }
    async forumtask() {
        let forum;
        try {
            forum = await Read_forum();
        }
        catch {
            await Write_forum([]);
            forum = await Read_forum();
        }
        for (var i = 0; i < forum.length; i++) {
            forum = forum.filter(item => item.qq != forum[i].qq);
            Write_forum(forum);
        }
        return;
    }
}
