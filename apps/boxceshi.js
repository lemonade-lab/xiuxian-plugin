import robotapi from "../model/robot/api/api.js"
import { superIndex } from "../model/robot/api/api.js"
import gameApi from '../model/api/api.js'
import botApi from '../model/robot/api/botapi.js'
export class boxceshi extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#测试$',
                fnc: 'ceshi'
            }
        ]))
    }
    ceshi = async (e) => {
        console.lof('测试')
        return
    }
}