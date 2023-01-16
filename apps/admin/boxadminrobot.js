import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import botapi from '../../model/robot/api/botapi.js'
export class boxadminrobot extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙关闭云崽',
                fnc: 'closeRobot',
            },
            {
                reg: '^#修仙开启云崽',
                fnc: 'openRobot',
            },

            {
                reg: '^#修仙关闭云崽帮助',
                fnc: 'CloseRobothelp',
            },
            {
                reg: '^#修仙开启云崽帮助',
                fnc: 'openRobothelp',
            },
            {
                reg: '^#修仙添加主人.*',
                fnc: 'AddMaster',
            },
            {
                reg: '^#修仙删除主人.*',
                fnc: 'DeleteMaster',
            },
            {
                reg: '^#修仙开启云崽私聊',
                fnc: 'OnGroup',
            },
            {
                reg: '^#修仙关闭云崽私聊',
                fnc: 'OffGroup',
            }
        ]))
    }
    closeRobot = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botapi.readConfig())
        return
    }
    openRobot = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botapi.openConfig())
        return
    }
    CloseRobothelp = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botapi.readConfigHelp())
        return
    }
    openRobothelp = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botapi.openConfigHelp())
        return
    }
    AddMaster = async (e) => {
        if (!e.isMaster) {
            return
        }
        const QQ = e.msg.replace('#修仙添加主人', '')
        e.reply(botapi.addMaster({
            mastername: QQ
        }))
        return
    }
    DeleteMaster = async (e) => {
        if (!e.isMaster) {
            return
        }
        const QQ = e.msg.replace('#修仙删除主人', '')
        e.reply(botapi.deleteMaster({
            mastername: QQ
        }))
        return
    }
    OffGroup = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botapi.offGroup())
        return
    }
    OnGroup = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botapi.onGroup())
        return
    }
}