import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import {
    exist_najie_thing_name,
    Add_najie_thing
} from '../../model/public.js'
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
                reg: '^#凡仙堂$',
                fnc: 'ningmenghome',
            },
        ]))
    }
    ningmenghome = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID:e.user_id })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '凡仙堂'
        const map = await gameApi.mapExistence({action, addressName:address_name})
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        const msg = [
            '___[凡仙堂]___\n#购买+物品名*数量\n不填数量,默认为1'
        ]
        const commodities_list = await  gameApi.listAction({ NAME: 'commodities', CHOICE: 'generate_all' })
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
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '凡仙堂'
        const map = await gameApi.mapExistence({action, addressName:address_name})
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        const thing = e.msg.replace('#购买', '')
        const [thing_name, thing_acount] = thing.split('\*')
        let quantity = await gameApi.leastOne(thing_acount)
        if (quantity > 99) {
            quantity = 99
        }
        const Commodities =  await  gameApi.listAction({ NAME: 'commodities', CHOICE: 'generate_all' })
        const ifexist = Commodities.find(item => item.name == thing_name)
        if (!ifexist) {
            e.reply(`[凡仙堂]小二\n不卖:${thing_name}`)
            return
        }
        let money = await exist_najie_thing_name(UID, '下品灵石')
        if (money == 1 || money.acount < ifexist.price * quantity) {
            e.reply(`似乎没有${ifexist.price * quantity}下品灵石`)
            return
        }
        //先扣钱
        await gameApi.userBag({ UID, name: '下品灵石', ACCOUNT: -ifexist.price * quantity })
        //重新把东西丢回去
        let najie = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag' })
        najie = await Add_najie_thing(najie, ifexist, quantity)
        await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag', DATA: najie })
        e.reply(`[凡仙堂]薛仁贵\n你花[${ifexist.price * quantity}]下品灵石购买了[${thing_name}]*${quantity},`)
        return
    }
    Sell_comodities = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const address_name = '凡仙堂'
        const map = await  gameApi.mapExistence({action, addressName:address_name})

        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return
        }
        const thing = e.msg.replace('#出售', '')
        const code = thing.split('\*')
        const [thing_name, thing_acount] = code//数量
        const the = {
            "quantity": 99,
            "najie": {}
        }
        the.quantity = await gameApi.leastOne(thing_acount)
        if (the.quantity > 99) {
            the.quantity = 99
        }
        const najie_thing = await exist_najie_thing_name(UID, thing_name)
        if (najie_thing == 1) {
            e.reply(`[凡仙堂]小二\n你没[${thing_name}]`)
            return
        }
        if (najie_thing.acount < the.quantity) {
            e.reply('[凡仙堂]小二\n数量不足')
            return
        }
        the.najie = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag' })
        the.najie = await Add_najie_thing(the.najie, najie_thing, -the.quantity)
        await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag', DATA: najie })
        const commodities_price = najie_thing.price * the.quantity
        await gameApi.userBag({ UID, name: '下品灵石', ACCOUNT: commodities_price })
        e.reply(`[凡仙堂]欧阳峰\n出售得${commodities_price}下品灵石 `)
        return
    }
}