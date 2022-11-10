import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import {Go,GenerateCD,Add_experiencemax,Add_experience,
    __PATH, Read_level, Write_level,updata_equipment,Read_Life,Write_Life} from '../Xiuxian/Xiuxian.js'
export class Level extends plugin {
    constructor() {
        super({
            name: 'Yunzai_Bot_Level',
            dsc: 'Yunzai_Bot_Level',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#突破$',
                    fnc: 'Level_up'
                },
                {
                    reg: '^#凝神',
                    fnc: 'Level_up2'
                },
                {
                    reg: '^#破体$',
                    fnc: 'LevelMax_up'
                },
                {
                    reg: '^#渡劫$',
                    fnc: 'fate_up'
                },
                {
                    reg: '^#羽化登仙$',
                    fnc: 'Level_up_Max'
                },
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    async LevelMax_up(e) {
        let good=await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let CDTime = this.xiuxianConfigData.CD.level_up;
        let CDid = "7";
        let now_time = new Date().getTime();
        let CD = await GenerateCD(usr_qq, CDid);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ':'+CDid ,now_time);
        await redis.expire("xiuxian:player:" + usr_qq + ':'+CDid , CDTime * 60);
        let player = await Read_level(usr_qq);
        let LevelMax = data.LevelMax_list.find(item => item.id == player.levelmax_id);
        if ( player.experiencemax< LevelMax.exp) {
            e.reply(`气血不足,再积累${ LevelMax.exp - player.experiencemax}气血后方可突破`);
            return;
        };
        if (player.levelmax_id >= 21) {
            return;
        };
        await redis.set("xiuxian:player:" + usr_qq + ':'+CDid, now_time);
        await redis.expire("xiuxian:player:" + usr_qq +':'+ CDid , CDTime * 60);
        if(player.levelmax_id>1&&player.rankmax_id<4){
            player.rankmax_id=player.rankmax_id+1;
            await Write_level(usr_qq, player);
            e.reply('突破成功至'+player.levelnamemax+player.rank_name[player.rankmax_id]);
            return;
        }
        let rand = Math.random();
        let prob = 1 - player.levelmax_id / 50;
        if (rand > prob) {
            let bad_time = Math.random();
            let x=0;
            if (bad_time > 0.9) {
                x=0.4;
                e.reply(`突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美！！！是翠翎恐蕈，此地不适合突破，快跑！险些走火入魔，丧失了` + (LevelMax.exp) * 0.4 + "气血");
            }
            else if (bad_time > 0.8) {
                x=0.2;
                e.reply(`突破瓶颈时想到树脂满了,险些走火入魔，丧失了` + (LevelMax.exp) * 0.2 + "气血");
            }
            else if (bad_time > 0.7) {
                x=0.1;
                e.reply(`突破瓶颈时想起背后是药园，刚种下掣电树种子，不能被破坏了，打断突破，嘴角流血，丧失了` + (LevelMax.exp) * 0.1 + "气血");

            }
            else if (bad_time > 0.1) {
                e.reply(`憋红了脸，境界突破失败,等到${CDTime}分钟后再尝试吧`);

            }
            else {
                e.reply(`突破瓶颈时想起怡红院里的放肆,想起了金银坊里的狂热,险些走火入魔，丧失了` + (LevelMax.exp) * 0.2 + "气血");
            }
            await Add_experiencemax(usr_qq, -1 * LevelMax.exp * x);
            await redis.set("xiuxian:player:" + usr_qq +':'+ CDid ,now_time);
            await redis.expire("xiuxian:player:" + usr_qq +':'+ CDid , CDTime * 60);
            return;
        }
        player.levelmax_id = player.levelmax_id + 1;
        player.levelnamemax= data.LevelMax_list.find(item => item.id == player.levelmax_id).name;
        player.experiencemax -= LevelMax.exp;
        player.rankmax_id=0;
        await Write_level(usr_qq, player);
        await updata_equipment(usr_qq);
        e.reply(`突破成功至`+player.levelnamemax+player.rank_name[player.rankmax_id]);
        await redis.set("xiuxian:player:" + usr_qq +':'+ CDid, now_time);
        await redis.expire("xiuxian:player:" + usr_qq +':'+ CDid , CDTime * 60);
        return;
    }

    //突破
    async Level_up(e) {
        let good=await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let CDTime = this.xiuxianConfigData.CD.level_up;
        let CDid = "6";
        let now_time = new Date().getTime();
        let CD = await GenerateCD(usr_qq, CDid);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        let player = await Read_level(usr_qq);
        let Level = data.Level_list.find(item => item.id == player.level_id);
        if (Level.id == 10) {
            e.reply(`请先渡劫！`);
            return;
        }
        if (player.experience < Level.exp) {
            e.reply(`修为不足,再积累${Level.exp- player.experience }修为后方可突破`);
            return;
        };
        await redis.set("xiuxian:player:" + usr_qq + ':'+CDid, now_time);
        await redis.expire("xiuxian:player:" + usr_qq +':'+ CDid , CDTime * 60);
        //是小境界突破:不需随机事件
        if(player.level_id>1&&player.rank_id<4){
            player.rank_id=player.rank_id+1;
            await Write_level(usr_qq, player);
            await updata_equipment(usr_qq);
            e.reply('突破成功至'+player.levelname+player.rank_name[player.rank_id]);
            return;
        }
        let rand = Math.random();
        let prob = 1 - player.level_id / 25;
        if (rand > prob) {
            let bad_time = Math.random();//增加多种突破失败情况，顺滑突破丢失experience曲线
            let x=0;
            if (bad_time > 0.9) {
                x=0.4;
                e.reply(`突然听到一声鸡叫,鸡..鸡..鸡...鸡你太美！！！是翠翎恐蕈，此地不适合突破，快跑！险些走火入魔，丧失了` + (Level.exp) * 0.4 + "修为");
            }
            else if (bad_time > 0.8) {
                x=0.2;
                e.reply(`突破瓶颈时想到树脂满了,险些走火入魔，丧失了` + (Level.exp) * 0.2 + "修为");
            }
            else if (bad_time > 0.7) {
                x=0.1;
                e.reply(`突破瓶颈时想起背后是药园，刚种下掣电树种子，不能被破坏了，打断突破，嘴角流血，丧失了` + (Level.exp) * 0.1 + "修为");
            }
            else if (bad_time > 0.1) {
                e.reply(`憋红了脸，境界突破失败,等到${CDTime}分钟后再尝试吧`);
            }
            else {
                x=0.2;
                e.reply(`突破瓶颈时想起怡红院里的放肆,想起了金银坊里的狂热,险些走火入魔，丧失了` + (Level.exp) * 0.2 + "修为");
            }
            await Add_experience(usr_qq, -1 * Level.exp * x);
            await redis.set("xiuxian:player:" + usr_qq +':'+ CDid, now_time);
            await redis.expire("xiuxian:player:" + usr_qq +':'+ CDid , CDTime * 60);
            return;
        }
        player.level_id = player.level_id + 1;
        player.levelname= data.Level_list.find(item => item.id == player.level_id).name;
        player.experience -= Level.exp;
        player.rank_id=0;
        await Write_level(usr_qq, player);
        await updata_equipment(usr_qq);
        let life = await Read_Life();
        life.forEach((item) => {
            if(item.qq==usr_qq){
                item.life+=Math.floor(item.life*player.level_id);
                e.reply('突破成功至'+player.levelname+player.rank_name[player.rank_id]+",寿命增加至"+item.life);
            }
        });
        await Write_Life(life);
        await redis.set("xiuxian:player:" + usr_qq +':'+ CDid, now_time);
        await redis.expire("xiuxian:player:" + usr_qq +':'+ CDid , CDTime * 60);
        return;
    };

    async Level_up2(e){        
        let good=await Go(e);
        if (!good) {
            return;
        }
        e.reply("待更新");
        return;
    }

    //渡劫
    async fate_up(e) {
        let good=await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let player = await Read_level(usr_qq);
        if (player.level_id != 10) {
            e.reply(`你非渡劫期修士！`);
            return;
        }
        e.reply("仙门未开！");
        return;
    }
    
}
