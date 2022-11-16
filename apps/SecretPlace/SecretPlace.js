//插件加载
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import { Go,  Read_action, Read_level, Write_action } from '../Xiuxian/Xiuxian.js'
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
        })
    }

    async Xiuxianstate(e) {
        await Go(e);
        return;
    }

    async xyzaddress(e) {
        const usr_qq = e.user_id;
        let action = await Read_action(usr_qq);
        e.reply("坐标(" + action.x + "," + action.y + "," + action.z + ")");
        return;
    }

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
            e.reply("已经在传送阵");
            return;
        }else{
            console.log("开始传送");
        };
        const setTime = setTimeout(async () => {
            action.x=Math.floor(x/100)*100;
            action.y=Math.floor(y/100)*100;
            action.z=Math.floor(z/100)*100;
            await Write_action(usr_qq, action)
            e.reply("已到达传送阵");
        }, 1000*60);
        return;
    }


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
            return;
        };
        //确认自己是否在传送阵
        let action = await Read_action(usr_qq);
        const x = action.x;
        const y = action.y;
        const z = action.z;
        if (x % 100 != 0 && y % 100 != 0 && z % 100 != 0) {
            e.reply("请先#赶往传送阵");
            return;
        };
        //判断距离
        //传送怎么能不花钱呢，嘿嘿
        //赋予时间
        const time=60;
        const setTime = setTimeout(async () => {
            //随机分配位置
            action.x = Math.floor((Math.random() * (place.x2 - place.x1))) + Number(place.x1);
            action.y = Math.floor((Math.random() * (place.y2 - place.y1))) + Number(place.y1);
            action.z = 0;
            await Write_action(usr_qq, action)
            e.reply("成功抵达！");
        }, 1000*time);
        e.reply("传送阵启动中...");
        return;
    }

}
