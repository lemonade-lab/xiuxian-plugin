import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import config from '../../model/config.js'
import { get_najie_img } from '../../model/showdata.js'
import {
    existplayer,
    Go,
    Read_najie,
    addAll,
    exist_najie_thing_name,
    Write_najie
} from '../../model/public.js'
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
        this.xiuxianconfigData = config.getconfig('xiuxian', 'xiuxian')
    }
    showBag = async (e) => {
        const uid = e.user_id
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const img = await get_najie_img(e.user_id)
        e.reply(img)
        return
    }
    bagUp = async (e) => {
        const good = await Go(e)
        if (!good) {
            return
        }
        const uid = e.user_id
        const najie = await Read_najie(uid)
        //根据戒指等级分配价格
        const najie_price = this.xiuxianconfigData.najie_price[najie.grade]
        if (!najie_price) {
            return
        }
        let thing = await exist_najie_thing_name(uid, '下品灵石')
        if (thing == 1 || thing.acount < najie_price) {
            e.reply(`灵石不足,需要准备${najie_price}下品灵石`)
            return
        }
        //等级+1
        najie.grade += 1
        //记录等级
        await Write_najie(uid, najie)
        //扣灵石
        await addAll(uid, -Number(najie_price))
        e.reply(`花了${najie_price}下品灵石升级,目前储物袋为${najie.grade}`)
        return
    }
}