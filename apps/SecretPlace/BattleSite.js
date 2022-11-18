import plugin from '../../../../lib/plugins/plugin.js';
import data from '../../model/XiuxianData.js';
import Cachemonster from "../../model/cachemonster.js";
import { Gomini, Read_action, ForwardMsg, Read_battle, monsterbattle, Add_experiencemax, Add_experience, Add_lingshi } from '../Xiuxian/Xiuxian.js';
export class BattleSite extends plugin {
    constructor() {
        super({
            name: 'BattleSite',
            dsc: 'BattleSite',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#击杀.*$',
                    fnc: 'Kill'
                },
                {
                    reg: '^#探索怪物$',
                    fnc: 'Exploremonsters'
                }
            ]
        });
    };
    async Kill(e) {
        const good = await Gomini(e);
        if (!good) {
            return;
        };
        const CDid = "10";
        const now_time = new Date().getTime();
        const CDTime = 5;
        const CD = await GenerateCD(A, CDid);
        if (CD != 0) {
            e.reply(CD);
        };
        const usr_qq = e.user_id;
        const name = e.msg.replace("#击杀", '');
        const action = await Read_action(usr_qq);
        //非安全区判断
        const p = await Cachemonster.monsters(action.x, action.y, action.z);
        if (p != -1) {
            await redis.set("xiuxian:player:" + A + ':' + CDid, now_time);
            await redis.expire("xiuxian:player:" + A + ':' + CDid, CDTime * 60);
            const monstersdata = await Cachemonster.monsterscache(p);
            const mon=monstersdata.find(item => item.name == name);
            const LevelMax = data.LevelMax_list.find(item => item.id == mon.level);
            const monsters = {
                "nowblood": LevelMax.blood,
                "attack": LevelMax.attack,
                "defense": LevelMax.defense,
                "blood": LevelMax.blood,
                "burst": LevelMax.burst+LevelMax.id*5,
                "burstmax": LevelMax.burstmax+LevelMax.id*10,
                "speed": LevelMax.speed+5
            };
            const battle=await Read_battle(usr_qq);
            const q=await monsterbattle(e,battle,monsters);
            if(q!=0){
                const msg = ["[击杀结果]"];
                e.reply(usr_qq+"击败了"+mon.name);
                //todo 按怪物等级进行掉落
                const m=Math.floor((Math.random() * (100-1))) + Number(1);
                //获得装备
                if(m<mon.level*5){
                    msg.push(usr_qq+"得到了装备");
                }
                //获得气血
                else if(m<mon.level*8){
                    msg.push(usr_qq+"得到99气血");
                    await Add_experiencemax(usr_qq,99);
                }
                //获得修为and灵石
                else if(m<mon.level*10){
                    msg.push(usr_qq+"得到99灵石和99修为");
                    await Add_experience(usr_qq,99);
                    await Add_lingshi(usr_qq,99);
                };
                await ForwardMsg(e, msg);
                return;
            };
            return;
        };
        return;
    };
    async Exploremonsters(e) {
        const good = await Gomini(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        const action = await Read_action(usr_qq);
        const p = await Cachemonster.monsters(action.x, action.y, action.z);
        if (p != -1) {
            const msg = [];
            const monster = await Cachemonster.monsterscache(p);
            monster.forEach((item) => {
                msg.push(
                    "怪名：" + item.name + "\n" +
                    "等级：" + item.level + "\n"
                );
            });
            await ForwardMsg(e, msg);
            return;
        }
        else{
            e.reply("修仙联盟的普通士兵:城里哪儿来的怪物？搞笑");
        }
        return;
    };
};