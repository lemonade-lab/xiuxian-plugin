import plugin from '../../../../lib/plugins/plugin.js'
import config from "../../model/Config.js"
import { Write_shop,Read_shop} from "../Xijie/Xijie.js"


export class ShopGradetask extends plugin {
    constructor() {
        super({
            name: 'ShopGradetask',
            dsc: '定时任务',
            event: 'message',
            priority: 300,
            rule: [
            ]
        });
        this.xiuxianConfigData = config.getConfig("xiuxian", "xiuxian");
        this.set = config.getdefSet('task', 'task')
        this.task = {
            cron: this.set.ExchangeTask,
            name: 'ShopGradetask',
            fnc: () => this.ShopGradetask()
        }
    }
    async ShopGradetask() {
        let shop=await Read_shop();
        for (var i=0;i<shop.length;i++)
        {
            shop[i].Grade--;
            if (shop[i].Grade<1)
            {
                shop[i].Grade=1;
            }
        }
        await Write_shop(shop);
    }  
}