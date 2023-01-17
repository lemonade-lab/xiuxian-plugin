import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import {
    offaction,
    Read_Life,
    Write_Life
} from '../../model/public.js'
import gameApi from '../../model/api/api.js'
export class boxusertask extends robotapi {
    constructor() {
        super(superIndex([]))
        //意思就是继承过来的机器人函数在配置task后会执行指定函数？
        //这个配置其实可以自己写
        //tudo
        this.task = {
            cron: gameApi.getConfig({ app: 'task', name: 'task' }).LifeTask,
            name: 'LifeTask',
            fnc: () => this.LevelTask()
        }
    }
    LevelTask = async () => {
        const life = await Read_Life()
        const x = []
        life.forEach((item) => {
            item.Age = item.Age + gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).Age.size
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