import plugin from '../../../../lib/plugins/plugin.js';
import config from "../../model/Config.js";
import {existplayer, search_thing_name, exist_najie_thing_id,Read_najie,Add_experiencemax, Write_najie, Numbers, Add_najie_thing,Add_blood,Add_experience, get_talent, Write_talent,  player_efficiency, Read_talent,Read_level} from '../Xiuxian/Xiuxian.js';
export class UserHome extends plugin {
    constructor() {
        super({
            name: 'UserHome',
            dsc: 'UserHome',
            event: 'message',
            priority: 600,
            rule: [
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
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    };
    async Player_use_danyao(e) {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        let thing_name = e.msg.replace("#服用", '');
        const code = thing_name.split("\*");
        thing_name = code[0];
        let thing_acount = code[1];
        thing_acount = await Numbers(thing_acount);
        const searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply("世界没有" + thing_name);
            return;
        };
        const najie_thing = await exist_najie_thing_id(usr_qq, searchsthing.id);
        if (najie_thing == 1) {
            e.reply("没有" + thing_name);
            return;
        };
        if (najie_thing.acount < thing_acount) {
            e.reply("数量不足");
            return;
        };
        const id = searchsthing.id.split('-');
        if(id[0] != 4){
            e.reply(`什么东西都吃啊？`);
            return ;
        };
        if (id[1] == 1) {
            let blood = parseInt(searchsthing.blood);
            await Add_blood(usr_qq, blood);
            e.reply("血量恢复至" + blood+"%");
        }
        else if (id[1] == 2) {
            let experience = parseInt(searchsthing.experience);
            await Add_experience(usr_qq, thing_acount * experience);
            e.reply("修为增加" + thing_acount * searchsthing.experience);
        }
        else if (id[1] == 3) {
            let experiencemax = parseInt(searchsthing.experiencemax);
            await Add_experiencemax(usr_qq, thing_acount * experiencemax);
            e.reply("气血增加" + thing_acount * searchsthing.experiencemax);
        } 
        else {
            e.reply("不可服用" + thing_name);
            return;
        };
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, -thing_acount);
        await Write_najie(usr_qq, najie);
        return;
    };
    async add_gonfa(e) {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const thing_name = e.msg.replace("#学习", '');
        const searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        };
        const najie_thing = await exist_najie_thing_id(usr_qq, searchsthing.id);
        if (najie_thing == 1) {
            e.reply(`没有[${thing_name}]`);
            return;
        };
        const id = searchsthing.id.split('-');
        if (id[0] != 5) {
            return;
        };
        const talent = await Read_talent(usr_qq);
        const islearned = talent.AllSorcery.find(item => item.id == searchsthing.id);
        if (islearned) {
            e.reply("学过了");
            return;
        };
        if (talent.AllSorcery.length <= this.xiuxianConfigData.myconfig.gonfa) {
            talent.AllSorcery.push(searchsthing);
            await Write_talent(usr_qq, talent);
            await player_efficiency(usr_qq);
        } 
        else {
            e.reply("脑子装不下了");
            return;
        };
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, -1);
        await Write_najie(usr_qq, najie);
        e.reply("学习" + thing_name);
        return;
    };
    async delete_gonfa(e) {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        const thing_name = e.msg.replace("#忘掉", '');
        const talent = await Read_talent(usr_qq);
        const islearned = talent.AllSorcery.find(item => item.name == thing_name);
        if (!islearned) {
            e.reply("没学过" + thing_name);
            return;
        };
        talent.AllSorcery = talent.AllSorcery.filter(item => item.name != thing_name);
        await Write_talent(usr_qq, talent);
        await player_efficiency(usr_qq);
        const searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply(`[${thing_name}]已从世界消失`);
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
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const thing_name = e.msg.replace("#消耗", '');
        const searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有[${thing_name}]`);
            return;
        };
        const najie_thing = await exist_najie_thing_id(usr_qq, searchsthing.id);
        if (najie_thing == 1) {
            e.reply(`没有[${thing_name}]`);
            return;
        };
        const id=searchsthing.id.split('-')
        if(id[0]!=6){
            return;
        };
        if(id[2]==1){
            e.reply("无法在储物袋中消耗");
            return;
        }
        else if(id[2]==2){
            const player = await Read_level(usr_qq);
            if (player.level_id > 21) {
                e.reply("灵根已定，不可洗髓");
                return;
            }
            const talent = await Read_talent(usr_qq);
            talent.talent = await get_talent();
            await Write_talent(usr_qq, talent);
            await player_efficiency(usr_qq);
            e.reply("使用成功");
        }
        else if(id[2]==3){
            const talent = await Read_talent(usr_qq);
            talent.talentshow = 0;
            await Write_talent(usr_qq, talent);
            e.reply("显示成功");
        }
        else{
            return;
        };
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, -1);
        await Write_najie(usr_qq, najie);
        return;
    };
};