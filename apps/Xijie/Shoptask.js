import { plugin, config, data } from '../../api/api.js';
import { Write_shop, Read_shop } from '../../model/xiuxian.js';

export class Shoptask extends plugin {
  constructor() {
    super({
      name: 'Shoptask',
      dsc: '定时任务',
      event: 'message',
      rule: [],
    });
    this.set = config.getConfig('task', 'task');
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
