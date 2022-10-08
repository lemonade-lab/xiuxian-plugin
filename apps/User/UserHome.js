import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import * as Xiuxian from '../Xiuxian/Xiuxian.js'

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
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#装备", '');
        let searchsthing = await Xiuxian.search_thing(thing_name);
        if (searchsthing == 1) {
            e.reply("世界没有" + thing_name);
            return;
        }
        let najie_thing = await Xiuxian.exist_najie_thing(usr_qq, searchsthing.id, searchsthing.class);
        if (najie_thing == 1) {
            e.reply("没有" + thing_name);
            return;
        }
        if (searchsthing.class == 1) {
            await Xiuxian.instead_equipment_arms(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type);
        }
        if (searchsthing.class == 2) {
            await Xiuxian.instead_equipment_huju(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type);
        }
        if (searchsthing.class == 3) {
            await Xiuxian.instead_equipment_fabao(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type);
        }
        e.reply("成功装备" + thing_name);
        return;
    }

    async Player_use_danyao(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#服用", '');
        let code = thing_name.split("\*");
        thing_name = code[0];
        let thing_acount = code[1];
        thing_acount = await Xiuxian.Numbers(thing_acount);
        let searchsthing = await Xiuxian.search_thing(thing_name);
        if (searchsthing == 1) {
            e.reply("世界没有" + thing_name);
            return;
        }
        let najie_thing = await Xiuxian.exist_najie_thing(usr_qq, searchsthing.id, searchsthing.class);
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
            await Xiuxian.Add_HP(usr_qq, blood);
            e.reply("血量恢复" + blood);
        }
        if (searchsthing.type == 2) {
            let experience = parseInt(searchsthing.exp);
            await Xiuxian.Add_experience(usr_qq, thing_acount * experience);
            e.reply("修为增加" + thing_acount * searchsthing.exp);
        }
        await Xiuxian.Add_najie_thing_danyao(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type, -thing_acount);
        return;
    }

    async Player_use_gonfa(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#学习", '');
        let searchsthing = await Xiuxian.search_thing(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        }
        let najie_thing = await Xiuxian.exist_najie_thing(usr_qq, searchsthing.id, searchsthing.class);
        if (najie_thing == 1) {
            e.reply(`你没有[${thing_name}]`);
            return;
        }
        let player = await Xiuxian.Read_player(usr_qq);
        let islearned = player.AllSorcery.find(item => item == searchsthing.id);
        if (islearned) {
            e.reply("学过了");
            return;
        }
        await Xiuxian.Add_player_AllSorcery(usr_qq, searchsthing.id);
        await Xiuxian.player_efficiency(usr_qq);
        e.reply("成功学习" + thing_name);
        await Xiuxian.Add_najie_thing_gonfa(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type, -1);
        return;
    }


    async Player_use_daoju(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#消耗", '');
        let searchsthing = await Xiuxian.search_thing(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        }
        let najie_thing = await Xiuxian.exist_najie_thing(usr_qq, searchsthing.id, searchsthing.class);
        if (najie_thing == 1) {
            e.reply(`你没有[${thing_name}]`);
            return;
        }
        let player = await Xiuxian.Read_player(usr_qq);
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
            let newtalent = await Xiuxian.get_talent();
            player.talent = newtalent;
            await Xiuxian.Write_player(usr_qq, player);
            await Xiuxian.player_efficiency(usr_qq);
            e.reply("使用成功");
        }
        if (searchsthing.type == 3) {
            player.talentshow = 0;
            await Xiuxian.Write_player(usr_qq, player);
            e.reply("显示成功");
        }
        await Xiuxian.Add_najie_thing_ring(usr_qq, searchsthing.id, searchsthing.class, searchsthing.type, -1);
        return;
    }
}
