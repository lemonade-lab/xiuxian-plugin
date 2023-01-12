import robotapi from "../../model/robotapi.js"
import config from '../../model/Config.js'
import { superIndex } from "../../model/robotapi.js"
import {
    Go,
    GenerateCD,
    Read_level,
    Write_level,
    Read_Life,
    Write_Life,
    returnLevel,
    returnLevelMax
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
        this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian')
    }
    LevelMax_up = async (e) => {
        const good = await Go(e)
        if (!good) {
            return
        }
        const uid = e.user_id
        const CDTime = this.xiuxianConfigData.CD.LevelMax_up
        const CDid = '7'
        const now_time = new Date().getTime()
        const CD = await GenerateCD(uid, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        const player = await Read_level(uid)
        const Levelmaxlist = await returnLevelMax()
        const LevelMax = Levelmaxlist.find(item => item.id == player.levelmax_id)
        if (player.experiencemax < LevelMax.exp) {
            e.reply(`气血不足,再积累${LevelMax.exp - player.experiencemax}气血后方可突破`)
            return
        }
        const Levellist = await returnLevel()
        const Level = Levellist.find(item => item.id == player.level_id)
        if (Level.level_id <= 10 && LevelMax.levelmax_id >= 11) {
            e.reply(`[#羽化登仙]后,方能探索更高境界`)
            return
        }
        const map = {
            '0': '初成',
            '1': '小成',
            '2': '大成',
            '3': '巅峰',
            '4': '圆满'
        }
        await redis.set(`xiuxian:player:${uid}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${uid}:${CDid}`, CDTime * 60)
        if (Math.random() >= 1 - player.levelmax_id / 23) {
            const bad_time = Math.random()
            let x = 0
            if (bad_time > 0.9) {
                x = 0.4
                e.reply(`突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美!险些走火入魔,丧失了${Math.ceil(LevelMax.exp) * x}气血`)
            } else if (bad_time > 0.8) {
                x = 0.2
                e.reply(`突破瓶颈时想到鸡哥了,险些走火入魔,丧失了${Math.ceil(LevelMax.exp) * x}气血`)
            } else if (bad_time > 0.7) {
                x = 0.1
                e.reply(`突破瓶颈时突然想起后花园种有药草,强行打断突破,嘴角流血,丧失了${Math.ceil(LevelMax.exp) * x}气血`)

            } else {
                e.reply(`憋红了脸,境界突破失败,等到${CDTime}分钟后再尝试吧`)
            }
            player.experiencemax -= Math.ceil(LevelMax.exp * x)
            await Write_level(uid, player)
            await redis.set(`xiuxian:player:${uid}:${CDid}`, now_time)
            await redis.expire(`xiuxian:player:${uid}:${CDid}`, CDTime * 60)
            return
        }
        if (player.levelmax_id > 1 && player.rankmax_id < 4) {
            player.rankmax_id = player.rankmax_id + 1
            player.experiencemax -= LevelMax.exp
            await Write_level(uid, player)
            e.reply(`突破成功至${player.levelnamemax}${map[player.rankmax_id]}`)
            return
        }
        player.levelmax_id = player.levelmax_id + 1
        player.levelnamemax = Levelmaxlist.find(item => item.id == player.levelmax_id).name
        player.experiencemax -= LevelMax.exp
        player.rankmax_id = 0
        await Write_level(uid, player)
        e.reply(`突破成功至${player.levelnamemax}${map[player.rankmax_id]}`)
        await redis.set(`xiuxian:player:${uid}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${uid}:${CDid}`, CDTime * 60)
        return
    }
    Level_up = async (e) => {
        const good = await Go(e)
        if (!good) {
            return
        }
        const uid = e.user_id
        const CDTime = this.xiuxianConfigData.CD.Level_up
        const CDid = '6'
        const now_time = new Date().getTime()
        const CD = await GenerateCD(uid, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        const player = await Read_level(uid)
        const Levellist = await returnLevel()
        const Level = Levellist.find(item => item.id == player.level_id)
        if (player.experience < Level.exp) {
            e.reply(`修为不足,再积累${Level.exp - player.experience}修为后方可突破`)
            return
        }
        if (Level.id == 10) {
            e.reply(`渡劫期修士需[#渡劫]后[#羽化登仙]`)
            return
        }
        const map = {
            '0': '初期',
            '1': '中期',
            '2': '后期',
            '3': '巅峰',
            '4': '圆满'
        }
        await redis.set(`xiuxian:player:${uid}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${uid}:${CDid}`, CDTime * 60)
        if (Math.random() > 1 - player.level_id / 23) {
            const bad_time = Math.random()
            let x = 0
            if (bad_time > 0.9) {
                x = 0.4
                e.reply(`突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美!险些走火入魔,丧失了${Math.ceil((Level.exp) * x)}修为`)
            } else if (bad_time > 0.8) {
                x = 0.2
                e.reply(`突破瓶颈时想到鸡哥了,险些走火入魔,丧失了${Math.ceil(Level.exp) * x}修为`)
            } else if (bad_time > 0.7) {
                x = 0.1
                e.reply(`突破瓶颈时突然想起后花园种有药草,强行打断突破,嘴角流血,丧失了${Math.ceil(Level.exp) * x}修为`)
            } else {
                e.reply(`憋红了脸,境界突破失败,等到${CDTime}分钟后再尝试吧`)
            }
            player.experience -= Math.ceil(Level.exp * x)
            await Write_level(uid, player)
            await redis.set(`xiuxian:player:${uid}:${CDid}`, now_time)
            await redis.expire(`xiuxian:player:${uid}:${CDid}`, CDTime * 60)
            return
        }
        if (player.level_id > 1 && player.rank_id < 4) {
            player.rank_id = player.rank_id + 1
            player.experience -= Level.exp
            await Write_level(uid, player)
            e.reply(`突破成功至${player.levelname}${map[player.rank_id]}`)
            return
        }
        player.level_id = player.level_id + 1
        player.levelname = Levellist.find(item => item.id == player.level_id).name
        player.experience -= Level.exp
        player.rank_id = 0
        await Write_level(uid, player)
        const life = await Read_Life()
        life.forEach((item) => {
            if (item.qq == uid) {
                item.life += Math.floor(item.life * player.level_id / 3)
                e.reply(`突破成功至${player.levelname}${map[player.rank_id]},寿命至${item.life}`)
            }
        })
        await Write_Life(life)
        await redis.set(`xiuxian:player:${uid}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${uid}:${CDid}`, CDTime * 60)
        return
    }
}