import plugin from '../../../../lib/plugins/plugin.js';
import config from '../../model/Config.js';
import { Go, Read_action, point_map,existplayer, GenerateCD, __PATH, At, battle,  Read_equipment, Anyarray, Write_equipment, Read_najie, Add_najie_thing, Write_najie, Read_level, Write_level, Read_wealth, Write_wealth } from '../Xiuxian/Xiuxian.js';
export class Battle extends plugin {
    constructor() {
        super({
            name: 'Battle',
            dsc: 'Battle',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#攻击.*$',
                    fnc: 'Attack'
                },
                {
                    reg: '^#洗手$',
                    fnc: 'HandWashing'
                }
            ]
        });
        this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian');
    };


    Attack = async (e) => {
        const good = await Go(e);
        if (!good) {
            return;
        };
        const user={
            A: e.user_id,
            B: 0,
            C: 0,
            QQ: 0,
            p: Math.floor((Math.random() * (99 - 1) + 1))
        };
        user.B = await At(e);
        if (user.B == 0 || user.B == user.A) {
            return;
        };
        const actionA = await Read_action(user.A);
        const actionB = await Read_action(user.B);
        if(actionA.region!=actionB.region){
            e.reply('没找到此人');
            return;
        };
        if(actionA.address==1){
            e.reply('[修仙联盟]普通卫兵:城内不可出手!');
            return;
        };
        if(actionB.address==1){
            e.reply('[修仙联盟]普通卫兵:城内不可出手!');
            return;
        };
        const CDid = '0';
        const now_time = new Date().getTime();
        const CDTime = this.xiuxianConfigData.CD.Attack;
        const CD = await GenerateCD(user.A, CDid);
        if (CD != 0) {
            e.reply(CD);
        };
        user.QQ  = await battle(e, user.A, user.B);
        const Level = await Read_level(user.A);
        Level.prestige += 1;
        await Write_level(user.A, Level);
        const LevelB = await Read_level(user.B);
        const MP = LevelB.prestige * 10 + Number(50);
        if (user.p <= MP) {
            if (user.QQ != user.A) {
                user.C = user.A;
                user.A = user.B;
                user.B = user.C;
            };
            let equipment = await Read_equipment(user.B);
            if (equipment.length > 0) {
                const thing = await Anyarray(equipment);
                equipment = equipment.filter(item => item.name != thing.name);
                await Write_equipment(user.B, equipment);
                let najie = await Read_najie(user.A);
                najie = await Add_najie_thing(najie, thing, 1);
                await Write_najie(user.A, najie);
                e.reply(`${user.A}夺走了${thing.name}`);
            };
        };
        await redis.set(`xiuxian:player:${user.A}:${CDid}`,now_time);
        await redis.expire(`xiuxian:player:${user.A}:${CDid}`, CDTime * 60);
        return;
    };

    
    /**
     * 此功能需要回  天机门
     */

    HandWashing = async (e) => {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const action=await Read_action(usr_qq);
        const address_name='天机门';
        const map=await point_map(action,address_name);
        if(!map){
            e.reply(`需回${address_name}`);
            return;
        };
        const Level = await Read_level(usr_qq);
        const money = 10000 * Level.level_id;
        if (Level.prestige > 0) {
            const wealt = await Read_wealth(usr_qq);
            if (wealt.lingshi > money) {
                Level.prestige -= 1;
                wealt.lingshi -= money;
                await Write_level(usr_qq, Level);
                await Write_wealth(usr_qq, wealt);
                e.reply('[天机门]南宫问天\n为你清除1点魔力值');
                return;
            }
            e.reply(`[天机门]韩立\n清魔力需要${money}`);
            return;
        } 
        else {
            e.reply('[天机门]李逍遥\n你一身清廉');
        };
        return;
    };
};