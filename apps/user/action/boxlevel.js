import {  GameApi, plugin, Super } from '../../../model/api/api.js'
export class BoxLevel extends plugin {
    constructor() {
        super(Super({
            rule: [
                {
                    reg: '^#突破$',
                    fnc: 'levelUp'
                },
                {
                    reg: '^#破体$',
                    fnc: 'levelMaxUp'
                },
                {
                    reg: '^#渡劫$',
                    fnc: 'levelBreak'
                }
            ]
        }))
    }
    levelUp = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { UserLevelUpMSG } = await GameApi.UserAction.userLevelUp({ UID: e.user_id })
        if (UserLevelUpMSG) {
            e.reply(UserLevelUpMSG)
        }
        return
    }
    levelMaxUp = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { UserLevelUpMSG } = await GameApi.UserAction.userLevelUp({
            UID: e.user_id,
            choise: 'max'
        })
        if (UserLevelUpMSG) {
            e.reply(UserLevelUpMSG)
        }
        return
    }

    /**
     * 如何渡劫？
     * 进入渡劫状态。
     * 根据灵根降下天罚。
     * 灵根越少渡劫越难
     * 天兵天将？
     * 五四  三双  单
     * 三九、六九、九九、
     * 三九天劫：
     * 天兵天降(攻击力：规定时间内灭杀一定数量的天兵天将),
     * 万世风雷（防御力：持续掉血，掉防御，不仅要吃药，还要），
     * 考验心智(需要声望，声望越高，难度越低。德高望众！名之所向)
     * 
     * 后面就是重复之前的步骤，不过更加大，需要一定的
     * 
     */

    levelBreak = async (e) => {
        if (!e.isGroup) {
            return
        }
        const msg = await GameApi.UserAction.levelBreak({ UID: e.user_id })
        if (msg) {
            e.reply(msg)
            return
        }
        e.reply('仙路已断')
        return
    }
}