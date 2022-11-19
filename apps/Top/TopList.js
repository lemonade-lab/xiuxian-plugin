import plugin from '../../../../lib/plugins/plugin.js';
import fs from "fs";
import { existplayer, __PATH, sortBy, Read_level, Read_battle } from '../Xiuxian/Xiuxian.js';
import { get_toplist_img } from "../ShowImeg/showData.js";
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
    async TOP_prestige(e) {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const playerList = [];
        const temp = [];
        const files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        files.forEach((item, index, arr) => {
            const file = item.replace(".json", "");
            playerList.push(file);
        });
        playerList.forEach(async (item, index, arr) => {
            const newbattle = await Read_level(item);
            if (newbattle.prestige > 0) {
                const battle = {
                    "QQ": item,
                    "power": newbattle.prestige,
                    "name": 'MP'
                };
                temp.push(battle);
            };
        });
        if(temp.length==0){
            return;
        };
        temp.sort(sortBy("power"));
        const list = [];
        temp.forEach((item, index) => {
            if (index < 10) {
                list.push(item);
            };
        });
        const img = await get_toplist_img(e, list);
        e.reply(img);
        return;
    };
    async TOP_Immortal(e) {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const playerList = [];
        const temp = [];
        const files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        files.forEach((item, index, arr) => {
            const file = item.replace(".json", "");
            playerList.push(file);
        });
        playerList.forEach(async (item, index, arr) => {
            const level = await Read_level(item);
            if (level.level_id > 10) {
                const newbattle = await Read_battle(item);
                const battle = {
                    "QQ": item,
                    "power": newbattle.power,
                    "name": 'CE'
                };
                temp.push(battle);
            };
        });
        if(temp.length==0){
            return;
        };
        temp.sort(sortBy("power"));
        const list = [];
        temp.forEach((item, index) => {
            if (index < 10) {
                list.push(item);
            };
        });
        const img = await get_toplist_img(e, list);
        e.reply(img);
        return;
    };
    async TOP_genius(e) {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        const playerList = [];
        const temp = [];
        const files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith(".json"));
        files.forEach((item, index, arr) => {
            const file = item.replace(".json", "");
            playerList.push(file);
        });
        playerList.forEach(async (item, index, arr) => {
            const level = await Read_level(item);
            if (level.level_id <= 10) {
                const newbattle = await Read_battle(item);
                const battle = {
                    "QQ": item,
                    "power": newbattle.power,
                    "name": 'CE'
                };
                temp.push(battle);
            };
        });
        if(temp.length==0){
            return;
        };
        temp.sort(sortBy("power"));
        const list = [];
        temp.forEach((item, index) => {
            if (index < 10) {
                list.push(item);
            };
        });
        
        const img = await get_toplist_img(e, list);
        e.reply(img);
        return;
    };
};