import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import config from '../../model/config.js'
import {
    GenerateCD,
    Read_level,
    Write_level,
    Read_Life,
    Write_Life,
    returnLevel,
    returnLevelMax,
    existplayer
} from '../../model/public.js'
export class boxlevel extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#突破$',
                fnc: 'Level_up'
            },
            {
                reg: '^#破体$',
                fnc: 'LevelMax_up'
            }
        ]))
    }
    LevelMax_up = async (e) => {
        const msg = await userLevel(e.user_id, 'max')
        e.reply(msg)
        return
    }
    Level_up = async (e) => {
        const msg = await userLevel(e.user_id)
        e.reply(msg)
        return
    }
}
const CopywritingLevel = {
    '0': '突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美!险些走火入魔,丧失了sizename',
    '1': '突破瓶颈时想到鸡哥了,险些走火入魔,丧失了sizename',
    '2': '突破瓶颈时突然想起后花园种有药草,强行打断突破,嘴角流血,丧失了sizename,',
    '3': '突破失败,丧失了sizename',
}
export const userLevel = async (UID, choise) => {
    //突破是比较频繁的？一些变量最好是全局的
    const ifexistplay = await existplayer(UID)
    if (!ifexistplay) {
        return `无存档`
    }
    const player = await Read_level(UID)
    let CDid = '6'
    let CDTime = config.getconfig('xiuxian', 'xiuxian').CD.Level_up
    let name = '修为'
    const Levelmaxlist = await returnLevelMax()
    const LevelMax = Levelmaxlist.find(item => item.id == player.levelmax_id)
    const Levellist = await returnLevel()
    const Level = Levellist.find(item => item.id == player.level_id)
    if (choise) {
        CDid = '7'
        CDTime = config.getconfig('xiuxian', 'xiuxian').CD.LevelMax_up
        name = '气血'
        if (player.experiencemax < LevelMax.exp) {
            return `再积累${LevelMax.exp - player.experiencemax}气血后方可突破`
        }
        if (Level.level_id <= 10 && LevelMax.levelmax_id >= 11) {
            return `[#羽化登仙]后,方能探索更高境界`
        }
    } else {
        if (player.experience < Level.exp) {
            return `再积累${Level.exp - player.experience}修为后方可突破`
        }
        if (Level.id == 10) {
            return `[#羽化登仙]后,方能探索更高境界`
        }
    }
    const now_time = new Date().getTime()
    const CD = await GenerateCD(UID, CDid)
    if (CD != 0) {
        return `${CD}`
    }
    await redis.set(`xiuxian:player:${UID}:${CDid}`, now_time)
    await redis.expire(`xiuxian:player:${UID}:${CDid}`, CDTime * 60)
    if (Math.random() >= 1 - player.levelmax_id / 22) {
        let size = ''
        if (choise) {
            size = Math.floor(Math.random() * player.experiencemax)
            player.experiencemax -= size
        } else {
            size = Math.floor(Math.random() * player.experience)
            player.experience -= size
        }
        await Write_level(UID, player)
        return CopywritingLevel[
            Math.floor(Math.random() * Object.keys(CopywritingLevel).length)
        ].replace(/name/g, name).replace(/size/g, size)
    }
    const LevelMiniName = {
        '0': '初期',
        '1': '中期',
        '2': '后期',
        '3': '巅峰',
        '4': '圆满'
    }
    let returnTXT = ''
    if (choise) {
        if (player.levelmax_id > 1 && player.rankmax_id < 4) {
            player.rankmax_id = player.rankmax_id + 1
        } else {
            player.rankmax_id = 0
            player.levelmax_id = player.levelmax_id + 1
            player.levelnamemax = Levelmaxlist.find(item => item.id == player.levelmax_id).name
        }
        player.experiencemax -= LevelMax.exp
        returnTXT = `突破成功至${player.levelnamemax}${LevelMiniName[player.rankmax_id]}`
    } else {
        if (player.level_id > 1 && player.rank_id < 4) {
            player.rank_id = player.rank_id + 1
            returnTXT = `突破成功至${player.levelname}${LevelMiniName[player.rank_id]}`
        } else {
            player.rank_id = 0
            player.level_id = player.level_id+1
            player.levelname = Levellist.find(item => item.id == player.level_id).name
            let lifesize = 0
            const life = await Read_Life()
            life.forEach((item) => {
                if (item.qq == UID) {
                    item.life += Math.floor(item.life * player.level_id / 5 + 50)
                    lifesize = item.life
                }
            })
            await Write_Life(life)
            returnTXT = `突破成功至${player.levelname}${LevelMiniName[player.rank_id]},寿命至${lifesize}`
        }
        player.experience -= Level.exp
    }
    await Write_level(UID, player)
    return returnTXT
}