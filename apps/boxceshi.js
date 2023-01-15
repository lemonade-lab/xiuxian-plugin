import robotapi from "../model/robotapi.js"
import { superIndex } from "../model/robotapi.js"
import { createBoxPlayer } from "../model/public.js"
export class boxceshi extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#修仙测试$',
                fnc: 'ceshi'
            }
        ]))
    }
    ceshi = async (e) => {
        if (!e.isMaster) {
            return
        }
        await createBoxPlayer(e.user_id)
        e.reply(`成功降临修仙世界\n你可以#前往极西联盟\n进行#联盟报到\n会得到[修仙联盟]的帮助\n也可以使用#位置信息\n查看城市信息\n若想了解自己的身世\n可以#基础信息`)
        return
    }
}