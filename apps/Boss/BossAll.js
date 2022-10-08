import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
/**
 * 全局
 */
let xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
/**
 * 怪物
 */
export class BossAll extends plugin {
    constructor() {
        super({
            name: 'BossAll',
            dsc: 'BossAll',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#怪物状态$',
                    fnc: 'Bosstate'
                },
                {
                    reg: '^#讨伐魔王$',
                    fnc: 'BossMaxplus'
                },
                {
                    reg: '^#讨伐金角大王$',
                    fnc: 'BossMax'
                },
                {
                    reg: '^#讨伐银角大王$',
                    fnc: 'BossMini'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    //怪物状态
    async Bosstate(e) {
        if (!e.isGroup) {
            return;
        }
        let msg = Bossmsg();
        await Xiuxian.ForwardMsg(e, msg);
        return;
    }

    //讨伐魔王
    async BossMaxplus(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;

        let boss = await redis.get("BossMaxplus");
        if (boss == 0) {
        }
        else {
            e.reply("魔王未开启！");
            return;
        }
        let player = await Xiuxian.Read_player(usr_qq);
        let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id >= 42) {
            let ClassCD = ":BossTime";
            let now_time = new Date().getTime();
            let CDTime = 15;
            let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
            if (CD == 1) {
                return;
            }
            await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);


            let BossMaxplus = await redis.get("xiuxian:BossMaxplus");
            BossMaxplus = JSON.parse(BossMaxplus);
            if (BossMaxplus != null) {
                /**
                 * 等重写
                 */

            }
        }
        else if (now_level_id <= 41) {
            e.reply("凡人不可阶跃！");
        }
        return;
    }
    //讨伐金角大王
    async BossMax(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;

        let boss = await redis.get("BossMax");
        if (boss == 0) {
        }
        else {
            e.reply("金角大王未开启！");
            return;
        }
        let player = await Xiuxian.Read_player(usr_qq);
        let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id >= 21 && now_level_id < 42) {
            let ClassCD = ":BossTime";
            let now_time = new Date().getTime();
            let CDTime = 15;
            let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
            if (CD == 1) {
                return;
            }
            await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);
            let BossMax = await redis.get("xiuxian:BossMax");
            BossMax = JSON.parse(BossMax);
            if (BossMax != null) {
                /**
                 * 等待重写
                 */

            }
        }
        else if (now_level_id > 33) {
            e.reply("仙人不可下界！");
        }
        else {
            e.reply("打不过你也打？");
        }
        return;
    }

    //讨伐银角大王
    async BossMini(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let boss = await redis.get("BossMini");
        if (boss == 0) {
        }
        else {
            e.reply("银角大王未开启！");
            return;
        }
        let player = await Xiuxian.Read_player(usr_qq);
        let now_level_id;
        now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 21) {
            let ClassCD = ":BossTime";
            let now_time = new Date().getTime();
            let CDTime = 15;
            let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
            if (CD == 1) {
                return;
            }
            await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);
            let BossMini = await redis.get("xiuxian:BossMini");
            BossMini = JSON.parse(BossMini);
            if (BossMini != null) {
                /**
                 * 待重写
                 */
            }
        }
        else if (now_level_id >= 42) {
            e.reply("仙人不可下界！");
        } else {
            e.reply("抢新手怪你要不要脸！");
        }
        return;
    }


}


export async function Bossmsg(e) {
    let bossMaxplus = await redis.get("BossMaxplus");
    let msg = [
        "《怪物时间》\n11:30——12:30\n18:30——19:30\n指令：#讨伐+怪物名"
    ];
    if (bossMaxplus == 0) {
        let BossMaxplus = await redis.get("xiuxian:BossMaxplus");
        BossMaxplus = JSON.parse(BossMaxplus);
        if (BossMaxplus != null) {
            msg.push("【魔王】" +
                "\n攻击：" + BossMaxplus.attack +
                "\n防御：" + BossMaxplus.defense +
                "\n血量：" + BossMaxplus.blood +
                "\n掉落：" + BossMaxplus.money);
        }
    }
    else {
        msg.push("魔王未开启！");
    }
    let bossMax = await redis.get("BossMax");
    if (bossMax == 0) {
        let BossMax = await redis.get("xiuxian:BossMax");
        BossMax = JSON.parse(BossMax);
        if (BossMax != null) {
            msg.push("【金角大王】" +
                "\n攻击：" + BossMax.attack +
                "\n防御：" + BossMax.defense +
                "\n血量：" + BossMax.blood +
                "\n掉落：" + BossMax.money);
        }
    }
    else {
        msg.push("金角大王未开启！");
    }
    let bossMini = await redis.get("BossMini");
    if (bossMini == 0) {
        let BossMini = await redis.get("xiuxian:BossMini");
        BossMini = JSON.parse(BossMini);
        if (BossMini != null) {
            msg.push("【银角大王】" +
                "\n攻击：" + BossMini.attack +
                "\n防御：" + BossMini.defense +
                "\n血量：" + BossMini.blood +
                "\n掉落：" + BossMini.money);
        }
    }
    else {
        msg.push("银角大王未开启！");
    }
    return msg;
}


