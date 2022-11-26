import plugin from '../../../../lib/plugins/plugin.js';
import Cachemonster from '../../model/cachemonster.js';
import data from '../../model/XiuxianData.js';
import config from '../../model/Config.js';
import fs from 'node:fs';
import { Gomini,Go, Read_action, ForwardMsg, Read_battle, monsterbattle, Add_experiencemax, Add_experience, Add_lingshi, GenerateCD, Add_najie_thing, Read_najie, Write_najie, Read_talent } from '../Xiuxian/Xiuxian.js';
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
        this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian');
    };
    Kill = async (e) => {
        const good = await Go(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        const CDid = '10';
        const now_time = new Date().getTime();
        const CDTime = this.xiuxianConfigData.CD.Kill;
        const CD = await GenerateCD(usr_qq, CDid);
        if (CD != 0) {
            e.reply(CD);
            return;
        };
        const name = e.msg.replace('#击杀', '');
        const action = await Read_action(usr_qq);
        const monstersdata = await Cachemonster.monsterscache(action.region);
        const mon = monstersdata.find(item => item.name == name);
        if (!mon) {
            e.reply(`这里没有${name},去别处看看吧`);
            return;
        };
        const acount = await Cachemonster.add(action.region, Number(1));
        const msg = [`${usr_qq}的[击杀结果]\n注:怪物每1小时刷新\n物品掉落率=怪物等级*5%`];
        const buff={
            "msg":1
        };
        if (acount == 1) {
            buff.msg = Math.floor((Math.random() * (20 - 5))) + Number(5);
            msg.push('怪物突然变异了!');
        };
        const LevelMax = data.Level_list.find(item => item.id == mon.level+1);
        const monsters = {
            'nowblood': LevelMax.blood * buff.msg,
            'attack': LevelMax.attack * buff.msg,
            'defense': LevelMax.defense * buff.msg,
            'blood': LevelMax.blood * buff.msg,
            'burst': LevelMax.burst + LevelMax.id * 5 * buff.msg,
            'burstmax': LevelMax.burstmax + LevelMax.id * 10 * buff.msg,
            'speed': LevelMax.speed + 5 + buff.msg
        };
        const battle = await Read_battle(usr_qq);
        const talent = await Read_talent(usr_qq);
        const mybuff = Math.floor(talent.talentsize / 100) + Number(1);
        const battle_msg = await monsterbattle(e, battle, monsters);
        battle_msg.msg.forEach((item)=>{
            msg.push(item);
        });
        if (battle_msg.QQ != 0) {
            const m = Math.floor((Math.random() * (100 - 1))) + Number(1);
            if (m < mon.level * 5) {
                const dropsItemList = JSON.parse(fs.readFileSync(`${data.__PATH.all}/dropsItem.json`));
                const random = Math.floor(Math.random() * dropsItemList.length);
                let najie = await Read_najie(usr_qq);
                najie = await Add_najie_thing(najie, dropsItemList[random], 1);
                msg.push(`得到[${dropsItemList[random].name}]`);
                await Write_najie(usr_qq, najie);
            };
            if (m < mon.level * 6) {
                msg.push(`得到${mon.level * 25 * mybuff}气血`);
                await Add_experiencemax(usr_qq, mon.level * 25 * mybuff);
            };
            if (m < mon.level * 7) {
                msg.push(`得到${mon.level * 35 * mybuff}灵石`);
                await Add_lingshi(usr_qq, mon.level * 35 * mybuff);
            };
            if (m < mon.level * 8) {
                msg.push(`得到${mon.level * 50 * mybuff}修为`);
                await Add_experience(usr_qq, mon.level * 50 * mybuff);
            };
            if (m >= mon.level * 8) {
                msg.push(`得到${mon.level * 25}灵石`);
                await Add_lingshi(usr_qq, mon.level * 25);
            };
        };
        await redis.set(`xiuxian:player:${usr_qq}:${CDid}`, now_time);
        await redis.expire(`xiuxian:player:${usr_qq}:${CDid}`, CDTime * 60);
        await ForwardMsg(e, msg);
        return;
    };

    Exploremonsters = async (e) => {
        const good = await Gomini(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        const action = await Read_action(usr_qq);
        const msg = [];
        const monster = await Cachemonster.monsterscache(action.region);
        monster.forEach((item) => {
            msg.push(
                '怪名:' + item.name + '\n' +
                '等级:' + item.level + '\n'
            );
        });
        await ForwardMsg(e, msg);
        return;
    };
};