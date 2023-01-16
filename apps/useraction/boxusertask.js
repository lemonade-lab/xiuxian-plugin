import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import config from '../../model/config.js'
import {
    offaction,
    Read_Life,
    Write_Life
} from '../../model/public.js'
export class boxusertask extends robotapi {
    constructor() {
        super(superIndex([
        ]))
        this.xiuxianconfigData = config.getconfig('xiuxian', 'xiuxian')
        this.set = config.getconfig('task', 'task')
        this.task = {
            cron: this.set.LifeTask,
            name: 'LifeTask',
            fnc: () => this.LevelTask()
        }
    }
    LevelTask = async () => {
        const life = await Read_Life()
        const x = []
        life.forEach((item) => {
            item.Age = item.Age + this.xiuxianconfigData.Age.size
            if (item.Age >= item.life) {
                item.status = 0
                x.push(item.qq)
            }
        })
        for (var i = 0; i < x.length; i++) {
            await offaction(x[i])
        }
        await Write_Life(life)
    }
}