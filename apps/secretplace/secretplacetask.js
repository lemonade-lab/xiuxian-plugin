import { plugin, segment, common, name, dsc } from "../../api/api.js";
import config from "../../model/config.js";
import data from "../../model/xiuxiandata.js";
import fs from "fs";
import { AppName } from "../../app.config.js";
import {
  Read_player,
  isNotNull,
  get_random_talent,
  Getmsg_battle,
  Add_najie_thing,
  Add_修为,
  Add_血气,
  Add_HP,
} from "../../model/xiuxian.js";
export class secretplacetask extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [],
    });
    this.set = config.getconfig("task", "task");
    this.task = {
      cron: this.set.action_task,
      name: "SecretPlaceTask",
      fnc: () => this.secretplacetask(),
    };
  }

  async secretplacetask() {
    //获取缓存中人物列表
    let playerList = [];
    let files = fs
      .readdirSync("./plugins/" + AppName + "/resources/data/xiuxian_player")
      .filter((file) => file.endsWith(".json"));
    for (let file of files) {
      file = file.replace(".json", "");
      playerList.push(file);
    }
    for (let player_id of playerList) {
      let log_mag = ""; //查询当前人物动作日志信息
      log_mag = log_mag + "查询" + player_id + "是否有动作,";
      //得到动作

      let action = await redis.get("xiuxian:player:" + player_id + ":action");
      action = await JSON.parse(action);
      //不为空，存在动作

      if (action != null) {
        let push_address; //消息推送地址
        let is_group = false; //是否推送到群

        if (await action.hasOwnProperty("group_id")) {
          if (isNotNull(action.group_id)) {
            is_group = true;
            push_address = action.group_id;
          }
        }

        //最后发送的消息
        let msg = [segment.at(player_id)];
        //动作结束时间
        let end_time = action.end_time;
        //现在的时间
        let now_time = new Date().getTime();
        //用户信息
        let player = await Read_player(player_id);

        //有秘境状态:这个直接结算即可
        if (action.Place_action == "0") {
          //这里改一改,要在结束时间的前两分钟提前结算
          end_time = end_time - 60000 * 2;
          //时间过了
          if (now_time > end_time) {
            let weizhi = action.Place_address;
            if (player.灵根 == null || player.灵根 == undefined) {
              player.灵根 = await get_random_talent();
              player.修炼效率提升 += player.灵根.eff;
            }
            data.setData("player", player_id, player);
            let A_player = {
              名号: player.名号,
              攻击: player.攻击,
              防御: player.防御,
              当前血量: player.当前血量,
              暴击率: player.暴击率,
              法球倍率: player.灵根.法球倍率,
            };
            let monster_length = data.monster_list.length;
            let monster_index = Math.trunc(Math.random() * monster_length);
            let monster = data.monster_list[monster_index];
            let B_player = {
              名号: monster.名号,
              攻击: parseInt(player.攻击 * monster.攻击),
              防御: parseInt(player.防御 * monster.防御),
              当前血量: parseInt(player.血量上限 * monster.当前血量),
              暴击率: monster.暴击率,
              法球倍率: 0,
            };
            let Data_battle = await Getmsg_battle(A_player, B_player);
            let msgg = Data_battle.msg;
            let A_win = `${A_player.名号}击败了${B_player.名号}`;
            let B_win = `${B_player.名号}击败了${A_player.名号}`;
            var thing_name;
            var thing_class;
            const xiuxaindata = config.getconfig("xiuxian", "xiuxian");
            var x = xiuxaindata.SecretPlace.one;
            let random1 = Math.random();
            var y = xiuxaindata.SecretPlace.two;
            let random2 = Math.random();
            var z = xiuxaindata.SecretPlace.three;
            let random3 = Math.random();
            let random4;
            var m = "";
            //查找秘境
            if (random1 <= x) {
              if (random2 <= y) {
                if (random3 <= z) {
                  random4 = Math.floor(Math.random() * weizhi.three.length);
                  thing_name = weizhi.three[random4].name;
                  thing_class = weizhi.three[random4].class;
                  m = "抬头一看，金光一闪！[" + thing_name + "]从天而降";
                } else {
                  random4 = Math.floor(Math.random() * weizhi.two.length);
                  thing_name = weizhi.two[random4].name;
                  thing_class = weizhi.two[random4].class;
                  m = "在洞穴中拿到[" + thing_name + "]";
                }
              } else {
                random4 = Math.floor(Math.random() * weizhi.one.length);
                thing_name = weizhi.one[random4].name;
                thing_class = weizhi.one[random4].class;
                m = "捡到了[" + thing_name + "] ";
              }
            } else {
              thing_name = "";
              thing_class = "";
              m = "走在路上都没看见一只蚂蚁！";
            }
            let last_msg;
            let xiuwei = 0;
            //默认结算装备数
            var n = 1;

            let now_level_id;
            if (!isNotNull(player.level_id)) {
              return false;
            }
            now_level_id = data.level_list.find(
              (item) => item.level_id == player.level_id
            ).level_id;
            //结算
            if (msgg.find((item) => item == A_win)) {
              xiuwei = parseInt(2000 + now_level_id * now_level_id);
              if (thing_name != "" || thing_class != "") {
                await Add_najie_thing(player_id, thing_name, thing_class, n);
              }
              last_msg =
                m +
                "不巧撞见[" +
                B_player.名号 +
                "],经过一番战斗,击败对手,获得修为" +
                xiuwei +
                "]";
            } else if (msgg.find((item) => item == B_win)) {
              xiuwei = 800;
              last_msg =
                "不巧撞见[" +
                B_player.名号 +
                "],经过一番战斗,败下阵来,还好跑得快,只获得了修为" +
                xiuwei +
                "]";
            } else {
              return false;
            }

            msg.push("\n" + player.名号 + last_msg);
            let arr = action;
            //把状态都关了
            arr.shutup = 1; //闭关状态
            arr.working = 1; //降妖状态
            arr.power_up = 1; //渡劫状态
            arr.Place_action = 1; //秘境
            arr.Place_actionplus = 1; //沉迷状态
            //结束的时间也修改为当前时间
            arr.end_time = new Date().getTime();
            //结算完去除group_id
            delete arr.group_id;
            //写入redis
            await redis.set(
              "xiuxian:player:" + player_id + ":action",
              JSON.stringify(arr)
            );
            //先完结再结算
            let qixue = Math.trunc(500 * now_level_id);
            await Add_血气(player_id, qixue);
            await Add_修为(player_id, xiuwei);
            await Add_HP(player_id, Data_battle.A_xue);
            //发送消息
            if (is_group) {
              await this.pushInfo(push_address, is_group, msg);
            } else {
              await this.pushInfo(player_id, is_group, msg);
            }
          }
        }
      }
    }
  }
  /**
   * 推送消息，群消息推送群，或者推送私人
   * @param id
   * @param is_group
   * @return falses {Promise<void>}
   */
  async pushInfo(id, is_group, msg) {
    if (is_group) {
      await Bot.pickGroup(id)
        .sendMsg(msg)
        .catch((err) => {
          Bot.logger.mark(err);
        });
    } else {
      await common.relpyPrivate(id, msg);
    }
  }
}
