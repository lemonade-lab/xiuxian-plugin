import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import data from '../../model/XiuxianData.js'
import { segment } from "oicq"
import {
    Add_najie_thing,
    existplayer,
    ForwardMsg,
    isNotNull,
    Read_najie, search_thing_id, search_thing_name, Write_najie
} from '../Xiuxian/xiuxian.js'
import assUtil from "../../model/AssUtil.js";


/**
 * 洞天福地
 */
export class TreasureVault extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'TreasureVault',
            /** 功能描述 */
            dsc: '宗门藏宝阁模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 9999,
            rule: [
                {
                    reg: '^#(宗门藏宝阁|藏宝阁)$',
                    fnc: 'List_treasureCabinet'
                },
                {
                    reg: '^#兑换.*$',
                    fnc: 'Converted_Item'
                },
                {
                    reg: '^#藏宝阁回收.*$',
                    fnc: 'Reclaim_Item'
                },
                {
                    reg: '^#我的贡献$',
                    fnc: 'Show_Contribute'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }


    async Reclaim_Item(e){
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay =await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if(assPlayer.assName == 0){
            e.reply("你还没有宗门");
            return;
        }
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);

        if(ass.facility[1].status == 0){
            e.reply(`藏宝阁正在修建，尚未完工`);
            return ;
        }
        let thingName = e.msg.replace("#藏宝阁回收", '');

        let searchThing = await search_thing_name(thingName);
        if(searchThing == 1){
            return ;
        }
        ass.facility[1].buildNum -=1;
        await assUtil.checkFacility(ass);
        let point = Math.trunc( searchThing.price / 10000);
        assPlayer.contributionPoints+=point;
        assPlayer.historyContribution+=point;
        await assUtil.setAssOrPlayer("assPlayer",usr_qq,assPlayer);
        await Add_najie_things(searchThing,usr_qq,-1);
        e.reply(`回收成功，你获得了${point}点贡献点！`);
        if(searchThing.price == 1){
            return ;
        }
        let assTreasureCabinet = assUtil.getAssOrPlayer(4,assPlayer.assName);
        let length = Math.ceil(ass.level / 3);
        let isExist = false;
        for(let i=0; i < length; i++){
            let location = assTreasureCabinet[i].findIndex(item => item.id == searchThing.id);
            if(location != -1){
                isExist = true;
            }
        }

        if(!isExist){
            let addTing ={
                "id": searchThing.id,
                "name": searchThing.name,
                "redeemPoint": Math.trunc(searchThing.price / 8000)
            }
            assTreasureCabinet[length - 1].push(addTing);
            await assUtil.setAssOrPlayer("assTreasureVault",assPlayer.assName,assTreasureCabinet);
        }
        return ;

    }




    //藏宝阁
    async List_treasureCabinet(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay =await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if(assPlayer.assName == 0){
            e.reply("你还没有宗门");
            return;
        }


        let msg = [
            "___[宗门藏宝阁]___"
        ];
        let basetreasureCabinet = assUtil.baseTreasureVaultList;
        let assTreasureCabinet = assUtil.getAssOrPlayer(4,assPlayer.assName);
        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);


        let length = Math.ceil(ass.level / 3);
        for (let i = 0; i < length; i++) {
            assTreasureCabinet[i].push(...basetreasureCabinet[i]);
            msg.push(`第${i+1}层`);
            for(let j = 0; j < assTreasureCabinet[i].length; j++){
                msg.push(
                    "物品：" + `${assTreasureCabinet[i][j].name}` +
                    "\n所需贡献值：" + `${assTreasureCabinet[i][j].redeemPoint}`);
            }
        }

        await ForwardMsg(e, msg)
        return;
    }


    //兑换
    async Converted_Item(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay =await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if(assPlayer.assName == 0){
            e.reply("你还没有宗门");
            return;
        }

        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);

        if(ass.facility[1].status == 0){
            e.reply(`藏宝阁正在修建，尚未完工`);
            return ;
        }

        let thingName = e.msg.replace("#兑换", '');

        if (thingName == "") {
            return;
        }

        let basetreasureCabinet = assUtil.baseTreasureVaultList;
        let assTreasureCabinet = assUtil.getAssOrPlayer(4,assPlayer.assName);

        let length = Math.ceil(ass.level / 3);
        let exchangeThing ;
        for (let i = 0; i < length; i++) {
            assTreasureCabinet[i].push(...basetreasureCabinet[i]);
            if(isNotNull(assTreasureCabinet[i].find(item => item.name == thingName))){
                exchangeThing =assTreasureCabinet[i].find(item => item.name == thingName);
            }
        }

        if(!isNotNull(exchangeThing)){
            e.reply(`藏宝阁没有该物品`);
            return ;
        }

        if(assPlayer.contributionPoints < exchangeThing.redeemPoint){
            e.reply(`贡献不足！`);
            return ;
        }

        ass.facility[1].buildNum -=1;
        await assUtil.checkFacility(ass);
        assPlayer.contributionPoints -= exchangeThing.redeemPoint;
        assUtil.setAssOrPlayer("assPlayer",usr_qq,assPlayer);
        let addThing =await search_thing_id(exchangeThing.id);
        await Add_najie_things(addThing, usr_qq, 1);
        e.reply(`兑换成功！！！`)
        return;
    }

//我的贡献
    async Show_Contribute(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay =await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if(assPlayer.assName == 0){
            e.reply("你还没有宗门");
            return;
        }

        e.reply(`你当前还剩${assPlayer.contributionPoints}贡献点，历史贡献值总和为${assPlayer.historyContribution}`);
        return ;

    }


}


async function Add_najie_things(thing ,user_qq, account) {
    let najie = await Read_najie(user_qq);
    najie = await Add_najie_thing(najie,thing,account);
    await Write_najie(user_qq,najie);
    return ;
}










