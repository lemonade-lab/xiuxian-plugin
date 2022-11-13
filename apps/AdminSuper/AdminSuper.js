
import plugin from '../../../../lib/plugins/plugin.js'
import filecp from "../../model/filecp.js"
import fs from "node:fs"
import { __PATH, updata_equipment,Read_Life, Write_Life } from '../Xiuxian/Xiuxian.js'
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
                    reg: "^#重置配置$",
                    fnc: "Againconfig",
                }
            ],
        });
    }

    async Againconfig(e) {
        if (!e.isMaster) {
            return;
        }
        filecp.upfile();
        e.reply("重置结束");
        return;
    }

    async synchronization(e) {
        if (!e.isMaster) {
            return;
        }
        let playerList = [];
        let files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            await updata_equipment(player_id);
        }

        let life = await Read_Life();
        let time = new Date();
        for (let i = 0 ; i<life.length ;i++){

            if(life[i].createTime == undefined){
                life[i].createTime = time;
            }

            if (life[i].status == undefined){
                life[i].status = 1 ;
            }
        }
        await Write_Life(life);
        e.reply("同步结束");
        return;
    }

}

