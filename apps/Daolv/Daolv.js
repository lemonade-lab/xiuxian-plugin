
import plugin from '../../../../lib/plugins/plugin.js'
import { fstadd_qinmidu, sleep, __PATH } from "../../model/xiuxian.js"
import { segment } from "oicq";
import { exist_najie_thing, existplayer, Read_player, find_qinmidu, Read_qinmidu, Write_qinmidu, add_qinmidu, Add_najie_thing } from "../../model/xiuxian.js"
import fs from "fs"
let x = 0;
let chaoshi_time
let user_A;
let user_B;

export class Daolv extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'Daolv',
            /** 功能描述 */
            dsc: '道侣模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^(结为道侣)$',
                    fnc: 'qiuhun'
                },
                {
                    reg: '^(我愿意|我拒绝)$',
                    fnc: 'xuanze'
                },
                {
                    reg: '^(断绝姻缘)$',
                    fnc: 'lihun'
                },
                {
                    reg: '^(我同意|我拒绝)$',
                    fnc: 'xuanze2'
                },
                {
                    reg: '^赠予百合花篮$',
                    fnc: 'get_dift'
                },
                {
                    reg: '^#查询亲密度$',
                    fnc: 'SearchQingmidu',
                }
            ]
        })
    }
    async SearchQingmidu(e) {
        if (!e.isGroup) {
            return;
        }
        let A = e.user_id;
        /*
            @xxx
            -----qq----- -亲密度-
            1726566892   200
            12345674     50  
            3309758991   20
         */
        let flag = 0;//关系人数
        let msg = []; //回复的消息
        msg.push(`\n-----qq----- -亲密度-`);
        //遍历所有人的qq
        let File = fs.readdirSync(__PATH.player_path);
        File = File.filter(file => file.endsWith(".json"));
        for (let i = 0; i < File.length; i++) {
            let B = File[i].replace(".json", '');
            //如果是本人不执行查询
            if (A == B) {
                continue;
            }
            //A与B的亲密度
            let pd = await find_qinmidu(A, B);
            if (pd == false) {
                continue;
            }
            flag++;
            msg.push(`\n${B}\t ${pd}`);
        }
        if (flag == 0) {
            e.reply(`其实一个人也不错的`);
        }
        else {
            for (let i = 0; i < msg.length; i += 8) {
                e.reply(msg.slice(i, i + 8), false, { at: true });
                await sleep(500);
            }
        }
        return;
    }

    async qiuhun(e) {
        if (!e.isGroup) {
            return;
        }
        let A = e.user_id;
        let ifexistplay_A = await existplayer(A);
        if (!ifexistplay_A || e.isPrivate) { return; }
        let A_action = await redis.get("xiuxian:player:" + A + ":action");
        A_action = JSON.parse(A_action);
        if (A_action != null) {
            let now_time = new Date().getTime();
            //人物任务的动作是否结束
            let A_action_end_time = A_action.end_time;
            if (now_time <= A_action_end_time) {
                let m = parseInt((A_action_end_time - now_time) / 1000 / 60);
                let s = parseInt(((A_action_end_time - now_time) - m * 60 * 1000) / 1000);
                e.reply("正在" + A_action.action + "中,剩余时间:" + m + "分" + s + "秒");
                return;
            }
        }
        let last_game_timeA = await redis.get("xiuxian:player:" + A + ":last_game_time");
        if (last_game_timeA == 0) {
            e.reply(`猜大小正在进行哦，结束了再求婚吧!`);
            return;
        }


        let isat = e.message.some((item) => item.type === "at");
        if (!isat) {
            return;
        }
        let atItem = e.message.filter((item) => item.type === "at");
        let B = atItem[0].qq;
        if (A == B) { e.reply("精神分裂?"); return; }
        let ifexistplay_B = await existplayer(B);
        if (!ifexistplay_B) { e.reply("修仙者不可对凡人出手!"); return; }
        let B_action = await redis.get("xiuxian:player:" + B + ":action");
        B_action = JSON.parse(B_action);
        if (B_action != null) {
            let now_time = new Date().getTime();
            //人物任务的动作是否结束
            let B_action_end_time = B_action.end_time;
            if (now_time <= B_action_end_time) {
                let m = parseInt((B_action_end_time - now_time) / 1000 / 60);
                let s = parseInt(((B_action_end_time - now_time) - m * 60 * 1000) / 1000);
                e.reply("对方正在" + B_action.action + "中,剩余时间:" + m + "分" + s + "秒");
                return;
            }
        }
        let last_game_timeB = await redis.get("xiuxian:player:" + B + ":last_game_time");
        if (last_game_timeB == 0) {
            e.reply(`对方猜大小正在进行哦，等他结束再求婚吧!`);
            return;
        }
        let pd = await find_qinmidu(A, B);
        let ishavejz = await exist_najie_thing(A, "定情信物", "道具");
        if (!ishavejz) {
            e.reply("你没有[定情信物],无法发起求婚");
            return;
        }
        else if (pd == false || (pd > 0 && pd < 500)) {
            if (pd == false) pd = 0;
            e.reply(`你们亲密度不足500,无法心意相通(当前亲密度${pd})`);
            return;
        }
        else if (pd == 0) {
            e.reply(`对方已有道侣`);
            return;
        }
        if (x == 1 || x == 2) {
            e.reply(`有人缔结道侣，请稍等`);
            return;
        }
        x = 1;
        user_A = A;
        user_B = B;
        let player_A = await Read_player(A);
        let msg = [segment.at(B), "\n"];
        msg.push(`${player_A.名号}想和你缔结道侣,你愿意吗？\n回复【我愿意】or【我拒绝】`);
        e.reply(msg);
        chaoshi(e);
        return;
    }

    async xuanze(e) {
        if (!e.isGroup) {
            return;
        }
        if (e.user_id != user_B) {
            return;
        }
        if (x == 1) {
            let player_B = await Read_player(user_B);
            if (e.msg == "我愿意") {
                let qinmidu = await Read_qinmidu();
                let i = await found(user_A, user_B);
                if (i != qinmidu.length) {
                    qinmidu[i].婚姻 = 1;
                    await Write_qinmidu(qinmidu);
                    e.reply(`${player_B.名号}同意了你的请求`);
                    await Add_najie_thing(user_A, "定情信物", "道具", -1)
                }
            }
            else if (e.msg == "我拒绝") {
                e.reply(`${player_B.名号}拒绝了你的请求`);
            }
            clearTimeout(chaoshi_time);
            x = 0;
            return;
        }
    }

    async lihun(e) {
        if (!e.isGroup) {
            return;
        }
        let A = e.user_id;
        let ifexistplay_A = await existplayer(A);
        if (!ifexistplay_A || e.isPrivate) { return; }
        let A_action = await redis.get("xiuxian:player:" + A + ":action");
        A_action = JSON.parse(A_action);
        if (A_action != null) {
            let now_time = new Date().getTime();
            //人物任务的动作是否结束
            let A_action_end_time = A_action.end_time;
            if (now_time <= A_action_end_time) {
                let m = parseInt((A_action_end_time - now_time) / 1000 / 60);
                let s = parseInt(((A_action_end_time - now_time) - m * 60 * 1000) / 1000);
                e.reply("正在" + A_action.action + "中,剩余时间:" + m + "分" + s + "秒");
                return;
            }
        }
        let last_game_timeA = await redis.get("xiuxian:player:" + A + ":last_game_time");
        if (last_game_timeA == 0) {
            e.reply(`猜大小正在进行哦，结束了再来吧!`);
            return;
        }


        let isat = e.message.some((item) => item.type === "at");
        if (!isat) {
            return;
        }
        let atItem = e.message.filter((item) => item.type === "at");
        let B = atItem[0].qq;
        if (A == B) { e.reply("精神分裂?"); return; }
        let ifexistplay_B = await existplayer(B);
        if (!ifexistplay_B) { e.reply("修仙者不可对凡人出手!"); return; }
        let B_action = await redis.get("xiuxian:player:" + B + ":action");
        B_action = JSON.parse(B_action);
        if (B_action != null) {
            let now_time = new Date().getTime();
            //人物任务的动作是否结束
            let B_action_end_time = B_action.end_time;
            if (now_time <= B_action_end_time) {
                let m = parseInt((B_action_end_time - now_time) / 1000 / 60);
                let s = parseInt(((B_action_end_time - now_time) - m * 60 * 1000) / 1000);
                e.reply("对方正在" + B_action.action + "中,剩余时间:" + m + "分" + s + "秒");
                return;
            }
        }
        let last_game_timeB = await redis.get("xiuxian:player:" + B + ":last_game_time");
        if (last_game_timeB == 0) {
            e.reply(`对方猜大小正在进行哦，等他结束再找他吧!`);
            return;
        }

        let qinmidu;
        try {
            qinmidu = await Read_qinmidu();
        } catch {
            //没有建立一个
            await Write_qinmidu([])
            qinmidu = await Read_qinmidu();
        }
        let i = await found(A, B)
        let pd = await find_qinmidu(A, B);
        if (pd == false) {
            e.reply("你们还没建立关系，断个锤子");
            return;
        }
        else if (qinmidu[i].婚姻 == 0) {
            e.reply("你们还没结婚，断个锤子");
            return;
        }
        if (x == 1 || x == 2) {
            e.reply(`有人正在缔结道侣，请稍等`);
            return;
        }
        x = 2;
        user_A = A;
        user_B = B;
        let player_A = await Read_player(A);
        let msg = [segment.at(B), "\n"];
        msg.push(`${player_A.名号}要和你断绝姻缘\n回复【我同意】or【我拒绝】`);
        e.reply(msg);
        chaoshi(e);
        return;
    }

    async xuanze2(e) {
        if (!e.isGroup) {
            return;
        }
        if (e.user_id != user_B) {
            return;
        }
        if (x == 2) {
            let player_A = await Read_player(user_A);
            let player_B = await Read_player(user_B);
            let qinmidu = await Read_qinmidu();
            let i = await found(user_A, user_B);
            if (i != qinmidu.length) {
                if (e.msg == "我同意") {
                    qinmidu[i].婚姻 = 0;
                    await Write_qinmidu(qinmidu);
                    e.reply(`${player_A.名号}和${player_B.名号}和平分手`);
                }
                else if (e.msg == "我拒绝") {
                    e.reply(`${player_B.名号}拒绝了${player_A.名号}提出的建议`);

                }
            }
            clearTimeout(chaoshi_time);
            x = 0;
            return;
        }
    }

    async get_dift(e) {
        if (!e.isGroup) {
            return;
        }
        let isat = e.message.some((item) => item.type === "at");
        if (!isat) {
            return;
        }
        let atItem = e.message.filter((item) => item.type === "at");
        let B = atItem[0].qq;
        let A = e.user_id;
        let ifexistplay = await existplayer(A);
        if (!ifexistplay) {
            return;
        }
        if (A == B) { e.reply("精神分裂?"); return; }
        let ifexistplay_B = await existplayer(B);
        if (!ifexistplay_B) { e.reply("修仙者不可对凡人出手!"); return; }
        let ishavejz = await exist_najie_thing(A, "百合花篮", "道具");
        if (!ishavejz) {
            e.reply("你没有[百合花篮]");
            return;
        }
        let pd = await find_qinmidu(A, B);
        if (pd == false) {
            await fstadd_qinmidu(A, B);
        }
        else if (pd == 0) {
            e.reply(`对方已有道侣`);
            return;
        }

        await add_qinmidu(A, B, 60);
        await Add_najie_thing(A, "百合花篮", "道具", -1);
        e.reply(`你们的亲密度增加了60`);
        return;



    }

}


async function chaoshi(e) {
    chaoshi_time = setTimeout(() => {
        if (x == 1 || x == 2) {
            x = 0;
            e.reply("对方没有搭理你");
            return true;
        }
    }, 30000);
}
async function found(A, B) {
    let qinmidu = await Read_qinmidu();
    let i;
    for (i = 0; i < qinmidu.length; i++) {
        if ((qinmidu[i].QQ_A == A && qinmidu[i].QQ_B == B) || (qinmidu[i].QQ_A == B && qinmidu[i].QQ_B == A)) {
            break;
        }
    }
    return i;
}