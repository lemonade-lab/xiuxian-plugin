import robotapi from "../../model/robot/api/api.js"
import { superIndex } from "../../model/robot/api/api.js"
import { segment } from 'oicq'
import {
    GenerateCD,
    Write_Life,
    Read_Life,
    offaction,
    exist,
    createBoxPlayer
} from '../../model/public.js'
import { get_player_img } from '../../model/showdata.js'
import gameApi from '../../model/api/api.js'
import botApi from '../../model/robot/api/botapi.js'
export class boxuserstart extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#降临世界$',
                fnc: 'Create_player'
            },
            {
                reg: '^#再入仙途$',
                fnc: 'reCreate_player'
            }
        ]))
    }
    Create_player = async (e) => {
        const group = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).group.white
        if (group != 0) {
            if (e.group_id != group) {
                return
            }
        }
        if (!e.isGroup || e.user_id == 80000000) {
            return
        }
        const UID = e.user_id
        const ifexistplay = await exist(UID)
        if (!ifexistplay) {
            const img = await get_player_img(e.user_id)
            if (img == undefined) {
                e.reply('已死亡')
            } else {
                e.reply(img)
            }
            return
        }
        await createBoxPlayer(e.user_id)
        e.reply(`成功降临修仙世界\n你可以#前往极西联盟\n进行#联盟报到\n会得到[修仙联盟]的帮助\n也可以使用#位置信息\n查看城市信息\n若想了解自己的身世\n可以#基础信息`)
        return
    }
    reCreate_player = async (e) => {
        if (!e.isGroup) {
            return
        }
        const UID = e.user_id
        const CDTime = gameApi.getConfig({ app: 'xiuxian', name: 'xiuxian' }).CD.Reborn
        const CDid = '8'
        const now_time = new Date().getTime()
        const CD = await GenerateCD(UID, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        await offaction(UID)
        let life = await Read_Life()
        life = await life.filter(item => item.qq != UID)
        await Write_Life(life)
        await createBoxPlayer(e.user_id)
        await redis.set(`xiuxian:player:${UID}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${UID}:${CDid}`, CDTime * 60)
        e.reply([segment.at(UID), '岁月悠悠\n世间终会出现两朵相同的花\n千百年的回眸\n一花凋零\n一花绽\n是否为同一朵\n任后人去评断'])
        return
    }
}