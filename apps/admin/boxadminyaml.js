import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
import { GameApi } from "../../model/api/gameapi.js"
export class boxadminyaml extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙配置更改.*',
                fnc: 'configUpdata',
            },
            {
                reg: '^#修仙配置重置',
                fnc: 'configReUpdata',
            },
            {
                reg: '^#修仙图片重置',
                fnc: 'imgReUpdata',
            }
        ]))
    }
    configUpdata = async (e) => {
        if (!e.isMaster) {
            return
        }
        const [name, size] = e.msg.replace('#修仙配置更改', '').split('\*')
        e.reply(gameApi.updateConfig({ name, size }))
        return
    }
    configReUpdata = async (e) => {
        if (!e.isMaster) {
            return
        }
        gameApi.moveConfig({ name: 'updata' })
        e.reply('配置已重置')
        return
    }
    imgReUpdata = async (e) => {
        if (!e.isMaster) {
            return
        }
        GameApi.Createdata.reImg({
            path: ['help'],
            name: ['help.png', 'icon.png']
        })
        e.reply('图片已重置')
        return
    }
}