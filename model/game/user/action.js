import defset from '../data/defset/updata.js'
import user from './user.js'
import data from './data.js'
import gamePublic from '../public/public.js'
const CopywritingLevel = {
    '0': '突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美!险些走火入魔,丧失了sizename',
    '1': '突破瓶颈时想到鸡哥了,险些走火入魔,丧失了sizename',
    '2': '突破瓶颈时突然想起后花园种有药草,强行打断突破,嘴角流血,丧失了sizename,',
    '3': '突破失败,丧失了sizename',
    '4': '突破失败,你刚刚气沉丹田就被一口老痰差点噎死,丧失了sizename',
    '5': '噗～你一口老血喷了出,突破失败,丧失了sizename',
    '6': '砰!你突破时身后的柜子动了一下,吓得你一时不敢突破并丧失了sizename',
    '7': '突破失败,你也不知道为啥,并且丧失了sizename',
    '8': '突破失败,可能是因为姿势不对吧,你尝试换了个姿势,发现丧失了sizename',
    '9': '突破失败,你差一点就成功了,你决定再试一次,可惜刚入定就被反噬,丧失了sizename',
    '10': '突破失败,你到瓶颈期,却因为今天是KFC疯狂星期四,决定不突破了去吃了KFC,回来直接变身喷射战士,并丧失了sizename'
}
const LevelMiniName = {
    '0': '初期',
    '1': '中期',
    '2': '后期',
    '3': '巅峰',
    '4': '圆满'
}
class userAction {
    /**
     * 突破
     */
    userLevelUp = async (parameter) => {
        const { UID, choise } = parameter
        const ifexistplay = await user.existUserSatus({ UID })
        if (!ifexistplay) {
            return { UserLevelUpMSG: `已死亡` }
        }
        const player = await user.userMsgAction({ NAME: UID, CHOICE: 'user_level' })
        let CDID = '6'
        let CDTime = defset.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.Level_up
        let name = '修为'
        const Levellist = await data.listAction({ CHOICE: 'generate_level', NAME: 'Level_list' })
        const Levelmaxlist = await data.listAction({ CHOICE: 'generate_level', NAME: 'LevelMax_list' })
        const Level = Levellist.find(item => item.id == player.level_id)
        const LevelMax = Levelmaxlist.find(item => item.id == player.levelmax_id)
        if (choise) {
            CDID = '7'
            CDTime = defset.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.LevelMax_up
            name = '气血'
            if (player.experiencemax < LevelMax.exp) {
                return { UserLevelUpMSG: `再积累${LevelMax.exp - player.experiencemax}气血后方可突破` }
            }
            if (Level.level_id <= 10 && LevelMax.levelmax_id >= 11) {
                return { UserLevelUpMSG: `[#羽化登仙]后,方能探索更高境界` }
            }
        } else {
            if (player.experience < Level.exp) {
                return { UserLevelUpMSG: `再积累${Level.exp - player.experience}修为后方可突破` }
            }
            if (Level.id == 10) {
                return { UserLevelUpMSG: `[#羽化登仙]后,方能探索更高境界` }
            }
        }
        const now_time = new Date().getTime()
        const { CDMSG } = await gamePublic.cooling({ UID, CDID })
        if (CDMSG) {
            return { UserLevelUpMSG: `${CDMSG}` }
        }
        await redis.set(`xiuxian:player:${UID}:${CDID}`, now_time)
        await redis.expire(`xiuxian:player:${UID}:${CDID}`, CDTime * 60)
        if (Math.random() >= 1 - player.levelmax_id / 22) {
            let size = ''
            if (choise) {
                size = Math.floor(Math.random() * player.experiencemax)
                player.experiencemax -= size
            } else {
                size = Math.floor(Math.random() * player.experience)
                player.experience -= size
            }
            await user.userMsgAction({ NAME: UID, CHOICE: 'user_level', DATA: player })
            return {
                UserLevelUpMSG: `${CopywritingLevel[
                    Math.floor(Math.random() * Object.keys(CopywritingLevel).length)
                ].replace(/name/g, name).replace(/size/g, size)}`
            }
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
                player.level_id = player.level_id + 1
                player.levelname = Levellist.find(item => item.id == player.level_id).name
                const size = this.userLifeUp({ UID, level_id: player.level_id })
                returnTXT = `突破成功至${player.levelname}${LevelMiniName[player.rank_id]},寿命至${size}`
            }
            player.experience -= Level.exp
        }
        await user.userMsgAction({ NAME: UID, CHOICE: 'user_level', DATA: player })
        return {
            UserLevelUpMSG: `${returnTXT}`
        }
    }
    //升级寿命
    userLifeUp = async (parameter) => {
        const { UID, level_id, acount } = parameter
        let size = 0
        const life = await user.userMsgAction({ NAME: 'life', CHOICE: 'user_life' })
        life.forEach((item) => {
            if (item.qq == UID) {
                if (acount) {
                    item.life += acount
                } else {
                    item.life += Math.floor(item.life * level_id / 5 + 50)
                }
                size = item.life
            }
        })
        await user.userMsgAction({ NAME: 'life', CHOICE: 'user_life', DATA: life })
        return { size: size }
    }
}
export default new userAction()