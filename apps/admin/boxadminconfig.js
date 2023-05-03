import { GameApi, plugin, name, dsc, verify } from '../../model/api/api.js'
export class boxadminconfig extends plugin {
    constructor() {
        super({
            name,
            dsc,
            rule: [
                { reg: '^#盒子开启.*$', fnc: 'boxaSwitchOpen' },
                { reg: '^#盒子关闭.*$', fnc: 'boxaSwitchOff' },
                { reg: '^#修仙配置更改.*', fnc: 'configUpdata' },
                { reg: '^#修仙重置配置', fnc: 'configReUpdata' },
                { reg: '^#修仙启动@2.0.0', fnc: 'boxStart' },
                { reg: '^#修仙停止@2.0.0$', fnc: 'boxStop' },
            ]
        })
    }

    boxStart = async (e) => {
        if (!e.isMaster) return false
        if (!e.isGroup || e.user_id == 80000000) return false
        e.reply(GameApi.DefsetUpdata.startGame(e.group_id,e.group_name))
        return false
    }

    boxStop = async (e) => {
        if (!e.isMaster) return false
        if (!e.isGroup || e.user_id == 80000000) return false
        e.reply(GameApi.DefsetUpdata.stopGame(e.group_id,e.group_name))
        return false
    }

    boxaSwitchOpen = async (e) => {
        if (!e.isMaster) return false
        if (!verify(e)) return false
        const name = e.msg.replace('#盒子开启', '')
        e.reply(GameApi.DefsetUpdata.updataSwich({ name, swich: true }))
        return false
    }
    boxaSwitchOff = async (e) => {
        if (!e.isMaster) return false
        if (!verify(e)) return false
        const name = e.msg.replace('#盒子关闭', '')
        e.reply(GameApi.DefsetUpdata.updataSwich({ name, swich: false }))
        return false
    }
    configUpdata = async (e) => {
        if (!e.isMaster) return false
        if (!verify(e)) return false
        const [name, size] = e.msg.replace('#修仙配置更改', '').split('*')
        e.reply(GameApi.DefsetUpdata.updataConfig({ name, size }))
        return false
    }
    configReUpdata = async (e) => {
        if (!e.isMaster) return false
        if (!verify(e)) return false
        GameApi.Createdata.moveConfig({ name: 'updata' })
        e.reply('配置已重置')
        return false
    }
}
