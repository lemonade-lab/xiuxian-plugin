
import plugin from '../../../../lib/plugins/plugin.js'
import data from '../../model/XiuxianData.js'
import { Go,Read_Exchange,GenerateCD,
    search_thing_name,ForwardMsg,__PATH,Numbers,
    Write_Exchange,Search_Exchange,
    exist_najie_thing,Read_najie} from '../Xiuxian/Xiuxian.js'
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
        let nowtime = new Date().getTime();
        let msg = [
            "___[弱水阁]___\n#上架+物品名*价格*数量\n#选购+编号\n#下架+编号\n不填数量，默认为1"
        ];
        Exchange.forEach(()=>{
            msg.push(nowtime);
        })
        await ForwardMsg(e, msg);
        return;
    }
   
    //上架
    async onsell(e) {
        e.reply("待更新");
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





