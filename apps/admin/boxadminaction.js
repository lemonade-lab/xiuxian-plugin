import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { appname } from "../../model/main.js"
import gameApi from '../../model/api/api.js'
import botApi from "../../model/robot/api/botapi.js"
export class boxadminaction extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙更新',
                fnc: 'Allforcecheckout',
            }
        ]))
        this.key = 'xiuxian:restart'
    }

    Allforcecheckout = async (e) => {
        if (!e.isMaster) {
            return
        }
        const filepath = `./plugins/${appname}/plugins/`
        const cmd = 'git  pull'
        const sum = gameApi.returnMenu(filepath)
        await botApi.execStart({
            cmd,
            cwd: `${process.cwd()}/plugins/${appname}/`,
            name: appname,
            e
        })
        sum.forEach(async (item) => {
            await botApi.execStart({
                cmd,
                cwd: `${process.cwd()}/plugins/${appname}/plugins/${item}`,
                name: item,
                e
            })
        })
        gameApi.moveConfig('updata')
        const data = {
            version: await gameApi.getConfig({
                app: 'version',
                name: 'version'
            })
        }
        const img = await botApi.showPuppeteer({ path: 'updata', name: 'updata', data })
        e.reply(img)
        return
    }
}