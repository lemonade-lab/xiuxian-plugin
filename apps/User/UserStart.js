
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
                    reg: '^#改名.*$',
                    fnc: 'Change_player_name'
                },
                {
                    reg: '^#设置道宣.*$',
                    fnc: 'Change_player_autograph'
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
            "prestige": 0,//魔力
            "Age":0,//年龄
            "life": 100,//寿命

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
                "id": 1101,
                "class": "1",
                "type": "1",
                "acount":"1"
            },
            "huju":
            {
                "id": 2101,
                "class": "2",
                "type": "1",
                "acount":"1"
            },
            "fabao":
            {
                "id": 3101,
                "class": "3",
                "type": "1",
                "acount":"1"
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
        this.Show_player(e);
        return;
    }


    //重新修仙
    async reCreate_player(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;

        let CDTime = this.xiuxianConfigData.CD.reborn;
        let ClassCD = ":last_reCreate_time";
        let now_time = new Date().getTime();
        let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);

        let acount = await redis.get("xiuxian:player:" + usr_qq + ":reCreate_acount");
        if (acount >= 15) {
            e.reply("灵魂虚弱，已不可转世！");
            return;
        }

        acount = Xiuxian.Numbers(acount);
        acount++;

        fs.rmSync(`${Xiuxian.__PATH.player}/${usr_qq}.json`);
        fs.rmSync(`${Xiuxian.__PATH.equipment}/${usr_qq}.json`);
        fs.rmSync(`${Xiuxian.__PATH.najie}/${usr_qq}.json`);

        e.reply([segment.at(usr_qq), "来世，信则有，不信则无，岁月悠悠，世间终会出现两朵相同的花，千百年的回眸，一花凋零，一花绽。是否为同一朵，任后人去评断"]);

        await this.Create_player(e);
        await redis.set("xiuxian:player:" + usr_qq + ":last_reCreate_time", now_time);
        await redis.set("xiuxian:player:" + usr_qq + ":reCreate_acount", acount);
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
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let lingshi = 1000;

        let new_name = e.msg.replace("#改名", '');
        if (new_name.length == 0) {
            e.reply("请输入正确名字");
            return;
        }

        if (new_name.length > 8) {
            e.reply("玩家名字最多八字");
            return;
        }

        let player = await Xiuxian.Read_player(usr_qq);
        if (player.lingshi < lingshi) {
            e.reply("需"+lingshi+"灵石");
            return;
        }
        
        let ClassCD = ":last_setname_time";
        let now_time = new Date().getTime();
        let CDTime = 60*24;
        let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if(CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);
        player.name = new_name;
        player.lingshi -= lingshi;
        await Xiuxian.Write_player(usr_qq, player);
        this.Show_player(e);
        return;
    }


    //设置道宣
    async Change_player_autograph(e) {
        let Go = await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        let player = await Xiuxian.Read_player(usr_qq);
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
        let ClassCD = ":last_setxuanyan_time";
        let now_time = new Date().getTime();
        let CDTime = 60*12;
        let CD = await Xiuxian.GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if(CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);
        player.autograph = new_msg;
        await Xiuxian.Write_player(usr_qq, player);
        this.Show_player(e);
        return;
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
        let gift_xiuwei = player.days * 3000;
        await Xiuxian.Add_experience(usr_qq, gift_xiuwei);
        let msg = [
            segment.at(usr_qq),
            `连续签到${player.days}天，获得了${gift_xiuwei}修为`
        ]
        e.reply(msg);
        return;
    }
}