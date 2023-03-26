import plugin from '../../../../lib/plugins/plugin.js';
import common from '../../../../lib/common/common.js';
import config from '../../model/Config.js';
import fs from 'node:fs';
import {
  Add_najie_thing,
  Write_Exchange,
  Read_Exchange,
} from '../../model/xiuxian.js';
import { AppName } from '../../app.config.js';
/**
 * 定时任务
 */

export class ExchangeTask extends plugin {
  constructor() {
    super({
      name: 'ExchangeTask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: [],
    });
    this.set = config.getdefSet('task', 'task');
    this.task = {
      cron: this.set.ExchangeTask,
      name: 'ExchangeTask',
      fnc: () => this.Exchangetask(),
    };
  }

  async Exchangetask() {
    let Exchange;
    try {
      Exchange = await Read_Exchange();
    } catch {
      //没有表要先建立一个！
      await Write_Exchange([]);
      Exchange = await Read_Exchange();
    }

    for (var i = 0; i < Exchange.length; i++) {
      //自我清除
      let tmp_exchange = Exchange.filter(item => item.qq == Exchange[i].qq);
      for (let ex of tmp_exchange) {
        Add_najie_thing(item.qq, item.name.name, item.name.class, item.amount);
      }
      Exchange = Exchange.filter(item => item.qq != Exchange[i].qq);
      await Write_Exchange(Exchange);
    }

    //遍历所有人，清除redis
    let playerList = [];
    let files = fs
      .readdirSync('./plugins/' + AppName + '/resources/data/xiuxian_player')
      .filter(file => file.endsWith('.json'));
    for (let file of files) {
      file = file.replace('.json', '');
      playerList.push(file);
    }
    for (let player_id of playerList) {
      await redis.set('xiuxian:player:' + player_id + ':Exchange', 0);
    }
    return;
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
