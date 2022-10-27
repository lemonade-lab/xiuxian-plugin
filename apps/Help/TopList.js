import plugin from '../../../../lib/plugins/plugin.js'
import fs from "fs"
import {existplayer,__PATH,Read_player,sortBy,ForwardMsg} from '../Xiuxian/Xiuxian.js'

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
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        var i = 0;
        for (let player_id of playerList) {
            let player = await Read_player(player_id);
            let prestige = Math.trunc(player.prestige);
            temp[i] = {
                "prestige": prestige,
                "qq": player_id,
                "name": player.name,
                "level_id": player.level_id
            }
            i++;
        }
        temp.sort(sortBy("prestige"));
        var length;
        if (temp.length > 10) {
            length = 10;
        }
        else {
            length = temp.length;
        }
        var j;
        for (j = 0; j < length; j++) {
            msg.push(
                "第" + (j + 1) + "名" +
                "\n道号：" + temp[j].name +
                "\n魔力：" + temp[j].prestige +
                "\nQQ:" + temp[j].qq);
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
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        var i = 0;
        for (let player_id of playerList) {
            let player = await Read_player(player_id);
            let power = (player.nowattack + player.nowdefense * 0.8 + player.hpmax * 0.6) * player.burst;
            if (player.level_id < 42) {
                continue;
            }
            power = Math.trunc(power);
            temp[i] = {
                "power": power,
                "qq": player_id,
                "name": player.name,
                "level_id": player.level_id
            }
            i++;
        }
        temp.sort(sortBy("power"));
        console.log(temp);
        var length;
        if (temp.length > 10) {
            length = 10;
        }
        else {
            length = temp.length;
        }
        var j;
        for (j = 0; j < length; j++) {
            msg.push(
                "第" + (j + 1) + "名" +
                "\n道号：" + temp[j].name +
                "\n战力：" + temp[j].power +
                "\nQQ:" + temp[j].qq);
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
            "___[至尊榜]___"
        ];
        let playerList = [];
        let temp = [];
        let files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        var i = 0;
        for (let player_id of playerList) {
            let player = await Read_player(player_id);
            let power = (player.nowattack + player.nowdefense * 0.8 + player.hpmax * 0.5) * player.burst;
            if (player.level_id >= 42) {
                continue;
            }
            power = Math.trunc(power);
            temp[i] = {
                "power": power,
                "qq": player_id,
                "name": player.name,
                "level_id": player.level_id
            }
            i++;
        }
        temp.sort(sortBy("power"));
        console.log(temp);
        var length;
        if (temp.length > 10) {
            length = 10;
        }
        else {
            length = temp.length;
        }
        var j;
        for (j = 0; j < length; j++) {
            msg.push(
                "第" + (j + 1) + "名" +
                "\n道号：" + temp[j].name +
                "\n战力：" + temp[j].power +
                "\nQQ:" + temp[j].qq);
        }
        await ForwardMsg(e, msg);
        return;
    }
}