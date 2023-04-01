import { plugin, common, segment ,puppeteer} from '../../api/api.js';
import config from '../../model/Config.js';
import data from '../../model/XiuxianData.js';
import { Write_shop, Read_shop } from '../../model/xiuxian.js';

export class Shoptask extends plugin {
  constructor() {
    super({
      name: 'Shoptask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: [],
    });
    this.xiuxianConfigData = config.getConfig('xiuxian', 'xiuxian');
    this.set = config.getdefSet('task', 'task');
    this.task = {
      cron: this.set.shop,
      name: 'Shoptask',
      fnc: () => this.Shoptask(),
    };
  }
  async Shoptask() {
    let shop = await Read_shop();
    for (var i = 0; i < shop.length; i++) {
      shop[i].one = data.shop_list[i].one;
      shop[i].price = data.shop_list[i].price;
    }
    await Write_shop(shop);
  }
}
