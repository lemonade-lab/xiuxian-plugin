import { plugin ,segment} from '../../api/api.js'
import data from '../../model/xiuxiandata.js'
import {
    existplayer,
    ForwardMsg,
    Getmsg_battle,
    Read_player,
    Add_血气
} from '../../model/xiuxian.js'
export class battle extends plugin {
    constructor() {
        super({
            name: 'battle',
            dsc: 'battle',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^(切磋|以武会友)$',
                    fnc: 'biwu'
                }
            ]
        })
    }

    //比武
    async biwu(e) {
        if (!e.isGroup) return
        let A = e.user_id;

        //先判断
        let ifexistplay_A = await existplayer(A);
        if (!ifexistplay_A || e.isPrivate) { return; }
        //看看状态
        //得到redis游戏状态
        let last_game_timeA = await redis.get("xiuxian:player:" + A + ":last_game_time");
        //设置游戏状态
        if (last_game_timeA == 0) {
            e.reply(`猜大小正在进行哦!`);
            return true;
        }

        let isat = e.message.some((item) => item.type === "at");
        if (!isat) {
            return;
        }
        let atItem = e.message.filter((item) => item.type === "at");
        let B = atItem[0].qq;//后手

        if (A == B) { e.reply("你还跟自己修炼上了是不是?"); return; }
        let ifexistplay_B = await existplayer(B);
        if (!ifexistplay_B) { e.reply("修仙者不可对凡人出手!"); return; }
        //这里前戏做完,确定要开打了
        let final_msg = [segment.at(A), segment.at(B), "\n"];
        let A_player = await Read_player(A);
        let B_player = await Read_player(B);
        final_msg.push(`${A_player.名号}向${B_player.名号}发起了切磋。`);
        A_player.法球倍率 = A_player.灵根.法球倍率;
        B_player.法球倍率 = B_player.灵根.法球倍率;
        A_player.当前血量 = A_player.血量上限;
        B_player.当前血量 = B_player.血量上限;
        let Data_battle = await Getmsg_battle(A_player, B_player);
        let msg = Data_battle.msg;
        //战斗回合过长会导致转发失败报错，所以超过30回合的就不转发了
        if (msg.length > 30) {
            e.reply("战斗过程超过30回合，略");
        } else {
            await ForwardMsg(e, msg);
        }
        //下面的战斗超过100回合会报错
        let A_win = `${A_player.名号}击败了${B_player.名号}`;
        let B_win = `${B_player.名号}击败了${A_player.名号}`;
        if (msg.find(item => item == A_win)) {
        } else if (msg.find(item => item == B_win)) {
        } else {
            e.reply(`战斗过程出错`);
            return;
        }
        //最后发送消息
        e.reply(final_msg);
        let level_idBB = data.level_list.find(item => item.level_id == B_player.Physique_id).level_id;
        await Add_血气(B, 20 * level_idBB);
        return;
    }
}