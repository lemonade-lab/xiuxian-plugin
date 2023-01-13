import robotapi from "../model/robotapi.js"
import { superIndex } from "../model/robotapi.js"
import boxfs from "../model/boxfs.js"
import { __dirname } from "../model/main.js"
export class boxceshi extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#测试$',
                fnc: 'ceshi'
            }
        ]))
    }
    ceshi = async(e)=>{
        //输入一个地址
        const name=boxfs.returnMenu(__dirname)
        name.forEach((item)=>{
            e.reply(item)
        })
        return
    }
}