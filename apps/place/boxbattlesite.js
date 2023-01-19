import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { Add_experiencemax } from '../../model/public.js'
import { monsterbattle } from '../../model/game/public/battel.js'
import gameApi from '../../model/api/api.js'
import botApi from '../../model/robot/api/botapi.js'
export class boxbattlesite extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#击杀.*$',
                fnc: 'Kill'
            },
            {
                reg: '^#探索怪物$',
                fnc: 'Exploremonsters'
            }
        ]))
    }
    Kill = async (e) => {
        if (!e.isGroup) {
            return
        }
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const { MSG } = await gameApi.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const UID = e.user_id
        const CDID = '10'
        const now_time = new Date().getTime()
        const CDTime = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.Kill
        const { CDMSG } = await gameApi.cooling({ UID, CDID })
        if (CDMSG) {
            e.reply(CDMSG)
            return
        }
        const name = e.msg.replace('#击杀', '')
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const monstersdata = await gameApi.monsterscache({ i: action.region })
        const mon = monstersdata.find(item => item.name == name)
        if (!mon) {
            e.reply(`这里没有${name},去别处看看吧`)
            return
        }
        const acount = await gameApi.add({ i: action.region, num: Number(1) })
        const msg = [`${UID}的[击杀结果]\n注:怪物每1小时刷新\n物品掉落率=怪物等级*5%`]
        const buff = {
            "msg": 1
        }
        if (acount == 1) {
            buff.msg = Math.floor((Math.random() * (20 - 5))) + Number(5)
            msg.push('怪物突然变异了!')
        }
        const Levellist = await gameApi.listAction({ NAME: 'Level_list', CHOICE: 'generate_level' })
        const LevelMax = Levellist.find(item => item.id == mon.level + 1)
        const monsters = {
            'nowblood': LevelMax.blood * buff.msg,
            'attack': LevelMax.attack * buff.msg,
            'defense': LevelMax.defense * buff.msg,
            'blood': LevelMax.blood * buff.msg,
            'burst': LevelMax.burst + LevelMax.id * 5 * buff.msg,
            'burstmax': LevelMax.burstmax + LevelMax.id * 10 * buff.msg,
            'speed': LevelMax.speed + 5 + buff.msg
        }
        const battle = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_battle' })
        const talent = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_talent' })
        const mybuff = Math.floor(talent.talentsize / 100) + Number(1)
        const battle_msg = await monsterbattle(e, battle, monsters)
        battle_msg.msg.forEach((item) => {
            msg.push(item)
        })
        if (battle_msg.QQ != 0) {
            const m = Math.floor((Math.random() * (100 - 1))) + Number(1)
            if (m < (mon.level + 1) * 5) {
                const randomthinf = await gameApi.randomThing()
                let najie = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag' })
                if (najie.thing.length <= najie.grade * 10) {
                    await gameApi.userBag({ UID, name: randomthinf.name, ACCOUNT: randomthinf.acount })
                    msg.push(`得到[${randomthinf.name}]`)
                } else {
                    msg.push('储物袋已满')
                }
            }
            if (m < (mon.level + 1) * 6) {
                const qixue = mon.level * 25 * mybuff
                msg.push(`得到${qixue}气血`)
                await Add_experiencemax(UID, qixue)
            }
            if (m < (mon.level + 1) * 7) {
                const lingshi = await gameApi.leastOne({ value: mon.level * 2 })
                msg.push(`得到${lingshi}上品灵石`)
                await gameApi.userBag({ UID, name: '上品灵石', ACCOUNT: lingshi })
            }
            if (m < (mon.level + 1) * 8) {
                const lingshi = await gameApi.leastOne({ value: mon.level * 20 })
                msg.push(`得到${lingshi}中品灵石`)
                await gameApi.userBag({ UID, name: '中品灵石', ACCOUNT: lingshi })
            }
            if (m >= (mon.level + 1) * 9) {
                const lingshi = await gameApi.leastOne({ value: mon.level * 200 })
                msg.push(`得到${lingshi}下品灵石`)
                await gameApi.userBag({ UID, name: '下品灵石', ACCOUNT: lingshi })
            }
        }
        await redis.set(`xiuxian:player:${UID}:${CDID}`, now_time)
        await redis.expire(`xiuxian:player:${UID}:${CDID}`, CDTime * 60)
        await botApi.forwardMsg({ e, data: msg })
        return
    }
    Exploremonsters = async (e) => {
        if (!e.isGroup) {
            return
        }
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            //如果死了，就直接返回
            e.reply('已死亡')
            return
        }
        const { MSG } = await gameApi.GoMini({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const UID = e.user_id
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const msg = []
        const monster = await gameApi.monsterscache({ i: action.region })
        monster.forEach((item) => {
            msg.push(
                '怪名:' + item.name + '\n' +
                '等级:' + item.level + '\n'
            )
        })
        await botApi.forwardMsg({ e, data: msg })
        return
    }
}