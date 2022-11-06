
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import { Read_Forum,Write_Forum,Read_Exchange,Write_Exchange,__PATH,offaction,At, Write_Life,Read_Life, Read_action, Write_action } from '../Xiuxian/Xiuxian.js'
/**
 * 修仙设置
 */
export class AdminDelete extends plugin {
    constructor() {
        super({
            name: "AdminDelete",
            dsc: "AdminDelete",
            event: "message",
            priority: 400,
            rule: [
                {
                    reg: "^#清理弱水阁$",
                    fnc: "Deleteexchange",
                },
                {
                    reg: '^#清除.*$',
                    fnc: 'Deletepurchase'
                },
                {
                    reg: '^#打扫客栈$',
                    fnc: 'DeleteForum'
                },
                {
                    reg: '^#删除世界$',
                    fnc: 'deleteallusers'
                },
                {
                    reg: '^#删除信息.*$',
                    fnc: 'deleteuser'
                }
            ],
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }



    async DeleteForum(e) {
        if (!e.isMaster) {
            return;
        }
        let Forum = await Read_Forum();
        for (var i = 0; i < Forum.length; i++) {
            Forum = Forum.filter(item => item.qq != Forum[i].qq);
            Write_Forum(Forum);
        }
        e.reply("已清理！");
        return;
    }


    async Deletepurchase(e) {
        if (!e.isMaster) {
            return;
        }
        let thingqq = e.msg.replace("#", '');
        thingqq = thingqq.replace("清除", '');
        if (thingqq == "") {
            return;
        }
        let x = 888888888;
        let Exchange  = await Read_Exchange();
        for (var i = 0; i < Exchange.length; i++) {
            if (Exchange[i].qq == thingqq) {
                x = i;
                break;
            }
        }
        if (x == 888888888) {
            e.reply("找不到该商品编号！");
            return;
        }
        Exchange = Exchange.filter(item => item.qq != thingqq);
        await Write_Exchange(Exchange);
        /*
        清楚玩家状态
        */
        e.reply("清除" + thingqq);
        return;
    }


    async Deleteexchange(e) {
        if (!e.isMaster) {
            return;
        }
        e.reply("开始清除！");
        await Write_Exchange([]);
        let playerList = [];
        let files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
           let action=await Read_action(player_id); 
           action.Exchange=0;
           await Write_action(player_id,action);
        }
        e.reply("清除完成！");
        return;
    }
    

    async deleteallusers(e){
        if (!e.isMaster) {
            return;
        }
        e.reply("开始崩碎世界");
        let playerList = [];
        let files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            await offaction(player_id);
            fs.rmSync(`${__PATH.player}/${player_id}.json`);
            await Write_Life([]);
        }
        e.reply("世界已崩碎");
        return;
    }


    async deleteuser(e){
        if (!e.isMaster) {
            return;
        }
        let B = await At(e);
        if(B==0){
            return;
        }
        e.reply("开始崩碎信息");
        fs.rmSync(`${__PATH.player}/${B}.json`);
        let life = await Read_Life();
        await offaction(B);
        life = await life.filter(item => item.qq != B);
        await Write_Life(life);
        e.reply("已崩碎");
        return;
    }


}

