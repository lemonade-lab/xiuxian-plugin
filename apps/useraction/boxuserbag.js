import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'


//tudo
import { get_najie_img } from '../../model/showdata.js'
export class boxuserbag extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#储物袋$',
                fnc: 'showBag'
            },
            {
                reg: '^#升级储物袋$',
                fnc: 'bagUp'
            }
        ]))
    }
    showBag = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const img = await get_najie_img(e.user_id)
        e.reply(img)
        return
    }
    bagUp = async (e) => {
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const { MSG } = await gameApi.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const UID = e.user_id
        const najie = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag' })
        //根据戒指等级分配价格
        const najie_price = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).najie_price[najie.grade]
        if (!najie_price) {
            return
        }
        const thing = await gameApi.userBagSearch({ UID, name: '下品灵石' })
        if (!thing || thing.acount < najie_price) {
            e.reply(`灵石不足,需要准备${najie_price}下品灵石`)
            return
        }
        //等级+1
        najie.grade += 1
        //记录等级
        await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag', DATA: najie })
        //扣灵石
        await gameApi.userBag({ UID, name: '下品灵石', ACCOUNT: -Number(najie_price) })
        e.reply(`花了${najie_price}下品灵石升级,目前储物袋为${najie.grade}`)
        return
    }
}