import { plugin, config } from '../../api/api.js';
import { Write_shop, Read_shop } from '../../model/xiuxian.js';

export class ShopGradetask extends plugin {
  constructor() {
    super({
      name: 'ShopGradetask',
      dsc: '定时任务',
      event: 'message',
      rule: [],
    });
    this.set = config.getConfig('task', 'task');
    this.task = {
      cron: this.set.ExchangeTask,
      name: 'ShopGradetask',
      fnc: () => this.ShopGradetask(),
    };
  }
  async ShopGradetask() {
    let shop = await Read_shop();
    for (var i = 0; i < shop.length; i++) {
      shop[i].Grade--;
      if (shop[i].Grade < 1) {
        shop[i].Grade = 1;
      }
    }
    await Write_shop(shop);
  }
}
