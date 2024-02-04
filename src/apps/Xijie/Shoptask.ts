import { Write_shop, Read_shop, getConfig, data } from '../../model/index.js'
import { plugin } from '../../../import.js'
/**
 *
 */
export class Shoptask extends plugin {
  constructor() {
    super({
      name: 'Shoptask',
      dsc: '定时任务',
      event: 'message',
      rule: []
    })
    this.task = {
      cron: data.test.shop,
      name: 'Shoptask',
      fnc: () => this.Shoptask()
    }
  }

  /**
   *
   */
  async Shoptask() {
    let shop = await Read_shop()
    if (Array.isArray(shop)) {
      for (let i = 0; i < shop.length; i++) {
        shop[i].one = data.shop_list[i].one
        shop[i].price = data.shop_list[i].price
      }
    }
    await Write_shop(shop)
  }
}
