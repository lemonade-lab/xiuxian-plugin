import { plugin } from "../../../model/robot/api/api.js"
import { GameApi } from '../../../model/api/gameapi.js'
import { BotApi } from '../../../model/api/botapi.js'
export class boxplayercontrol extends plugin {
    constructor() {
        super(BotApi.SuperIndex.getUser({
            rule: [
                {
                    reg: '#降妖$',
                    fnc: 'dagong'
                },
                {
                    reg: '#闭关$',
                    fnc: 'biguan'
                },
                {
                    reg: '^#出关$',
                    fnc: 'chuGuan'
                },
                {
                    reg: '^#归来$',
                    fnc: 'endWork'
                }
            ]
        }))
    }
    biguan = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { MSG } = await GameApi.GamePublic.GoMini({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const UID = e.user_id
        const now_time = new Date().getTime()
        const actionObject = {
            'actionName': '闭关',
            'startTime': now_time
        }
        await redis.set(`xiuxian:player:${UID}:action`, JSON.stringify(actionObject))
        e.reply('开始两耳不闻窗外事...')
        return true
    }
    dagong = async (e) => {
        if (!e.isGroup) {
            return
        }
        if (!await GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
            e.reply('已死亡')
            return
        }
        const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
        if (MSG) {
            e.reply(MSG)
            return
        }
        const UID = e.user_id
        const now_time = new Date().getTime()
        const actionObject = {
            'actionName': '降妖',
            'startTime': now_time
        }
        await redis.set(`xiuxian:player:${UID}:action`, JSON.stringify(actionObject))
        e.reply('开始外出...')
        return true
    }
    chuGuan = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (!await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        let action = await redis.get(`xiuxian:player:${UID}:action`)
        if (action == undefined) {
            return
        }
        action = JSON.parse(action)
        if (action.actionName != '闭关') {
            return
        }
        const startTime = action.startTime
        const cf = GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' })
        const timeUnit = cf['biguan']['time'] ? cf['biguan']['time'] : 5
        const time = Math.floor((new Date().getTime() - startTime) / 60000)
        if (time < timeUnit) {
            e.reply('只是呆了一会儿...')
            await GameApi.GamePublic.offAction({ UID })
            return
        }
        await GameApi.GamePublic.offAction({ UID })
        await this.upgrade(UID, time, action.actionName, e)
        return
    }
    endWork = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        if (! await GameApi.GameUser.existUserSatus({ UID })) {
            e.reply('已死亡')
            return
        }
        let action = await redis.get(`xiuxian:player:${UID}:action`)
        if (action == undefined) {
            return
        }
        action = JSON.parse(action)
        if (action.actionName != '降妖') {
            return
        }
        const startTime = action.startTime
        const cf = GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' })
        const timeUnit = cf['work']['time'] ? cf['work']['time'] : 5
        const time = Math.floor((new Date().getTime() - startTime) / 60000)
        if (time < timeUnit) {
            e.reply('只是呆了一会儿...')
            await GameApi.GamePublic.offAction({ UID })
            return
        }
        await GameApi.GamePublic.offAction({ UID })
        await this.upgrade(UID, time, action.actionName, e)
        return
    }
    upgrade = async (user_id, time, name, e) => {
        if (!e.isGroup) {
            return
        }
        const UID = user_id
        const talent = await GameApi.GameUser.userMsgAction({ NAME: UID, CHOICE: 'user_talent' })
        const buff = Math.floor(talent.talentsize / 100) + Number(1)
        const appSize = GameApi.DefsetUpdata.getConfig({ app: 'parameter', name: 'cooling' })
        let map = {
            '闭关': 'biguan',
            '降妖': 'work'
        }
        let other = Math.floor(appSize[map[name]]['size'] * time * buff)
        if ((Math.random() * (100 - 1) + 1) < 20) {
            other -= Math.floor(other / 3)
        }
        let othername = 'experience'
        let msg = `闭关结束,获得${other}修为`
        if (name != '闭关') {
            othername = 'experiencemax'
            msg = `降妖归来,获得${other}气血`
        }
        await GameApi.GameUser.updataUser({ UID, CHOICE: 'user_level', ATTRIBUTE: othername, SIZE: other })
        await GameApi.GameUser.updataUserBlood({ UID, SIZE: Number(90) })
        msg += '\n血量恢复至90%'
        msg += `\n${name}结束`
        e.reply([BotApi.segment.at(UID), msg])
        return
    }
}