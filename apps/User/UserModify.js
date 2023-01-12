import robotapi from "../../model/robotapi.js"
import config from '../../model/Config.js'
import {
    Write_player,
    Go,
    GenerateCD,
    exist_najie_thing_name,
    Read_player,
    Write_Life,
    Read_Life,
    addLingshi
} from '../../model/public.js'
import { get_player_img } from '../../model/showdata.js'
import { superIndex } from "../../model/robotapi.js"
export class UserModify extends robotapi {
    constructor() {
        super(superIndex([
            {
                reg: '^#改名.*$',
                fnc: 'Change_name'
            },
            {
                reg: '^#设置道宣.*$',
                fnc: 'Change_autograph'
            }
        ]))
        this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian')
    }
    Change_name = async (e) => {
        const good = await Go(e)
        if (!good) {
            return
        }
        const usr_qq = e.user_id
        const lingshi = 5
        let new_name = e.msg.replace('#改名', '')
        if (new_name.length == 0) {
            return
        }
        const name = ['尼玛', '妈的', '他妈', '卧槽', '操', '操蛋', '麻痹', '傻逼', '妈逼']
        name.forEach((item) => {
            new_name = new_name.replace(item, '')
        })
        if (new_name.length > 8) {
            e.reply('这名可真是稀奇')
            return
        }
        let thing = await exist_najie_thing_name(usr_qq, '下品灵石')
        if (thing == 1 || thing.acount < lingshi) {
            e.reply([segment.at(usr_qq), `似乎没有${lingshi}灵石`])
            return
        }
        const CDid = '3'
        const now_time = new Date().getTime()
        const CDTime = this.xiuxianConfigData.CD.Name
        const CD = await GenerateCD(usr_qq, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        await redis.set(`xiuxian:player:${usr_qq}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${usr_qq}:${CDid}`, CDTime * 60)
        await addLingshi(usr_qq, -lingshi)
        const life = await Read_Life()
        life.forEach((item) => {
            if (item.qq == usr_qq) {
                item.name = new_name
            }
        })
        await Write_Life(life)
        const img = await get_player_img(e.user_id)
        e.reply(img)
        return
    }
    Change_autograph = async (e) => {
        const good = await Go(e)
        if (!good) {
            return
        }
        const usr_qq = e.user_id
        const player = await Read_player(usr_qq)
        let new_msg = e.msg.replace('#设置道宣', '')
        new_msg = new_msg.replace(' ', '')
        const name = ['尼玛', '妈的', '他妈', '卧槽', '操', '操蛋', '麻痹', '傻逼', '妈逼']
        name.forEach((item) => {
            new_msg = new_msg.replace(item, '')
        })
        if (new_msg.length == 0 || new_msg.length > 50) {
            e.reply('请正确设置,且道宣最多50字符')
            return
        }
        const CDid = '4'
        const now_time = new Date().getTime()
        const CDTime = this.xiuxianConfigData.CD.Autograph
        const CD = await GenerateCD(usr_qq, CDid)
        if (CD != 0) {
            e.reply(CD)
            return
        }
        await redis.set(`xiuxian:player:${usr_qq}:${CDid}`, now_time)
        await redis.expire(`xiuxian:player:${usr_qq}:${CDid}`, CDTime * 60)
        player.autograph = new_msg
        await Write_player(usr_qq, player)
        const img = await get_player_img(e.user_id)
        e.reply(img)
        return
    }
}