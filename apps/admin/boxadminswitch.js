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
            },
            {
                reg: '^#盒子开关$',
                fnc: 'boxaSwitch'
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
    boxaSwitch = async (e) => {
        if (!e.isMaster) {
            return
        }
        const cf = await GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' })
        const Ttwist = cf['switch'] ? cf['switch']['twist'] : true
        const Tcome = cf['switch'] ? cf['switch']['come'] : true
        e.reply(`[盒子开关]\n戳一戳:${Ttwist ? '开启' : '关闭'}\n自动降临:${Tcome ? '开启' : '关闭'}\n指令:盒子+开启/关闭+选项`)
        return
    }
}