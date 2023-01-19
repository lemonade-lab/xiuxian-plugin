import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { battle } from '../../model/game/public/battel.js'
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
        const existA = await gameApi.existUserSatus({ UID: e.user_id })
        if (!existA) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const { MSG } = await gameApi.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const user = {
            A: e.user_id,
            C: 0,
            QQ: 0,
            p: Math.floor((Math.random() * (99 - 1) + 1))
        }
        user['B'] = await botApi.at({ e })
        if (!user['B']) {
            return
        }
        const existB = await gameApi.existUserSatus({ UID: user['B'] })
        if (!existB) {
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
        const CDID = '11'
        const now_time = new Date().getTime()
        const CDTime = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.Attack
        const { CDMSG } = await gameApi.cooling({ UID: user.A, CDID })
        if (CDMSG) {
            e.reply(CDMSG)
            return
        }
        const najie_thing = await gameApi.userBagSearch({ UID, name: '决斗令' })
        if (!najie_thing) {
            e.reply(`没有决斗令`)
            return
        }
        await gameApi.userBag({ UID: user.A, name: najie_thing.name, ACCOUNT: -1 })
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
                const thing = await gameApi.Anyarray({ ARR: najieB.thing })
                najieB.thing = najieB.thing.filter(item => item.name != thing.name)
                await gameApi.userMsgAction({ NAME: user.B, CHOICE: 'user_bag', DATA: najieB })
                await gameApi.userBag({ UID: user.A, name: thing.name, ACCOUNT: thing.acount })
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
        const existA = await gameApi.existUserSatus({ UID: e.user_id })
        if (!existA) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const { MSG } = await gameApi.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const user = {
            A: e.user_id,
            C: 0,
            QQ: 0,
            p: Math.floor((Math.random() * (99 - 1) + 1))
        }
        user['B'] = await botApi.at({ e })
        if (!user['B']) {
            return
        }
        const existB = await gameApi.existUserSatus({ UID: user['B'] })
        if (!existB) {
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
        const { CDMSG } = await gameApi.cooling({ UID: user.A, CDID })
        if (CDMSG) {
            e.reply(CDMSG)
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
                const thing = await gameApi.Anyarray({ ARR: najieB.thing })
                najieB.thing = najieB.thing.filter(item => item.name != thing.name)
                await gameApi.userMsgAction({ NAME: user.B, CHOICE: 'user_bag', DATA: najieB })
                await gameApi.userBag({ UID: user.A, name: thing.name, ACCOUNT: thing.acount })
                e.reply(`${user.A}夺走了${thing.name}*${thing.acount}`)
            }
        }
        await redis.set(`xiuxian:player:${user.A}:${CDID}`, now_time)
        await redis.expire(`xiuxian:player:${user.A}:${CDID}`, CDTime * 60)
        return
    }
    handWashing = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const Level = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_level' })
        const money = 10000 * Level.level_id
        if (Level.prestige > 0) {
            const thing = await gameApi.userBagSearch({ UID, name: '下品灵石' })
            if (!thing || thing.acount < money) {
                e.reply(`[天机门]韩立\n清魔力需要${money}下品灵石`)
                return
            }
            await gameApi.userBag({ UID, name: '下品灵石', ACCOUNT: -money })
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