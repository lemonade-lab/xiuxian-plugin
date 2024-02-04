import {
  Add_najie_thing,
  Add_money,
  Read_player,
  openAU,
  getConfig,
  data
} from '../../model/index.js'
import { common, plugin } from '../../../import.js'
import { pushInfo } from '../../model/bot.js'
export class AuctionofficialTask extends plugin {
  constructor() {
    super({
      name: 'AuctionofficialTask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: []
    })
    this.task = {
      cron: data.test.action_task,
      name: 'AuctionofficialTask',
      fnc: () => this.AuctionofficialTask()
    }
  }

  async AuctionofficialTask() {
    // 判断是否已经在拍卖中
    const wupinStr = await redis.get('xiuxian:AuctionofficialTask')

    // 如果不在拍卖中
    if (!wupinStr) {
      // 判断是否在开启时间
      const nowDate = new Date()
      const todayDate = new Date(nowDate)
      const { openHour, closeHour } = getConfig('xiuxian', 'xiuxian').Auction
      const todayTime = todayDate.setHours(0, 0, 0, 0)
      const openTime = todayTime + openHour * 60 * 60 * 1000
      const nowTime = nowDate.getTime()
      const closeTime = todayTime + closeHour * 60 * 60 * 1000
      if (nowTime < openTime || nowTime > closeTime) return false

      // 在开启时间且未开启拍卖则开启拍卖
      const auction = await openAU()
      let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`
      if (auction.last_offer_player === 0) {
        msg += '暂无人出价'
      } else {
        const player = await Read_player(auction.last_offer_player)
        msg += `最高出价是${player.name}叫出the${auction.last_price}`
      }
      auction.groupList.forEach((group_id) =>
        pushInfo(Number(group_id), true, msg)
      )
      return false
    }

    // 如果已在拍卖中
    const wupin = JSON.parse(wupinStr)
    let msg = ''
    const group_ids = wupin.groupList
    const last_offer_price = wupin.last_offer_price
    const interMinu = getConfig('xiuxian', 'xiuxian').Auction.interval
    const nowTime = new Date().getTime()

    if (wupin.last_offer_price + interMinu * 60 * 1000 > nowTime) {
      const m = (last_offer_price + interMinu * 60 * 1000 - nowTime) / 1000 / 60
      const s =
        (last_offer_price + interMinu * 60 * 1000 - nowTime - m * 60 * 1000) /
        1000
      msg = `星阁限定物品【${wupin.thing.name}】拍卖中\n距离拍卖结束还有${m}分${s}秒\n目前最高价${wupin.last_price}`

      for (const group_id of group_ids) {
        pushInfo(group_id, true, msg)
      }
    } else {
      const last_offer_player = wupin.last_offer_player
      if (last_offer_player === 0) {
        msg = `流拍，${wupin.thing.name}已退回神秘人the纳戒`
      } else {
        await Add_money(last_offer_player, -wupin.last_price)
        await Add_najie_thing(
          last_offer_player,
          wupin.thing.name,
          wupin.thing.class,
          wupin.amount,
          wupin.thing.pinji
        )
        const player = await Read_player(last_offer_player)
        msg = `拍卖结束，${player.name}最终拍得该物品！`
      }

      for (const group_id of group_ids) {
        pushInfo(group_id, true, msg)
      }
      await redis.del('xiuxian:AuctionofficialTask')
    }
  }
}
