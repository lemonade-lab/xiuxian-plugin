import plugin from '../../../../lib/plugins/plugin.js';
import {existplayer, search_thing_name, exist_najie_thing_id,Read_najie,Read_equipment, Write_equipment, Write_najie,Add_najie_thing} from '../Xiuxian/Xiuxian.js';
export class Userequipment extends plugin {
    constructor() {
        super({
            name: 'Userequipment',
            dsc: 'Userequipment',
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
                    reg: '^#升级魂力$',
                    fnc: 'upgrade_equipment'
                }
            ]
        });
    };
    async upgrade_equipment(e){
        if (!e.isGroup) {
            return;
        };
        e.reply("待更新");
        return;
    };
    async add_equipment(e) {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const thing_name = e.msg.replace("#装备", '');
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
        const id=searchsthing.id.split('-')
        if(id[0]!= 1 ){
            if(id[0]!=2){
                if (id[0]!=3){
                    e.reply(`此物无法被装备`);
                    return ;
                };
            };
        };
        const equipment = await Read_equipment(usr_qq);
        if (equipment.length < 4) {
            equipment.push(searchsthing);
            await Write_equipment(usr_qq, equipment);
        } 
        else {
            e.reply("无法操控更多装备");
            return;
        };
        const najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, -1);
        await Write_najie(usr_qq, najie);
        e.reply("装备" + thing_name);
        return;
    };
    async delete_equipment(e) {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const thing_name = e.msg.replace("#卸下", '');
        const equipment = await Read_equipment(usr_qq);
        const islearned = equipment.find(item => item.name == thing_name);
        if (islearned) {
            equipment = equipment.filter(item => item.name != thing_name);
            await Write_equipment(usr_qq, equipment);
        } 
        else {
            e.reply("未装备");
        };
        const searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply("世界没有" + thing_name);
            return;
        };
        const najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, 1);
        await Write_najie(usr_qq, najie);
        e.reply("已卸下" + thing_name);
        return;
    };
};