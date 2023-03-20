import plugin from '../../../../lib/plugins/plugin.js';
import common from '../../../../lib/common/common.js';
import config from '../../model/Config.js';
import {Add_najie_thing,Add_灵石,Read_player,} from '../Xiuxian/xiuxian.js';
import { openAU } from '../Auction/Auction.js';
/**
 * 定时任务
 */

export class AuctionofficialTask extends plugin {
  constructor() {
    super({
      name: 'AuctionofficialTask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: [],
    });
    this.set = config.getConfig('xiuxian', 'xiuxian');
    this.task = {
      cron: config.getdefSet('task', 'task').action_task,
      name: 'AuctionofficialTask',
      fnc: () => this.AuctionofficialTask(),
    };
  }


  async AuctionofficialTask() {
    // 判断是否已经在拍卖中
    const wupinStr = await redis.get('xiuxian:AuctionofficialTask');

    // 如果不在拍卖中
    if (!wupinStr) {
      // 判断是否在开启时间
      const nowDate = new Date();
      const todayDate = new Date(nowDate);
      const { openHour, closeHour } = this.set.Auction;
      const todayTime = todayDate.setHours(0, 0, 0, 0);
      const openTime = todayTime + openHour * 60 * 60 * 1000;
      const nowTime = nowDate.getTime();
      const closeTime = todayTime + closeHour * 60 * 60 * 1000;
      if (nowTime < openTime || nowTime > closeTime) return;

      // 在开启时间且未开启拍卖则开启拍卖
      const auction = await openAU();
      let msg = `___[星阁]___\n目前正在拍卖【${auction.thing.name}】\n`;
      if (auction.last_offer_player === 0) {
        msg += '暂无人出价';
      } else {
        const player = await Read_player(auction.last_offer_player);
        msg += `最高出价是${player.名号}叫出的${auction.last_price}`;
      }
      auction.groupList.forEach(group_id => this.pushInfo(group_id, true, msg));
      return;
    }

    // 如果已在拍卖中
    const wupin = JSON.parse(wupinStr);
    let msg = '';
    const group_ids = wupin.groupList;
    const last_offer_price = wupin.last_offer_price;
    const interMinu = this.set.Auction.interval;
    const nowTime = new Date().getTime();

    if (wupin.last_offer_price + interMinu * 60 * 1000 > nowTime) {
      const m = parseInt(
        (last_offer_price + interMinu * 60 * 1000 - nowTime) / 1000 / 60
      );
      const s = parseInt(
        (last_offer_price + interMinu * 60 * 1000 - nowTime - m * 60 * 1000) /
          1000
      );
      msg = `星阁限定物品【${wupin.thing.name}】拍卖中\n距离拍卖结束还有${m}分${s}秒\n目前最高价${wupin.last_price}`;

      for (const group_id of group_ids) {
        this.pushInfo(group_id, true, msg);
      }
    } else {
      const last_offer_player = wupin.last_offer_player;
      if (last_offer_player === 0) {
        msg = `流拍，${wupin.thing.name}已退回神秘人的纳戒`;
      } else {
        await Add_灵石(last_offer_player, -wupin.last_price);
        await Add_najie_thing(
          last_offer_player,
          wupin.thing.name,
          wupin.thing.class,
          wupin.amount,
          wupin.thing.pinji
        );
        const player = await Read_player(last_offer_player);
        msg = `拍卖结束，${player.名号}最终拍得该物品！`;
      }

      for (const group_id of group_ids) {
        this.pushInfo(group_id, true, msg);
      }
      await redis.del('xiuxian:AuctionofficialTask');
    }
  }

  /**
   * 推送消息，群消息推送群，或者推送私人
   * @param id
   * @param is_group
   * @returns {Promise<void>}
   */
  async pushInfo(id, is_group, msg) {
    if (is_group) {
      await Bot.pickGroup(id)
        .sendMsg(msg)
        .catch(err => {
          Bot.logger.mark(err);
        });
    } else {
      await common.relpyPrivate(id, msg);
    }
  }
}
