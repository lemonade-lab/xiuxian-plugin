import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import Cachemonster from '../../model/cachemonster.js'
import {
    Gomini,
    Go,
    monsterbattle,
    Add_experiencemax,
    addAll,
    GenerateCD,
    Add_najie_thing,
    randomThing,
    returnLevel,
    Numbers
} from '../../model/public.js'
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
        const good = await Go(e)
        if (!good) {
            return
        }
        const UID = e.user_id
        const CDid = '10'
        const now_time = new Date().getTime()
        const CDTime = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.Kill
        const CD = await GenerateCD(UID, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        const name = e.msg.replace('#击杀', '')
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const monstersdata = await Cachemonster.monsterscache(action.region)
        const mon = monstersdata.find(item => item.name == name)
        if (!mon) {
            e.reply(`这里没有${name},去别处看看吧`)
            return
        }
        const acount = await Cachemonster.add(action.region, Number(1))
        const msg = [`${UID}的[击杀结果]\n注:怪物每1小时刷新\n物品掉落率=怪物等级*5%`]
        const buff = {
            "msg": 1
        }
        if (acount == 1) {
            buff.msg = Math.floor((Math.random() * (20 - 5))) + Number(5)
            msg.push('怪物突然变异了!')
        }
        const Levellist = await returnLevel()
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
        const battle =   await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_battle' })
        const talent =  await gameApi.userMsgAction({ NAME: UID , CHOICE: 'user_talent' })
        const mybuff = Math.floor(talent.talentsize / 100) + Number(1)
        const battle_msg = await monsterbattle(e, battle, monsters)
        battle_msg.msg.forEach((item) => {
            msg.push(item)
        })
        if (battle_msg.QQ != 0) {
            const m = Math.floor((Math.random() * (100 - 1))) + Number(1)
            if (m < (mon.level+1) * 5) {
                const randomthinf = await randomThing()
                let najie = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag' })
                if (najie.thing.length <= najie.grade * 10) {
                    najie = await Add_najie_thing(najie, randomthinf, 1)
                    msg.push(`得到[${randomthinf.name}]`)
                    await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_bag', DATA: najie })
                } else {
                    msg.push('储物袋已满')
                }
            }
            if (m < (mon.level+1) * 6) {
                const qixue=mon.level * 25 * mybuff
                msg.push(`得到${qixue}气血`)
                await Add_experiencemax(UID, qixue)
            }
            if (m < (mon.level+1) * 7) {
                const lingshi = await Numbers(mon.level*2)
                msg.push(`得到${lingshi}上品灵石`)
                await addAll(UID, lingshi,'上品灵石')
            }
            if (m < (mon.level+1) * 8) {
                const lingshi = await Numbers(mon.level * 20 )
                msg.push(`得到${lingshi}中品灵石`)
                await addAll(UID, lingshi,'中品灵石')
            }
            if (m >= (mon.level+1) * 9) {
                const lingshi = await Numbers(mon.level * 200 )
                msg.push(`得到${lingshi}下品灵石`)
                await addAll(UID, lingshi)
            }
        }
        await redis.set(`xiuxian:player:${UID}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${UID}:${CDid}`, CDTime * 60)
        await botApi.forwardMsg({e,data:msg}) 
        return
    }
    Exploremonsters = async (e) => {
        if (!e.isGroup) {
            return
        }
        const good = await Gomini(e)
        if (!good) {
            return
        }
        const UID = e.user_id
        const action = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_action' })
        const msg = []
        const monster = await Cachemonster.monsterscache(action.region)
        monster.forEach((item) => {
            msg.push(
                '怪名:' + item.name + '\n' +
                '等级:' + item.level + '\n'
            )
        })
        await botApi.forwardMsg({e,data:msg}) 
        return
    }
}