import plugin from '../../../../lib/plugins/plugin.js'
import fs from "fs"
import {existplayer,__PATH,sortBy, Read_level, Read_battle} from '../Xiuxian/Xiuxian.js'
import {get_toplist_img} from "../ShowImeg/showData.js";
export class TopList extends plugin {
    constructor() {
        super({
            name: 'TopList',
            dsc: 'TopList',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#封神榜$',
                    fnc: 'TOP_Immortal'
                },
                {
                    reg: '^#至尊榜$',
                    fnc: 'TOP_genius'
                },
                {
                    reg: '^#杀神榜$',
                    fnc: 'TOP_prestige'
                }
            ]
        })
    }

    async TOP_prestige(e){
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let playerList = [];
        let temp = [];
        let files = fs
            .readdirSync(__PATH.level)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let newbattle= await Read_level(player_id);
            if(newbattle.prestige<=0){
                continue;
            }
            let battle={
                "QQ":player_id,
                "power":newbattle.prestige,
                "name":'MP'
            }
            temp.push(battle);
        }
        temp.sort(sortBy("power"));
        let list=[];
        temp.forEach((item,index)=>{
            if(index<10){
                list.push(item)
            }
        })
        let img = await get_toplist_img(e,list);
        e.reply(img);
        return;
    }

    //封神榜
    async TOP_Immortal(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let playerList = [];
        let temp = [];
        let files = fs
            .readdirSync(__PATH.level)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let level= await Read_level(player_id);
            if(level.level_id<11){
                continue;
            }
            let newbattle= await Read_battle(player_id);
            let battle={
                "QQ":player_id,
                "power":newbattle.power,
                "name":'CE'
            }
            temp.push(battle);
        }
        temp.sort(sortBy("power"));
        let list=[];
        temp.forEach((item,index)=>{
            if(index<10){
                list.push(item)
            }
        })
        let img = await get_toplist_img(e,list);
        e.reply(img);
        return;
    }

    //#至尊榜
    async TOP_genius(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let playerList = [];
        let temp = [];
        let files = fs
            .readdirSync(__PATH.level)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let level= await Read_level(player_id);
            if(level.level_id>=11){
                continue;
            }
            let newbattle= await Read_battle(player_id);
            let battle={
                "QQ":player_id,
                "power":newbattle.power,
                "name":'CE'
            }
            temp.push(battle);
        }
        temp.sort(sortBy("power"));
        let list=[];
        temp.forEach((item,index)=>{
            if(index<10){
                list.push(item)
            }
        })
        let img = await get_toplist_img(e,list);
        e.reply(img);
        return;
    }
}