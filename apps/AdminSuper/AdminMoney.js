
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import config from "../../model/Config.js"
import fs from "node:fs"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
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
                    reg: '^#修仙世界$',
                    fnc: 'Worldstatistics'
                },
                {
                    reg: '^#扣除.*$',
                    fnc: 'Deduction'
                },
                {
                    reg: '^#发测试福利.*$',
                    fnc: 'ceshi'
                },
                {
                    reg: '^#发福利.*$',
                    fnc: 'Allfuli'
                },
                {
                    reg: '^#发补偿.*$',
                    fnc: 'Fuli'
                }
            ],
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }

    
    async Deduction(e) {
        if (!e.isGroup) {
            return;
        }
        if (!e.isMaster) {
            return;
        }
        let B = await Xiuxian.At(e);
        if(B==0){
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("扣除", "");
        lingshi = await Xiuxian.Numbers(lingshi);

        let player = await Xiuxian.Read_player(B);
        if (player.lingshi < lingshi) {
            e.reply("他并没有这么多");
            return;
        }
        if (player.lingshi == lingshi) {
            lingshi = lingshi - 1;
        }
        await Xiuxian.Add_lingshi(B, -lingshi);
        await Xiuxian.Worldwealth(lingshi);
        e.reply("已强行扣除灵石" + lingshi);
        return;
    }


    async Worldstatistics(e) {
        if (!e.isGroup) {
            return;
        }
        if (!e.isMaster) {
            return;
        }
        let acount = 0;
        let lower = 0;
        let senior = 0;
        lower = Number(lower);
        senior = Number(senior);
        let playerList = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            let player = await Xiuxian.Read_player(player_id);
            let now_level_id;
            now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
            if (now_level_id <= 41) {
                lower++;
            }
            else {
                senior++;
            }
            acount++;
        }
        let msg = [];
        var Worldmoney = await redis.get("Xiuxian:Worldmoney");
        if (Worldmoney == null || Worldmoney == undefined || Worldmoney <= 0 || Worldmoney == NaN) {
            Worldmoney = 1;
        }
        Worldmoney = Number(Worldmoney);
        if (Worldmoney < 10000) {
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数：" + acount +
                "\n修道者：" + senior +
                "\n修仙者：" + lower +
                "\n财富：" + Worldmoney +
                "\n人均：" + (Worldmoney / acount).toFixed(3)
            ];
        }
        else if (Worldmoney > 10000 && Worldmoney < 1000000) {
            Worldmoney = Worldmoney / 10000;
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数：" + acount +
                "\n修道者：" + senior +
                "\n修仙者：" + lower +
                "\n财富：" + Worldmoney + "万" +
                "\n人均：" + (Worldmoney / acount).toFixed(3) + "万"
            ];
        }
        else if (Worldmoney > 1000000 && Worldmoney < 100000000) {
            Worldmoney = Worldmoney / 1000000;
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数：" + acount +
                "\n修道者：" + senior +
                "\n修仙者：" + lower +
                "\n财富：" + Worldmoney + "百万" +
                "\n人均：" + (Worldmoney / acount).toFixed(3) + "百万"
            ];
        }
        else if (Worldmoney > 100000000) {
            Worldmoney = Worldmoney / 100000000;
            Worldmoney = Worldmoney.toFixed(2);
            msg = [
                "___[修仙世界]___" +
                "\n人数：" + acount +
                "\n修道者：" + senior +
                "\n修仙者：" + lower +
                "\n财富：" + Worldmoney + "亿" +
                "\n人均：" + (Worldmoney / acount).toFixed(3) + "亿"
            ];
        }
        await Xiuxian.ForwardMsg(e, msg);
        return;
    }

    
    async ceshi(e) {
        if (!e.isGroup) {
            return;
        }
        if (!e.isMaster) {
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("发测试", "");
        lingshi = lingshi.replace("福利", "");
        if (parseInt(lingshi) == parseInt(lingshi) && parseInt(lingshi) > 0) {
            lingshi = parseInt(lingshi);
        }
        else {
            lingshi = 100;
        }
        let playerList = [];
        let files = fs
            .readdirSync(Xiuxian.__PATH.player)
            .filter((file) => file.endsWith(".json"));
        for (let file of files) {
            file = file.replace(".json", "");
            playerList.push(file);
        }
        for (let player_id of playerList) {
            await Xiuxian.Add_lingshi(player_id, lingshi);
        }
        e.reply(`福利发放成功,每人增加${lingshi}灵石`);
        return;
    }


    
    //发福利
    async Allfuli(e) {
        if (!e.isGroup) {
            return;
        }
        if (!e.isMaster) {
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("发", "");
        lingshi = lingshi.replace("福利", "");

        lingshi =await Xiuxian.Numbers(lingshi);

        if(lingshi<1000){
            return;
        }

        let File = fs.readdirSync(Xiuxian.__PATH.player);
        File = File.filter(file => file.endsWith(".json"));
        let File_length = File.length;
        for (var i = 0; i < File_length; i++) {
            let B = File[i].replace(".json", '');
            await Xiuxian.Add_lingshi(B, lingshi);
        }
        
        await Xiuxian.Worldwealth(- lingshi * File_length);

        e.reply(`福利发放成功,${File_length}个玩家,每人增加${lingshi}灵石`);

        return;
    }


    

    //发补偿
    async Fuli(e) {
        if (!e.isGroup) {
            return;
        }
        if (!e.isMaster) {
            return;
        }
        let lingshi = e.msg.replace("#", "");
        lingshi = lingshi.replace("发", "");
        lingshi = lingshi.replace("补偿", "");

        lingshi =await Xiuxian.Numbers(lingshi);
        if(lingshi<1000){
            return;
        }


        let B = await Xiuxian.At(e);
        if(B==0){
            return;
        }

        let Worldmoney = await redis.get("Xiuxian:Worldmoney");
        Worldmoney = await Xiuxian.Numbers(Worldmoney);
        if (Worldmoney <= lingshi) {
            e.reply("世界财富不足！");
            return;
        }

        await Xiuxian.Worldwealth(- lingshi);

        await Xiuxian.Add_lingshi(B, lingshi);

        e.reply(`${B}获得${lingshi}灵石的补偿`);

        return;
    }


}


