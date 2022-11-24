import plugin from '../../../../lib/plugins/plugin.js';
import config from '../../model/Config.js';
import { Go, Read_action, existplayer, GenerateCD, __PATH, At, battle,  Read_equipment, Anyarray, Write_equipment, Read_najie, Add_najie_thing, Write_najie, Read_level, Write_level, Read_wealth, Write_wealth } from '../Xiuxian/Xiuxian.js';
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
        let A = e.user_id;
        let B = await At(e);
        if (B == 0 || B == A) {
            return;
        };
        const actionA = await Read_action(A);
        const actionB = await Read_action(B);
        if(actionA.region!=actionB.region){
            e.reply('没找到此人');
            return;
        };
        if(actionA.address==1){
            e.reply('[修仙联盟]普通卫兵:城内不可出手！');
            return;
        };
        if(actionB.address==1){
            e.reply('[修仙联盟]普通卫兵:城内不可出手！');
            return;
        };
        const CDid = '0';
        const now_time = new Date().getTime();
        const CDTime = this.xiuxianConfigData.CD.Attack;
        const CD = await GenerateCD(A, CDid);
        if (CD != 0) {
            e.reply(CD);
        };
        await redis.set(`xiuxian:player:${A}:${CDid}`,now_time);
        await redis.expire(`xiuxian:player:${A}:${CDid}`, CDTime * 60);
        let qq  = await battle(e, A, B);
        const Level = await Read_level(A);
        Level.prestige += 1;
        await Write_level(A, Level);
        const q = Math.floor((Math.random() * (99 - 1) + 1));
        const LevelB = await Read_level(B);
        const MP = LevelB.prestige * 10 + Number(50);
        if (q <= MP) {
            if (qq != A) {
                let C = A;
                A = B;
                B = C;
            };
            let equipment = await Read_equipment(B);
            if (equipment.length > 0) {
                const thing = await Anyarray(equipment);
                equipment = equipment.filter(item => item.name != thing.name);
                await Write_equipment(B, equipment);
                let najie = await Read_najie(A);
                najie = await Add_najie_thing(najie, thing, 1);
                await Write_najie(A, najie);
                e.reply(`${A}夺走了${thing.name}`);
            };
        };
        return;
    };

    HandWashing = async (e) => {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
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
                e.reply('天机门的某位修士:你为你清除1点魔力值');
                return;
            }
            e.reply(`天机门的某位修士:清魔力需要${money}`);
            return;
        } 
        else {
            e.reply('一身清廉');
        };
        return;
    };
};