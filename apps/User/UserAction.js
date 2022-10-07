
import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import * as Xiuxian from '../Xiuxian/Xiuxian.js'
import { get_najie_img } from '../ShowImeg/showData.js'
/**
 * 交易系统
 */
export class UserAction extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'UserAction',
            /** 功能描述 */
            dsc: 'UserAction',
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 600,
            rule: [
                {
                    reg: '^#储物袋$',
                    fnc: 'Show_najie'
                },
                {
                    reg: '^#升级储物袋$',
                    fnc: 'Lv_up_najie'
                },
            ]
        })
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
    }


    //#我的纳戒
    async Show_najie(e) {
        if (!e.isGroup) {
            return;
        }
        let usr_qq = e.user_id;
        let ifexistplay = await Xiuxian.existplayer(usr_qq);
        if (!ifexistplay) {
            return;
        }
        let img = await get_najie_img(e);
        e.reply(img);
        return;
    }


    async Lv_up_najie(e) {
        let Go=await Xiuxian.Go(e);
        if (!Go) {
            return;
        }
        let usr_qq = e.user_id;
        
        let najie = await Xiuxian.Read_najie(usr_qq);
        let player = await Xiuxian.Read_player(usr_qq);
        let najie_num = this.xiuxianConfigData.najie_num
        let najie_price = this.xiuxianConfigData.najie_price
        if (najie.grade == najie_num.length) {
            e.reply("你的纳戒已经是最高级的了")
            return;
        }
        if (player.lingshi < najie_price[najie.grade]) {
            e.reply(`灵石不足,还需要准备${najie_price[najie.grade] - player.lingshi}灵石`)
            return;
        }
        await Xiuxian.Add_lingshi(usr_qq, -najie_price[najie.grade]);
        najie.lingshimax = najie_num[najie.grade];
        najie.grade += 1;
        await Xiuxian.Write_najie(usr_qq, najie);
        e.reply(`你的纳戒升级成功,花了${najie_price[najie.grade - 1]}灵石,目前纳戒灵石存储上限为${najie.lingshimax}`)
        return;
    }

}