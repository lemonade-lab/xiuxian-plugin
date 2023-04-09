import { plugin, config } from '../../api/api.js';
import {
  Add_najie_thing,
  Write_Exchange,
  Read_Exchange,
} from '../../model/xiuxian.js';
export class ExchangeTask extends plugin {
  constructor() {
    super({
      name: 'ExchangeTask',
      dsc: '定时任务',
      event: 'message',
      priority: 300,
      rule: [],
    });
    this.set = config.getConfig('task', 'task');
    this.task = {
      cron: this.set.AutoBackUpTask,
      name: 'ExchangeTask',
      fnc: () => this.Exchangetask(),
    };
  }
  async Exchangetask() {
    let Exchange;
    try {
      Exchange = await Read_Exchange();
    } catch {
      await Write_Exchange([]);
      Exchange = await Read_Exchange();
    }
    const now_time = new Date().getTime();
    for (let i = 0; i < Exchange.length; i++) {
      const time = (now_time - Exchange[i].now_time) / 24 / 60 / 60 / 1000;
      if (time < 3) break;
      const usr_qq = Exchange[i].qq;
      let thing = Exchange[i].name.name;
      const quanity = Exchange[i].aconut;
      if (Exchange[i].name.class == '装备' || Exchange[i].name.class == '仙宠')
        thing = Exchange[i].name;
      await Add_najie_thing(
        usr_qq,
        thing,
        Exchange[i].name.class,
        quanity,
        Exchange[i].name.pinji
      );
      Exchange.splice(i, 1);
      i--;
    }
    await Write_Exchange(Exchange);
    return false;
  }
}
