import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
import botApi from '../../model/robot/api/botapi.js'
export class boxusertransaction extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#购买.*$',
                fnc: 'Buy_comodities'
            },
            {
                reg: '^#出售.*$',
                fnc: 'Sell_comodities'
            },
            {
                reg: '^#万宝楼$',
                fnc: 'ningmenghome',
            },
        ]))
    }
    ningmenghome = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '万宝楼'
        const map = await gameApi.mapExistence({ action, addressName: address_name })
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        const msg = [
            '___[万宝楼]___\n#购买+物品名*数量\n不填数量,默认为1'
        ]
        const commodities_list = await gameApi.listAction({ NAME: 'commodities', CHOICE: 'generate_all' })
        commodities_list.forEach((item) => {
            const id = item.id.split('-')
            switch (id[0]) {
                case '1': {
                    msg.push(`物品:${item.name}\n攻击:${item.attack}%\n价格:${item.price}`)
                    break
                }
                case '2': {
                    msg.push(`物品:${item.name}\n防御:${item.defense}%\n价格:${item.price}`)
                    break
                }
                case '3': {
                    msg.push(`物品:${item.name}\n暴伤:${item.burstmax}%\n价格:${item.price}`)
                    break
                }
                case '4': {
                    if (id[1] == 1) {
                        msg.push(`物品:${item.name}\n气血:${item.blood}%\n价格:${item.price}`)
                    } else {
                        msg.push(`物品:${item.name}\n修为:${item.experience}\n价格:${item.price}`)
                    }
                    break
                }
                case '5': {
                    msg.push(`物品:${item.name}\n天赋:${item.size}%\n价格:${item.price}`)
                    break
                }
                case '6': {
                    msg.push(`物品:${item.name}\n价格:${item.price}`)
                    break
                }
                default: {
                    break
                }
            }
        })
        await botApi.forwardMsg({ e, data: msg })
        return
    }
    Buy_comodities = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '万宝楼'
        const map = await gameApi.mapExistence({ action, addressName: address_name })
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        const thing = e.msg.replace('#购买', '')
        const [thing_name, thing_acount] = thing.split('\*')
        let quantity = await gameApi.leastOne({ value: thing_acount })
        if (quantity > 99) {
            quantity = 99
        }
        const Commodities = await gameApi.listAction({ NAME: 'commodities', CHOICE: 'generate_all' })
        const ifexist = Commodities.find(item => item.name == thing_name)
        if (!ifexist) {
            e.reply(`[万宝楼]小二\n不卖:${thing_name}`)
            return
        }
        const money = await gameApi.userBagSearch({ UID, name: '下品灵石' })
        if (!money || money.acount < ifexist.price * quantity) {
            e.reply(`似乎没有${ifexist.price * quantity}下品灵石`)
            return
        }
        await gameApi.userBag({ UID, name: '下品灵石', ACCOUNT: -ifexist.price * quantity })
        await gameApi.userBag({ UID, name: ifexist.name, ACCOUNT: quantity })
        e.reply(`[万宝楼]薛仁贵\n你花[${ifexist.price * quantity}]下品灵石购买了[${thing_name}]*${quantity},`)
        return
    }
    Sell_comodities = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '万宝楼'
        const map = await gameApi.mapExistence({ action, addressName: address_name })

        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        const thing = e.msg.replace('#出售', '')
        const code = thing.split('\*')
        const [thing_name, thing_acount] = code
        let quantity = await gameApi.leastOne({ value: thing_acount })
        if (quantity > 99) {
            quantity = 99
        }
        const najie_thing = await gameApi.userBagSearch({ UID, name: thing_name })
        if (!najie_thing) {
            e.reply(`[万宝楼]小二\n你没[${thing_name}]`)
            return
        }
        if (najie_thing.acount < quantity) {
            e.reply('[万宝楼]小二\n数量不足')
            return
        }
        await gameApi.userBag({ UID, name: najie_thing.name, ACCOUNT: -quantity })
        const commodities_price = najie_thing.price * quantity
        await gameApi.userBag({ UID, name: '下品灵石', ACCOUNT: commodities_price })
        e.reply(`[万宝楼]欧阳峰\n出售得${commodities_price}下品灵石 `)
        return
    }
}