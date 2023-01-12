import robotapi from "../../model/robotapi.js"
import pluginup from '../../model/pluginup.js'
import { superIndex } from "../../model/robotapi.js"
export class boxadminwork extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙数据升级$',
                fnc: 'Xiuxiandataup'
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
}