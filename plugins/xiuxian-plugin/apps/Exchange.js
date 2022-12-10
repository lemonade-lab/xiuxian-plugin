import plugin from '../../../../../lib/plugins/plugin.js';
import { Read_Exchange, ForwardMsg, __PATH, existplayer, Write_Exchange, Write_najie, Read_action, Numbers, exist_najie_thing_name, Read_najie, Add_najie_thing, Read_wealth, Write_wealth, point_map } from '../../../apps/Xiuxian/Xiuxian.js';
export class Exchange extends plugin {
    constructor() {
        super({
            name: 'Exchange',
            dsc: '交易模块',
            event: 'message',
            priority: 600,
            rule: [
                {
                    reg: '^#弱水阁$',
                    fnc: 'supermarket'
                },
                {
                    reg: '^#上架.*$',
                    fnc: 'onsell'
                },
                {
                    reg: '^#下架.*$',
                    fnc: 'Offsell'
                },
                {
                    reg: '^#选购.*$',
                    fnc: 'purchase'
                }
            ]
        });
    };
    supermarket = async (e) => {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const action=await Read_action(usr_qq);
        const address_name='弱水阁';
        const map=await point_map(action,address_name);
        if(!map){
            e.reply(`需回${address_name}`);
            return;
        };
        const Exchange = await Read_Exchange();
        const msg = [
            '___[弱水阁]___\n#上架+物品名*数量*价格\n#选购+编号\n#下架+编号\n不填数量,默认为1'
        ];
        Exchange.forEach((item) => {
            msg.push( `编号:${item.id}\n物品:${item.thing.name}\n数量:${item.thing.acount}\n价格:${item.money}\n`);
        });
        await ForwardMsg(e, msg);
        return;
    };
    onsell = async (e) => {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const action=await Read_action(usr_qq);
        const address_name='弱水阁';
        const map=await point_map(action,address_name);
        if(!map){
            e.reply(`需回${address_name}`);
            return;
        };
        const thing = e.msg.replace('#上架', '');
        const code = thing.split('\*');
        const [thing_name,thing_acount,thing_money] = code;//价格
        const the={
            quantity:0,
            money:0
        };
        the.quantity = await Numbers(thing_acount);
        if (the.quantity > 99) {
            the.quantity = 99;
        };
        the.money = await Numbers(thing_money);
        if (the.money < 10) {
            the.money = 10;
        };
        const najie_thing = await exist_najie_thing_name(usr_qq, thing_name);
        if (najie_thing == 1) {
            e.reply(`没有[${thing_name}]`);
            return;
        };
        if (najie_thing.acount < the.quantity) {
            e.reply(`[${thing_name}]不够`);
            return;
        };
        najie_thing.acount = the.quantity;
        const exchange = await Read_Exchange();
        const sum=Math.floor((Math.random() * (99 - 1) + 1));
        exchange.push({
            'id': `${usr_qq}${sum}`,
            'QQ': usr_qq,
            'thing': najie_thing,
            'x': action.x,
            'y': action.y,
            'z': action.z,
            'money': the.money * the.quantity
        });
        await Write_Exchange(exchange);
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, najie_thing, -the.quantity);
        await Write_najie(usr_qq, najie);
        e.reply(`成功上架:${najie_thing.name}*${najie_thing.acount}`);
        return;
    };
    Offsell = async (e) => {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const action=await Read_action(usr_qq);
        const address_name='弱水阁';
        const map=await point_map(action,address_name);
        if(!map){
            e.reply(`需回${address_name}`);
            return;
        };
        let thingid = e.msg.replace('#下架', '');
        thingid = await Numbers(thingid);
        let x = 888888888;
        let exchange = await Read_Exchange();
        for (var i = 0; i < exchange.length; i++) {
            if (exchange[i].id == thingid) {
                x = i;
                break;
            }
        };
        if (x == 888888888) {
            e.reply('找不到该商品编号');
            return;
        };
        if (exchange[x].QQ != usr_qq) {
            return;
        };
        let najie = await Read_najie(usr_qq);
        if(najie.thing.length>21){
        e.reply("储物袋已满");
            return;
        };
        najie = await Add_najie_thing(najie, exchange[x].thing, exchange[x].thing.acount);
        await Write_najie(usr_qq, najie);
        exchange = exchange.filter(item => item.id != thingid);
        await Write_Exchange(exchange);
        e.reply("成功下架" + thingid);
        return;
    };
    purchase = async (e) => {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const action=await Read_action(usr_qq);
        const address_name='弱水阁';
        const map=await point_map(action,address_name);
        if(!map){
            e.reply(`需回${address_name}`);
            return;
        };
        let thingid = e.msg.replace('#选购', '');
        thingid = await Numbers(thingid);
        let x = 888888888;
        let exchange = await Read_Exchange();
        for (var i = 0; i < exchange.length; i++) {
            if (exchange[i].id == thingid) {
                x = i;
                break;
            }
        };
        if (x == 888888888) {
            e.reply('找不到该商品编号');
            return;
        };
        const wealth = await Read_wealth(usr_qq);
        if (wealth.lingshi < exchange[x].money) {
            e.reply('资金不足');
            return;
        };
        let najie = await Read_najie(usr_qq);
        if(najie.thing.length>21){
        e.reply("储物袋已满");
            return;
        };
        wealth.lingshi -= exchange[x].money;
        await Write_wealth(usr_qq, wealth);
        const newwealth = await Read_wealth(exchange[x].QQ);
        newwealth.lingshi += exchange[x].money;
        await Write_wealth(exchange[x].QQ, newwealth);
        najie = await Add_najie_thing(najie, exchange[x].thing, exchange[x].thing.acount);
        await Write_najie(usr_qq, najie);
        exchange = exchange.filter(item => item.id != thingid);
        await Write_Exchange(exchange);
        e.reply(`成功选购${thingid}`);
        return;
    };
};