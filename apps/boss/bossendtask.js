import { plugin, name, dsc } from "../../api/api.js";
import config from "../../model/config.js";
export class bossendtask extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [],
    });
    this.set = config.getconfig("task", "task");
    this.task = {
      cron: this.set.BossEndTask,
      name: "BossEndTask",
      fnc: () => this.Bossendtask(),
    };
  }
  async Bossendtask() {
    //boss分为金角大王、银角大王、魔王
    //魔王boss
    await redis.set("BossMaxplus", 1);
    await redis.del("BossMaxplus");
    //金角大王
    await redis.set("BossMax", 1);
    await redis.del("BossMax");
    //银角大王
    await redis.set("BossMini", 1);
    await redis.del("BossMini");
    return false;
  }
}
