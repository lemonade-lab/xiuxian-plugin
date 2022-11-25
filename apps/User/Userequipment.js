import plugin from '../../../../lib/plugins/plugin.js';
import config from '../../model/Config.js';
import { existplayer, exist_najie_thing_name, Read_najie, Read_equipment, Write_equipment, Write_najie, Add_najie_thing } from '../Xiuxian/Xiuxian.js';
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
                }
            ]
        });
        this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian');
    };
    add_equipment = async (e) => {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const thing_name = e.msg.replace('#装备', '');
        const najie_thing = await exist_najie_thing_name(usr_qq, thing_name);
        if (najie_thing == 1) {
            e.reply(`没有${thing_name}`);
            return;
        };
        const equipment = await Read_equipment(usr_qq);
        if (equipment.length >= this.xiuxianConfigData.myconfig.equipment) {
            return;
        };
        equipment.push(najie_thing);
        await Write_equipment(usr_qq, equipment);
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, najie_thing, -1);
        await Write_najie(usr_qq, najie);
        e.reply(`装备${thing_name}`);
        return;
    };
    delete_equipment = async (e) => {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const thing_name = e.msg.replace('#卸下', '');
        let equipment = await Read_equipment(usr_qq);
        const islearned = equipment.find(item => item.name == thing_name);
        if (!islearned) {
            return;
        };
        const q={
            "x":0
        };
        equipment.forEach((item,index,arr)=>{
            if(item.name==thing_name&&q.x==0){
                q.x=1;
                arr.splice(index, 1);
            };
        });
        await Write_equipment(usr_qq, equipment);
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, islearned, 1);
        await Write_najie(usr_qq, najie);
        e.reply(`已卸下${thing_name}`);
        return;
    };
};