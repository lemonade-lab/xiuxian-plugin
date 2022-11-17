//插件加载
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import Cachemonster from "../../model/cachemonster.js";
import { Gomini, Read_action, ForwardMsg, Read_battle, monsterbattle } from '../Xiuxian/Xiuxian.js'
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
        })
    }


    async Kill(e) {
        const good = await Gomini(e);
        if (!good) {
            return;
        };
        const name = e.msg.replace("#击杀", '');
        const usr_qq = e.user_id;
        const action = await Read_action(usr_qq);
        const p = await Cachemonster.monsters(action.x, action.y, action.z);
        if (p != -1) {
            const monstersdata = await Cachemonster.monsterscache(p);
            const mon=monstersdata.find(item => item.name == name);
            //根据id。max面板
            const LevelMax = data.LevelMax_list.find(item => item.id == mon.level);
            //怪物面板
            const monsters = {
                "nowblood": LevelMax.blood,
                "attack": LevelMax.attack,
                "defense": LevelMax.defense,
                "blood": LevelMax.blood,
                "burst": LevelMax.burst+LevelMax.id*10,
                "burstmax": LevelMax.burstmax+LevelMax.id*10,
                "speed": LevelMax.speed+5
            }
            //玩家面板
            const battle=await Read_battle(usr_qq);
            const q=await monsterbattle(e,battle,monsters);
            //击败才能获得东东
            if(q!=0){
                e.reply(usr_qq+"击败了"+mon.name);
            }
        }
        return;
    }

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
        return;
    }
}