
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fs from "fs"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
import * as ShowData from '../ShowImeg/showData.js'
import { segment } from "oicq"
/**
 * 信息模块
 */
export class UserStart extends plugin {
    constructor() {
        super({
            name: 'UserStart',
            dsc: 'UserStart',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#踏入仙途$',
                    fnc: 'Create_player'
                },
                {
                    reg: '^#再入仙途$',
                    fnc: 'reCreate_player'
                },
                {
                    reg: '^#我的练气$',
                    fnc: 'Show_player'
                },
                {
                    reg: '^#(改名.*)|(设置道宣.*)$',
                    fnc: 'Change_player_name'
                },
                {
                    reg: '^#修仙签到$',
                    fnc: 'daily_gift'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    //#踏入仙途
    async Create_player(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        if (usr_qq == 80000000) {
            return;
        }
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (ifexistplay) {
            this.Show_player(e);
            return;
        }
        let newtalent = await Xiuxian.get_talent();
        let File_msg = fs.readdirSync(Xiuxian.__PATH.player);
        let n = File_msg.length + 1;
        let new_player = {
            "name": `${n}号`,//道号
            "autograph": "无",//道宣
            "race": 1,//种族

            "level_id": 1,//练气境界
            "Physique_id": 1,//练体境界 
            "experience": 1,//练气经验
            "experiencemax": 1,//练体经验

            "lingshi": 1000,//灵石
            "nowblood": 8040,//血量

            "talent": newtalent,//灵根
            "talentshow": 1,//显示0，隐藏1
            "talentsize": 0,//天赋

            "AllSorcery": [],//功法
            "occupation": [],//职业

            "power_place": 1,//仙界
            
            "days": 0,//签到
        }
        await Xiuxian.Write_player(usr_qq, new_player);

        //初始化装备
        let new_equipment = {
            "arms": 
                {
                "id": 1,
                "class": "1",
                "type": "1"
               },
            "huju": 
                {
                "id": 1,
                "class": "2",
                "type": "1"
                },
            "fabao": 
                {
                "id": 1,
                "class": "3",
                "type": "1"
                }
        }

        await Xiuxian.Write_equipment(usr_qq, new_equipment);

        //初始化纳戒
        let new_najie = {
            "grade": 1,
            "lingshimax": 50000,
            "lingshi": 0,
            "arms": [],
            "huju": [],
            "fabao": [],
            "danyao": [],
            "daoju": [],
            "gonfa": [],
            "ring": []
        }

        await Xiuxian.Write_najie(usr_qq, new_najie);
        await Xiuxian.Add_HP(usr_qq, 999999);
        this.Show_player(e);

        return;
    }


    //重新修仙
    async reCreate_player(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        
        let acount = await redis.get("xiuxian:player:" + usr_qq + ":reCreate_acount");
        if (acount == undefined || acount == null || acount == NaN || acount <= 0) {
            await redis.set("xiuxian:player:" + usr_qq + ":reCreate_acount", 1);
        }
        let now = new Date();
        let nowTime = now.getTime(); //获取当前时间戳
        let lastrestart_time = await redis.get("xiuxian:player:" + usr_qq + ":last_reCreate_time");//获得上次重生时间戳,
        lastrestart_time = parseInt(lastrestart_time);
        var time = this.xiuxianConfigData.CD.reborn;
        let rebornTime = parseInt(60000 * time)
        if (nowTime < lastrestart_time + rebornTime) {
            let waittime_m = Math.trunc((lastrestart_time + rebornTime - nowTime) / 60 / 1000);
            let waittime_s = Math.trunc(((lastrestart_time + rebornTime - nowTime) % 60000) / 1000);
            e.reply(`每${rebornTime / 60 / 1000}分钟只能转世一次` + `剩余cd:${waittime_m}分 ${waittime_s}秒`);
            return;
        }
        this.setContext('RE_xiuxian');
        await e.reply('发送【转世】或者【罢了】进行二次确定', false, { at: true });
        return;
    }


    //重生方法
    async RE_xiuxian(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let new_msg = this.e.message;
        let choice = new_msg[0].text;
        let now = new Date();
        let nowTime = now.getTime(); //获取当前时间戳
        if (choice == "罢了") {
            this.finish('RE_xiuxian');
            return;
        }
        else if (choice == "转世") {
            let acount = await redis.get("xiuxian:player:" + usr_qq + ":reCreate_acount");
            if (acount >= 15) {
                e.reply("灵魂虚弱，已不可转世！");
                return;
            }
            acount = Number(acount);
            acount++;
            fs.rmSync(`${Xiuxian.__PATH.player}/${usr_qq}.json`);
            fs.rmSync(`${Xiuxian.__PATH.equipment}/${usr_qq}.json`);
            fs.rmSync(`${Xiuxian.__PATH.najie}/${usr_qq}.json`);
            e.reply([segment.at(usr_qq), "来世，信则有，不信则无，岁月悠悠，世间终会出现两朵相同的花，千百年的回眸，一花凋零，一花绽。是否为同一朵，任后人去评断"]);
            await this.Create_player(e);
            await redis.set("xiuxian:player:" + usr_qq + ":last_reCreate_time", nowTime);//redis设置本次改名时间戳
            await redis.set("xiuxian:player:" + usr_qq + ":reCreate_acount", acount);

        }
        else {
            this.setContext('RE_xiuxian');
            await this.reply('【转世】或者【罢了】进行选择', false, { at: true });
            return;
        }
        /** 结束上下文 */
        this.finish('RE_xiuxian');
        return;
    }

    //#我的练气
    async Show_player(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let img = await ShowData.get_player_img(e);
        e.reply(img);
        return;
    }

    //改名
    async Change_player_name(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        //检索方法
        var reg = new RegExp(/改名|设置道宣/);
        let func = reg.exec(e.msg);
        if (func == "改名") {
            let new_name = e.msg.replace("#改名", '');
            new_name = new_name.replace(" ", '');
            new_name = new_name.replace("+", '');
            if (new_name.length == 0) {
                e.reply("请输入正确名字");
                return;
            }
            else if (new_name.length > 8) {
                e.reply("玩家名字最多八字");
                return;
            }
            let player = {};
            let now = new Date();
            let nowTime = now.getTime(); //获取当前日期的时间戳
            let Today = await Xiuxian.shijianc(nowTime);
            let lastsetname_time = await redis.get("xiuxian:player:" + usr_qq + ":last_setname_time");//获得上次改名日期,
            lastsetname_time = parseInt(lastsetname_time);
            lastsetname_time = await Xiuxian.shijianc(lastsetname_time);
            if (Today.Y == lastsetname_time.Y && Today.M == lastsetname_time.M && Today.D == lastsetname_time.D) {
                e.reply("每日只能改名一次");
                return;
            }
            player = await Xiuxian.Read_player(usr_qq);
            if (player.lingshi < 1000) {
                e.reply("改名需要1000lingshi");
                return;
            }
            player.name = new_name;
            redis.set("xiuxian:player:" + usr_qq + ":last_setname_time", nowTime);//redis设置本次改名时间戳
            player.lingshi -= 1000;
            await Xiuxian.Write_player(usr_qq, player);
            this.Show_player(e);
            return;
        }

        //设置道宣
        else if (func == "设置道宣") {
            let new_msg = e.msg.replace("#设置道宣", '');
            new_msg = new_msg.replace(" ", '');
            new_msg = new_msg.replace("+", '');
            if (new_msg.length == 0) {
                return;
            }
            else if (new_msg.length > 50) {
                e.reply("道宣最多50字符");
                return;
            }
            let player = {};
            let now = new Date();
            let nowTime = now.getTime(); //获取当前日期的时间戳
            let Today = await Xiuxian.shijianc(nowTime);
            let lastsetxuanyan_time = await redis.get("xiuxian:player:" + usr_qq + ":last_setxuanyan_time");
            lastsetxuanyan_time = parseInt(lastsetxuanyan_time);
            lastsetxuanyan_time = await Xiuxian.shijianc(lastsetxuanyan_time);
            if (Today.Y == lastsetxuanyan_time.Y && Today.M == lastsetxuanyan_time.M && Today.D == lastsetxuanyan_time.D) {
                e.reply("每日仅可更改一次");
                return;
            }
            player = await Xiuxian.Read_player(usr_qq);
            player.autograph = new_msg;//
            redis.set("xiuxian:player:" + usr_qq + ":last_setxuanyan_time", nowTime);//redis设置本次设道置宣时间戳
            await Xiuxian.Write_player(usr_qq, player);
            this.Show_player(e);
            return;
        }
    }


    //签到
    async daily_gift(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let now = new Date();
        let nowTime = now.getTime(); //获取当前日期的时间戳
        let Yesterday = await Xiuxian.shijianc(nowTime - 24 * 60 * 60 * 1000);//获得昨天日期
        let Today = await Xiuxian.shijianc(nowTime);
        let lastsign_time = await Xiuxian.getLastsign(usr_qq);//获得上次签到日期
        if (Today.Y == lastsign_time.Y && Today.M == lastsign_time.M && Today.D == lastsign_time.D) {
            e.reply(`今日已经签到过了`);
            return;
        }
        let Sign_Yesterday;        //昨日日是否签到
        if (Yesterday.Y == lastsign_time.Y && Yesterday.M == lastsign_time.M && Yesterday.D == lastsign_time.D) {
            Sign_Yesterday = true;
        }
        else {
            Sign_Yesterday = false;
        }
        await redis.set("xiuxian:player:" + usr_qq + ":lastsign_time", nowTime);//redis设置签到时间
        let player = await data.getData("player", usr_qq);
        if (player.days == 7 || !Sign_Yesterday) {//签到连续7天或者昨天没有签到,连续签到天数清零
            player.days = 0;
        }
        player.days += 1;
        data.setData("player", usr_qq, player);
        //给奖励
        let gift_xiuwei = player.days * 3000;
        await Xiuxian.Add_experience(usr_qq, gift_xiuwei);
        let msg = [
            segment.at(usr_qq),
            `已经连续签到${player.days}天了，获得了${gift_xiuwei}修为`
        ]
        e.reply(msg);
        return;
    }
}