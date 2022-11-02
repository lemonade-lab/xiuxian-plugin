
import plugin from '../../../../lib/plugins/plugin.js'
import filecp from "../../model/filecp.js"
import config from "../../model/Config.js"
import fs from "node:fs"
import { __PATH, updata_equipment } from '../Xiuxian/Xiuxian.js'
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
                    reg: "^#重置配置$",
                    fnc: "Againconfig",
                }
            ],
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    async Againconfig(e) {
        if (!e.isMaster) {
            return;
        }
        e.reply("开始重置");
        filecp.upfile();
        e.reply("重置结束");
        return;
    }

    async synchronization(e) {
        if (!e.isMaster) {
            return;
        }
        e.reply("开始同步");
        let playerList = [];
        let files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            //
            await updata_equipment(player_id);
        }
        e.reply("同步结束");
        return;
    }

}

