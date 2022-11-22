import plugin from '../../../../lib/plugins/plugin.js';
import data from '../../model/XiuxianData.js';
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
                    reg: '^#位置信息$',
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
        const point = JSON.parse(fs.readFileSync(`${data.position}/point.json`)).find(item => item.name == address);
        let mx = point.x;
        let my = point.y;
        let name = point.name;
        let grade = point.grade;
        if (!point) {
            //看他说的是不是区域地点
            const position = JSON.parse(fs.readFileSync(`${data.position}/position.json`)).find(item => item.name == address);
            if (!position) {
                return;
            };
            //是区域的，就随机分配
            mx = Math.floor((Math.random() * (position.x2 - position.x1))) + Number(position.x1);
            my = Math.floor((Math.random() * (position.y2 - position.y1))) + Number(position.y1);
            name = position.name;
            grade = position.grade;
        };
        //判断地点等级限制
        const level = await Read_level();
        if (level.level < grade) {
            //境界不足
            return;
        };
        //计算时间
        const time = Math.floor((x - mx) > 0 ? (x - mx) : (mx - x) + (y - my) > 0 ? (y - my) : (my - y));
        const setTime = setTimeout(async () => {
            clearTimeout(setTime);
            action.x = mx;
            action.y = my;
            await Write_action(usr_qq, action);
            e.reply(`${usr_qq}成功抵达${name}`);
        }, 1000 * time);
        e.reply(`正在前往${name}`);
        return;
    };
};