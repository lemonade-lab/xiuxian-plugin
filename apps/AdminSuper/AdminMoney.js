import plugin from '../../../../lib/plugins/plugin.js';
import { __PATH, At, Numbers, Add_lingshi, Read_wealth, search_thing_name, Read_najie, Add_najie_thing, Write_najie, Write_wealth } from '../Xiuxian/Xiuxian.js';
export class AdminMoney extends plugin {
    constructor() {
        super({
            name: 'AdminMoney',
            dsc: 'AdminMoney',
            event: 'message',
            priority: 400,
            rule: [
                {
                    reg: '^#扣除.*$',
                    fnc: 'Deduction'
                },
                {
                    reg: '^#补偿.*$',
                    fnc: 'Fuli'
                },
                {
                    reg: '^#馈赠.*$',
                    fnc: 'gifts'
                }
            ],
        });
    };
    gifts = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const B = await At(e);
        if (B == 0) {
            return;
        };
        const thing_name = e.msg.replace('#馈赠', '');
        const searchsthing = await search_thing_name(thing_name);
        if (searchsthing == 1) {
            e.reply(`世界没有${thing_name}`);
            return;
        };
        let najie = await Read_najie(B);
        najie = await Add_najie_thing(najie, searchsthing, 1);
        await Write_najie(B, najie);
        e.reply(`${B}获得馈赠:${thing_name}`);
        return;
    };
    Deduction = async (e) => {
        if (!e.isMaster) {
            return;
        };
        const B = await At(e);
        if (B == 0) {
            return;
        };
        let lingshi = e.msg.replace('#扣除', '');
        lingshi = await Numbers(lingshi);
        const player = await Read_wealth(B);
        if (player.lingshi < lingshi) {
            e.reply('他好穷的');
            return;
        };
        player.lingshi -= lingshi;
        await Write_wealth(B, player);
        e.reply(`已扣除灵石${lingshi}`);
        return;
    };
    Fuli = async (e) => {
        if (!e.isMaster) {
            return;
        };
        let lingshi = e.msg.replace('#补偿', '');
        lingshi = await Numbers(lingshi);
        const B = await At(e);
        if (B == 0) {
            return;
        };
        await Add_lingshi(B, lingshi);
        e.reply(`${B}获得${lingshi}灵石的补偿`);
        return;
    };
};