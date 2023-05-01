import { BotApi, GameApi, plugin, name, dsc } from '../../../model/api/api.js'
export class boxunion extends plugin {
    constructor() {
        super({
            name,
            dsc,
            rule: [
                { reg: '^#联盟报到$', fnc: 'userCheckin' },
                { reg: '^#联盟签到$', fnc: 'userSignin' }
            ]
        })
    }

    userSignin = async (e) => {
        if (!e.isGroup || e.user_id == 80000000) return false
        if (!BotApi.User.controlMessage({ e })) return false
        e.reply('待更新~')
        return false
    }

    userCheckin = async (e) => {
        if (!e.isGroup || e.user_id == 80000000) return false
        if (!BotApi.User.controlMessage({ e })) return false
        if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
            e.reply('已死亡')
            return false
        }
        const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return false
        }
        const UID = e.user_id
        const action = await GameApi.UserData.listAction({
            NAME: UID,
            CHOICE: 'user_action'
        })
        const address_name = '联盟'
        const map = await GameApi.GameMap.mapExistence({
            action,
            addressName: address_name
        })
        if (!map) {
            e.reply(`需[#前往+城池名+${address_name}]`)
            return false
        }
        const level = await GameApi.UserData.listAction({
            NAME: UID,
            CHOICE: 'user_level'
        })
        if (level.level_id != 1) {
            e.reply('[修仙联盟]方正\n前辈莫要开玩笑')
            return false
        }
        if (action.newnoe != 1) {
            e.reply('[修仙联盟]方正\n道友要不仔细看看自己的储物袋')
            return false
        }
        action.newnoe = 0
        await GameApi.UserData.listAction({
            NAME: UID,
            CHOICE: 'user_action',
            DATA: action
        })
        const randomthing = await GameApi.GameUser.randomThing()
        await GameApi.GameUser.userBag({
            UID,
            name: randomthing.name,
            ACCOUNT: randomthing.acount
        })
        e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧`)
        return false
    }
}
