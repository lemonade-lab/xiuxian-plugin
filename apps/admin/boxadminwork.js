import robotapi from "../../model/robotapi.js"
import pluginup from '../../model/pluginup.js'
import { superIndex } from "../../model/robotapi.js"
export class boxadminwork extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙升级$',
                fnc: 'Xiuxiandataup'
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
    Xiuxiandataup = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(pluginup.pluginupdata('xiuxian-emulator-plugin'))
        return
    }
    dataBackups = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply('待更新')
        return
    }
    datarecovery = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply('待更新')
        return
    }
}