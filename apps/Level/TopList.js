import plugin from '../../../../lib/plugins/plugin.js';
import fs from 'fs';
import { existplayer, __PATH, Read_action,point_map,sortBy, Read_level, Read_battle } from '../Xiuxian/Xiuxian.js';
import { get_toplist_img } from '../ShowImeg/showData.js';
export class TopList extends plugin {
    constructor() {
        super({
            name: 'TopList',
            dsc: 'TopList',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#封神榜$',
                    fnc: 'TOP_Immortal'
                },
                {
                    reg: '^#至尊榜$',
                    fnc: 'TOP_genius'
                },
                {
                    reg: '^#杀神榜$',
                    fnc: 'TOP_prestige'
                }
            ]
        });
    };
    
    /**
     * 此功能需要回  天机门
     */

    TOP_prestige = async (e) => {
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
        const playerList = [];
        const temp = [];
        const list = [];
        const files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith('.json'));
        files.forEach((item) => {
            const file = item.replace('.json', '');
            playerList.push(file);
        });
        for (let item of playerList) {
            const newbattle = await Read_level(item);
            if (newbattle.prestige > 0) {
                const battle = {
                    'QQ': item,
                    'power': newbattle.prestige,
                    'name': 'MP'
                };
                temp.push(battle);
            };
        };
        if (temp.length == 0) {
            e.reply('此界皆是良民');
            return;
        };
        temp.sort(sortBy('power'));
        temp.forEach((item, index) => {
            if (index < 10) {
                list.push(item);
            };
        });
        const img = await get_toplist_img(e, list);
        e.reply(img);
        return;
    };
    TOP_Immortal = async (e) => {
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
        const playerList = [];
        const temp = [];
        const list = [];
        const files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith('.json'));
        files.forEach((item) => {
            const file = item.replace('.json', '');
            playerList.push(file);
        });
        for (let item of playerList) {
            const level = await Read_level(item);
            if (level.level_id > 10) {
                const newbattle = await Read_battle(item);
                const battle = {
                    'QQ': item,
                    'power': newbattle.power,
                    'name': 'CE'
                };
                temp.push(battle);
            };
        };
        if (temp.length == 0) {
            e.reply('无一人成仙');
            return;
        };
        temp.sort(sortBy('power'));
        temp.forEach((item, index) => {
            if (index < 10) {
                list.push(item);
            };
        });
        const img = await get_toplist_img(e, list);
        e.reply(img);
        return;
    };
    TOP_genius = async (e) => {
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
        const list = [];
        const temp = [];
        const playerList = [];
        const files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith('.json'));
        files.forEach((item) => {
            const file = item.replace('.json', '');
            playerList.push(file);
        });
        for (let item of playerList) {
            const level = await Read_level(item);
            if (level.level_id <= 10) {
                const newbattle = await Read_battle(item);
                const battle = {
                    'QQ': item,
                    'power': newbattle.power,
                    'name': 'CE'
                };
                temp.push(battle);
            };
        };
        if (temp.length == 0) {
            return;
        };
        temp.sort(sortBy('power'));
        temp.forEach(async (item, index) => {
            if (index < 10) {
                list.push(item);
            };
        });
        const img = await get_toplist_img(e, list);
        e.reply(img);
        return;
    };
};