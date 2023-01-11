import robotapi from "../../model/robotapi.js"
import config from '../../model/Config.js'
import { get_najie_img } from '../../model/showdata.js'
import { superIndex } from "../../model/robotapi.js"
import {
    existplayer,
    Go,
    Read_najie,
    addLingshi,
    Write_najie,
    Read_wealth
} from '../../model/public.js'
export class UserAction extends robotapi {
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
        const player = await Read_wealth(usr_qq)
        const najie_num = this.xiuxianConfigData.najie_num
        const najie_price = this.xiuxianConfigData.najie_price
        if (najie.grade == najie_num.length) {
            e.reply('已经是最高级的了')
            return
        }
        if (player.lingshi < najie_price[najie.grade]) {
            e.reply(`灵石不足,还需要准备${najie_price[najie.grade] - player.lingshi}灵石`)
            return
        }
        await addLingshi(usr_qq, -najie_price[najie.grade])
        najie.lingshimax = najie_num[najie.grade]
        najie.grade += 1
        await Write_najie(usr_qq, najie)
        e.reply(`花了${najie_price[najie.grade - 1]}灵石升级,目前灵石存储上限为${najie.lingshimax}`)
        return
    }
}