import plugin from '../../../../lib/plugins/plugin.js';
import config from '../../model/Config.js';
import { Add_lingshi, existplayer,point_map,Read_action, Read_najie, Write_najie } from '../Xiuxian/Xiuxian.js';
export class OneKey extends plugin {
    constructor() {
        super({
            name: 'OneKey',
            dsc: 'OneKey',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#一键出售所有$',
                    fnc: 'OneKey_all'
                },
                {
                    reg: '^#一键出售.*$',
                    fnc: 'OneKey_key'
                }
            ]
        });
        this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian');
    };

    /**
     * 此功能需要去#万宝楼
     * 装备物品个数需要控制！
     */

    OneKey_all = async (e) => {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const action=await Read_action(usr_qq);
        const address_name='万宝楼';
        const map=await point_map(action,address_name);
        if(!map){
            e.reply(`需回${address_name}`);
            return;
        };
        let najie = await Read_najie(usr_qq);
        let money = 0;
        for (let item of najie.thing) {
            money += item.acount * item.price;
        };
        await Add_lingshi(usr_qq, money);
        najie.thing = [];
        await Write_najie(usr_qq, najie);
        e.reply(`[蜀山派]叶铭\n这是${money}灵石,道友慢走`);
        return;
    };
    OneKey_key = async (e) => {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        return;
    };
};