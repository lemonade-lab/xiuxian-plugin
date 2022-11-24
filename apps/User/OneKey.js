import plugin from '../../../../lib/plugins/plugin.js';
import config from '../../model/Config.js';
import { Add_lingshi, existplayer, Read_najie, Write_najie } from '../Xiuxian/Xiuxian.js';
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

    OneKey_all = async (e) => {
        if (!e.isGroup) {
            return;
        };
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
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
        e.reply(`[蜀山派]某弟子:\n你出售了所有物品，共获得${money}灵石`);
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