import robotapi from "../../model/robotapi.js"
import XiuxianYaml from '../../model/XiuxianYaml.js'
import { superIndex } from "../../model/robotapi.js"
export class AdminYaml extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙配置更改.*',
                fnc: 'configupdata',
            }
        ]))
    }
    configupdata = async (e) => {
        if (!e.isMaster) {
            return
        }
        const config = e.msg.replace('#修仙配置更改', '')
        const code = config.split('\*')
        const [name, size] = code
        e.reply(XiuxianYaml.config(name, size))
        return
    }
}