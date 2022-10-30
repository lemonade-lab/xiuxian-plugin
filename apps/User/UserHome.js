import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import {
    existplayer, search_thing_name, exist_najie_thing,
    Read_najie, Read_equipment, Add_experiencemax,
    Write_equipment, Write_najie, Numbers, Add_najie_thing,
    Add_HP, Add_experience, get_talent, Add_player_AllSorcery, player_efficiency, Read_talent, search_thing_id
} from '../Xiuxian/Xiuxian.js'
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
                    fnc: 'add_equipment'
                },
                {
                    reg: '^#卸下.*$',
                    fnc: 'delete_equipment'
                },
                {
                    reg: '^#服用.*$',
                    fnc: 'Player_use_danyao'
                },
                {
                    reg: '^#学习.*$',
                    fnc: 'add_gonfa'
                },
                {
                    reg: '^#忘掉.*$',
                    fnc: 'delete_gonfa'
                },
                {
                    reg: '^#消耗.*$',
                    fnc: 'Player_use_daoju'
                }
            ]
        })
    }

    async add_equipment(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#装备", '');
        let searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply("世界没有" + thing_name);
            return;
        }
        let najie_thing = await exist_najie_thing(usr_qq, searchsthing.id);
        if (najie_thing == 1) {
            e.reply("没有" + thing_name);
            return;
        }
        let equipment = await Read_equipment(usr_qq);
        if (equipment.length < 4) {
            //推送装备
            equipment.push(searchsthing);
            await Write_equipment(usr_qq, equipment);
        } else {
            e.reply("无法操控更多装备");
            return;
        }
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, -1);
        await Write_najie(usr_qq, najie);
        e.reply("装备" + thing_name);
        return;
    }

    async delete_equipment(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#卸下", '');
        let equipment = await Read_equipment(usr_qq);

        let islearned = equipment.find(item => item.name == thing_name);
        if (islearned) {
            equipment = equipment.filter(item => item.name != thing_name);
            await Write_equipment(usr_qq, equipment);
        } else {
            e.reply("未装备");
        }

        let searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply("世界没有" + thing_name);
            return;
        }
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, 1);
        await Write_najie(usr_qq, najie);
        e.reply("已卸下" + thing_name);
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
        let searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply("世界没有" + thing_name);
            return;
        }
        let najie_thing = await exist_najie_thing(usr_qq, searchsthing.id);
        if (najie_thing == 1) {
            e.reply("没有" + thing_name);
            return;
        }
        if (najie_thing.acount < thing_acount) {
            e.reply("数量不足");
            return;
        }
        //切割类型，看到类型对不对。
        let id = searchsthing.id.split('-');
        if (id[1] == 1) {
            let blood = parseInt(thing_acount * searchsthing.blood);
            await Add_HP(usr_qq, blood);
            e.reply("血量恢复" + blood);
        }
        else if (id[1] == 2) {
            let experience = parseInt(searchsthing.experience);
            await Add_experience(usr_qq, thing_acount * experience);
            e.reply("修为增加" + thing_acount * searchsthing.experience);
        }
        else if (id[2] == 3) {
            let experiencemax = parseInt(searchsthing.experiencemax);
            await Add_experiencemax(usr_qq, thing_acount * experiencemax);
            e.reply("气血增加" + thing_acount * searchsthing.experiencemax);
        } else {
            e.reply("不可服用" + thing_name);
            return;
        }
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, -1);
        await Write_najie(usr_qq, najie);
        return;
    }

    async add_gonfa(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#学习", '');
        let searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        }
        let najie_thing = await exist_najie_thing(usr_qq, searchsthing.id);
        if (najie_thing == 1) {
            e.reply(`你没有[${thing_name}]`);
            return;
        }
        let talent = await Read_talent(usr_qq);
        let islearned = talent.AllSorcery.find(item => item == searchsthing.id);
        if (islearned) {
            e.reply("学过了");
            return;
        }
        if (AllSorcery.length < 21) {
            talent.AllSorcery.push(searchsthing);
            await Write_talent(usr_qq, talent);
            await player_efficiency(usr_qq);
        } else {
            e.reply("脑子装不下了");
            return;
        }
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, -1);
        await Write_najie(usr_qq, najie);
        e.reply("学习" + thing_name);
        return;
    }

    async delete_gonfa(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let thing_name = e.msg.replace("#忘掉", '');
        let talent = await Read_talent(usr_qq);

        let islearned = talent.AllSorcery.find(item => item.name == thing_name);

        if (islearned) {
            talent = talent.AllSorcery.filter(item => item.name != thing_name);
            await Write_talent(usr_qq, talent);
            await player_efficiency(usr_qq);
        } else {
            e.reply("没学过" + thing_name);
        }

        let searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        }

        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, 1);
        await Write_najie(usr_qq, najie);
        e.reply("忘了" + thing_name);
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
        let searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        }
        let najie_thing = await exist_najie_thing(usr_qq, searchsthing.id);
        if (najie_thing == 1) {
            e.reply(`你没有[${thing_name}]`);
            return;
        }
        //切割类型
        let id=searchsthing.id.split('-')
        if(id[0]!=6){
            return;
        }
        if(id[2]==1){
            e.reply("无法在储物袋中消耗");
            return;
        }else if(id[2]==2){
            let player = await Read_level(user_id);
            if (player.level_id > 21) {
                e.reply("灵根已定，不可洗髓");
                return;
            }
            let talent = await Read_talent(user_id);
            talent.talent = await get_talent();
            await Write_talent(usr_qq, talent);
            await player_efficiency(usr_qq);
            e.reply("使用成功");
        }
        else if(id[2]==3){
            talent.talentshow = 0;
            await Write_talent(usr_qq, talent);
            e.reply("显示成功");
        }
        else{
            return;
        }
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, 1);
        await Write_najie(usr_qq, najie);
        return;
    }
}
