import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { GameApi } from '../../model/api/gameapi.js'
export class boxadminswitch extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#盒子开启.*$',
                fnc: 'boxaSwitchOpen'
            },
            {
                reg: '^#盒子关闭.*$',
                fnc: 'boxaSwitchOff'
            }
        ]))
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
}