import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import { Go,At,GenerateCD,existplayer,__PATH } from '../Xiuxian/Xiuxian.js'
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


