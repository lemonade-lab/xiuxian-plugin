import robotapi from "../../model/robot/api/api.js"
import { appname } from "../../model/main.js"
import { BotApi } from '../../model/api/botapi.js'
import { GameApi } from '../../model/api/gameapi.js'
export class boxadminaction extends robotapi {
    constructor() {
        super(BotApi.SuperIndex.getUser({
            rule: [
                {
                    reg: '^#修仙更新',
                    fnc: 'allForcecheckout',
                },
                {
                    reg: '^#修仙删除数据$',
                    fnc: 'deleteRedis'
                },
                {
                    reg: '^#修仙删除世界$',
                    fnc: 'deleteAllusers'
                },
                {
                    reg: '^#盒子开启.*$',
                    fnc: 'boxaSwitchOpen'
                },
                {
                    reg: '^#盒子关闭.*$',
                    fnc: 'boxaSwitchOff'
                },
                {
                    reg: '^#修仙配置更改.*',
                    fnc: 'configUpdata',
                },
                {
                    reg: '^#修仙重置配置',
                    fnc: 'configReUpdata',
                },
                {
                    reg: '^#修仙重置图片',
                    fnc: 'imgReUpdata',
                },
                {
                    reg: '^#盒子数据$',
                    fnc: 'dataBackups'
                },
                {
                    reg: '^#盒子复原.*$',
                    fnc: 'dataRecovery'
                }
            ]
        }))
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
    deleteRedis = async (e) => {
        if (!e.isMaster) {
            return
        }
        await GameApi.GamePublic.deleteReids()
        e.reply('删除完成')
        return
    }
    deleteAllusers = async (e) => {
        if (!e.isMaster) {
            return
        }
        await GameApi.GameUser.userMsgAction({ NAME: 'life', CHOICE: 'user_life', DATA: [] })
        await GameApi.GamePublic.deleteReids()
        e.reply('删除完成')
        return
    }
    boxaSwitchOpen = async (e) => {
        if (!e.isMaster) {
            return
        }
        const name = e.msg.replace('#盒子开启', '')
        e.reply(GameApi.DefsetUpdata.updataSwich({ name, swich: true }))
        return
    }
    boxaSwitchOff = async (e) => {
        if (!e.isMaster) {
            return
        }
        const name = e.msg.replace('#盒子关闭', '')
        e.reply(GameApi.DefsetUpdata.updataSwich({ name, swich: false }))
        return
    }
    configUpdata = async (e) => {
        if (!e.isMaster) {
            return
        }
        const [name, size] = e.msg.replace('#修仙配置更改', '').split('\*')
        e.reply(GameApi.DefsetUpdata.updataConfig({ name, size }))
        return
    }
    configReUpdata = async (e) => {
        if (!e.isMaster) {
            return
        }
        GameApi.Createdata.moveConfig({ name: 'updata' })
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
    dataBackups = async (e) => {
        if (!e.isMaster) {
            return
        }
        await BotApi.User.forwardMsg({ e, data: GameApi.Schedule.viewbackups() })
        return
    }
    dataRecovery = async (e) => {
        if (!e.isMaster) {
            return
        }
        await BotApi.User.forwardMsg({ e, data: GameApi.Schedule.backuprecovery({ name: e.msg.replace('#盒子复原', '') }) })
        return
    }
}