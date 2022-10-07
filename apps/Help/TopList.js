import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import fs from "fs"
import * as ShowData from '../ShowImeg/showData.js'
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
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
                    reg: '^#天榜$',
                    fnc: 'TOP_xiuwei'
                },
                {
                    reg: '^#灵榜$',
                    fnc: 'TOP_lingshi'
                },
                {
                    reg: '^#封神榜$',
                    fnc: 'TOP_Immortal'
                },
                {
                    reg: '^#至尊榜$',
                    fnc: 'TOP_genius'
                }
            ]
        })
    }

    //封神榜
    async TOP_Immortal(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let msg = [
            "___[封神榜]___"
        ];
        let playerList = [];
        let temp = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        var i = 0;
        for (let player_id of playerList) {
            let player = await Xiuxian.Read_player(player_id);
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
        temp.sort(Xiuxian.sortBy("power"));
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
        await Xiuxian.ForwardMsg(e, msg);
        return;
    }

    //#至尊榜
    async TOP_genius(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let msg = [
            "___[至尊榜]___"
        ];
        let playerList = [];
        let temp = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        var i = 0;
        for (let player_id of playerList) {
            let player = await Xiuxian.Read_player(player_id);
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
        temp.sort(Xiuxian.sortBy("power"));
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
        await Xiuxian.ForwardMsg(e, msg);
        return;
    }

    async TOP_xiuwei(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) { return; }
        let usr_paiming;
        let File = fs.readdirSync(Xiuxian.__PATH.player);
        File = File.filter(file => file.endsWith(".json"));
        let File_length = File.length;
        let temp = [];
        for (var i = 0; i < File_length; i++) {
            let this_qq = File[i].replace(".json", '');
            this_qq = parseInt(this_qq);
            let player = await Xiuxian.Read_player(this_qq);
            let sum_exp = await Xiuxian.get_experience(this_qq);
            let level = data.Level_list.find(item => item.level_id == player.level_id).level;
            temp[i] = {
                exp: sum_exp,
                level: level,
                name: player.name,
                qq: this_qq
            }
        }
        temp.sort(Xiuxian.sortBy("exp"));
        usr_paiming = temp.findIndex(temp => temp.qq === usr_qq) + 1;
        let Data = [];
        if (File_length > 10) { File_length = 10; }//最多显示前十
        for (var i = 0; i < File_length; i++) {
            temp[i].名次 = i + 1;
            Data[i] = temp[i];
        }
        let thisplayer = await data.getData("player", usr_qq);
        let img = await ShowData.get_ranking_power_img(e, Data, usr_paiming, thisplayer);
        e.reply(img);
        return;
    }



    //TOP_lingshi
    async TOP_lingshi(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) { return; }
        let usr_paiming;
        let File = fs.readdirSync(Xiuxian.__PATH.player);
        File = File.filter(file => file.endsWith(".json"));
        let File_length = File.length;
        let temp = [];
        for (var i = 0; i < File_length; i++) {
            let this_qq = File[i].replace(".json", '');
            this_qq = parseInt(this_qq);
            let player = await Xiuxian.Read_player(this_qq);
            let najie = await Xiuxian.Read_najie(this_qq);
            let lingshi = player.lingshi + najie.lingshi;
            temp[i] = {
                ls1: najie.lingshi,
                ls2: player.lingshi,
                lingshi: lingshi,
                name: player.name,
                qq: this_qq
            }
        }
        temp.sort(Xiuxian.sortBy("lingshi"));
        let Data = [];
        usr_paiming = temp.findIndex(temp => temp.qq === usr_qq) + 1;
        if (File_length > 10) { File_length = 10; }//最多显示前十
        for (var i = 0; i < File_length; i++) {
            temp[i].名次 = i + 1;
            Data[i] = temp[i];
        }
        await Xiuxian.sleep(500);
        let thisplayer = await data.getData("player", usr_qq);
        let thisnajie = await data.getData("najie", usr_qq);
        let img = await ShowData.get_ranking_money_img(e, Data, usr_paiming, thisplayer, thisnajie);
        e.reply(img);
        return;
    }
}