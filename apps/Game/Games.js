import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fetch from 'node-fetch'
import { segment } from "oicq"
import { Go,At,sleep,GenerateCD,existplayer,ForwardMsg,__PATH } from '../Xiuxian/Xiuxian.js'
/**
* 修仙游戏模块
*/
export class Games extends plugin {
    constructor() {
        super({
            name: 'Games',
            dsc: 'Games',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#怡红院$',
                    fnc: 'Xiuianplay'
                },
                {
                    reg: '^#双修$',
                    fnc: 'Couple'
                },
                {
                    reg: '^#拒绝双修$',
                    fnc: 'Refusecouple'
                },
                {
                    reg: '^#允许双修$',
                    fnc: 'Allowcouple'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }
    async Refusecouple(e) {

        let usr_qq = e.user_id;
        let ifexistplay = data.existData("player", usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = await Read_player(usr_qq);
        await redis.set("xiuxian:player:" + usr_qq + ":couple", 1);
        e.reply(player.name + "开启了拒绝模式");
        return;
    }

    async Allowcouple(e) {

        let usr_qq = e.user_id;
        let ifexistplay = data.existData("player", usr_qq);
        if (!ifexistplay) {
            return;
        }
        let player = await Read_player(usr_qq);
        await redis.set("xiuxian:player:" + usr_qq + ":couple", 0);
        e.reply(player.name + "开启了允许模式");
        return;
    }


    //怡红院
    async Xiuianplay(e) {
        let switchgame = this.xiuxianConfigData.switch.play;
        if (switchgame != true) {
            return;
        }
        let good = await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let CDTime = 5;
        let ClassCD = ":Xiuianplay";
        let now_time = new Date().getTime();
        let CD = await GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);


        let player = await Read_player(usr_qq);
        let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        var money = now_level_id * 1000;
        var addlevel;
        if (now_level_id < 10) {
            addlevel = money;
        }
        else {
            addlevel = (9 / now_level_id) * money;
        }
        var rand = Math.random();
        var ql1 = "门口的大汉粗鲁的将你赶出来:'哪来的野小子,没钱还敢来学人家公子爷寻欢作乐?' 被人看出你囊中羞涩,攒到"
        var ql2 = "灵石再来吧！"
        if (player.lingshi < money) {
            e.reply(ql1 + money + ql2);
            return;
        }
        if (rand < 0.5) {
            let randexp = 90 + parseInt(Math.random() * 20);
            ql1 = "花了"
            ql2 = "灵石,你好好放肆了一番,奇怪的修为增加了"
            e.reply(ql1 + money + ql2 + randexp);
            await Add_experience(usr_qq, addlevel);
            await Add_lingshi(usr_qq, -money);
            let gameswitch = this.xiuxianConfigData.switch.Xiuianplay_key;
            if (gameswitch == true) {
                setu(e);
            }
            return;
        }
        else if (rand > 0.7) {
            await Add_lingshi(usr_qq, -money);
            ql1 = "花了"
            ql2 = "灵石,本想好好放肆一番,却赶上了扫黄,无奈在衙门被教育了一晚上,最终大彻大悟,下次还来！"
            e.reply([segment.at(usr_qq), ql1 + money + ql2]);
            return;
        }
        else {
            await Add_lingshi(usr_qq, -money);
            ql1 = "这一次，你进了一个奇怪的小巷子，那里衣衫褴褛的漂亮姐姐说要找你玩点有刺激的，你想都没想就进屋了。\n"
            ql2 = "没想到进屋后不多时遍昏睡过去。醒来发现自己被脱光扔在郊外,浑身上下只剩一条裤衩子了。仰天长啸：也不过是从头再来！"
            e.reply([segment.at(usr_qq), ql1 + ql2]);
            return;
        }

    }


    //双修
    async Couple(e) {
        let gameswitch = this.xiuxianConfigData.switch.couple;
        if (gameswitch != true) {
            return;
        }
        let good = await Go(e);
        if (!goodo) {
            return;
        }
        let A = e.user_id;
        let B = await At(e);
        if (B == 0 || B == A) {
            return;
        }
        let UserGo = await UserGo(B);
        if (!UserGo) {
            e.reply(UserGo);
            return;
        }
        let ifexistplay_B = await existplayer(B);
        if (!ifexistplay_B) {
            e.reply("修仙者不可对凡人出手!");
            return;
        }
        let couple = await redis.get("xiuxian:player:" + B + ":couple");
        if (couple != 0) {
            e.reply("哎哟，你干嘛...");
            return;
        }
        let ClassCD = ":Couple_time";
        let now_time = new Date().getTime();
        let CDTime = this.xiuxianConfigData.CD.couple;
        let CDA = await GenerateCD(A, ClassCD, now_time, CDTime);
        if (CDA != 0) {
            e.reply(CDA);
            return;
        }
        let CDB = await GenerateCD(A, ClassCD, now_time, CDTime);
        if (CDB != 0) {
            e.reply(CDB);
            return;
        }
        await redis.set("xiuxian:player:" + A + ClassCD, now_time);
        await redis.set("xiuxian:player:" + B + ClassCD, now_time);
        let option = Math.random();
        let x = 10000;
        let y = 0;
        if (option > 0 && option <= 0.5) {
            y = 3;
            e.reply('你们双方心无旁骛努力修炼，都增加了修为');
            return;
        }
        else if (option > 0.5 && option <= 0.6) {
            y = 2;
            e.reply('你们双方心无旁骛努力修炼，都增加了修为');
        }
        else if (option > 0.6 && option <= 0.7) {
            y = 1;
            e.reply('你们双方努力修炼，过程平稳，都增加了修为');
        }
        else if (option > 0.7 && option <= 0.9) {
            e.reply('你们双方默契不足，心也静不下来，并没有成功双修，只是聊了会天');
        }
        else {
            e.reply('你们双方默契不足，心也静不下来，并没有成功双修，只是聊了会天');
        }
        x = Math.trunc(y * x);
        await Add_experience(A, x);
        await Add_experience(B, x);
        return;
    }
}


export async function setu(e) {
    let url = "https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0";
    let msg = [];
    let res;
    try {
        let response = await fetch(url);
        res = await response.json();
    }
    catch (error) {
    }
    let link = res.data[0].urls.original;//获取图链
    link = link.replace('pixiv.cat', 'pixiv.re');//链接改为国内可访问的域名
    let pid = res.data[0].pid;//获取图片ID
    let uid = res.data[0].uid;//获取画师ID
    let title = res.data[0].title;//获取图片名称
    let author = res.data[0].author;//获取画师名称
    let px = res.data[0].width + '*' + res.data[0].height;//获取图片宽高
    msg.push("User: " + author +
        "\nUid: " + uid +
        "\nTitle: " + title +
        "\nPid: " + pid +
        "\nPx: " + px +
        "\nLink: " + link
    );

    await sleep(1000);
    e.reply(segment.image(link));
    await ForwardMsg(e, msg);
    return;
}


