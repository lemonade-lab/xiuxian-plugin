import robotapi from "../../model/robotapi.js"
import config from '../../model/Config.js'
import { offaction, Read_Life, Write_Life} from '../../model/public.js'
import { superIndex } from "../../model/robotapi.js"
export class UserTask extends robotapi {
    constructor() {
        super(superIndex([
        ]))
        this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian')
        this.set = config.getConfig('task', 'task')
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
            item.Age = item.Age + this.xiuxianConfigData.Age.size
            if (item.Age >= item.life) {
                item.status = 0
                x.push(item.qq)
            }
        })
        for (var i = 0; i < x.length ;i++) {
            await offaction(x[i])
        }
        await Write_Life(life)
    }
}