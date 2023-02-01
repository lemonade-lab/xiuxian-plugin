import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { BotApi } from '../../model/robot/api/botapi.js'
import { GameApi } from '../../model/api/gameapi.js'
export class boxadminwork extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#盒子数据$',
                fnc: 'dataBackups'
            },
            {
                reg: '^#盒子复原.*$',
                fnc: 'dataRecovery'
            }
        ]))
    }
    dataBackups = async (e) => {
        if (!e.isMaster) {
            return
        }
        await BotApi.User.forwardMsg({ e, data: GameApi.Schedule.viewbackups() })
        return
    }
    dataRecovery = async (e) => {
        if (!e.isMaster) {
            return
        }
        await BotApi.User.forwardMsg({ e, data: GameApi.Schedule.backuprecovery({ name: e.msg.replace('#盒子复原', '') }) })
        return
    }
}