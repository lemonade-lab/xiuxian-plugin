import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { segment } from 'oicq'
import {
    Go,
    Read_level,
    existplayer,
    Write_action,
    exist_najie_thing_name,
    addAll,
    Read_battle,
    returnPosirion,
    returnPoint
} from '../../model/public.js'
import gameApi from '../../model/api/api.js'
import botApi from '../../model/robot/api/botapi.js'
const forwardsetTime = []
const deliverysetTime = []
const useraction = []
export class boxsecretplace extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#坐标信息$',
                fnc: 'xyzaddress'
            },
            {
                reg: '^#前往.*$',
                fnc: 'forward'
            },
            {
                reg: '^#回到原地$',
                fnc: 'returnpiont'
            },
            {
                reg: '^#传送.*$',
                fnc: 'delivery'
            },
            {
                reg: '^#位置信息$',
                fnc: 'show_city'
            }
        ]))
    }
    show_city = async (e) => {
        const UID = e.user_id
        const ifexistplay = await existplayer(UID)
        if (!ifexistplay) {
            return
        }
        const action = await gameApi.userMsgAction({ NAME:UID, CHOICE: 'user_action' })
        if (action.address != 1) {
            e.reply('你对这里并不了解...')
            return
        }
        const addressId = `${action.z}-${action.region}-${action.address}`
        const point = await returnPoint()
        const address = []
        const msg = []
        point.forEach((item) => {
            if (item.id.includes(addressId)) {
                address.push(item)
            }
        })
        address.forEach((item) => {
            msg.push(`地点名:${item.name}\n坐标(${item.x},${item.y})`)
        })
        await botApi.forwardMsg({e,data:msg}) 
        return
    }
    returnpiont = async (e) => {
        if (!e.isGroup) {
            return
        }
        const good = await Go(e)
        if (!good) {
            return
        }
        const UID = e.user_id
        forwardsetTime[UID] = 0
        clearTimeout(useraction[UID])
        e.reply('你回到了原地')
        return
    }
    xyzaddress = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        const ifexistplay = await existplayer(UID)
        if (!ifexistplay) {
            return
        }
        const action = await gameApi.userMsgAction({ NAME:UID, CHOICE: 'user_action' })
        e.reply(`坐标(${action.x},${action.y},${action.z})`)
        return
    }
    forward = async (e) => {
        if (!e.isGroup) {
            return
        }
        const good = await Go(e)
        if (!good) {
            return
        }
        const UID = e.user_id
        if (forwardsetTime[UID] == 1) {
            return
        }
        const action =await gameApi.userMsgAction({ NAME:UID, CHOICE: 'user_action' })
        const x = action.x
        const y = action.y
        const address = e.msg.replace('#前往', '')
        const Point = await returnPoint()
        const point = Point.find(item => item.name == address)
        if (!point) {
            return
        }
        const mx = point.x
        const my = point.y
        const PointId = point.id.split('-')
        const level = await Read_level(UID)
        if (level.level_id < PointId[3]) {
            e.reply('[修仙联盟]守境者\n道友请留步')
            return
        }
        const a = x - mx >= 0 ? x - mx : mx - x
        const b = y - my >= 0 ? y - my : my - y
        const battle = await Read_battle(UID)
        const the = Math.floor((a + b) - (a + b) * battle.speed * 0.01)
        const time = the >= 0 ? the : 1
        useraction[UID] = setTimeout(async () => {
            forwardsetTime[UID] = 0
            action.x = mx
            action.y = my
            action.region = PointId[1]
            action.address = PointId[2]
            await Write_action(UID, action)
            e.reply([segment.at(UID), `成功抵达${address}`])
        }, 1000 * time)
        forwardsetTime[UID] = 1
        e.reply(`正在前往${address}...\n需要${time}秒`)
        return
    }
    delivery = async (e) => {
        if (!e.isGroup) {
            return
        }
        const good = await Go(e)
        if (!good) {
            return
        }
        const UID = e.user_id
        if (deliverysetTime[UID] == 1) {
            return
        }
        const action = await gameApi.userMsgAction({ NAME:UID, CHOICE: 'user_action' })
        const x = action.x
        const y = action.y
        const address = e.msg.replace('#传送', '')
        const Posirion = await returnPosirion()
        const position = Posirion.find(item => item.name == address)
        if (!position) {
            return
        }
        const positionID = position.id.split('-')
        const level = await Read_level(UID)
        if (level.level_id < positionID[3]) {
            e.reply('[修仙联盟]守境者\n道友请留步')
            return
        }
        const point = await returnPoint()
        let key = 0
        point.forEach((item) => {
            const pointID = item.id.split('-')
            if (pointID[4] == 2) {
                if (item.x == x) {
                    if (item.y = y) {
                        key = 1
                    }
                }
            }
        })
        if (key == 0) {
            return
        }
        const lingshi = 1000
        let money = await exist_najie_thing_name(UID, '下品灵石')
        if (money == 1 || money.acount < lingshi) {
            e.reply(`[修仙联盟]守阵者\n需要花费${lingshi}下品灵石`)
            return
        }
        //先扣钱
        await addAll(UID, -lingshi)
        const mx = Math.floor((Math.random() * (position.x2 - position.x1))) + Number(position.x1)
        const my = Math.floor((Math.random() * (position.y2 - position.y1))) + Number(position.y1)
        const the = Math.floor(((x - mx >= 0 ? x - mx : mx - x) + (y - my >= 0 ? y - my : my - y)) / 100)
        const time = the > 0 ? the : 1
        setTimeout(async () => {
            deliverysetTime[UID] = 0
            action.x = mx
            action.y = my
            action.region = positionID[1]
            action.address = positionID[2]
            await Write_action(UID, action)
            e.reply([segment.at(UID), `成功传送至${address}`])
        }, 1000 * time)
        deliverysetTime[UID] = 1
        e.reply(`[修仙联盟]守阵者\n传送对接${address}\n需要${time}秒`)
        return
    }
}