import { plugin,verc } from "../../api/api.js";
import { __PATH } from "../../model/xiuxian.js";
import data from "../../model/XiuxianData.js";
import {
  existplayer,
  Read_player,
  exist_najie_thing,
  Add_najie_thing,
  Write_player,
} from "../../model/xiuxian.js";
export class motou extends plugin {
  constructor() {
    super({
      name: "motou",
      dsc: "交易模块",
      event: "message",
      priority: 600,
      rule: [
        {
          reg: "^#供奉魔石$",
          fnc: "add_lingeng",
        },
        {
          reg: "^#堕入魔界$",
          fnc: "mojie",
        },
        {
          reg: "^#献祭魔石$",
          fnc: "xianji",
        },
      ],
    });
  }

  async add_lingeng(e) {
    if (!e.isGroup) return false;
    if (!verc({ e })) return false;
    //固定写法
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) return;
    let player = await Read_player(usr_qq);
    if (player.魔道值 < 1000) {
      e.reply("你不是魔头");
      return;
    }
    let x = await exist_najie_thing(usr_qq, "魔石", "道具");
    if (!x) {
      e.reply("你没有魔石");
      return;
    }
    if (player.灵根.type != "魔头") {
      /** 设置上下文 */
      this.setContext("RE_lingeng");
      /** 回复 */
      await e.reply(
        "一旦转为魔根,将会舍弃当前灵根。回复:【放弃魔根】或者【转世魔根】进行选择",
        false,
        { at: true }
      );
      return;
    }
    let random = Math.random();
    if (player.灵根.name == "一重魔功") {
      if (x < 20) {
        e.reply("魔石不足20个,当前魔石数量" + x + "个");
        return;
      }
      await Add_najie_thing(usr_qq, "魔石", "道具", -20);
      if (random < 0.9) {
        player.灵根 = {
          id: 100992,
          name: "二重魔功",
          type: "魔头",
          eff: 0.42,
          法球倍率: 0.27,
        };
        await Write_player(usr_qq, player);
        e.reply("恭喜你,灵根突破成功,当前灵根二重魔功!");
        return;
      } else {
        e.reply("灵根突破失败");
        return;
      }
    } else if (player.灵根.name == "二重魔功") {
      if (x < 30) {
        e.reply("魔石不足30个,当前魔石数量" + x + "个");
        return;
      }
      await Add_najie_thing(usr_qq, "魔石", "道具", -30);
      if (random < 0.8) {
        player.灵根 = {
          id: 100993,
          name: "三重魔功",
          type: "魔头",
          eff: 0.48,
          法球倍率: 0.31,
        };
        await Write_player(usr_qq, player);
        e.reply("恭喜你,灵根突破成功,当前灵根三重魔功!");
        return;
      } else {
        e.reply("灵根突破失败");
        return;
      }
    } else if (player.灵根.name == "三重魔功") {
      if (x < 30) {
        e.reply("魔石不足30个,当前魔石数量" + x + "个");
        return;
      }
      await Add_najie_thing(usr_qq, "魔石", "道具", -30);
      if (random < 0.7) {
        player.灵根 = {
          id: 100994,
          name: "四重魔功",
          type: "魔头",
          eff: 0.54,
          法球倍率: 0.36,
        };
        await Write_player(usr_qq, player);
        e.reply("恭喜你,灵根突破成功,当前灵根四重魔功!");
        return;
      } else {
        e.reply("灵根突破失败");
        return;
      }
    } else if (player.灵根.name == "四重魔功") {
      if (x < 40) {
        e.reply("魔石不足40个,当前魔石数量" + x + "个");
        return;
      }
      await Add_najie_thing(usr_qq, "魔石", "道具", -40);
      if (random < 0.6) {
        player.灵根 = {
          id: 100995,
          name: "五重魔功",
          type: "魔头",
          eff: 0.6,
          法球倍率: 0.4,
        };
        await Write_player(usr_qq, player);
        e.reply("恭喜你,灵根突破成功,当前灵根五重魔功!");
        return;
      } else {
        e.reply("灵根突破失败");
        return;
      }
    } else if (player.灵根.name == "五重魔功") {
      if (x < 40) {
        e.reply("魔石不足40个,当前魔石数量" + x + "个");
        return;
      }
      await Add_najie_thing(usr_qq, "魔石", "道具", -40);
      if (random < 0.5) {
        player.灵根 = {
          id: 100996,
          name: "六重魔功",
          type: "魔头",
          eff: 0.66,
          法球倍率: 0.43,
        };
        await Write_player(usr_qq, player);
        e.reply("恭喜你,灵根突破成功,当前灵根六重魔功!");
        return;
      } else {
        e.reply("灵根突破失败");
        return;
      }
    } else if (player.灵根.name == "六重魔功") {
      if (x < 40) {
        e.reply("魔石不足40个,当前魔石数量" + x + "个");
        return;
      }
      await Add_najie_thing(usr_qq, "魔石", "道具", -40);
      if (random < 0.4) {
        player.灵根 = {
          id: 100997,
          name: "七重魔功",
          type: "魔头",
          eff: 0.72,
          法球倍率: 0.47,
        };
        await Write_player(usr_qq, player);
        e.reply("恭喜你,灵根突破成功,当前灵根七重魔功!");
        return;
      } else {
        e.reply("灵根突破失败");
        return;
      }
    } else if (player.灵根.name == "七重魔功") {
      if (x < 50) {
        e.reply("魔石不足50个,当前魔石数量" + x + "个");
        return;
      }
      await Add_najie_thing(usr_qq, "魔石", "道具", -50);
      if (random < 0.3) {
        player.灵根 = {
          id: 100998,
          name: "八重魔功",
          type: "魔头",
          eff: 0.78,
          法球倍率: 0.5,
        };
        await Write_player(usr_qq, player);
        e.reply("恭喜你,灵根突破成功,当前灵根八重魔功!");
        return;
      } else {
        e.reply("灵根突破失败");
        return;
      }
    } else if (player.灵根.name == "八重魔功") {
      if (x < 50) {
        e.reply("魔石不足50个,当前魔石数量" + x + "个");
        return;
      }
      await Add_najie_thing(usr_qq, "魔石", "道具", -50);
      if (random < 0.2) {
        player.灵根 = {
          id: 100999,
          name: "九重魔功",
          type: "魔头",
          eff: 1.2,
          法球倍率: 1.2,
        };
        await Write_player(usr_qq, player);
        e.reply("恭喜你,灵根突破成功,当前灵根九重魔功!");
        return;
      } else {
        e.reply("灵根突破失败");
        return;
      }
    }
    return;
  }
  async RE_lingeng(e) {
    if (!e.isGroup) return false;
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    let player = await Read_player(usr_qq);
    /** 内容 */
    let new_msg = this.e.message;
    let choice = new_msg[0].text;
    if (choice == "放弃魔根") {
      await this.reply("重拾道心,继续修行");
      /** 结束上下文 */
      this.finish("RE_lingeng");
      return;
    } else if (choice == "转世魔根") {
      var x = await exist_najie_thing(usr_qq, "魔石", "道具");
      if (!x) {
        e.reply("你没有魔石");
        return;
      }
      if (x < 10) {
        e.reply("你魔石不足10个");
        return;
      }
      await Add_najie_thing(usr_qq, "魔石", "道具", -10);
      player.灵根 = {
        id: 100991,
        name: "一重魔功",
        type: "魔头",
        eff: 0.36,
        法球倍率: 0.23,
      };
      await Write_player(usr_qq, player);
      e.reply("恭喜你,转世魔头成功!");
      /** 结束上下文 */
      this.finish("RE_lingeng");
      return;
    }
  }

  async mojie(e) {
    if (!e.isGroup) return false;
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    //查看存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) return;
    let game_action = await redis.get(
      "xiuxian:player:" + usr_qq + ":game_action"
    );
    //防止继续其他娱乐行为
    if (game_action == 0) {
      e.reply("修仙：游戏进行中...");
      return;
    }
    //查询redis中的人物动作
    let action = await redis.get("xiuxian:player:" + usr_qq + ":action");
    action = JSON.parse(action);
    if (action != null) {
      //人物有动作查询动作结束时间
      let action_end_time = action.end_time;
      let now_time = new Date().getTime();
      if (now_time <= action_end_time) {
        let m = parseInt((action_end_time - now_time) / 1000 / 60);
        let s = parseInt((action_end_time - now_time - m * 60 * 1000) / 1000);
        e.reply("正在" + action.action + "中,剩余时间:" + m + "分" + s + "秒");
        return;
      }
    }
    let player = await Read_player(usr_qq);
    if (player.魔道值 < 1000) {
      e.reply("你不是魔头");
      return;
    }
    if (player.修为 < 4000000) {
      e.reply("修为不足");
      return;
    }
    player.魔道值 -= 100;
    player.修为 -= 4000000;
    await Write_player(usr_qq, player);
    var time = 60; //时间（分钟）
    let action_time = 60000 * time; //持续时间，单位毫秒
    let arr = {
      action: "魔界", //动作
      end_time: new Date().getTime() + action_time, //结束时间
      time: action_time, //持续时间
      shutup: "1", //闭关
      working: "1", //降妖
      Place_action: "1", //秘境状态---关闭
      mojie: "0", //魔界状态---关闭
      Place_actionplus: "1", //沉迷秘境状态---关闭
      power_up: "1", //渡劫状态--关闭
      xijie: "1", //洗劫状态开启
      plant: "1", //采药-开启
      mine: "1", //采矿-开启
      cishu: "10",
    };
    if (e.isGroup) {
      arr.group_id = e.group_id;
    }
    await redis.set(
      "xiuxian:player:" + usr_qq + ":action",
      JSON.stringify(arr)
    );
    e.reply("开始进入魔界," + time + "分钟后归来!");
    return;
  }

  async xianji(e) {
    if (!e.isGroup) return false;
    if (!verc({ e })) return false;
    let usr_qq = e.user_id;
    //查看存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) return;
    let player = await Read_player(usr_qq);
    if (player.魔道值 < 1000) {
      e.reply("你不是魔头");
      return;
    }
    let x = await exist_najie_thing(usr_qq, "魔石", "道具");
    if (!x) {
      e.reply("你没有魔石");
      return;
    }
    if (x < 8) {
      e.reply("魔石不足8个,当前魔石数量" + x + "个");
      return;
    }
    await Add_najie_thing(usr_qq, "魔石", "道具", -8);
    let wuping_length;
    let wuping_index;
    let wuping;
    wuping_length = data.xingge[0].one.length;
    wuping_index = Math.trunc(Math.random() * wuping_length);
    wuping = data.xingge[0].one[wuping_index];
    e.reply("获得了" + wuping.name);
    await Add_najie_thing(usr_qq, wuping.name, wuping.class, 1);
    return;
  }
}
