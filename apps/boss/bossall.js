import { plugin } from '../../api/api.js'
import data from '../../model/xiuxiandata.js'
import config from "../../model/config.js"
import {
    Go,
    Read_player,
    get_random_talent,
    Getmsg_battle,
    isNotNull,
    ForwardMsg,
    Add_灵石,
    Add_血气
} from '../../model/xiuxian.js'
export class bossall extends plugin {
    constructor() {
        super({
            name: 'bossall',
            dsc: 'bossall',
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
    }

    //怪物状态
    async Bosstate(e) {
        if (!e.isGroup) return
        let bossMaxplus = await redis.get("BossMaxplus");
        let msg = [
            "《怪物时间》\n11:30——12:30\n18:30——19:30\n指令:#讨伐+怪物名"
        ];
        if (bossMaxplus == 0) {
            let BossMaxplus = await redis.get("xiuxian:BossMaxplus");
            BossMaxplus = JSON.parse(BossMaxplus);
            if (BossMaxplus != null) {
                msg.push("【魔王】" +
                    "\n攻击:" + BossMaxplus.attack +
                    "\n防御:" + BossMaxplus.defense +
                    "\n血量:" + BossMaxplus.blood +
                    "\n掉落:" + BossMaxplus.money);
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
                    "\n攻击:" + BossMax.attack +
                    "\n防御:" + BossMax.defense +
                    "\n血量:" + BossMax.blood +
                    "\n掉落:" + BossMax.money);
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
                    "\n攻击:" + BossMini.attack +
                    "\n防御:" + BossMini.defense +
                    "\n血量:" + BossMini.blood +
                    "\n掉落:" + BossMini.money);
            }
        }
        else {
            msg.push("银角大王未开启！");
        }
        await ForwardMsg(e, msg);
        return;
    }

    //讨伐魔王
    async BossMaxplus(e) {
        if (!e.isGroup) return
        let usr_qq = e.user_id;
        //看状态
        const T = await Go(e);
        if (!T) {
            return
        }
        //查看boss状态
        let boss = await redis.get("BossMaxplus");
        if (boss == 0) {
        }
        else {
            e.reply("魔王未开启！");
            return;
        }
        //按攻打次数获得奖励
        let player = await Read_player(usr_qq);
        let now_level_id;
        if (!isNotNull(player.level_id)) {
            e.reply("请先#同步信息");
            return;
        }
        now_level_id = data.level_list.find(item => item.level_id == player.level_id).level_id;

        if (now_level_id >= 42) {
            let cd = await BossCD(e);
            if (cd == 1) {
                return;
            }
            let A_player = await Bossbattle(e);
            let BossMaxplus = await redis.get("xiuxian:BossMaxplus");
            BossMaxplus = JSON.parse(BossMaxplus);
            if (BossMaxplus != null) {
                let B_player = {
                    名号: "魔王",
                    攻击: parseInt(BossMaxplus.attack),
                    防御: parseInt(BossMaxplus.defense),
                    当前血量: parseInt(BossMaxplus.blood),
                    暴击率: parseInt(BossMaxplus.probability),
                    法球倍率: 0
                }
                let Data_battle = await Getmsg_battle(A_player, B_player);
                let msgg = Data_battle.msg;
                let A_win = `${A_player.名号}击败了${B_player.名号}`;
                let B_win = `${B_player.名号}击败了${A_player.名号}`;
                if (msgg.find(item => item == A_win)) {
                    await Add_灵石(usr_qq, BossMaxplus.money);
                    e.reply(A_player.名号 + "击败了" + B_player.名号 + "，得到了" + BossMaxplus.money + "灵石");
                }
                else if (msgg.find(item => item == B_win)) {
                    //输了，被抢了灵石
                    if (player.灵石 > BossMaxplus.money) {
                        await Add_灵石(usr_qq, -BossMaxplus.money);
                        e.reply(A_player.名号 + "打不过" + B_player.名号 + "，被抢走了" + BossMaxplus.money + "灵石");
                    }
                    else {
                        await Add_灵石(usr_qq, -player.灵石 + 1);
                        e.reply(A_player.名号 + "打不过" + B_player.名号 + "，被抢走了" + BossMaxplus.money + "灵石");
                    }
                }
                else {
                    //出错了
                    return;
                }
                await Add_血气(usr_qq, 500);
                let now_time = new Date().getTime();
                //获得时间戳
                await redis.set("xiuxian:player:" + usr_qq + ":Bosstime", now_time);
            }
        }
        else if (now_level_id <= 41) {
            e.reply("凡人不可阶跃！");
        }
        return;
    }
    //讨伐金角大王
    async BossMax(e) {
        if (!e.isGroup) return
        let usr_qq = e.user_id;
        //看状态
        const T = await Go(e);
        if (!T) {
            return
        }
        //查看boss状态
        let boss = await redis.get("BossMax");
        if (boss == 0) {
        }
        else {
            e.reply("金角大王未开启！");
            return;
        }
        let player = await Read_player(usr_qq);


        let now_level_id;
        if (!isNotNull(player.level_id)) {
            e.reply("请先#同步信息");
            return;
        }
        now_level_id = data.level_list.find(item => item.level_id == player.level_id).level_id;

        if (now_level_id >= 21 && now_level_id < 42) {
            let cd = await BossCD(e);
            if (cd == 1) {
                return;
            }
            let A_player = await Bossbattle(e);
            let BossMax = await redis.get("xiuxian:BossMax");
            BossMax = JSON.parse(BossMax);
            if (BossMax != null) {
                let B_player = {
                    名号: "金角大王",
                    攻击: parseInt(BossMax.attack),
                    防御: parseInt(BossMax.defense),
                    当前血量: parseInt(BossMax.blood),
                    暴击率: parseInt(BossMax.probability),
                    法球倍率: 0
                }
                let Data_battle = await Getmsg_battle(A_player, B_player);
                let msgg = Data_battle.msg;
                let A_win = `${A_player.名号}击败了${B_player.名号}`;
                let B_win = `${B_player.名号}击败了${A_player.名号}`;
                if (msgg.find(item => item == A_win)) {
                    await Add_灵石(usr_qq, BossMax.money);
                    e.reply(A_player.名号 + "击败了" + B_player.名号 + "，得到了" + BossMax.money + "灵石");
                }
                else if (msgg.find(item => item == B_win)) {
                    //输了，被抢了灵石
                    if (player.灵石 > BossMax.money) {
                        await Add_灵石(usr_qq, -BossMax.money);
                        e.reply(A_player.名号 + "打不过" + B_player.名号 + "，被抢走了" + BossMax.money + "灵石");
                    }
                    else {
                        await Add_灵石(usr_qq, -player.灵石 + 1);
                        e.reply(A_player.名号 + "打不过" + B_player.名号 + "，被抢走了" + BossMax.money + "灵石");
                    }
                }
                else {
                    //出错了
                    return;
                }
                await Add_血气(usr_qq, 500);
                let now_time = new Date().getTime();
                //获得时间戳
                await redis.set("xiuxian:player:" + usr_qq + ":Bosstime", now_time);

            }
            else {
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
        if (!e.isGroup) return
        let usr_qq = e.user_id;
        //看状态
        const T = await Go(e);
        if (!T) {
            return
        }
        //查看boss状态
        let boss = await redis.get("BossMini");
        if (boss == 0) {
        }
        else {
            e.reply("银角大王未开启！");
            return;
        }
        let player = await Read_player(usr_qq);
        let now_level_id;
        if (!isNotNull(player.level_id)) {
            e.reply("请先#同步信息");
            return;
        }
        now_level_id = data.level_list.find(item => item.level_id == player.level_id).level_id;
        if (now_level_id < 21) {
            let cd = await BossCD(e);
            if (cd == 1) {
                return;
            }
            //这里接受用户信息
            let A_player = await Bossbattle(e);
            //攻打
            let BossMini = await redis.get("xiuxian:BossMini");
            BossMini = JSON.parse(BossMini);

            if (BossMini != null) {
                let B_player = {
                    名号: "银角大王",
                    攻击: parseInt(BossMini.attack),
                    防御: parseInt(BossMini.defense),
                    当前血量: parseInt(BossMini.blood),
                    暴击率: parseInt(BossMini.probability),
                    法球倍率: 0
                }
                let Data_battle = await Getmsg_battle(A_player, B_player);
                let msgg = Data_battle.msg;
                let A_win = `${A_player.名号}击败了${B_player.名号}`;
                let B_win = `${B_player.名号}击败了${A_player.名号}`;
                if (msgg.find(item => item == A_win)) {
                    await Add_灵石(usr_qq, BossMini.money);
                    e.reply(A_player.名号 + "击败了" + B_player.名号 + "，得到了" + BossMini.money + "灵石");
                }
                else if (msgg.find(item => item == B_win)) {
                    //输了，被抢了灵石
                    if (player.灵石 > BossMini.money) {

                        await Add_灵石(usr_qq, -BossMini.money);
                        e.reply(A_player.名号 + "打不过" + B_player.名号 + "，被抢走了" + BossMini.money + "灵石");
                    }
                    else {
                        await Add_灵石(usr_qq, -player.灵石 + 1);
                        e.reply(A_player.名号 + "打不过" + B_player.名号 + "，被抢走了" + BossMini.money + "灵石");
                    }

                }
                else {
                    return;
                }
                await Add_血气(usr_qq, 500);
                //获取当前时间
                let now_time = new Date().getTime();
                //获得时间戳
                await redis.set("xiuxian:player:" + usr_qq + ":Bosstime", now_time);
            }
            else {
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
/**
 * boss战斗
 */
async function Bossbattle(e) {
    let usr_qq = e.user_id;
    let player = await Read_player(usr_qq);
    if (player.灵根 == null || player.灵根 == undefined) {
        player.灵根 = await get_random_talent();
        player.修炼效率提升 += player.灵根.eff;
    }
    data.setData("player", usr_qq, player);
    let A_player = {
        名号: player.名号,
        攻击: player.攻击,
        防御: player.防御,
        当前血量: player.当前血量,
        暴击率: player.暴击率,
        法球倍率: player.灵根.法球倍率
    }
    return A_player;
}

/**
 * 冷却
 * 
 */

async function BossCD(e) {
    let usr_qq = e.user_id;
    //设置           
    var time = config.getconfig("xiuxian", "xiuxian").CD.boss;
    //获取当前时间
    let now_time = new Date().getTime();
    //获得时间戳
    let Bosstime = await redis.get("xiuxian:player:" + usr_qq + ":Bosstime");
    Bosstime = parseInt(Bosstime);
    let transferTimeout = parseInt(60000 * time)
    if (now_time < Bosstime + transferTimeout) {
        let game_m = Math.trunc((Bosstime + transferTimeout - now_time) / 60 / 1000);
        let game_s = Math.trunc(((Bosstime + transferTimeout - now_time) % 60000) / 1000);
        e.reply(`每${transferTimeout / 1000 / 60}分钟讨伐一次。` + `cd: ${game_m}分${game_s}秒`);
        //存在CD。直接返回1
        return 1;
    }
    return 0;
}