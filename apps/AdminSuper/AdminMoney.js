
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import { __PATH,At , Numbers,Add_lingshi , Add_experience, Add_experiencemax, Read_wealth } from '../Xiuxian/Xiuxian.js'

/**
 * 修仙财富
 */
export class AdminMoney extends plugin {
    constructor() {
        super({
            name: "AdminMoney",
            dsc: "AdminMoney",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: '^#扣除.*$',
                    fnc: 'Deduction'
                },
                {
                    reg: '^#补偿.*$',
                    fnc: 'Fuli'
                },
                {
                    reg: '^#发测试福利$',
                    fnc: 'ceshi'
                }
            ],
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    
    async Deduction(e) {
        if (!e.isMaster) {
            return;
        }
        let B = await At(e);
        if(B==0){
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("扣除", "");
        lingshi = await Numbers(lingshi);
        let player = await Read_wealth(B);
        if (player.lingshi < lingshi) {
            e.reply("他并没有这么多");
            return;
        }
        if (player.lingshi == lingshi) {
            lingshi = lingshi - 1;
        }
        await Add_lingshi(B, -lingshi);
        e.reply("已强行扣除灵石" + lingshi);
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
            await Add_lingshi(player_id, 9999999);
            await Add_experience(player_id, 9999999);
            await Add_experiencemax(player_id, 9999999);
        }
        e.reply(`福利发放成功,每人增加9999999灵石,9999999修为,9999999气血！`);
        return;
    }

    //发补偿
    async Fuli(e) {
        if (!e.isMaster) {
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("补偿", "");
        lingshi =await Numbers(lingshi);
        if(lingshi<1000){
            return;
        }
        let B = await At(e);
        if(B==0){
            return;
        }
        await Add_lingshi(B, lingshi);
        e.reply(`${B}获得${lingshi}灵石的补偿`);
        return;
    }


}


