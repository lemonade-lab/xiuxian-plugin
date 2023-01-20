import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
export class boxadminyaml extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙配置更改.*',
                fnc: 'configUpdata',
            }
        ]))
    }
    configUpdata = async (e) => {
        if (!e.isMaster) {
            return
        }
        const config = e.msg.replace('#修仙配置更改', '')
        const code = config.split('\*')
        const [name, size] = code
        e.reply(gameApi.updateConfig({ name, size }))
        return
    }
}