import { plugin } from "../../api/api.js";
import data from "../../model/xiuxiandata.js";
import {
  __PATH,
  existplayer,
  ForwardMsg,
  Read_player,
  isNotNull,
  Read_forum,
  Write_forum,
} from "../../model/xiuxian.js";
export class forum extends plugin {
  constructor() {
    super({
      name: "forum",
      dsc: "forum",
      event: "message",
      priority: 600,
      rule: [
        {
          reg: "^#有间客栈$",
          fnc: "Searchforum",
        },
        {
          reg: "^#发布文章.*$",
          fnc: "Pushforum",
        },
      ],
    });
  }

  async Searchforum(e) {
    if (!e.isGroup) return;
    let forum;
    try {
      forum = await Read_forum();
    } catch {
      await Write_forum([]);
      forum = await Read_forum();
    }
    let msg = ["___[有间客栈]___"];
    for (var i = 0; i < forum.length; i++) {
      msg.push(
        "   [" +
          forum[i].title +
          "]" +
          "\n" +
          forum[i].content +
          "\ntime:" +
          forum[i].time +
          "\nID:" +
          forum[i].number
      );
    }
    await ForwardMsg(e, msg);
    return;
  }

  async Pushforum(e) {
    if (!e.isGroup) return;
    let usr_qq = e.user_id;
    if (usr_qq == 80000000) {
      return;
    }
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return;
    }
    let forum;
    try {
      forum = await Read_forum();
    } catch {
      await Write_forum([]);
      forum = await Read_forum();
    }

    //标题
    let title0 = e.msg.replace("#", "");
    title0 = title0.replace("发布文章", "");
    //内容
    let code = title0.split("*");
    let title = code[0]; //标题
    let content = code[1]; //内容
    console.log(title);
    console.log(content);

    if (title.length == 0) {
      e.reply("未填写标题");
      return;
    } else if (content == undefined) {
      e.reply("未填写内容");
      return;
    } else if (title.length > 8) {
      e.reply("标题最多8个字");
      return;
    } else if (content.length > 50) {
      e.reply("内容最多50个字");
      return;
    }

    let player = await Read_player(usr_qq);

    let now_level_id;
    if (!isNotNull(player.level_id)) {
      e.reply("请先#同步信息");
      return;
    }

    now_level_id = data.level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id;
    if (now_level_id < 9) {
      e.reply("境界过低");
      return;
    }

    //随机编号
    let Mathrandom = Math.random();
    Mathrandom = usr_qq + Mathrandom;
    Mathrandom = Mathrandom * 100000;
    Mathrandom = Math.trunc(Mathrandom);
    //时间
    var myDate = new Date();
    var year = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    var month = myDate.getMonth() + 1; //获取当前月份(1-12)
    var day = myDate.getDate(); //获取当前日(1-31)
    var newDay = year + "-" + month + "-" + day; //获取完整年月日
    let wupin = {
      title: title, //发布名
      qq: usr_qq, //发布名
      content: content, //发布内容
      time: newDay, //发布时间
      number: Mathrandom, //编号
    };
    forum.push(wupin);
    await Write_forum(forum);
    e.reply("发布成功！");
    return;
  }
}
