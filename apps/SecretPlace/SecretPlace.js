//插件加载
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import { Go, Read_action, Read_level, Write_action} from '../Xiuxian/Xiuxian.js'
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
                    reg: '^#前往.*$',
                    fnc: 'forward'
                },
                {
                    reg: '^#移动.*$',
                    fnc: 'move'
                },
                {
                    reg: '^#击杀$',
                    fnc: 'Kill'
                }
            ]
        })
    }

    async Xiuxianstate(e) {
        await Go(e);
        return;
    }

    async xyzaddress(e) {
        let usr_qq = e.user_id;
        let action = await Read_action(usr_qq);
        e.reply("坐标(" + action.x + "," + action.y + "," + action.z + ")");
        return;
    }

    async Kill(e) {
        e.reply("待更新");
        return;
    }

    async forward(e) {
        let good = await Go(e);
        if (!good) {
            return;
        };
        let address = e.msg.replace("#前往", '');
        let place = data.position_list.find(item => item.name == address);
        if (!place) {
            return;
        };
        let usr_qq = e.user_id;
        let level = await Read_level(usr_qq);
        if (level.level_id < place.grade) {
            e.reply("前面的区域，以后再来探索吧！");
            return;
        };
        let action = await Read_action(usr_qq);
        action.x =  Math.floor((Math.random() * (place.x2 - place.x1))) + Number(place.x1);
        action.y = Math.floor((Math.random() * (place.y2 - place.y1))) + Number(place.y1);
        action.z = 0;
        console.log(action);
        await Write_action(usr_qq,action);
        e.reply("成功抵达" + place.name);
        return;
    }

    async move(e) {
        e.reply("待更新");
        return;
    }

}
