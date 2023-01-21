import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { BotApi } from '../../model/robot/api/botapi.js'
import gameApi from '../../model/api/api.js'
export class boxtoplist extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#杀神榜$',
                fnc: 'showTopPrestige'
            },
            {
                reg: '^#至尊榜$',
                fnc: 'showTopGenius'
            }
        ]))
    }
    showTopPrestige = async (e) => {
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const { CacheMSG } = await BotApi.Cache.readCahe({ name: 'showTopPrestige' })
        if (CacheMSG) {
            e.reply(CacheMSG)
            return
        }
        const userList = await gameApi.getUserUID()
        const temp = []
        const list = []
        for (let item of userList) {
            const userLevel = await gameApi.userMsgAction({ NAME: item, CHOICE: 'user_level' })
            if (userLevel.prestige > 0) {
                const battle = {
                    'QQ': item,
                    'power': userLevel.prestige,
                    'name': 'MP'
                }
                temp.push(battle)
            }
        }
        if (temp.length == 0) {
            e.reply('此界皆是良民')
            return
        }
        temp.sort(gameApi.sortBy('power'))
        temp.forEach((item, index) => {
            if (index < 10) {
                list.push(item)
            }
        })
        const newimg = await BotApi.Imgindex.showPuppeteer({
            path: 'toplist',
            name: 'toplist',
            data: { list: list },
        })
        await BotApi.Cache.addCahe({
            name: 'showTopPrestige',
            data: newimg
        })
        e.reply(newimg)
        return
    }
    showTopGenius = async (e) => {
        const exist = await gameApi.existUserSatus({ UID: e.user_id })
        if (!exist) {
            e.reply('已死亡')
            return
        }
        const { CacheMSG } = await BotApi.Cache.readCahe({ name: 'showTopGenius' })
        if (CacheMSG) {
            e.reply(CacheMSG)
            return
        }
        const list = []
        const temp = []
        const playerList = await gameApi.getUserUID()
        for (let item of playerList) {
            const level = await gameApi.userMsgAction({ NAME: item, CHOICE: 'user_level' })
            if (level.level_id <= 10) {
                const newbattle = await gameApi.userMsgAction({ NAME: item, CHOICE: 'user_battle' })
                const battle = {
                    'QQ': item,
                    'power': newbattle.power,
                    'name': 'CE'
                }
                temp.push(battle)
            }
        }
        if (temp.length == 0) {
            return
        }
        temp.sort(gameApi.sortBy('power'))
        temp.forEach(async (item, index) => {
            if (index < 10) {
                list.push(item)
            }
        })
        const newimg = await BotApi.Imgindex.showPuppeteer({
            path: 'toplist',
            name: 'toplist',
            data: { list: list },
        })
        e.reply(newimg)
        await BotApi.Cache.addCahe({
            name: 'showTopGenius',
            data: newimg
        })
        return
    }
}