import plugin from '../../../../lib/plugins/plugin.js'
import fs from "fs"
import {existplayer,__PATH,sortBy,ForwardMsg, Read_level, Read_battle} from '../Xiuxian/Xiuxian.js'
/**
 * 所有榜单
 */
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
        let msg = [
            "___[杀神榜]___"
        ];
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
            let battle={
                "QQ":player_id,
                "prestige":newbattle.prestige
            }
            temp.push(battle);
        }
        temp.sort(sortBy("prestige"));
        for (let item of temp) {
            console.log(item);
            msg.push(
                "QQ"+item.QQ+"\n"+
                "魔力"+item.prestige
            );
        }
        await ForwardMsg(e, msg);
        return;
    }

    //封神榜
    async TOP_Immortal(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let msg = [
            "___[封神榜]___"
        ];
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
                "power":newbattle.power
            }
            temp.push(battle);
        }
        temp.sort(sortBy("power"));
        for (let item of temp) {
            console.log(item);
            msg.push(
                "QQ"+item.QQ+"\n"+
                "战力"+item.power+"\n"
                
            );
        }
        await ForwardMsg(e, msg);
        return;
    }

    //#至尊榜
    async TOP_genius(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let msg = [
            "___[封神榜]___"
        ];
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
                "power":newbattle.power
            }
            temp.push(battle);
        }
        temp.sort(sortBy("power"));
        for (let item of temp) {
            console.log(item);
            msg.push(
                "QQ"+item.QQ+"\n"+
                "战力"+item.power+"\n"
                
            );
        }
        await ForwardMsg(e, msg);
        return;
    }
}