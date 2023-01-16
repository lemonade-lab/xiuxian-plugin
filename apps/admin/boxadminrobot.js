import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import botApi from '../../model/robot/api/botapi.js'
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
        e.reply(botApi.readConfig())
        return
    }
    openRobot = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botApi.openConfig())
        return
    }
    CloseRobothelp = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botApi.readConfigHelp())
        return
    }
    openRobothelp = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botApi.openConfigHelp())
        return
    }
    AddMaster = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botApi.addMaster({
            mastername: e.msg.replace('#修仙添加主人', '')
        }))
        return
    }
    DeleteMaster = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botApi.deleteMaster({
            mastername: e.msg.replace('#修仙删除主人', '')
        }))
        return
    }
    OffGroup = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botApi.offGroup())
        return
    }
    OnGroup = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(botApi.onGroup())
        return
    }
}