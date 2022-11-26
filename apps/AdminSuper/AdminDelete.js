import plugin from '../../../../lib/plugins/plugin.js';
import fs from 'node:fs';
import { Write_Forum, Read_Exchange, Write_Exchange, __PATH, offaction, At, Write_Life, Read_Life, Read_action, Write_action } from '../Xiuxian/Xiuxian.js';
export class AdminDelete extends plugin {
    constructor() {
        super({
            name: 'AdminDelete',
            dsc: 'AdminDelete',
            event: 'message',
            priority: 400,
            rule: [
                {
                    reg: '^#清理弱水阁$',
                    fnc: 'Deleteexchange',
                },
                {
                    reg: '^#清除.*$',
                    fnc: 'Deletepurchase'
                },
                {
                    reg: '^#打扫客栈$',
                    fnc: 'DeleteForum'
                },
                {
                    reg: '^#删除世界$',
                    fnc: 'deleteallusers'
                },
                {
                    reg: '^#删除信息.*$',
                    fnc: 'deleteuser'
                },
                {
                    reg: '^#删除数据$',
                    fnc: 'deleteredis'
                }
            ],
        });
    };
    deleteredis = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const allkey = await redis.keys('xiuxian:*', (err, data) => {});
        if (allkey) {
            allkey.forEach(async (item) => {
                await redis.del(item);
            });
            e.reply('删除完成');
            return;
        };
        e.reply('世界无一花草');
        return;
    };
    DeleteForum = async (e) => {
        if (!e.isMaster) {
            return;
        };
        await Write_Forum([]);
        e.reply('已打扫');
        return;
    };
    Deletepurchase = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const thingid = e.msg.replace('#清除', '');
        const Exchange = await Read_Exchange();
        Exchange.forEach(async (item, index, arr) => {
            if (item.id == thingid) {
                const action = await Read_action(item.QQ);
                action.Exchange = action.Exchange - 1;
                await Write_action(item.QQ, action);
                arr.splice(index, 1);
                e.reply(`清除${thingid}`);
            };
        });
        await Write_Exchange(Exchange);
        return;
    };
    Deleteexchange = async (e) => {
        if (!e.isMaster) {
            return;
        };
        await Write_Exchange([]);
        const playerList = [];
        const files = fs
            .readdirSync(__PATH.player)
            .filter((file) => file.endsWith('.json'));
        files.forEach((item) => {
            const file = item.replace('.json', '');
            playerList.push(file);
        });
        playerList.forEach(async (item) => {
            const action = await Read_action(item);
            action.Exchange = 0;
            await Write_action(item, action);
        });
        e.reply('已清除');
        return;
    };
    deleteallusers = async (e) => {
        if (!e.isMaster) {
            return;
        };
        await Write_Exchange([]);
        await Write_Forum([]);
        await Write_Life([]);
        await this.deleteredis(e);
        return;
    };
    deleteuser = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const B = await At(e);
        if (B == 0) {
            return;
        };
        await offaction(B);
        let life = await Read_Life();
        life.forEach((item, index, arr) => {
            if (item.qq == B) {
                arr.splice(index, 1);
            };
        });
        await Write_Life(life);
        e.reply('信息崩碎');
        return;
    }
};