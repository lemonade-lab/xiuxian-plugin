
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fs from "fs"
import { segment } from "oicq"
import { get_player_img } from '../ShowImeg/showData.js'
import {
    existplayer, __PATH, Write_player, Go, GenerateCD, Numbers,
    Read_player, Add_experience, getLastsign, shijianc, get_talent,
    Write_najie, Write_talent, Write_battle, Write_level, Write_wealth,
    player_efficiency, Write_action, Write_equipment, Read_wealth, Write_Life, Read_Life,offaction
} from '../Xiuxian/Xiuxian.js'
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
        let ifexistplay = await existplayer(usr_qq);
        if (ifexistplay) {
            return;
        }
        let new_player = {
            "autograph": "无",//道宣
            "days": 0//签到
        }
        await Write_player(usr_qq, new_player);
        let newtalent = await get_talent();
        let new_talent = {
            "talent": newtalent,//灵根
            "talentshow": 1,//显示0，隐藏1
            "talentsize": 0,//天赋
            "AllSorcery": []//功法
        }
        await Write_talent(usr_qq, new_talent);
        await player_efficiency(usr_qq);
        let new_battle = {
            "nowblood": data.Level_list.find(item => item.id == 1).blood+data.LevelMax_list.find(item => item.id == 1).blood,//血量
        }
        await Write_battle(usr_qq, new_battle);
        let new_level = {
            "prestige": 0,//魔力
            "level_id": 1,//练气境界
            "levelname": data.Level_list.find(item => item.id == 1).name,//练气名
            "experience": 1,//练气经验
            "levelmax_id": 1,//练体境界 
            "levelnamemax": data.LevelMax_list.find(item => item.id == 1).name,//练体名
            "experiencemax": 1,//练体经验
            "power":1
        }
        await Write_level(usr_qq, new_level);
        let new_wealth = {
            "lingshi": 5,
            "xianshi": 0,
            "reward": 1,//新手礼包，只要满足条件就开启。开启后领取，关闭
            "rewardmax": 1,//境界礼包，需要一定境界才能开启
        }
        await Write_wealth(usr_qq, new_wealth);
        let new_action = {
            "power_place": 1,//仙界状态
            "game": 1,//游戏状态
            "Couple": 1 //双修
        }
        await Write_action(usr_qq, new_action);
        let new_equipment = [];
        await Write_equipment(usr_qq, new_equipment);
        //初始化纳戒
        let new_najie = {
            "grade": 1,
            "lingshimax": 50000,
            "lingshi": 0,
            "thing": []
        }
        await Write_najie(usr_qq, new_najie);
        //随机名
        let name1 = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        let name2 = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        let name = name1[Math.floor((Math.random() * name1.length))] + name2[Math.floor((Math.random() * name2.length))];
        let life = await Read_Life();
        //随机寿命
        life.push({
            "qq": usr_qq,
            "name": `${name}`,
            "Age": 1,//年龄
            "life": Math.floor((Math.random() * (100-50)+50))//寿命
        })
        await Write_Life(life);
        this.Show_player(e);
        return;
    }


    //重新修仙
    async reCreate_player(e) {
        let good = await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let CDTime = this.xiuxianConfigData.CD.reborn;
        let ClassCD = ":last_reCreate_time";
        let now_time = new Date().getTime();
        let CD = await GenerateCD(usr_qq, ClassCD, now_time, CDTime);
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
        acount = Numbers(acount);
        acount++;
        //删档
        fs.rmSync(`${__PATH.player}/${usr_qq}.json`);
        let life = await Read_Life();
        await offaction(usr_qq);
        life = await life.filter(item => item.qq != usr_qq);
        await Write_Life(life);

        e.reply([segment.at(usr_qq), "来世，信则有，不信则无，岁月悠悠，世间终会出现两朵相同的花，千百年的回眸，一花凋零，一花绽。是否为同一朵，任后人去评断"]);
        await this.Create_player(e);
        await redis.set("xiuxian:player:" + usr_qq + ":last_reCreate_time", now_time);
        await redis.set("xiuxian:player:" + usr_qq + ":reCreate_acount", acount);
        return;
    }

    //#基础信息
    async Show_player(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let img = await get_player_img(e);
        e.reply(img);
        return;
    }

    //改名
    async Change_player_name(e) {
        let good = await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let lingshi = 5;
        let new_name = e.msg.replace("#改名", '');
        if (new_name.length == 0) {
            e.reply("请输入正确名字");
            return;
        }
        const name = ['尼玛', '妈的', '他妈', '卧槽', '操', '操蛋', '麻痹', '傻逼', '妈逼'];
        //屏蔽某词
        for (var i = 0; i < name.length; i++) {
            new_name = new_name.replace(name[i], '');
        }
        if (new_name.length > 8) {
            e.reply("玩家名字最多八字");
            return;
        }
        let wealth = await Read_wealth(usr_qq);

        if (wealth.lingshi < lingshi) {
            e.reply("需" + lingshi + "灵石");
            return;
        }

        let ClassCD = ":last_setname_time";
        let now_time = new Date().getTime();
        let CDTime = 60 * 24;
        let CD = await GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);
        wealth.lingshi -= lingshi;
        await Write_wealth(usr_qq,wealth);
        let life = await Read_Life();
        life.forEach((item)=>{
            if(item.qq==usr_qq){
                item.name=new_name;
            }
        });
        console.log(life);
        await Write_Life(life);
        this.Show_player(e);
        return;
    }


    //设置道宣
    async Change_player_autograph(e) {
        let good = await Go(e);
        if (!good) {
            return;
        }
        let usr_qq = e.user_id;
        let player = await Read_player(usr_qq);
        let new_msg = e.msg.replace("#设置道宣", '');
        new_msg = new_msg.replace(" ", '');
        const name = ['尼玛', '妈的', '他妈', '卧槽', '操', '操蛋', '麻痹', '傻逼', '妈逼'];
        for (var i = 0; i < name.length; i++) {
            new_msg = new_msg.replace(name[i], '');
        }

        if (new_msg.length == 0) {
            return;
        }
        else if (new_msg.length > 50) {
            e.reply("道宣最多50字符");
            return;
        }
        let ClassCD = ":last_setxuanyan_time";
        let now_time = new Date().getTime();
        let CDTime = 60 * 12;
        let CD = await GenerateCD(usr_qq, ClassCD, now_time, CDTime);
        if (CD != 0) {
            e.reply(CD);
            return;
        }
        await redis.set("xiuxian:player:" + usr_qq + ClassCD, now_time);
        player.autograph = new_msg;
        await Write_player(usr_qq, player);
        this.Show_player(e);
        return;
    }


    //签到
    async daily_gift(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let now = new Date();
        let nowTime = now.getTime(); //获取当前日期的时间戳
        let Yesterday = await shijianc(nowTime - 24 * 60 * 60 * 1000);//获得昨天日期
        let Today = await shijianc(nowTime);
        let lastsign_time = await getLastsign(usr_qq);//获得上次签到日期
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

        let player = await Read_player(usr_qq);
        if (player.days == 7 || !Sign_Yesterday) {//签到连续7天或者昨天没有签到,连续签到天数清零
            player.days = 0;
        }
        player.days += 1;
        await Write_player(usr_qq,player);
        let gift_xiuwei = player.days * 5;
        await Add_experience(usr_qq, gift_xiuwei);
        let msg = [
            segment.at(usr_qq),
            `连续签到${player.days}天，获得了${gift_xiuwei}修为`
        ]
        e.reply(msg);
        return;
    }
}