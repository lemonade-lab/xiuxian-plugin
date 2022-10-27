import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import {existplayer,search_thing,exist_najie_thing,
    Read_najie,Read_equipment,
    Add_najie_thing_arms,instead_equipment_arms,
    Add_najie_thing_huju,instead_equipment_huju,
    Add_najie_thing_fabao,instead_equipment_fabao,
    Write_equipment,Write_najie,Numbers,
    Add_HP,Add_experience,Add_najie_thing_danyao,
    Add_najie_thing_daoju,get_talent,
    Add_najie_thing_gonfa,Add_player_AllSorcery,player_efficiency} from '../Xiuxian/Xiuxian.js'

/**
  * 一级类型
  * 武器：1  
  * 护具：2 
  * 法宝：3   
  * 丹药：4   
  * 功法：5   
  * 道具：6   
  * 戒指：7
  */

/**
 * 货币与物品操作模块
 */
export class UserHome extends plugin {
    constructor() {
        super({
            name: 'UserHome',
            dsc: 'UserHome',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#装备.*$',
                    fnc: 'Player_use_equipment'
                },
                {
                    reg: '^#服用.*$',
                    fnc: 'Player_use_danyao'
                },
                {
                    reg: '^#学习.*$',
                    fnc: 'Player_use_gonfa'
                },
                {
                    reg: '^#消耗.*$',
                    fnc: 'Player_use_daoju'
                }
            ]
        })
    }

    async Player_use_equipment(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#装备", '');
        let searchsthing = await search_thing(thing_name);
        if (searchsthing == 1) {
            e.reply("世界没有" + thing_name);
            return;
        }
        let najie_thing = await exist_najie_thing(usr_qq, searchsthing.id, searchsthing.class);
        if (najie_thing == 1) {
            e.reply("没有" + thing_name);
            return;
        }
        let najie = await Read_najie(usr_qq);

        let equipment = await Read_equipment(usr_qq);

        if (searchsthing.class == 1) {
            najie = await Add_najie_thing_arms(najie, equipment.arms, 1);
            equipment=await instead_equipment_arms(equipment, searchsthing);
            najie = await Add_najie_thing_arms(najie, searchsthing, -1);
        }
        if (searchsthing.class == 2) {
            najie = await Add_najie_thing_huju(najie, equipment.huju, 1);
            equipment=await instead_equipment_huju(equipment, searchsthing);
            najie = await Add_najie_thing_huju(najie, searchsthing, -1);
        }
        if (searchsthing.class == 3) {
            najie = await Add_najie_thing_fabao(najie, equipment.fabao, 1);
            equipment=await instead_equipment_fabao(equipment, searchsthing);
            najie = await Add_najie_thing_fabao(najie, searchsthing, -1);
        }
        await Write_equipment(usr_qq, equipment);
        await Write_najie(usr_qq, najie);
        e.reply("成功装备" + thing_name);
        return;
    }

    async Player_use_danyao(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#服用", '');
        let code = thing_name.split("\*");
        thing_name = code[0];
        let thing_acount = code[1];
        thing_acount = await Numbers(thing_acount);
        let searchsthing = await search_thing(thing_name);
        if (searchsthing == 1) {
            e.reply("世界没有" + thing_name);
            return;
        }
        let najie_thing = await exist_najie_thing(usr_qq, searchsthing.id, searchsthing.class);
        if (najie_thing == 1) {
            e.reply("没有" + thing_name);
            return;
        }
        if (najie_thing.acount < thing_acount) {
            e.reply("数量不足");
            return;
        }
        if (searchsthing.type == 1) {
            let blood = parseInt(thing_acount * searchsthing.HP);
            await Add_HP(usr_qq, blood);
            e.reply("血量恢复" + blood);
        }
        if (searchsthing.type == 2) {
            let experience = parseInt(searchsthing.exp);
            await Add_experience(usr_qq, thing_acount * experience);
            e.reply("修为增加" + thing_acount * searchsthing.exp);
        }
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing_danyao(najie, searchsthing, -thing_acount);
        await Write_najie(usr_qq, najie);
        return;
    }

    async Player_use_gonfa(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#学习", '');
        let searchsthing = await search_thing(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        }
        let najie_thing = await exist_najie_thing(usr_qq, searchsthing.id, searchsthing.class);
        if (najie_thing == 1) {
            e.reply(`你没有[${thing_name}]`);
            return;
        }
        
        let player = await Read_player(usr_qq);
        let islearned = player.AllSorcery.find(item => item == searchsthing.id);
        if (islearned) {
            e.reply("学过了");
            return;
        }
        await Add_player_AllSorcery(usr_qq, searchsthing.id);
        await player_efficiency(usr_qq);
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing_gonfa(najie, searchsthing, -1);
        await Write_najie(usr_qq, najie);
        e.reply("成功学习" + thing_name);
        return;
    }


    async Player_use_daoju(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#消耗", '');
        let searchsthing = await search_thing(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        }
        let najie_thing = await exist_najie_thing(usr_qq, searchsthing.id, searchsthing.class);
        if (najie_thing == 1) {
            e.reply(`你没有[${thing_name}]`);
            return;
        }
        let player = await Read_player(usr_qq);
        let islearned = player.AllSorcery.find(item => item == searchsthing.id);
        if (islearned) {
            e.reply("学过了");
            return;
        }
        if (searchsthing.type == 1) {
            e.reply("无法在储物袋中消耗");
            return;
        }
        if (searchsthing.type == 2) {
            let now_level_id = data.Level_list.find(item => item.level_id == player.level_id).level_id;
            if (now_level_id > 21) {
                e.reply("灵根已定，不可洗髓");
                return;
            }
            let newtalent = await get_talent();
            player.talent = newtalent;
            await Write_player(usr_qq, player);
            await player_efficiency(usr_qq);
            e.reply("使用成功");
        }
        if (searchsthing.type == 3) {
            player.talentshow = 0;
            await Write_player(usr_qq, player);
            e.reply("显示成功");
        }
        
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing_daoju(najie, searchsthing, -1);
        await Write_najie(usr_qq, najie);
        return;
    }
}
