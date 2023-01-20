import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import botApi from '../../model/robot/api/botapi.js'
import gameApi from '../../model/api/api.js'
export class boxadminwork extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙数据$',
                fnc: 'dataBackups'
            },
            {
                reg: '^#修仙复原.*$',
                fnc: 'dataRecovery'
            }
        ]))
    }
    dataBackups = async (e) => {
        if (!e.isMaster) {
            return
        }
        const msg = gameApi.viewbackups()
        await botApi.forwardMsg({ e, data: msg })
        return
    }
    dataRecovery = async (e) => {
        if (!e.isMaster) {
            return
        }
        const msg = gameApi.backuprecovery({ name: e.msg.replace('#修仙复原', '') })
        await botApi.forwardMsg({ e, data: msg })
        return
    }
}