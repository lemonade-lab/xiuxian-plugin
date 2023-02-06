import { BotApi, GameApi, plugin } from '../../../model/api/api.js'
export class boxlevel extends plugin {
    constructor() {
        super(BotApi.SuperIndex.getUser({
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
    levelBreak = async (e) => {
        if (!e.isGroup) {
            return
        }
        const { levelMsg } = await GameApi.UserAction.levelBreak({ UID: e.user_id })
        if (levelMsg) {
            e.reply(levelMsg)
            return
        }
        e.reply('仙路已断')
        return
    }
}