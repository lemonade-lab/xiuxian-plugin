import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import config from '../../model/config.js'
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
import gameApi from '../../model/api/api.js'
import botApi from '../../model/robot/api/botapi.js'
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
        this.CopywritingLevel = {
            '0': '突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美!险些走火入魔,丧失了sizename',
            '1': '突破瓶颈时想到鸡哥了,险些走火入魔,丧失了sizename',
            '2': '突破瓶颈时突然想起后花园种有药草,强行打断突破,嘴角流血,丧失了sizename,',
            '3': '突破失败,丧失了sizename',
        }
    }
    LevelMax_up = async (e) => {
        /**
         * 行为限制
         */
        const good = await Go(e)
        if (!good) {
            return
        }
        const UID = e.user_id
        const player = await Read_level(UID)
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
        /**
         * 行为冷却
         */
        const CDTime = config.getconfig('xiuxian', 'xiuxian').CD.LevelMax_up
        const CDid = '7'
        const now_time = new Date().getTime()
        const CD = await GenerateCD(UID, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        await redis.set(`xiuxian:player:${UID}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${UID}:${CDid}`, CDTime * 60)
        /**
         * 突破门槛
         */
        if (Math.random() >= 1 - player.levelmax_id / 22) {
            const size = Math.floor(Math.random() * LevelMax.exp)
            const name = '气血'
            player.experiencemax -= size
            await Write_level(UID, player)
            e.reply(this.CopywritingLevel[
                Math.floor(Math.random() * Object.keys(this.CopywritingLevel).length)
            ].replace(/name/g, name).replace(/size/g, size))
            return
        }
        const LevelMiniName = {
            '0': '初成',
            '1': '小成',
            '2': '大成',
            '3': '巅峰',
            '4': '圆满'
        }
        if (player.levelmax_id > 1 && player.rankmax_id < 4) {
            /**
             * 小境界升级
             */
            player.rankmax_id = player.rankmax_id + 1
            player.experiencemax -= LevelMax.exp
            await Write_level(UID, player)
            e.reply(`突破成功至${player.levelnamemax}${LevelMiniName[player.rankmax_id]}`)
            return
        }
        /**
         * 大升级
         */
        player.levelmax_id = player.levelmax_id + 1
        player.levelnamemax = Levelmaxlist.find(item => item.id == player.levelmax_id).name
        player.experiencemax -= LevelMax.exp
        player.rankmax_id = 0
        await Write_level(UID, player)
        /**
         * 
         */
        e.reply(`突破成功至${player.levelnamemax}${LevelMiniName[player.rankmax_id]}`)
        return
    }
    Level_up = async (e) => {
        const good = await Go(e)
        if (!good) {
            return
        }
        const player = await Read_level(UID)
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


        const UID = e.user_id
        const CDTime = config.getconfig('xiuxian', 'xiuxian').CD.Level_up
        const CDid = '6'
        const now_time = new Date().getTime()
        const CD = await GenerateCD(UID, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        await redis.set(`xiuxian:player:${UID}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${UID}:${CDid}`, CDTime * 60)

        if (Math.random() > 1 - player.level_id / 22) {
            const size = Math.floor(Math.random() * Level.exp)
            const name = '修为'
            player.experience -= size
            await Write_level(UID, player)
            e.reply(this.CopywritingLevel[
                Math.floor(Math.random() * Object.keys(this.CopywritingLevel).length)
            ].replace(/name/g, name).replace(/size/g, size))
            return
        }


        const map = {
            '0': '初期',
            '1': '中期',
            '2': '后期',
            '3': '巅峰',
            '4': '圆满'
        }
        if (player.level_id > 1 && player.rank_id < 4) {
            player.rank_id = player.rank_id + 1
            player.experience -= Level.exp
            await Write_level(UID, player)
            e.reply(`突破成功至${player.levelname}${map[player.rank_id]}`)
            return
        }



        player.level_id = player.level_id + 1
        player.levelname = Levellist.find(item => item.id == player.level_id).name0
        player.experience -= Level.exp
        player.rank_id = 0
        await Write_level(UID, player)
        const life = await Read_Life()
        life.forEach((item) => {
            if (item.qq == UID) {
                item.life += Math.floor(item.life * player.level_id / 5 + 50)
                e.reply(`突破成功至${player.levelname}${map[player.rank_id]},寿命至${item.life}`)
            }
        })
        await Write_Life(life)


        return
    }
}