import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
import { BotApi } from '../../model/robot/api/botapi.js'
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
        if (!await gameApi.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const { path, name, data } = await gameApi.userBagShow({ UID })
        await e.reply(await BotApi.Imgindex.showPuppeteer({ path, name, data }))
        return
    }
    bagUp = async (e) => {
        if (!await gameApi.existUserSatus({ UID: e.user_id })) {
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
        const najie_price = gameApi.getConfig({ app: 'parameter', name: 'cooling' }).najie_price[najie.grade]
        if (!najie_price) {
            return
        }
        const thing = await gameApi.userBagSearch({ UID, name: '下品灵石' })
        if (!thing || thing.acount < najie_price) {
            e.reply(`灵石不足,需要准备${najie_price}下品灵石`)
            return
        }
        najie.grade += 1
        await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag', DATA: najie })
        await gameApi.userBag({ UID, name: '下品灵石', ACCOUNT: -Number(najie_price) })
        e.reply(`花了${najie_price}下品灵石升级,目前储物袋为${najie.grade}`)
        return
    }
}