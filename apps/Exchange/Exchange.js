
import plugin from '../../../../lib/plugins/plugin.js'
import { Read_Exchange,ForwardMsg,__PATH,existplayer, Write_Exchange, Write_najie,
        Read_action,Numbers,exist_najie_thing_name,Write_action,Read_najie,
        Add_najie_thing} from '../Xiuxian/Xiuxian.js'
/**
 * 交易系统
 */
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
        })
    }

    async supermarket(e) {
        let Exchange = await Read_Exchange();
        let msg = [
            "___[弱水阁]___\n#上架+物品名*价格*数量\n#选购+编号\n#下架+编号\n不填数量，默认为1"
        ];
        Exchange.forEach((item)=>{
            msg.push(
                "编号:"+item.id+"\n"+
                "物品:"+item.thing.name+"\n"+
                "数量:"+item.thing.acount+"\n"+
                "价格:"+item.money+"\n");
        })
        await ForwardMsg(e, msg);
        return;
    }
   
    //上架
    async onsell(e) {
        let usr_qq = e.user_id;
        let ifexistplay = await existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        };
        let thing = e.msg.replace("#上架", '');
        let code = thing.split("\*");
        let thing_name = code[0];//物品
        let thing_acount = code[1];//数量
        let thing_money = code[2];//价格
        let quantity = await Numbers(thing_acount);
        if (quantity > 99) {
            quantity = 99;
        };
        let money=await Numbers(thing_money);
        if (quantity < 10) {
            quantity = 10;
        };
        let najie_thing = await exist_najie_thing_name(thing_name);
        if (najie_thing == 1) {
            e.reply(`没有[${thing_name}]`);
            return;
        };
        if (najie_thing.acount < quantity ) {
            e.reply(`[${thing_name}]不够`);
            return;
        };
        //看看可上架次数
        let action=await Read_action(player_id); 
        if(action.Exchange>=3){
            e.reply("有其他物品未售出")
            return;
        }
        najie_thing.acount=quantity;
        let exchange={
            "id":usr_qq+1,
            "QQ":usr_qq,
            "thing":[
                najie_thing
            ],
            //位面:读取
            "x":action.x,
            "y":action.y,
            "z":action.z,
            "money":money*quantity
        }
        await Write_Exchange(exchange);
        action.Exchange=action.Exchange+1;
        await Write_action(player_id,action);
        let najie = await Read_najie(usr_qq);
        najie = await Add_najie_thing(najie, searchsthing, -quantity);
        await Write_najie(usr_qq, najie);
        return;
    };

    async Offsell(e) {
        e.reply("待更新");
        return;
    };

    async purchase(e) {
        e.reply("待更新");
        return;
    };

}





