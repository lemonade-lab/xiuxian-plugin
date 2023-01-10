import Robotapi from "../../model/Robotapi.js";
import {  __PATH, offaction, At, Write_Life, Read_Life } from '../../model/public.js';
export class AdminDelete extends Robotapi {
    constructor() {
        super({
            name: 'AdminDelete',
            dsc: 'AdminDelete',
            event: 'message',
            priority: 400,
            rule: [
                {
                    reg: '^#修仙删除数据$',
                    fnc: 'deleteredis'
                },
                {
                    reg: '^#修仙删除世界$',
                    fnc: 'deleteallusers'
                },
                {
                    reg: '^#修仙删除信息.*$',
                    fnc: 'deleteuser'
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
    deleteallusers = async (e) => {
        if (!e.isMaster) {
            return;
        };
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
    };
};