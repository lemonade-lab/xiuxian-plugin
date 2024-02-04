import { Write_shop, Read_shop, getConfig } from '../../model/index.js'
import { plugin } from '../../../import.js'
export class ShopGradetask extends plugin {
  constructor() {
    super({
      name: 'ShopGradetask',
      dsc: '定时任务',
      event: 'message',
      rule: []
    })
    this.set = getConfig('task', 'task')
    this.task = {
      cron: this.set.ExchangeTask,
      name: 'ShopGradetask',
      fnc: () => this.ShopGradetask()
    }
  }
  async ShopGradetask() {
    let shop = await Read_shop()
    if (Array.isArray(shop)) {
      for (let i = 0; i < shop.length; i++) {
        shop[i].Grade--
        if (shop[i].Grade < 1) {
          shop[i].Grade = 1
        }
      }
    }
    await Write_shop(shop)
  }
}
