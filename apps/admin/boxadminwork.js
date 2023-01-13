import robotapi from "../../model/robotapi.js"
import pluginup from '../../model/pluginup.js'
import { superIndex } from "../../model/robotapi.js"
import schedule from "../../model/schedule.js"
import { ForwardMsg } from '../../model/public.js'
export class boxadminwork extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙升级$',
                fnc: 'boxdadaup'
            },
            {
                reg: '^#修仙数据$',
                fnc: 'dataBackups'
            },
            {
                reg: '^#修仙复原.*$',
                fnc: 'datarecovery'
            }
        ]))
    }
    boxdadaup = async (e) => {
        if (!e.isMaster) {
            return
        }
        const msg = pluginup.pluginupdata('xiuxian-emulator-plugin')
        await ForwardMsg(e, msg)
        return
    }
    dataBackups = async (e) => {
        if (!e.isMaster) {
            return
        }
        const msg = schedule.viewbackups()
        await ForwardMsg(e, msg)
        return
    }
    datarecovery = async (e) => {
        if (!e.isMaster) {
            return
        }
        const msg = schedule.backuprecovery(e.msg.replace('#修仙复原', ''))
        await ForwardMsg(e, msg)
        return
    }
}