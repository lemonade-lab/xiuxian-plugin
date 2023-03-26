
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import { Read_player, existplayer,Read_najie,Write_najie,Add_灵石,__PATH} from '../../model/xiuxian.js'
import {get_najie_img} from '../ShowImeg/showData.js'

/**
 * 全局
 */
let allaction = false;//全局状态判断
/**
 * 交易系统
 */

export class UserAction extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'UserAction',
            /** 功能描述 */
            dsc: '交易模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^#我的纳戒$',
                    fnc: 'Show_najie'
                },
                {
                    reg: '^#升级纳戒$',
                    fnc: 'Lv_up_najie'
                },
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    
    //#我的纳戒
    async Show_najie(e) {
        let usr_qq = e.user_id;
        //有无存档
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let img = await get_najie_img(e);
        e.reply(img);
        return;
    }

    
    //纳戒升级
    async Lv_up_najie(e) {
         //不开放私聊功能
         if (!e.isGroup) {
            return;
        }
        await Go(e);
        if (allaction) {
            console.log(allaction);
        } else {
            return;
        }
        allaction = false;
        let usr_qq = e.user_id;
        //有无存档
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) { return; }
        let najie = await Read_najie(usr_qq);
        let player = await Read_player(usr_qq);
        let najie_num = this.xiuxianConfigData.najie_num
        let najie_price = this.xiuxianConfigData.najie_price
        if (najie.等级 == najie_num.length) {
            e.reply("你的纳戒已经是最高级的了")
            return;
        }
        if (player.灵石 < najie_price[najie.等级]) {
            e.reply(`灵石不足,还需要准备${najie_price[najie.等级] - player.灵石}灵石`)
            return;
        }
        await Add_灵石(usr_qq, -najie_price[najie.等级]);
        najie.灵石上限 = najie_num[najie.等级];
        najie.等级 += 1;
        await Write_najie(usr_qq, najie);
        e.reply(`你的纳戒升级成功,花了${najie_price[najie.等级 - 1]}灵石,目前纳戒灵石存储上限为${najie.灵石上限},可以使用【#我的纳戒】来查看`)
        return;
    }

}




/**
 * 状态
 */

 export async function Go(e) {
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
        return;
    }
    //获取游戏状态
    let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
    //防止继续其他娱乐行为
    if (game_action == 0) {
        e.reply("修仙：游戏进行中...");
        return;
    }
    //查询redis中的人物动作
    let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
    action = JSON.parse(action);
    if (action != null) {
        //人物有动作查询动作结束时间
        let action_end_time = action.end_time;
        let now_time = new Date().getTime();
        if (now_time <= action_end_time) {
            let m = parseInt((action_end_time - now_time) / 1000 / 60);
            let s = parseInt(((action_end_time - now_time) - m * 60 * 1000) / 1000);
            e.reply("正在" + action.action + "中,剩余时间:" + m + "分" + s + "秒");
            return;
        }
    }
    let player = await Read_player(usr_qq);
    if (player.当前血量 < 200) {
        e.reply("你都伤成这样了,就不要出去浪了");
        return;
    }
    allaction = true;
    return;
}