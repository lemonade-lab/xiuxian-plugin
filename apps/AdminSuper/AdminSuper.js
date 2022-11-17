
import plugin from '../../../../lib/plugins/plugin.js';
import filecp from "../../model/filecp.js";
import fs from "node:fs";
import { __PATH, updata_equipment,Read_Life, Write_Life } from '../Xiuxian/Xiuxian.js';
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
    };
    async Againconfig(e) {
        if (!e.isMaster) {
            return;
        };
        filecp.upfile();
        e.reply("重置结束");
        return;
    };
    async synchronization(e) {
        if (!e.isMaster) {
            return;
        };
        const playerList = [];
        const files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        files.forEach((item,index,arr)=>{
            let file = item.replace(".json", "");
            playerList.push(file);
        });
        playerList.forEach(async(item,index,arr)=>{
              await updata_equipment(item);
        });
        e.reply("同步结束");
        return;
    };
};