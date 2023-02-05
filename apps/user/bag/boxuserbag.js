import robotapi from "../../../model/robot/api/api.js"
import { GameApi } from '../../../model/api/gameapi.js'
import { BotApi } from '../../../model/api/botapi.js'
export class boxuserbag extends robotapi {
    constructor() {
        super(BotApi.SuperIndex.getUser({rule:[
            {
                reg: '^#储物袋$',
                fnc: 'showBag'
            },
            {
                reg: '^#升级储物袋$',
                fnc: 'bagUp'
            }
        ]}))
    }
    showBag = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (!await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        const { path, name, data } = await GameApi.Information.userBagShow({ UID })
        const isreply = await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
        await BotApi.User.surveySet({ e, isreply })
        return
    }
    bagUp = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const UID = e.user_id
        const najie = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_bag' })
        const najie_price = GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' }).najie_price[najie.grade]
        if (!najie_price) {
            return
        }
        const thing = await GameApi.GameUser.userBagSearch({ UID, name: '下品灵石' })
        if (!thing || thing.acount < najie_price) {
            e.reply(`灵石不足,需要准备${najie_price}下品灵石`)
            return
        }
        najie.grade += 1
        await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_bag', DATA: najie })
        await GameApi.GameUser.userBag({ UID, name: '下品灵石', ACCOUNT: -Number(najie_price) })
        e.reply(`花了${najie_price}下品灵石升级,目前储物袋为${najie.grade}`)
        return
    }
}