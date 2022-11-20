import plugin from '../../../../lib/plugins/plugin.js';
import data from '../../model/XiuxianData.js';
import config from "../../model/Config.js";
import fs from "fs";
import { segment } from "oicq";
import {existplayer, __PATH, Write_player, Go, GenerateCD, get_talent, Write_najie, Write_talent, Write_battle,Write_level, Write_wealth,player_efficiency, Write_action, Write_equipment,Write_Life, Read_Life,offaction, Anyarray} from '../Xiuxian/Xiuxian.js';
import {get_player_img} from "../ShowImeg/showData.js";
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
                }
            ]
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    };
    async Create_player(e) {
        const group= this.xiuxianConfigData.group.white;
        if(group!=0){
            if(e.group_id!=group){
                return;
            };
        };
        if(!e.isGroup||e.user_id==80000000){
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (ifexistplay) {
            this.Show_player(e);
            return;
        };
        const new_player = {
            "autograph": "无",//道宣
            "days": 0//签到
        };
        await Write_player(usr_qq, new_player);
        const newtalent = await get_talent();
        const new_talent = {
            "talent": newtalent,//灵根
            "talentshow": 1,//显示0，隐藏1
            "talentsize": 0,//天赋
            "AllSorcery": []//功法
        };
        await Write_talent(usr_qq, new_talent);
        await player_efficiency(usr_qq);
        const new_battle = {
            "nowblood": data.Level_list.find(item => item.id == 1).blood+data.LevelMax_list.find(item => item.id == 1).blood,//血量
        };
        await Write_battle(usr_qq, new_battle);
        const new_level = {
            "prestige": 0,//魔力
            "level_id": 1,//练气境界
            "levelname": '凡人',//练气名
            "experience": 1,//练气经验
            "levelmax_id": 1,//练体境界
            "levelnamemax": '莽夫',//练体名
            "experiencemax": 1,//练体经验
            "rank_id":0,//数组位置
            "rank_name":[
                "初期","中期","后期","巅峰","圆满"
            ],
            "rankmax_id":0//数组位置
        };
        await Write_level(usr_qq, new_level);
        const new_wealth = {
            "lingshi": 5,
            "xianshi": 0
        };
        await Write_wealth(usr_qq, new_wealth);
        const new_action = {
            "game": 1,//游戏状态
            "Couple": 1, //双修
            "x":Math.floor((Math.random() * (199-100))) + Number(100),
            "y":Math.floor((Math.random() * (499-400))) + Number(400),
            "z":0,//位面为0
            "Exchange":0
        };
        await Write_action(usr_qq, new_action);
        await Write_equipment(usr_qq, []);
        const new_najie = {
            "grade": 1,
            "lingshimax": 50000,
            "lingshi": 0,
            "thing": []
        };
        await Write_najie(usr_qq, new_najie);
        const name1 = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        const name2 = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        const name = await Anyarray(name1)+await Anyarray(name2);
        const life = await Read_Life();
        const time = new Date();
        life.push({
            "qq": usr_qq,
            "name": `${name}`,
            "Age": 1,//年龄
            "life": Math.floor((Math.random() * (100-50)+50)), //寿命
            "createTime":time.getTime(),
            "status":1
        });
        await Write_Life(life);
        this.Show_player(e);
        return;
    };
    async Show_player(e) {
        const img = await get_player_img(e);
        e.reply(img);
        return;
    };
    async reCreate_player(e) {
        const good = await Go(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        const CDTime = this.xiuxianConfigData.CD.Reborn;
        const CDid = "8";
        const now_time = new Date().getTime();
        const CD = await GenerateCD(usr_qq, CDid);
        if (CD != 0) {
            e.reply(CD);
            return;
        };
        fs.rmSync(`${__PATH.player}/${usr_qq}.json`);
        let life = await Read_Life();
        await offaction(usr_qq);
        life = await life.filter(item => item.qq != usr_qq);
        await Write_Life(life);
        e.reply([segment.at(usr_qq), "来世，信则有，不信则无，岁月悠悠，世间终会出现两朵相同的花，千百年的回眸，一花凋零，一花绽。是否为同一朵，任后人去评断"]);
        await this.Create_player(e);
        await redis.set("xiuxian:player:" + usr_qq +':'+ CDid, now_time);
        await redis.expire("xiuxian:player:" + usr_qq +':'+ CDid, CDTime*60);
        return;
    };
};