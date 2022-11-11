import plugin from '../../../../lib/plugins/plugin.js'
import fs from "node:fs"
import { __PATH,Add_lingshi , Add_experience, Add_experiencemax} from '../../apps/Xiuxian/Xiuxian.js'
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
        })
    }

    async XiuxianWorld(e){
        if (!e.isMaster) {
            return;
        };
        e.reply("#修仙世界");
        return;
    }

    async ceshi(e) {
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
            await Add_lingshi(player_id, 999);
            await Add_experience(player_id, 999);
            await Add_experiencemax(player_id, 999);
        }
        e.reply('每人增加\n999灵石\n999修为\n999气血！');
        return;
    }

}
