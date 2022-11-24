import plugin from '../../../../lib/plugins/plugin.js';
import data from '../../model/XiuxianData.js';
import fs from 'node:fs';
import { segment } from 'oicq';
import { Go, Read_action, Read_level, existplayer,Read_wealth, Write_action, Write_wealth } from '../Xiuxian/Xiuxian.js';
const forwardsetTime = []
const deliverysetTime = [];
const useraction=[];
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
                    reg: '^#回到原地$',
                    fnc: 'returnpiont'
                },
                {
                    reg: '^#传送.*$',
                    fnc: 'delivery'
                }
            ]
        });
    };

    returnpiont=async(e)=>{
        const good = await Go(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        forwardsetTime[usr_qq]=0;
        clearTimeout(useraction[usr_qq]);
        e.reply('你回到了原地');
        return;
    };

    xyzaddress = async (e) => {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
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
        if(forwardsetTime[usr_qq]==1){
            return;
        };
        let action = await Read_action(usr_qq);
        const x = action.x;
        const y = action.y;
        const address = e.msg.replace('#前往', '');
        const point = JSON.parse(fs.readFileSync(`${data.__PATH.position}/point.json`)).find(item => item.name == address);
        if (!point) {
            return;
        };
        const mx = point.x;
        const my = point.y;
        const PointId = point.id.split('-');
        console.log(PointId);
        //判断地点等级限制
        const level = await Read_level(usr_qq);
        if (level.level_id < PointId[3]) {
            //境界不足
            e.reply('[修仙联盟]守境者\n前面的区域以后再探索吧');
            return;
        };
        //计算时间
        const a = (x - mx) > 0 ? (x - mx) : (mx - x);
        const b = (y - my) > 0 ? (y - my) : (my - y);
        const the = Math.floor(a + b);
        const time =the>0?the:1;
        useraction[usr_qq]=setTimeout(async () => {
                forwardsetTime[usr_qq]=0;
                action.x = mx;
                action.y = my;
                action.region = PointId[1];
                action.address = PointId[2];
                await Write_action(usr_qq, action);
                e.reply([segment.at(usr_qq),`成功抵达${address}`]);
        }, 1000 * time);
        forwardsetTime[usr_qq]=1;
        e.reply(`正在前往${address}...\n需要${time}秒`);
        return;
    };

    delivery = async (e) => {
        const good = await Go(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        if(deliverysetTime[usr_qq]==1){
            return;
        };
        let action = await Read_action(usr_qq);
        const x = action.x;
        const y = action.y;
        const address = e.msg.replace('#传送', '');
        const position = JSON.parse(fs.readFileSync(`${data.__PATH.position}/position.json`)).find(item => item.name == address);
        console.log(position);
        if (!position) {
            return;
        };
        const positionID = position.id.split('-');
        console.log(positionID);
        const level = await Read_level(usr_qq);
        if (level.level_id < positionID[3]) {
            e.reply('[修仙联盟]守境者\n前面的区域以后再探索吧');
            return;
        };
        const point = JSON.parse(fs.readFileSync(`${data.__PATH.position}/point.json`));
        let key = 0;
        //看看地点
        point.forEach((item) => {
            //看看在不在传送阵:传送阵点固定id=1-6
            const pointID = item.id.split('-');
            console.log(pointID);
            //id需要重设定
            //位面、区域、属性、等级、编号2为传送阵
            if (pointID[4] == 2) {
                if (item.x == x) {
                    if (item.y = y) {
                        key = 1;
                        console.log(1);
                    };
                };
            };
        });
        if (key == 0) {
            return;
        };
        const wealth = await Read_wealth(usr_qq);
        const lingshi=1000;
        if (wealth.lingshi < lingshi) {
            e.reply(`[修仙联盟]守阵者\n需要花费${lingshi}灵石`);
            return;
        };
        wealth.lingshi -= lingshi;
        await Write_wealth(usr_qq, wealth);
        const mx = Math.floor((Math.random() * (position.x2 - position.x1))) + Number(position.x1);
        const my = Math.floor((Math.random() * (position.y2 - position.y1))) + Number(position.y1);
        const the=Math.floor(((x - mx) > 0 ? (x - mx) : (mx - x) + (y - my) > 0 ? (y - my) : (my - y)) / 100);
        const time =the>0?the:1;
        setTimeout(async () => {
            deliverysetTime[usr_qq]=0;
            action.x = mx;
            action.y = my;
            action.region = positionID[1];
            action.address = positionID[2];
            console.log(positionID[2]);
            await Write_action(usr_qq, action);
            e.reply([segment.at(usr_qq),`成功传送至${address}`]);
        }, 1000 * time);
        deliverysetTime[usr_qq]=1;
        e.reply(`[修仙联盟]守阵者\n传送${address}\n需要${time}秒`);
        return;
    };
};