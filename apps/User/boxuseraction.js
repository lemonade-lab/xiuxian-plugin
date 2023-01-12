import robotapi from "../../model/robotapi.js"
import config from '../../model/Config.js'
import { get_najie_img } from '../../model/showdata.js'
import { superIndex } from "../../model/robotapi.js"
import {
    existplayer,
    Go,
    Read_najie,
    addLingshi,
    exist_najie_thing_name,
    Write_najie
} from '../../model/public.js'
export class boxuseraction extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#储物袋$',
                fnc: 'Show_najie'
            },
            {
                reg: '^#升级储物袋$',
                fnc: 'Lv_up_najie'
            }
        ]))
        this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian')
    }
    Show_najie = async (e) => {
        const usr_qq = e.user_id
        const ifexistplay = await existplayer(usr_qq)
        if (!ifexistplay) {
            return
        }
        const img = await get_najie_img(e.user_id)
        e.reply(img)
        return
    }
    Lv_up_najie = async (e) => {
        const good = await Go(e)
        if (!good) {
            return
        }
        const usr_qq = e.user_id
        const najie = await Read_najie(usr_qq)
        //根据戒指等级分配价格
        const najie_price = this.xiuxianConfigData.najie_price[najie.grade]
        let thing = await exist_najie_thing_name(usr_qq, '下品灵石')
        if (thing == 1 || thing.acount < najie_price) {
            e.reply(`灵石不足,需要准备${najie_price}下品灵石`)
            return
        }
        //扣灵石
        await addLingshi(usr_qq, -najie_price)
        //等级+1
        najie.grade += 1
        //记录等级
        await Write_najie(usr_qq, najie)
        e.reply(`花了${najie_price}下品灵石升级,目前储物袋为${najie.grade}`)
        return
    }
}