import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { get_player_img } from '../../model/showdata.js'
import {
    existplayer,
    exist_najie_thing_name,
    Read_najie,
    Add_experiencemax,
    Write_najie,
    Numbers,
    Add_najie_thing,
    Add_blood,
    GenerateCD,
    Add_experience,
    get_talent,
    Write_talent,
    player_efficiency,
    Read_talent,
    Read_level
} from '../../model/public.js'
import gameApi from '../../model/api/api.js'
export class boxuserhome extends robotapi {
    constructor() {
        super(superIndex([
            {
                //  血量、修为、气血、
                reg: '^#服用.*$',
                fnc: 'consumption_danyao'
            },
            {
                //天赋
                reg: '^#学习.*$',
                fnc: 'add_gongfa'
            },
            {
                reg: '^#忘掉.*$',
                fnc: 'delete_gongfa'
            },
            {
                //
                reg: '^#消耗.*$',
                fnc: 'consumption_daoju'
            }
        ]))
    }
    consumption_danyao = async (e) => {
        const uid = e.user_id
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        let thing = e.msg.replace('#服用', '')
        const code = thing.split('\*')
        let [thing_name, thing_acount] = code
        thing_acount = await Numbers(thing_acount)
        const najie_thing = await exist_najie_thing_name(uid, thing_name)
        if (najie_thing == 1) {
            e.reply(`没有${thing_name}`)
            return
        }
        if (najie_thing.acount < thing_acount) {
            e.reply('数量不足')
            return
        }
        const id = najie_thing.id.split('-')
        switch (id[1]) {
            case '1': {
                let blood = parseInt(najie_thing.blood)
                await Add_blood(uid, blood)
                e.reply(`血量至${blood}%`)
                break
            }
            case '2': {
                let experience = parseInt(najie_thing.experience)
                if (id[0] == '6') {
                    if(thing_acount>2200){
                        thing_acount=2200
                    }
                    const CDTime = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.Practice
                    const CDid = '12'
                    const now_time = new Date().getTime()
                    const CD = await GenerateCD(uid, CDid)
                    if (CD != 0) {
                        experience = 0
                        e.reply(CD)
                    }
                    await redis.set(`xiuxian:player:${uid}:${CDid}`, now_time)
                    await redis.expire(`xiuxian:player:${uid}:${CDid}`, CDTime * 60)
                    const player = await Read_level(uid)
                    switch (id[2]) {
                        //下品
                        case '1': {
                            if (player.level_id >= 3) {
                                experience = 0
                            }
                            break
                        }
                        //中品
                        case '2': {
                            if (player.level_id >= 5) {
                                experience = 0
                            }
                            break
                        }
                        //上品
                        case '3': {
                            if (player.level_id >= 7) {
                                experience = 0
                            }
                            break
                        }
                        //极品
                        case '4': {
                            if (player.level_id >= 9) {
                                experience = 0
                            }
                            break
                        }
                        default: { }
                    }
                }
                if(experience>0){
                    await Add_experience(uid, thing_acount * experience)
                }
                e.reply(`修为+${thing_acount * experience}`)
                break
            }
            case '3': {
                let experiencemax = parseInt(najie_thing.experiencemax)
                await Add_experiencemax(uid, thing_acount * experiencemax)
                e.reply(`气血+${thing_acount * experiencemax}`)
                break
            }
            default: {
            }
        }
        let najie = await Read_najie(uid)
        najie = await Add_najie_thing(najie, najie_thing, -thing_acount)
        await Write_najie(uid, najie)
        return
    }
    add_gongfa = async (e) => {
        const uid = e.user_id
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const thing_name = e.msg.replace('#学习', '')
        const najie_thing = await exist_najie_thing_name(uid, thing_name)
        if (najie_thing == 1) {
            e.reply(`没有[${thing_name}]`)
            return
        }
        const id = najie_thing.id.split('-')
        if (id[0] != 5) {
            return
        }
        const talent = await Read_talent(uid)
        const islearned = talent.AllSorcery.find(item => item.id == najie_thing.id)
        if (islearned) {
            e.reply('学过了')
            return
        }
        if (talent.AllSorcery.length >= gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).myconfig.gongfa) {
            e.reply('你反复看了又看,却怎么也学不进')
            return
        }
        talent.AllSorcery.push(najie_thing)
        await Write_talent(uid, talent)
        await player_efficiency(uid)
        let najie = await Read_najie(uid)
        najie = await Add_najie_thing(najie, najie_thing, -1)
        await Write_najie(uid, najie)
        e.reply(`学习${thing_name}`)
        return
    }
    delete_gongfa = async (e) => {
        const uid = e.user_id
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const thing_name = e.msg.replace('#忘掉', '')
        const talent = await Read_talent(uid)
        const islearned = talent.AllSorcery.find(item => item.name == thing_name)
        if (!islearned) {
            e.reply(`没学过${thing_name}`)
            return
        }
        talent.AllSorcery = talent.AllSorcery.filter(item => item.name != thing_name)
        await Write_talent(uid, talent)
        await player_efficiency(uid)
        let najie = await Read_najie(uid)
        najie = await Add_najie_thing(najie, islearned, 1)
        await Write_najie(uid, najie)
        e.reply(`忘了${thing_name}`)
        return
    }
    consumption_daoju = async (e) => {
        const uid = e.user_id
        const ifexistplay = await existplayer(uid)
        if (!ifexistplay) {
            return
        }
        const thing_name = e.msg.replace('#消耗', '')
        const najie_thing = await exist_najie_thing_name(uid, thing_name)
        if (najie_thing == 1) {
            e.reply(`没有[${thing_name}]`)
            return
        }
        const id = najie_thing.id.split('-')
        let najie = await Read_najie(uid)
        najie = await Add_najie_thing(najie, najie_thing, -1)
        await Write_najie(uid, najie)
        //类型0  1  编号2
        if (id[0] != 6) {
            e.reply(`${thing_name}损坏`)
            return
        }
        //属性1为特效道具
        if (id[1] == 1) {
            switch (id[2]) {
                case '1': {
                    const player = await Read_level(uid)
                    if (player.level_id >= 10) {
                        e.reply('灵根已定\n此生不可再洗髓')
                        break
                    }
                    const talent = await Read_talent(uid)
                    talent.talent = await get_talent()
                    await Write_talent(uid, talent)
                    await player_efficiency(uid)
                    const img = await get_player_img(e.user_id)
                    e.reply(img)
                    break
                }
                case '2': {
                    const talent = await Read_talent(uid)
                    talent.talentshow = 0
                    await Write_talent(uid, talent)
                    const img = await get_player_img(e.user_id)
                    e.reply(img)
                    break
                }
                default: { }
            }
        }
        return
    }
}