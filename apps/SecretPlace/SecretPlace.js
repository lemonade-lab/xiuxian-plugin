import plugin from '../../../../lib/plugins/plugin.js';
import data from '../../model/XiuxianData.js';
import fs from 'node:fs';
import { Go, Read_action, Read_level, Read_wealth, Write_action, Write_wealth } from '../Xiuxian/Xiuxian.js';
export class SecretPlace extends plugin {
    constructor() {
        super({
            name: 'SecretPlace',
            dsc: 'SecretPlace',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#坐标信息$',
                    fnc: 'xyzaddress'
                },
                {
                    reg: '^#前往.*$',
                    fnc: 'forward'
                },
                {
                    reg: '^#传送.*$',
                    fnc: 'delivery'
                }
            ]
        });
    };
    xyzaddress = async (e) => {
        const usr_qq = e.user_id;
        let action = await Read_action(usr_qq);
        e.reply(`坐标(${action.x},${action.y},${action.z})`);
        return;
    };
    forward = async (e) => {
        const good = await Go(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        let action = await Read_action(usr_qq);
        const x = action.x;
        const y = action.y;
        const address = e.msg.replace('#前往', '');
        //点位表：有各种点位置、传送阵
        const point = JSON.parse(fs.readFileSync(`${data.__PATH.position}/point.json`)).find(item => item.name == address);
        const mx = point.x;
        const my = point.y;
        const PointId = point.id.split('-');
        if (!point) {
            return;
        };
        //判断地点等级限制
        const level = await Read_level(usr_qq);
        if (level.level_id < PointId[3]) {
            //境界不足
            e.reply('前面的区域以后再来探索吧');
            return;
        };
        //计算时间
        const a = (x - mx) > 0 ? (x - mx) : (mx - x);
        const b = (y - my) > 0 ? (y - my) : (my - y);
        const time = Math.floor(a + b);
        const setTime = setTimeout(async () => {
            clearTimeout(setTime);
            action.x = mx;
            action.y = my;
            action.region = PointId[1];
            action.adress = PointId[2];
            await Write_action(usr_qq, action);
            e.reply(`${usr_qq}成功抵达${address}`);
        }, 1000 * time);
        e.reply(`正在前往${address}...\n需要${time}秒`);
        return;
    };

    delivery = async (e) => {
        const good = await Go(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        let action = await Read_action(usr_qq);
        const x = action.x;
        const y = action.y;
        const address = e.msg.replace('#传送', '');
        const position = JSON.parse(fs.readFileSync(`${data.__PATH.position}/position.json`)).find(item => item.name == address);
        if (!position) {
            return;
        };
        const positionID = position.id.split('-');
        //判断地点等级限制
        const level = await Read_level(usr_qq);
        if (level.level_id < positionID[3]) {
            //境界不足
            e.reply('前面的区域以后再来探索吧');
            return;
        };
        const point = JSON.parse(fs.readFileSync(`${data.__PATH.position}/point.json`));
        let key = 0;
        //看看地点
        point.forEach((item) => {
            //看看在不在传送阵:传送阵点固定id=1-6
            const pointID = item.id.split('-');
            //id需要重设定
            //位面、区域、属性、等级、编号2为传送阵
            if (pointID[4] == 2) {
                if (item.x == x) {
                    if (item.y = y) {
                        key = 1;
                    };
                };
            };
        });
        if (key == 0) {
            return;
        };
        const wealth = await Read_wealth(usr_qq);
        if (wealth.lingshi < 10000) {
            return;
        };
        wealth.lingshi -= 10000;
        await Write_wealth(usr_qq, wealth);
        //是区域的，就随机分配
        const mx = Math.floor((Math.random() * (position.x2 - position.x1))) + Number(position.x1);
        const my = Math.floor((Math.random() * (position.y2 - position.y1))) + Number(position.y1);
        //计算时间
        const time = Math.floor(((x - mx) > 0 ? (x - mx) : (mx - x) + (y - my) > 0 ? (y - my) : (my - y)) / 10);
        const setTime = setTimeout(async () => {
            clearTimeout(setTime);
            action.x = mx;
            action.y = my;
            action.region = positionID[1];
            action.address = positionID[2];
            await Write_action(usr_qq, action);
            e.reply(`${usr_qq}成功传送至${address}`);
        }, 1000 * time);
        e.reply(`正在传送${address}\n需要${time}秒`);
        return;
    };
};