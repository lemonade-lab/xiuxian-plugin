import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import assUtil from '../../model/assUtil.js'
import config from "../../model/Config.js"
import fs from "fs"
import { segment } from "oicq"
import { exist_najie_thing_id, ForwardMsg, Read_najie, Write_najie,Add_najie_thing, existplayer} from "../Xiuxian/Xiuxian.js";

/**
 * 宗门
 */

export class AssociationExtend extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'AssociationExtend',
            /** 功能描述 */
            dsc: '宗门模块',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^#鉴定宗门令牌$',
                    fnc: 'identify_token'
                },
                {
                    reg: '^#加载宗门玩法$',
                    fnc: 'load_association'
                },
                {
                    reg: '^#查看秘境详情$',
                    fnc: 'show_uncharted_detail'
                }
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }


    async identify_token(e){
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }

        if(!assUtil.existAss("assPlayer",usr_qq)){
            return;
        }

        let isExists =await exist_najie_thing_id(usr_qq,"6-2-40");
        if(!isNotNull(isExists)){
            e.reply(`没令牌你鉴定个锤子`);
            return ;
        }
        let random =Math.random();
        let najie =await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, isExists, -1);
        let newToken;

        if(random < 0.05){
            newToken = {
                "id": "6-2-43",
                "name": "上等宗门令牌",
                "attack": 1,
                "defense": 1,
                "blood": 1,
                "burst": 1,
                "burstmax": 1,
                "size": 1,
                "experience": 1,
                "experiencemax": 1,
                "speed": 1,
                "acount": 1,
                "price": 1
            };
            e.reply(`你获得了上等宗门令牌`);
            najie =  await Add_najie_thing(najie, newToken, 1);
        }else if(random < 0.25){
            newToken = {
                "id": "6-2-42",
                "name": "中等宗门令牌",
                "attack": 1,
                "defense": 1,
                "blood": 1,
                "burst": 1,
                "burstmax": 1,
                "size": 1,
                "experience": 1,
                "experiencemax": 1,
                "speed": 1,
                "acount": 1,
                "price": 1
            };
            e.reply(`你获得了中等宗门令牌`);
            najie =  await Add_najie_thing(najie, newToken, 1);
        }else {
            newToken = {
                "id": "6-2-41",
                "name": "下等宗门令牌",
                "attack": 1,
                "defense": 1,
                "blood": 1,
                "burst": 1,
                "burstmax": 1,
                "size": 1,
                "experience": 1,
                "experiencemax": 1,
                "speed": 1,
                "acount": 1,
                "price": 1
            };
            e.reply(`你获得了下等宗门令牌`);
            najie = await Add_najie_thing(najie, newToken, 1);
        }
        await Write_najie(usr_qq,najie);
        return ;
    }


    async load_association(e){
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        if(assUtil.existAss("assPlayer",usr_qq)){
           return ;
        }
        let assPlayer={
                "assName": 0,
                "qqNumber": usr_qq,
                "assJob": 0,
                "effective": 0,
                "contributionPoints": 0,
                "historyContribution": 0,
                "favorability": 0,
                "volunteerAss": 0,
                "lastSignAss":0,
                "lastExplorTime":0,
                "lastBounsTime":0,
                "time": []
            }
        await assUtil.setAssOrPlayer("assPlayer",usr_qq,assPlayer);
        e.reply(`宗门系统存档创建成功！`);
        return ;
        }



    async show_uncharted_detail(e){
        //不开放私聊功能
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay =await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }

        if(!assUtil.existAss("assPlayer",usr_qq)){
            return ;
        }
        let assPlayer = assUtil.getAssOrPlayer(1,usr_qq);
        if(assPlayer.assName == 0){
            e.reply("你还没有宗门");
            return;
        }

        let ass = assUtil.getAssOrPlayer(2,assPlayer.assName);

        if(ass.facility[2].status == 0){
            e.reply(`宗门秘境维护中，无法查看`);
            return ;
        }

        let level = Math.ceil(ass.level / 3) - 1;

        let baseUncharted = assUtil.baseUnchartedList[level];
        let assUncharted = assUtil.getAssOrPlayer(3,ass.id);
        let assRelation = assUtil.assRelationList.find(item => item.id == ass.id);
        let uncharted = [ assUncharted.one,assUncharted.two,assUncharted.three ];

        let msg = [
           `__[${assRelation.unchartedName}]__`
        ];
        for (let i = 0; i < 3; i++) {
            uncharted[i].push(...baseUncharted.one);
            msg.push(`第${i+1}层`);
            for(let j = 0; j < uncharted[i].length; j++){
                msg.push(
                    `物品：${uncharted[i][j].name} `+
                    "\n价值：" +`${uncharted[i][j].price}` );
            }
        }

        await ForwardMsg(e, msg);

    }




}


function isNotNull(obj) {
    if (obj == undefined || obj == null)
        return false;
    return true;
}
