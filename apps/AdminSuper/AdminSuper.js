
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
/**
 * 修仙设置
 */
export class AdminSuper extends plugin {
    constructor() {
        super({
            name: "AdminSuper",
            dsc: "AdminSuper",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: "^#同步信息$",
                    fnc: "synchronization",
                },
                {
                    reg: "^#解封.*$",
                    fnc: "relieve",
                },
                {
                    reg: "^#解除所有$",
                    fnc: "Allrelieve",
                },
                {
                    reg: "^#打落凡间.*$",
                    fnc: "Knockdown",
                },
                {
                    reg: "^#修仙设置练气为.*$",
                    fnc: "upuserlevel",
                },
                {
                    reg: "^#修仙设置炼体为.*$",
                    fnc: "upuserlevelmax",
                }
            ],
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    async synchronization(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        e.reply("开始同步");
        let playerList = [];
        let x = 0;
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let usr_qq = player_id;
            let player = await Xiuxian.Read_player(usr_qq);
            if(player.prestige==undefined){
                player.prestige=0;
            }
            await Write_player(usr_qq,player);
            let equipment = await Xiuxian.Read_equipment(usr_qq);
            await Xiuxian.Write_equipment(usr_qq, equipment);
        }
        e.reply("同步结束");
        return;
    }

    async upuserlevel(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        e.reply("开始设置");
        let code = e.msg.replace("#修仙设置练气为", '');
        let B = await Xiuxian.At(e);
        if (B == 0) {
            return;
        }
        let usr_qq = B;
        let player = await Xiuxian.Read_player(usr_qq);
        player.level_id=code;
        await Xiuxian.Write_player(usr_qq, player);
        let equipment = await Xiuxian.Read_equipment(usr_qq);
        await Xiuxian.Write_equipment(usr_qq, equipment);
        e.reply("已完成设置");
        return;
    }

    
    async upuserlevelmax(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        e.reply("开始设置");
        let code = e.msg.replace("#修仙设置练气为", '');
        let B = await Xiuxian.At(e);
        if (B == 0) {
            return;
        }
        let usr_qq = B;
        let player = await Xiuxian.Read_player(usr_qq);
        player.Physique_id=code;
        await Xiuxian.Write_player(usr_qq, player);
        let equipment = await Xiuxian.Read_equipment(usr_qq);
        await Xiuxian.Write_equipment(usr_qq, equipment);
        e.reply("已完成设置");
        return;
    }





    async Allrelieve(e) {
        if (!e.isMaster) {
            return;
        }
        if (!e.isGroup) {
            return;
        }
        e.reply("开始行动！");
        let playerList = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            await Xiuxian.offaction(player_id);
        }
        e.reply("行动结束！");
    }


    async relieve(e) {
        if (!e.isMaster) {
            return;
        }
        let qq=await Xiuxian.At(e);
        if(qq==0){
            return;
        }
        await Xiuxian.offaction(qq);
        e.reply("执行结束");
        return;
    }

    async Knockdown(e) {
        if (!e.isMaster) {
            return;
        }
        let qq=await Xiuxian.At(e);
        if(qq==0){
            return;
        }
        let player = await Xiuxian.Read_player(qq);
        player.power_place = 1;
        await Xiuxian.Write_player(usr_qq, player);
        e.reply("已打落凡间！");
        return;
    }
}

