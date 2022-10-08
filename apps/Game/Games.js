import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fetch from 'node-fetch'
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
import { segment } from "oicq"

/**
 * 全局变量
 */

let gane_key_user = [];//怡红院限制
var yazhu = [];//押注
let gametime = [];//临时游戏CD

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
                    reg: '^#金银坊$',
                    fnc: 'Moneynumber'
                },
                {
                    reg: '^#(梭哈)|(押注.*)$',
                    fnc: 'Moneycheck'
                },
                {
                    reg: '^(大|小)$',
                    fnc: 'Moneycheckguess'
                },
                {
                    reg: '^#金银坊记录$',
                    fnc: 'Moneyrecord'
                },
                {
                    reg: '^#来张卡片$',
                    fnc: 'getOneCard'
                },
                {
                    reg: '^双修$',
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
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let player = await Xiuxian.Read_player(usr_qq);
        await redis.set("xiuxian:player:" + usr_qq + ":couple", 1);
        e.reply(player.name + "开启了拒绝模式");
        return;
    }

    async Allowcouple(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let player = await Xiuxian.Read_player(usr_qq);
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

        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }

        let CDTime =5;
        let ClassCD = ":Xiuianplay";
        let now_time = new Date().getTime();
        let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if (CD == 1) {
            return;
        }
        
        e.reply(CD);
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);


        let usr_qq = e.user_id;
        let player = await Xiuxian.Read_player(usr_qq);
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
            await Xiuxian.Add_experience(usr_qq, addlevel);
            await Xiuxian.Add_lingshi(usr_qq, -money);
            let gameswitch = this.xiuxianConfigData.switch.Xiuianplay_key;
            if (gameswitch == true) {
                setu(e);
            }
            return;
        }
        else if (rand > 0.7) {
            await Xiuxian.Add_lingshi(usr_qq, -money);
            ql1 = "花了"
            ql2 = "灵石,本想好好放肆一番,却赶上了扫黄,无奈在衙门被教育了一晚上,最终大彻大悟,下次还来！"
            e.reply([segment.at(usr_qq), ql1 + money + ql2]);
            return;
        }
        else {
            await Xiuxian.Add_lingshi(usr_qq, -money);
            ql1 = "这一次，你进了一个奇怪的小巷子，那里衣衫褴褛的漂亮姐姐说要找你玩点有刺激的，你想都没想就进屋了。\n"
            ql2 = "没想到进屋后不多时遍昏睡过去。醒来发现自己被脱光扔在郊外,浑身上下只剩一条裤衩子了。仰天长啸：也不过是从头再来！"
            e.reply([segment.at(usr_qq), ql1 + ql2]);
            return;
        }

    }


    //金银坊
    async Moneynumber(e) {
        let gameswitch = this.xiuxianConfigData.switch.Moneynumber;
        if (gameswitch != true) {
            return;
        }
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let player = data.getData("player", usr_qq);
        var money = 10000;
        if (player.lingshi < money) {
            e.reply("掌柜：哪里的穷小子，滚一边去！");
            return;
        }

        let CDTime =this.xiuxianConfigData.CD.gambling;
        let ClassCD = ":last_game_time";
        let now_time = new Date().getTime();
        let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if (CD == 1) {
            return;
        }
        e.reply(CD);
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time); 
        
        e.reply(`媚娘：发送[#押注+数字]或[#梭哈]`, true);
        await redis.set("xiuxian:player:" + usr_qq + ":game_action", 0);
        return true;
    }


    //梭哈|押注999
    async Moneycheck(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let now_time = new Date().getTime();
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
        if (!ifexistplay || game_action == 1) {
            return;
        }
        let es = e.msg.replace('#押注', "").trim();
        if (es == '#梭哈') {
            let player = await Xiuxian.Read_player(usr_qq);
            yazhu[usr_qq] = player.lingshi - 1;
            e.reply("媚娘：梭哈完成,发送[大]或[小]");
            return true;
        }
        if (parseInt(es) == parseInt(es)) {
            let player = await Xiuxian.Read_player(usr_qq);
            if (player.lingshi >= parseInt(es)) {
                yazhu[usr_qq] = parseInt(es);
                var money = 10000;
                if (yazhu[usr_qq] >= money) {
                    gane_key_user[usr_qq];
                    e.reply("媚娘：押注完成,发送[大]或[小]");
                    return;
                }
                else {
                    gane_key_user[usr_qq];
                    e.reply("至少押注" + money + "灵石!");
                    return;
                }
            }
            else {
                await redis.set("xiuxian:player:" + usr_qq + ":last_game_time", now_time);//存入缓存
                await redis.set("xiuxian:player:" + usr_qq + ":game_action", 1);
                yazhu[usr_qq] = 0;
                clearTimeout(gametime[usr_qq]);
                e.reply("媚娘：灵石不够也想玩？");
                return;
            }
        }

        return;
    }


    //大|小
    async Moneycheckguess(e) {
        if (!e.isGroup) {
            return;
        }
        
        let usr_qq = e.user_id;
        let now_time = new Date().getTime();
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        let game_action = await redis.get("xiuxian:player:" + usr_qq + ":game_action");
        if (!ifexistplay || game_action == 1) {
            return;
        }


        if (isNaN(yazhu[usr_qq])) {
            return;
        }
        if (!gane_key_user) {
            e.reply("媚娘：公子，你还没押注呢");
            return;
        }
        let player = await Xiuxian.Read_player(usr_qq);
        let es = e.msg
        let randtime = Math.trunc(Math.random() * 6) + 1;
        let touzi;
        var n;
        for (n = 1; n <= randtime; n++) {
            touzi = n;
        }
        e.reply(segment.dice(touzi));
        if (es == '大' && touzi > 3 || es == '小' && touzi < 4) {//赢了
            var x = this.xiuxianConfigData.percentage.Moneynumber;
            var y = 1;
            var z = this.xiuxianConfigData.size.Money * 10000;
            if (yazhu[usr_qq] >= z) {
                x = this.xiuxianConfigData.percentage.punishment;
                y = 0;
            }
            let addWorldmoney = yazhu[usr_qq] * (1 - x);
            yazhu[usr_qq] = Math.trunc(yazhu[usr_qq] * x);
            let Worldmoney = await redis.get("Xiuxian:Worldmoney");
            if (Worldmoney == null || Worldmoney == undefined || Worldmoney <= 0 || Worldmoney == NaN) {
                Worldmoney = 1;
            }
            Worldmoney = Number(Worldmoney);
            Worldmoney = Worldmoney + addWorldmoney;
            Worldmoney = Number(Worldmoney);
            await redis.set("Xiuxian:Worldmoney", Worldmoney);
            if (Xiuxian.isNotNull(player.金银坊胜场)) {
                player.金银坊胜场 = parseInt(player.金银坊胜场) + 1;
                player.金银坊收入 = parseInt(player.金银坊收入) + parseInt(yazhu[usr_qq]);
            } else {
                player.金银坊胜场 = 1
                player.金银坊收入 = parseInt(yazhu[usr_qq]);
            }
            data.setData("player", usr_qq, player);
            Xiuxian.Add_lingshi(usr_qq, yazhu[usr_qq]);
            if (y == 1) {
                e.reply([segment.at(usr_qq), `骰子最终为 ${touzi} 你猜对了！`, '\n', `现在拥有灵石:${player.lingshi + yazhu[usr_qq]}`]);
            }
            else {
                e.reply([segment.at(usr_qq), `骰子最终为 ${touzi} 你虽然猜对了，但是金银坊怀疑你出老千，准备打断你的腿的时候，你选择破财消灾。`, '\n', `现在拥有灵石:${player.lingshi + yazhu[usr_qq]}`]);
            }
            await redis.set("xiuxian:player:" + usr_qq + ":last_game_time", now_time);//存入缓存
            await redis.set("xiuxian:player:" + usr_qq + ":game_action", 1);
            yazhu[usr_qq] = 0;
            clearTimeout(gametime[usr_qq]);
            return true;

        }
        else if (es == '大' && touzi < 4 || es == '小' && touzi > 3) {//输了
            if (Xiuxian.isNotNull(player.金银坊败场)) {
                player.金银坊败场 = parseInt(player.金银坊败场) + 1;
                player.金银坊支出 = parseInt(player.金银坊支出) + parseInt(yazhu[usr_qq]);
            } else {
                player.金银坊败场 = 1
                player.金银坊支出 = parseInt(yazhu[usr_qq]);
            }
            data.setData("player", usr_qq, player);
            Xiuxian.Add_lingshi(usr_qq, -yazhu[usr_qq]);
            let msg = [segment.at(usr_qq), `骰子最终为 ${touzi} 你猜错了！`, '\n', `现在拥有灵石:${player.lingshi - yazhu[usr_qq]}`];
            let now_money = player.lingshi - yazhu[usr_qq];
            await redis.set("xiuxian:player:" + usr_qq + ":last_game_time", now_time);//存入缓存
            await redis.set("xiuxian:player:" + usr_qq + ":game_action", 1);
            yazhu[usr_qq] = 0;
            clearTimeout(gametime[usr_qq]);
            if (now_money <= 0) {
                msg.push("\n媚娘：没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！");
            }
            e.reply(msg);
            return true;
        }
    }



    async Moneyrecord(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let qq = e.user_id;
        let player_data = data.getData("player", qq);
        let victory = Xiuxian.isNotNull(player_data.金银坊胜场) ? player_data.金银坊胜场 : 0;
        let victory_num = Xiuxian.isNotNull(player_data.金银坊收入) ? player_data.金银坊收入 : 0;
        let defeated = Xiuxian.isNotNull(player_data.金银坊败场) ? player_data.金银坊败场 : 0;
        let defeated_num = Xiuxian.isNotNull(player_data.金银坊支出) ? player_data.金银坊支出 : 0;
        let shenglv = 0;
        if (parseInt(victory) + parseInt(defeated) == 0) {
            shenglv = 0;
        } else {
            shenglv = ((victory / (victory + defeated)) * 100).toFixed(2);
        }
        e.reply([segment.at(qq), "\n" +
            "金银坊记录如下：\n" +
            "胜场：" + victory + "\n" +
            "共卷走" + victory_num + "灵石\n" +
            "败场" + defeated + "\n" +
            "送给金银坊" + defeated_num + "灵石\n" +
            "胜率:" + shenglv + "%"]
        );
    }



    //双修
    async Couple(e) {
        let gameswitch = this.xiuxianConfigData.switch.couple;
        if (gameswitch != true) {
            return;
        }
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let A = e.user_id;
        let B = await Xiuxian.At(e);
        if (B == 0 || B == A) {
            return;
        }
        let UserGo = await Xiuxian.UserGo(B);
        if (!UserGo) {
            return;
        }
        let ifexistplay_B = await Xiuxian.existplayer(B);
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
        let CDA = await Xiuxian.GenerateCD(A, ClassCD, now_time, CDTime);
        if (CDA == 1) {
            return;
        }
        e.reply(CDA);
        let CDB = await Xiuxian.GenerateCD(A, ClassCD, now_time, CDTime);
        if (CDB == 1) {
            return;
        }
        e.reply(CDB);
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
        await Xiuxian.Add_experience(A, x);
        await Xiuxian.Add_experience(B, x);
        return;
    }
}



//图开关
export async function setu(e) {
    e.reply(`玩命加载图片中,请稍后...   ` + "\n(一分钟后还没有出图片,大概率被夹了,这个功能谨慎使用,机器人容易寄)")
    let url;
    url = "https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0";
    let msg = [];
    let res;
    //
    try {
        let response = await fetch(url);
        res = await response.json();
    } catch (error) {
        console.log('Request Failed', error);
    }
    if (res !== '{}') { console.log('res不为空'); } else { console.log('res为空'); }
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
        "\nLink: " + link);
    await Xiuxian.sleep(1000);
    e.reply(segment.image(link));
    await Xiuxian.ForwardMsg(e, msg);
    return true;
}


