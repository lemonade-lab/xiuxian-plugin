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
        let msg = [
            "《怪物时间》\n11:30——12:30\n18:30——19:30\n指令：#讨伐+怪物名"
        ];
        for (var i = 0; i < 3; i++) {
            let Boss;
            let x=0;
            if (i == 0) {
                Boss = await redis.get("xiuxian:BossMaxplus");
                x=await redis.get("BossMaxplus");
            }
            else if (i == 1) {
                Boss = await redis.get("xiuxian:BossMax");
                x=await redis.get("BossMax");
            } else {
                Boss = await redis.get("xiuxian:BossMini");
                x=await redis.get("BossMini");
            }
            if(x==0){
                Boss = JSON.parse(Boss);
                if (Boss != null) {
                    msg.push(
                    "怪物：" + Boss.name +
                    "\n攻击：" + Boss.nowattack +
                    "\n防御：" + Boss.nowdefense +
                    "\n血量：" + Boss.nowblood +
                    "\n敏捷：" + Boss.nowblood +
                    "\n暴击：" + Boss.nowblood +
                    "\n暴伤：" + Boss.nowblood +
                    "\n掉落：" + Boss.money
                   );
                }
            }
        }
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
            if (CD != 0) {
                e.reply(CD);
                return;
            }
            await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);


            let BossMaxplus = await redis.get("xiuxian:BossMaxplus");
            BossMaxplus = JSON.parse(BossMaxplus);
            if (BossMaxplus != null) {
                let Data_battle = await Xiuxian.battlemax(usr_qq, BossMax);
                let msg = Data_battle.msg;
                if (msg.length > 30) {
                    e.reply("战斗过程略...");
                } else {
                    await Xiuxian.ForwardMsg(e, msg);
                }
                if (Data_battle.victory == usr_qq) {
                    await Xiuxian.Add_lingshi(usr_qq, BossMaxplus.money);
                    e.reply("你击败了"+BossMaxplus.name+"，获得" + BossMaxplus.money);
                } else {
                    await Xiuxian.Add_lingshi(usr_qq, -BossMaxplus.money);
                    e.reply("你被"+BossMaxplus.name+"打败了，被抢走了" + BossMaxplus.money);
                }
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
            if (CD != 0) {
                e.reply(CD);
                return;
            }
            await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);
            let BossMax = await redis.get("xiuxian:BossMax");
            BossMax = JSON.parse(BossMax);
            if (BossMax != null) {
                let Data_battle = await Xiuxian.battlemax(usr_qq, BossMax);
                let msg = Data_battle.msg;
                if (msg.length > 30) {
                    e.reply("战斗过程略...");
                } else {
                    await Xiuxian.ForwardMsg(e, msg);
                }
                if (Data_battle.victory == usr_qq) {
                    await Xiuxian.Add_lingshi(usr_qq, BossMax.money);
                    e.reply("你击败了"+BossMax.name+"，获得" + BossMax.money);
                } else {
                    await Xiuxian.Add_lingshi(usr_qq, -BossMax.money);
                    e.reply("你被"+BossMax.name+"打败了，被抢走了" + BossMax.money);
                }
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
            if (CD != 0) {
                e.reply(CD);
                return;
            }
            await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);
            let BossMini = await redis.get("xiuxian:BossMini");
            BossMini = JSON.parse(BossMini);
            if (BossMini != null) {
                let Data_battle = await Xiuxian.battlemax(usr_qq, BossMini);
                let msg = Data_battle.msg;
                if (msg.length > 30) {
                    e.reply("战斗过程略...");
                } else {
                    await Xiuxian.ForwardMsg(e, msg);
                }
                if (Data_battle.victory == usr_qq) {
                    await Xiuxian.Add_lingshi(usr_qq, BossMini.money);
                    e.reply("你击败了"+BossMini.name+"，，获得" + BossMini.money);
                } else {
                    await Xiuxian.Add_lingshi(usr_qq, -BossMini.money);
                    e.reply("你被"+BossMini.name+"打败了，被抢走了" + BossMini.money);
                }
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


