import { BotApi, GameApi, plugin , Super} from '../../../model/api/api.js'
export class BoxDice extends plugin {
    constructor() {
        super(Super({
            rule: [
                {
                    reg: '^#万花坊$',
                    fnc: 'userDice'
                }
            ]
        }))
    }
    userDice = async (e) => {
        const msg = ['__[万花坊]__']
        msg.push('待更新')
        await BotApi.User.forwardMsgSurveySet({ e, data: msg })
        if (e.group.is_owner || e.group.is_admin) {
            await e.recall()
        }
        return
    }
}