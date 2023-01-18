import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import {
    Go,
    existplayer,
    exist_najie_thing_name,
    battle,
    Anyarray,
    Add_najie_thing,
    addAll
} from '../../model/public.js'
import botApi from '../../model/robot/api/botapi.js'
import gameApi from '../../model/api/api.js'
export class boxbattle extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#决斗.*$',
                fnc: 'duel'
            },
            {
                reg: '^#攻击.*$',
                fnc: 'attack'
            },
            {
                reg: '^#洗手$',
                fnc: 'handWashing'
            }
        ]))
    }
    duel = async (e) => {
        if (!e.isGroup) {
            return
        }



        const good = await Go(e)
        if (!good) {
            return
        }


        const user = {
            A: e.user_id,
            C: 0,
            QQ: 0,
            p: Math.floor((Math.random() * (99 - 1) + 1))
        }
        user['B'] = await botApi.at({ e })
        const exist = await gameApi.existUserSatus({ UID: user['B'] })
        if (!exist) {
            return
        }
        if (!user['B'] || user['B'] == user['A']) {
            return
        }
        const actionA = await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_action' })
        const actionB = await gameApi.userMsgAction({ NAME: user.B, CHOICE: 'user_action' })
        if (actionA.region != actionB.region) {
            e.reply('此地未找到此人')
            return
        }
        const CDID = '11'
        const now_time = new Date().getTime()
        const CDTime = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.Attack
        const CD = await gameApi.cooling({ UID: user.A, CDID })
        if (CD != 0) {
            e.reply(CD)
            return
        }
        const najie_thing = await exist_najie_thing_name(user.A, '决斗令')
        if (najie_thing == 1) {
            e.reply(`没有决斗令`)
            return
        }
        let bag = await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_bag' })
        bag = await Add_najie_thing(bag, najie_thing, -1)
        await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_bag', DATA: bag })
        user.QQ = await battle(e, user.A, user.B)
        const Level = await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_level' })
        Level.prestige += 1
        await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_level', DATA: Level })
        const LevelB = await gameApi.userMsgAction({ NAME: user.B, CHOICE: 'user_level' })
        const MP = LevelB.prestige * 10 + Number(50)
        if (user.p <= MP) {
            if (user.QQ != user.A) {
                user.C = user.A
                user.A = user.B
                user.B = user.C
            }
            let najieB = await gameApi.userMsgAction({ NAME: user.B, CHOICE: 'user_bag' })
            if (najieB.thing.length != 0) {
                const thing = await Anyarray(najieB.thing)
                najieB.thing = najieB.thing.filter(item => item.name != thing.name)
                await gameApi.userMsgAction({ NAME: user.B, CHOICE: 'user_bag', DATA: najieB })
                let najie = await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_bag' })
                najie = await Add_najie_thing(najie, thing, thing.acount)
                await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_bag', DATA: najie })
                e.reply(`${user.A}夺走了${thing.name}*${thing.acount}`)
            }
        }
        await redis.set(`xiuxian:player:${user.A}:${CDID}`, now_time)
        await redis.expire(`xiuxian:player:${user.A}:${CDID}`, CDTime * 60)
        return
    }
    attack = async (e) => {
        if (!e.isGroup) {
            return
        }
        const good = await Go(e)
        if (!good) {
            return
        }
        const user = {
            A: e.user_id,
            C: 0,
            QQ: 0,
            p: Math.floor((Math.random() * (99 - 1) + 1))
        }
        user['B'] = await botApi.at({ e })
        const exist = await gameApi.existUserSatus({ UID: user['B'] })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        if (!user['B'] || user['B'] == user['A']) {
            return
        }
        const actionA = await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_action' })
        const actionB = await gameApi.userMsgAction({ NAME: user.B, CHOICE: 'user_action' })
        if (actionA.region != actionB.region) {
            e.reply('此地未找到此人')
            return
        }
        if (actionA.address == 1) {
            e.reply('[修仙联盟]普通卫兵:城内不可出手!')
            return
        }
        if (actionB.address == 1) {
            e.reply('[修仙联盟]普通卫兵:城内不可出手!')
            return
        }
        const CDID = '0'
        const now_time = new Date().getTime()
        const CDTime = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.Attack
        const CD = await gameApi.cooling({ UID: user.A, CDID })
        if (CD != 0) {
            e.reply(CD)
            return
        }
        user.QQ = await battle(e, user.A, user.B)
        const Level = await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_level' })
        Level.prestige += 1
        await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_level', DATA: Level })
        const LevelB = await gameApi.userMsgAction({ NAME: user.B, CHOICE: 'user_level' })
        const MP = LevelB.prestige * 10 + Number(50)
        if (user.p <= MP) {
            if (user.QQ != user.A) {
                user.C = user.A
                user.A = user.B
                user.B = user.C
            }
            let najieB = await gameApi.userMsgAction({ NAME: user.B, CHOICE: 'user_bag' })
            if (najieB.thing.length != 0) {
                const thing = await Anyarray(najieB.thing)
                najieB.thing = najieB.thing.filter(item => item.name != thing.name)
                await gameApi.userMsgAction({ NAME: user.B, CHOICE: 'user_bag', DATA: najieB })
                let najie = await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_bag' })
                najie = await Add_najie_thing(najie, thing, thing.acount)
                await gameApi.userMsgAction({ NAME: user.A, CHOICE: 'user_bag', DATA: najie })
                e.reply(`${user.A}夺走了${thing.name}*${thing.acount}`)
            }
        }
        await redis.set(`xiuxian:player:${user.A}:${CDID}`, now_time)
        await redis.expire(`xiuxian:player:${user.A}:${CDID}`, CDTime * 60)
        return
    }
    handWashing = async (e) => {
        const UID = e.user_id
        const ifexistplay = await existplayer(UID)
        if (!ifexistplay) {
            return
        }
        const Level = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_level' })
        const money = 10000 * Level.level_id
        if (Level.prestige > 0) {
            let thing = await exist_najie_thing_name(UID, '下品灵石')
            if (thing == 1 || thing.acount < money) {
                e.reply(`[天机门]韩立\n清魔力需要${money}下品灵石`)
                return
            }
            await addAll(UID, -money)
            Level.prestige -= 1
            await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_level', DATA: Level })
            e.reply('[天机门]南宫问天\n为你清除1点魔力值')
            return
        } else {
            e.reply('[天机门]李逍遥\n你一身清廉')
        }
        return
    }
}