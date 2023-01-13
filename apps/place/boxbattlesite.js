import robotapi from "../../model/robotapi.js"
import Cachemonster from '../../model/cachemonster.js'
import config from '../../model/config.js'
import { superIndex } from "../../model/robotapi.js"
import {
    Gomini,
    Go,
    Read_action,
    ForwardMsg,
    Read_battle,
    monsterbattle,
    Add_experiencemax,
    addLingshi,
    GenerateCD,
    Add_najie_thing,
    Read_najie,
    Write_najie,
    Read_talent,
    randomThing,
    returnLevel,
    Numbers
} from '../../model/public.js'
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
        this.xiuxianconfigData = config.getconfig('xiuxian', 'xiuxian')
    }
    Kill = async (e) => {
        if (!e.isGroup) {
            return
        }
        const good = await Go(e)
        if (!good) {
            return
        }
        const uid = e.user_id
        const CDid = '10'
        const now_time = new Date().getTime()
        const CDTime = this.xiuxianconfigData.CD.Kill
        const CD = await GenerateCD(uid, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        const name = e.msg.replace('#击杀', '')
        const action = await Read_action(uid)
        const monstersdata = await Cachemonster.monsterscache(action.region)
        const mon = monstersdata.find(item => item.name == name)
        if (!mon) {
            e.reply(`这里没有${name},去别处看看吧`)
            return
        }
        const acount = await Cachemonster.add(action.region, Number(1))
        const msg = [`${uid}的[击杀结果]\n注:怪物每1小时刷新\n物品掉落率=怪物等级*5%`]
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
        const battle = await Read_battle(uid)
        const talent = await Read_talent(uid)
        const mybuff = Math.floor(talent.talentsize / 100) + Number(1)
        const battle_msg = await monsterbattle(e, battle, monsters)
        battle_msg.msg.forEach((item) => {
            msg.push(item)
        })
        if (battle_msg.QQ != 0) {
            const m = Math.floor((Math.random() * (100 - 1))) + Number(1)
            if (m < mon.level * 5) {
                const randomthinf = await randomThing()
                let najie = await Read_najie(uid)
                if (najie.thing.length <= najie.grade * 10) {
                    najie = await Add_najie_thing(najie, randomthinf, 1)
                    msg.push(`得到[${randomthinf.name}]`)
                    await Write_najie(uid, najie)
                } else {
                    msg.push('储物袋已满')
                }
            }
            if (m < mon.level * 7) {
                const qixue=mon.level * 20 * mybuff
                msg.push(`得到${qixue}气血`)
                await Add_experiencemax(uid, qixue)
            }
            if (m < mon.level * 8) {
                const lingshi = await Numbers(mon.level * 20 * mybuff)
                msg.push(`得到${lingshi}下品灵石`)
                await addLingshi(uid, lingshi)
            }
            if (m >= mon.level * 9) {
                const lingshi = await Numbers(mon.level * 10 * mybuff)
                msg.push(`得到${lingshi}下品灵石`)
                await addLingshi(uid, lingshi)
            }
        }
        await redis.set(`xiuxian:player:${uid}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${uid}:${CDid}`, CDTime * 60)
        await ForwardMsg(e, msg)
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
        const uid = e.user_id
        const action = await Read_action(uid)
        const msg = []
        const monster = await Cachemonster.monsterscache(action.region)
        monster.forEach((item) => {
            msg.push(
                '怪名:' + item.name + '\n' +
                '等级:' + item.level + '\n'
            )
        })
        await ForwardMsg(e, msg)
        return
    }
}