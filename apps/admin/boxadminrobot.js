import robotapi from "../../model/robotapi.js"
import defset from '../../model/defset.js'
import { superIndex } from "../../model/robotapi.js"
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
        e.reply(defset.Readconfig())
        return
    }
    openRobot = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(defset.openReadconfig())
        return
    }
    CloseRobothelp = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(defset.Readconfighelp())
        return
    }
    openRobothelp = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(defset.openReadconfighelp())
        return
    }
    AddMaster = async (e) => {
        if (!e.isMaster) {
            return
        }
        const QQ = e.msg.replace('#修仙添加主人', '')
        e.reply(defset.AddMaster(QQ))
        return
    }
    DeleteMaster = async (e) => {
        if (!e.isMaster) {
            return
        }
        const QQ = e.msg.replace('#修仙删除主人', '')
        e.reply(defset.DeleteMaster(QQ))
        return
    }
    OffGroup = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(defset.OffGroup())
        return
    }
    OnGroup = async (e) => {
        if (!e.isMaster) {
            return
        }
        e.reply(defset.OnGroup())
        return
    }
}