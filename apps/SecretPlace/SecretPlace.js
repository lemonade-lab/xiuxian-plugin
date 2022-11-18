import plugin from '../../../../lib/plugins/plugin.js';
import data from '../../model/XiuxianData.js';
import { Go,  Read_action, Read_level, Read_wealth, Write_action, Write_wealth } from '../Xiuxian/Xiuxian.js';
export class SecretPlace extends plugin {
    constructor() {
        super({
            name: 'SecretPlace',
            dsc: 'SecretPlace',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#修仙状态$',
                    fnc: 'Xiuxianstate'
                },
                {
                    reg: '^#位置信息$',
                    fnc: 'xyzaddress'
                },
                {
                    reg: '^#赶往传送阵$',
                    fnc: 'delivery'
                },
                {
                    reg: '^#前往.*$',
                    fnc: 'forward'
                }
            ]
        });
    };
    async Xiuxianstate(e) {
        await Go(e);
        return;
    };
    async xyzaddress(e) {
        const usr_qq = e.user_id;
        let action = await Read_action(usr_qq);
        e.reply("坐标(" + action.x + "," + action.y + "," + action.z + ")");
        return;
    };
    async delivery(e) {
        const good = await Go(e);
        if (!good) {
            return;
        };
        const usr_qq = e.user_id;
        let action = await Read_action(usr_qq);
        const x = action.x;
        const y = action.y;
        const z = action.z;
        if (x % 100 == 0 && y % 100 == 0 && z % 100 == 0) {
            e.reply("修仙联盟的守阵者:已经在传送阵了");
            return;
        };
        const setTime = setTimeout(async () => {
            action.x=Math.floor(x/100)*100;
            action.y=Math.floor(y/100)*100;
            action.z=Math.floor(z/100)*100;
            await Write_action(usr_qq, action)
            e.reply(usr_qq+"已到达传送阵");
        }, 1000*15);
        e.reply(usr_qq+"正在赶往传送阵...");
        return;
    };
    async forward(e) {
        const good = await Go(e);
        if (!good) {
            return;
        };
        const address = e.msg.replace("#前往", '');
        const place = data.position_list.find(item => item.name == address);
        if (!place) {
            return;
        };
        const usr_qq = e.user_id;
        let level = await Read_level(usr_qq);
        if (level.level_id < place.grade) {
            e.reply("修仙联盟的维护者:前面的区域，以后再来探索吧");
            return;
        };
        let action = await Read_action(usr_qq);
        const x = action.x;
        const y = action.y;
        const z = action.z;
        if (x % 100 != 0 || y % 100 != 0 || z % 100 != 0) {
            e.reply(usr_qq+"请先#赶往传送阵");
            return;
        };
        let wealt=await Read_wealth(usr_qq);
        const money=10000;
        if(wealt.lingshi<money){
            e.reply("修仙联盟的守阵者:灵石不够，下次再来吧");
            return;
        };
        wealt.lingshi=wealt.lingshi-money;
        await Write_wealth(usr_qq,wealt);
        const time=((x-place.x1)>0?x-place.x1:place.x1-x)/100+(y-place.y1>0?y-place.y1:place.y1-x)/100;
        const setTime = setTimeout(async () => {
            action.x = Math.floor((Math.random() * (place.x2 - place.x1))) + Number(place.x1);
            action.y = Math.floor((Math.random() * (place.y2 - place.y1))) + Number(place.y1);
            action.z = 0;
            await Write_action(usr_qq, action);
            e.reply(usr_qq+"成功抵达"+place.name);
        }, 1000*time);
        e.reply("修仙联盟的守阵者:传送阵正在启动...");
        return;
    };
};