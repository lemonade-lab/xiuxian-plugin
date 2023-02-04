import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { appname } from "../../model/main.js"
import { BotApi } from "../../model/robot/api/botapi.js"
export class boxadminaction extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙更新',
                fnc: 'allForcecheckout',
            }
        ]))
        this.key = 'xiuxian:restart'
    }
    allForcecheckout = async (e) => {
        if (!e.isMaster) {
            return
        }
        await BotApi.Exec.execStart({
            cmd: 'git  pull',
            cwd: `${process.cwd()}/plugins/${appname}/`,
            name: appname,
            e
        })
        return
    }
}