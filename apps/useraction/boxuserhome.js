import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import gameApi from '../../model/api/api.js'
import botApi from '../../model/robot/api/botapi.js'
export class boxuserhome extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#服用.*$',
                fnc: 'consumption_danyao'
            },
            {
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
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        let thing = e.msg.replace('#服用', '')
        const code = thing.split('\*')
        let [thing_name, thing_acount] = code
        thing_acount = await gameApi.leastOne({ value: thing_acount })
        const najie_thing = await gameApi.userBagSearch({ UID, name: thing_name })
        if (!najie_thing) {
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
                await gameApi.updataUserBlood({ UID, SIZE: Number(blood) })
                e.reply(`血量至${blood}%`)
                break
            }
            case '2': {
                let experience = parseInt(najie_thing.experience)
                if (id[0] == '6') {
                    if (thing_acount > 2200) {
                        thing_acount = 2200
                    }
                    const CDTime = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.Practice
                    const CDID = '12'
                    const now_time = new Date().getTime()
                    const { CDMSG } = await gameApi.cooling({ UID, CDID })
                    if (CDMSG) {
                        experience = 0
                        e.reply(CDMSG)
                    }
                    await redis.set(`xiuxian:player:${UID}:${CDID}`, now_time)
                    await redis.expire(`xiuxian:player:${UID}:${CDID}`, CDTime * 60)
                    const player = gameApi.userMsgAction({ NAME: UID, CHOICE: "user_level" })
                    switch (id[2]) {
                        case '1': {
                            if (player.level_id >= 3) {
                                experience = 0
                            }
                            break
                        }
                        case '2': {
                            if (player.level_id >= 5) {
                                experience = 0
                            }
                            break
                        }
                        case '3': {
                            if (player.level_id >= 7) {
                                experience = 0
                            }
                            break
                        }
                        case '4': {
                            if (player.level_id >= 9) {
                                experience = 0
                            }
                            break
                        }
                        default: { }
                    }
                }
                if (experience > 0) {
                    await gameApi.updataUser({ UID, CHOICE: 'user_level', ATTRIBUTE: 'experience', SIZE: thing_acount * experience })
                }
                e.reply(`修为+${thing_acount * experience}`)
                break
            }
            case '3': {
                let experiencemax = parseInt(najie_thing.experiencemax)
                await gameApi.updataUser({ UID, CHOICE: 'user_level', ATTRIBUTE: 'experiencemax', SIZE: thing_acount * experiencemax })
                e.reply(`气血+${thing_acount * experiencemax}`)
                break
            }
            default: {
            }
        }
        await gameApi.userBag({ UID, name: najie_thing.name, ACCOUNT: -thing_acount })
        return
    }
    add_gongfa = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const thing_name = e.msg.replace('#学习', '')
        const najie_thing = await gameApi.userBagSearch({ UID, name: thing_name })
        if (!najie_thing) {
            e.reply(`没有${thing_name}`)
            return
        }
        const id = najie_thing.id.split('-')
        if (id[0] != 5) {
            return
        }
        const talent = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_talent' })
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
        await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_talent', DATA: talent })
        await gameApi.updataUserEfficiency({ UID })
        await gameApi.userBag({ UID, name: najie_thing.name, ACCOUNT: -1 })
        e.reply(`学习${thing_name}`)
        return
    }
    delete_gongfa = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const thing_name = e.msg.replace('#忘掉', '')
        const talent = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_talent' })
        const islearned = talent.AllSorcery.find(item => item.name == thing_name)
        if (!islearned) {
            e.reply(`没学过${thing_name}`)
            return
        }
        talent.AllSorcery = talent.AllSorcery.filter(item => item.name != thing_name)
        await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_talent', DATA: talent })
        await gameApi.updataUserEfficiency({ UID })
        await gameApi.userBag({ UID, name: islearned.name, ACCOUNT: 1 })
        e.reply(`忘了${thing_name}`)
        return
    }
    consumption_daoju = async (e) => {
        const UID = e.user_id
        const exist = await gameApi.existUserSatus({ UID })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const thing_name = e.msg.replace('#消耗', '')
        const najie_thing = await gameApi.userBagSearch({ UID, name: thing_name })
        if (!najie_thing) {
            e.reply(`没有${thing_name}`)
            return
        }
        await gameApi.userBag({ UID, name: najie_thing.name, ACCOUNT: -1 })
        const id = najie_thing.id.split('-')
        if (id[0] != 6) {
            e.reply(`${thing_name}损坏`)
            return
        }
        if (id[1] == 1) {
            switch (id[2]) {
                case '1': {
                    const player = gameApi.userMsgAction({ NAME: UID, CHOICE: "user_level" })
                    if (player.level_id >= 10) {
                        e.reply('灵根已定\n此生不可再洗髓')
                        break
                    }
                    const talent = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_talent' })
                    talent.talent = await gameApi.getTalent()
                    await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_talent', DATA: talent })
                    await gameApi.updataUserEfficiency({ UID })
                    const { path, name, data } = await gameApi.userDataShow({ UID: e.user_id })
                    const img = await botApi.showPuppeteer({ path, name, data })
                    e.reply(img)
                    break
                }
                case '2': {
                    const talent = await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_talent' })
                    talent.talentshow = 0
                    await gameApi.userMsgAction({ NAME: UID, CHOICE: 'user_talent', DATA: talent })
                    const { path, name, data } = await gameApi.userDataShow({ UID: e.user_id })
                    const img = await botApi.showPuppeteer({ path, name, data })
                    e.reply(img)
                    break
                }
                default: { }
            }
        }
        return
    }
}