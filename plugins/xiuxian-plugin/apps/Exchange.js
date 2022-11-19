import plugin from '../../../../../lib/plugins/plugin.js';
import { Read_Exchange,ForwardMsg,__PATH,existplayer, Write_Exchange, Write_najie, Read_action,Numbers,exist_najie_thing_name,Write_action,Read_najie,Add_najie_thing,Read_wealth,Write_wealth} from '../../../apps/Xiuxian/Xiuxian.js';
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
    async supermarket(e) {
        const Exchange = await Read_Exchange();
        const msg = [
            "___[弱水阁]___\n#上架+物品名*数量*价格\n#选购+编号\n#下架+编号\n不填数量，默认为1"
        ];
        Exchange.forEach((item)=>{
            msg.push(
                "编号:"+item.id+"\n"+
                "物品:"+item.thing.name+"\n"+
                "数量:"+item.thing.acount+"\n"+
                "价格:"+item.money+"\n");
        });
        await ForwardMsg(e, msg);
        return;
    }
    async onsell(e) {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        const thing = e.msg.replace("#上架", '');
        const code = thing.split("\*");
        const thing_name = code[0];//物品
        const thing_acount = code[1];//数量
        const thing_money = code[2];//价格
        let quantity = await Numbers(thing_acount);
        if (quantity > 99) {
            quantity = 99;
        };
        let money=await Numbers(thing_money);
        if (money < 10) {
            money = 10;
        };
        const najie_thing = await exist_najie_thing_name(usr_qq,thing_name);
        if (najie_thing == 1) {
            e.reply(`没有[${thing_name}]`);
            return;
        };
        if (najie_thing.acount < quantity ) {
            e.reply(`[${thing_name}]不够`);
            return;
        };
        const action=await Read_action(usr_qq); 
        if(action.Exchange>=3){
            e.reply("有其他物品未售出")
            return;
        }
        najie_thing.acount=quantity;
        const exchange=await Read_Exchange();
        exchange.push({
            "id":usr_qq+Math.floor((Math.random() * (99-1)+1)),
            "QQ":usr_qq,
            "thing":najie_thing,
            "x":action.x,
            "y":action.y,
            "z":action.z,
            "money":money*quantity
        });
        await Write_Exchange(exchange);
        action.Exchange=action.Exchange+1;
        await Write_action(usr_qq,action);
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, najie_thing, -quantity);
        await Write_najie(usr_qq, najie);
        e.reply("成功上架:"+najie_thing.name+"*"+najie_thing.acount);
        return;
    };
    async Offsell(e) {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        let thingid = e.msg.replace("#下架", '');
        thingid = await Numbers(thingid);
        let x = 888888888;
        let exchange  = await Read_Exchange();
        for (var i = 0; i < exchange.length; i++) {
            if (exchange[i].id == thingid) {
                x = i;
                break;
            }
        };
        if (x == 888888888) {
            e.reply("找不到该商品编号！");
            return;
        };
        if(exchange[x].QQ!=usr_qq){
            return;
        };
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, exchange[x].thing, exchange[x].thing.acount);
        await Write_najie(usr_qq, najie);
        exchange = exchange.filter(item => item.id != thingid);
        await Write_Exchange(exchange);
        e.reply("成功下架"+thingid);
        return;
    };
    async purchase(e) {
        const usr_qq = e.user_id;
        const ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        let thingid = e.msg.replace("#选购", '');
        thingid = await Numbers(thingid);
        let x = 888888888;
        let exchange  = await Read_Exchange();
        for (var i = 0; i < exchange.length; i++) {
            if (exchange[i].id == thingid) {
                x = i;
                break;
            }
        };
        if (x == 888888888) {
            e.reply("找不到该商品编号！");
            return;
        };

        let wealth=await Read_wealth(usr_qq);
        if(wealth.lingshi<exchange[x].money){
            e.reply("资金不足");
            return;
        };
        wealth.lingshi-=exchange[x].money;
        await Write_wealth(usr_qq,wealth);

        let newwealth=await Read_wealth(exchange[x].QQ);
        newwealth.lingshi+=exchange[x].money;
        await Write_wealth(exchange[x].QQ,newwealth);

        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, exchange[x].thing, exchange[x].thing.acount);
        await Write_najie(usr_qq, najie);

        exchange = exchange.filter(item => item.id != thingid);
        await Write_Exchange(exchange);
        
        e.reply("成功选购"+thingid);
        return;
    };
};