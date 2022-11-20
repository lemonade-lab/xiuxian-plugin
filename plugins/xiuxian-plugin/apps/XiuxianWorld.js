import plugin from '../../../../../lib/plugins/plugin.js';
import fs from "node:fs";
import { __PATH, Add_lingshi, ForwardMsg, Add_experience, Add_experiencemax, Read_Life } from '../../../apps/Xiuxian/Xiuxian.js';
export class XiuxianWorld extends plugin {
    constructor() {
        super({
            name: 'XiuxianWorld',
            dsc: 'XiuxianWorld',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#修仙世界$',
                    fnc: 'XiuxianWorld'
                },
                {
                    reg: '^#发测试福利$',
                    fnc: 'ceshi'
                }
            ]
        });
    };
    XiuxianWorld = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const life = await Read_Life();
        const msg = ["--修仙世界---"];
        msg.push("人数：" + life.length);
        await ForwardMsg(e, msg);
        return;
    };
    ceshi = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const playerList = [];
        const files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        files.forEach((item) => {
            const file = item.replace(".json", "");
            playerList.push(file);
        });
        playerList.forEach(async (item) => {
            await Add_lingshi(item, 99999);
            await Add_experience(item, 99999);
            await Add_experiencemax(item, 99999);
        });
        e.reply('已发放');
        return;
    };
};