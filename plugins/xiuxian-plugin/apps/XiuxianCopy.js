import plugin from '../../../../../lib/plugins/plugin.js';
import fs from 'node:fs';
import { __PATH, Add_lingshi, Add_experience, Add_experiencemax } from '../../../apps/Xiuxian/Xiuxian.js';
export class XiuxianCopy extends plugin {
    constructor() {
        super({
            name: 'XiuxianCopy',
            dsc: 'XiuxianCopy',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#发测试福利$',
                    fnc: 'ceshi'
                }
            ]
        });
    };
    ceshi = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const playerList = [];
        const files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith('.json'));
        files.forEach((item) => {
            const file = item.replace('.json', '');
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