import robotapi from "../../model/robotapi.js"
import config from '../../model/config.js'
import { superIndex } from "../../model/robotapi.js"
import {
    Go,
    Read_action,
    existplayer,
    GenerateCD,
    exist_najie_thing_name,
    battle,
    Anyarray,
    Read_najie, Add_najie_thing,
    Write_najie,
    Read_level,
    addAll,
    Write_level
} from '../../model/public.js'
import {
    userAt
} from "../../model/boxpublic.js"
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
        this.xiuxianconfigData = config.getconfig('xiuxian', 'xiuxian')
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
        user['B'] = await userAt(e)
        if (!user['B'] || user['B'] == user['A']) {
            return
        }
        const actionA = await Read_action(user.A)
        const actionB = await Read_action(user.B)
        if (actionA.region != actionB.region) {
            e.reply('此地未找到此人')
            return
        }
        const CDid = '11'
        const now_time = new Date().getTime()
        const CDTime = this.xiuxianconfigData.CD.Attack
        const CD = await GenerateCD(user.A, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        const najie_thing = await exist_najie_thing_name(user.A, '决斗令')
        if (najie_thing == 1) {
            e.reply(`没有决斗令`)
            return
        }
        let najie = await Read_najie(user.A)
        najie = await Add_najie_thing(najie, najie_thing, -1)
        await Write_najie(user.A, najie)
        user.QQ = await battle(e, user.A, user.B)
        const Level = await Read_level(user.A)
        Level.prestige += 1
        await Write_level(user.A, Level)
        const LevelB = await Read_level(user.B)
        const MP = LevelB.prestige * 10 + Number(50)
        if (user.p <= MP) {
            if (user.QQ != user.A) {
                user.C = user.A
                user.A = user.B
                user.B = user.C
            }
            let najieB = await Read_najie(user.B)
            if (najieB.thing.length != 0) {
                const thing = await Anyarray(najieB.thing)
                najieB.thing = najieB.thing.filter(item => item.name != thing.name)
                await Write_najie(user.B, najieB)
                let najie = await Read_najie(user.A)
                najie = await Add_najie_thing(najie, thing, thing.acount)
                await Write_najie(user.A, najie)
                e.reply(`${user.A}夺走了${thing.name}*${thing.acount}`)
            }
        }
        await redis.set(`xiuxian:player:${user.A}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${user.A}:${CDid}`, CDTime * 60)
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
        user['B'] = await userAt(e)
        if (!user['B'] || user['B'] == user['A']) {
            return
        }
        const actionA = await Read_action(user.A)
        const actionB = await Read_action(user.B)
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
        const CDid = '0'
        const now_time = new Date().getTime()
        const CDTime = this.xiuxianconfigData.CD.Attack
        const CD = await GenerateCD(user.A, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        user.QQ = await battle(e, user.A, user.B)
        const Level = await Read_level(user.A)
        Level.prestige += 1
        await Write_level(user.A, Level)
        const LevelB = await Read_level(user.B)
        const MP = LevelB.prestige * 10 + Number(50)
        if (user.p <= MP) {
            if (user.QQ != user.A) {
                user.C = user.A
                user.A = user.B
                user.B = user.C
            }
            let najieB = await Read_najie(user.B)
            if (najieB.thing.length != 0) {
                const thing = await Anyarray(najieB.thing)
                najieB.thing = najieB.thing.filter(item => item.name != thing.name)
                await Write_najie(user.B, najieB)
                let najie = await Read_najie(user.A)
                najie = await Add_najie_thing(najie, thing, thing.acount)
                await Write_najie(user.A, najie)
                e.reply(`${user.A}夺走了${thing.name}*${thing.acount}`)
            }
        }
        await redis.set(`xiuxian:player:${user.A}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${user.A}:${CDid}`, CDTime * 60)
        return
    }
    handWashing = async (e) => {
        const uid = e.user_id
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const Level = await Read_level(uid)
        const money = 10000 * Level.level_id
        if (Level.prestige > 0) {
            let thing = await exist_najie_thing_name(uid, '下品灵石')
            if (thing == 1 || thing.acount < money) {
                e.reply(`[天机门]韩立\n清魔力需要${money}下品灵石`)
                return
            }
            await addAll(uid, -money)
            Level.prestige -= 1
            await Write_level(uid, Level)
            e.reply('[天机门]南宫问天\n为你清除1点魔力值')
            return
        } else {
            e.reply('[天机门]李逍遥\n你一身清廉')
        }
        return
    }
}