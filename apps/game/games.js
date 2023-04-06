import { plugin, segment, common, name, dsc } from "../../api/api.js";
import data from "../../model/xiuxiandata.js";
import config from "../../model/config.js";
import fetch from "node-fetch";
import {
  Read_player,
  existplayer,
  ForwardMsg,
  sleep,
  isNotNull,
  Add_灵石,
  Add_修为,
  Go,
} from "../../model/xiuxian.js";
let gane_key_user = []; //怡红院限制
var yazhu = []; //押注
let gametime = []; //临时游戏CD
export class games extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        {
          reg: "^#怡红院$",
          fnc: "Xiuianplay",
        },
        {
          reg: "^#金银坊$",
          fnc: "Moneynumber",
        },
        {
          reg: "^#(梭哈)|(押注.*)$",
          fnc: "Moneycheck",
        },
        {
          reg: "^(大|小)$",
          fnc: "Moneycheckguess",
        },
        {
          reg: "^#金银坊记录$",
          fnc: "Moneyrecord",
        },
        {
          reg: "^#来张卡片$",
          fnc: "getOneCard",
        },
        {
          reg: "^双修$",
          fnc: "Couple",
        },
        {
          reg: "^#拒绝双修$",
          fnc: "Refusecouple",
        },
        {
          reg: "^#允许双修$",
          fnc: "Allowcouple",
        },
      ],
    });
  }
  async Refusecouple(e) {
    //统一用户ID名
    let usr_qq = e.user_id;
    //不开放私聊
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;

    //全局状态判断
    const T = await Go(e);
    if (!T) {
      return false;
    }
    let player = await Read_player(usr_qq);
    await redis.set("xiuxian:player:" + usr_qq + ":couple", 1);
    e.reply(player.名号 + "开启了拒绝模式");
    return false;
  }

  async Allowcouple(e) {
    //统一用户ID名
    let usr_qq = e.user_id;
    //不开放私聊
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    //全局状态判断
    const T = await Go(e);
    if (!T) {
      return false;
    }
    let player = await Read_player(usr_qq);
    await redis.set("xiuxian:player:" + usr_qq + ":couple", 0);
    e.reply(player.名号 + "开启了允许模式");
    return false;
  }

  //怡红院
  async Xiuianplay(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let switchgame = config.getconfig("xiuxian", "xiuxian").switch.play;

    if (switchgame != true) {
      return false;
    }
    //统一用户ID名
    let usr_qq = e.user_id;

    //全局状态判断
    const T = await Go(e);
    if (!T) {
      return false;
    }

    //得到用户信息
    let player = await Read_player(usr_qq);
    let now_level_id;
    if (!isNotNull(player.level_id)) {
      e.reply("请先#同步信息");
      return false;
    }
    now_level_id = data.level_list.find(
      (item) => item.level_id == player.level_id
    ).level_id;
    //用id当作收益用
    //收益用
    var money = now_level_id * 1000;
    //如果是渡劫期。大概收益用为33*1000=3.3w
    //为防止丹药修为报废，这个收益要成曲线下降
    //得到的修为
    //先是1:1的收益
    var addlevel;
    //到了结丹中期收益变低
    //都不是凡人了，还天天祸害人间？
    if (now_level_id < 10) {
      addlevel = money;
    } else {
      addlevel = (9 / now_level_id) * money;
    }
    //随机数
    var rand = Math.random();
    var ql1 =
      "门口的大汉粗鲁的将你赶出来:'哪来的野小子,没钱还敢来学人家公子爷寻欢作乐?' 被人看出你囊中羞涩,攒到";
    var ql2 = "灵石再来吧！";

    if (player.灵石 < money) {
      e.reply(ql1 + money + ql2);
      return false;
    }

    //加修为
    if (rand < 0.5) {
      let randexp = 90 + parseInt(Math.random() * 20);
      e.reply(
        "花费了" +
          money +
          "灵石,你好好放肆了一番,奇怪的修为增加了" +
          randexp +
          "!在鱼水之欢中你顿悟了,修为增加了" +
          addlevel +
          "!"
      );
      await Add_修为(usr_qq, addlevel);
      await Add_灵石(usr_qq, -money);
      let gameswitch = config.getconfig("xiuxian", "xiuxian").switch
        .Xiuianplay_key;
      if (gameswitch == true) {
        setu(e);
      }
      return false;
    }

    //被教训
    else if (rand > 0.7) {
      await Add_灵石(usr_qq, -money);
      ql1 = "花了";
      ql2 =
        "灵石,本想好好放肆一番,却赶上了扫黄,无奈在衙门被教育了一晚上,最终大彻大悟,下次还来！";
      e.reply([segment.at(usr_qq), ql1 + money + ql2]);
      return false;
    }

    //被坑了
    else {
      await Add_灵石(usr_qq, -money);
      ql1 =
        "这一次，你进了一个奇怪的小巷子，那里衣衫褴褛的漂亮姐姐说要找你玩点有刺激的，你想都没想就进屋了。\n";
      ql2 =
        "没想到进屋后不多时遍昏睡过去。醒来发现自己被脱光扔在郊外,浑身上下只剩一条裤衩子了。仰天长啸:也不过是从头再来！";
      e.reply([segment.at(usr_qq), ql1 + ql2]);
      return false;
    }
  }

  //金银坊
  async Moneynumber(e) {
    //金银坊开关
    let gameswitch = config.getconfig("xiuxian", "xiuxian").switch.Moneynumber;
    if (gameswitch != true) {
      return false;
    }
    //用户固定写法
    let usr_qq = e.user_id;
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    //全局状态判断
    const T = await Go(e);
    if (!T) {
      return false;
    }
    //用户信息查询
    let player = data.getData("player", usr_qq);
    var money = 10000;
    //判断灵石
    if (player.灵石 < money) {
      e.reply("掌柜:哪里的穷小子，滚一边去！");
      e.reply("你摸了摸口袋，发现不足" + money + "灵石,你羞愧地离开了!");
      return false;
    }

    //设置
    var time = config.getconfig("xiuxian", "xiuxian").CD.gambling; //
    //获取当前时间
    let now_time = new Date().getTime();
    //最后的游戏时间
    //last_game_time
    //获得时间戳
    let last_game_time = await redis.get(
      "xiuxian:player:" + usr_qq + ":last_game_time"
    );
    last_game_time = parseInt(last_game_time);
    let transferTimeout = parseInt(60000 * time);
    if (now_time < last_game_time + transferTimeout) {
      let game_m = Math.trunc(
        (last_game_time + transferTimeout - now_time) / 60 / 1000
      );
      let game_s = Math.trunc(
        ((last_game_time + transferTimeout - now_time) % 60000) / 1000
      );
      e.reply(
        `每${transferTimeout / 1000 / 60}分钟游玩一次。` +
          `cd: ${game_m}分${game_s}秒`
      );
      //存在CD。直接返回
      return false;
    }

    //记录本次执行时间
    await redis.set("xiuxian:player:" + usr_qq + ":last_game_time", now_time);
    //判断是否已经在进行
    let game_action = await redis.get(
      "xiuxian:player:" + usr_qq + ":game_action"
    );
    //为0，就是在进行了
    if (game_action == 0) {
      //在进行
      e.reply(`媚娘:猜大小正在进行哦!`);
      return false;
    }
    //不为0   没有参与押注和梭哈
    e.reply(`媚娘:发送[#押注+数字]或[#梭哈]`, true);
    //写入游戏状态为真-在进行了
    await redis.set("xiuxian:player:" + usr_qq + ":game_action", 0);
    await redis.set("xiuxian:player:" + usr_qq + ":game_action2", 1);
    return false;
  }

  //这里冲突了，拆函数！
  //梭哈|押注999
  async Moneycheck(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    //统一用户ID名
    let usr_qq = e.user_id;
    //获取当前时间戳
    let now_time = new Date().getTime();

    //文档
    let ifexistplay = await existplayer(usr_qq);
    //得到此人的状态
    //判断是否是押注用户

    let game_action = await redis.get(
      "xiuxian:player:" + usr_qq + ":game_action"
    );
    if (!ifexistplay || game_action == 1) {
      //不是就返回
      return false;
    }

    //梭哈|押注999。如果是押注。就留下999
    let es = e.msg.replace("#押注", "").trim();

    //去掉押注，发现得到的是梭哈

    //梭哈，全部灵石
    if (es == "#梭哈") {
      let player = await Read_player(usr_qq);
      //得到押注金额
      yazhu[usr_qq] = player.灵石 - 1;
      e.reply("媚娘:梭哈完成,发送[大]或[小]");
      await redis.set("xiuxian:player:" + usr_qq + ":game_action2", 0);
      return false;
    }

    //不是梭哈，看看是不是数字

    //判断是不是输了个数字，看看押注多少
    if (parseInt(es) == parseInt(es)) {
      let player = await Read_player(usr_qq);
      //判断灵石
      if (player.灵石 >= parseInt(es)) {
        //得到押注数
        yazhu[usr_qq] = parseInt(es);
        //这里限制一下，至少押1w
        var money = 10000;
        //如果押注的数大于0
        if (yazhu[usr_qq] >= money) {
          //如果押的钱不够
          //值未真。并记录此人信息
          gane_key_user[usr_qq];
          e.reply("媚娘:押注完成,发送[大]或[小]");
          await redis.set("xiuxian:player:" + usr_qq + ":game_action2", 0);
          return false;
        } else {
          gane_key_user[usr_qq];
          e.reply("至少押注" + money + "灵石!");
          return false;
        }
      }
      //不够
      else {
        //直接清除，并记录
        //重新记录本次时间
        await redis.set(
          "xiuxian:player:" + usr_qq + ":last_game_time",
          now_time
        ); //存入缓存
        //清除游戏状态
        await redis.set("xiuxian:player:" + usr_qq + ":game_action", 1);
        await redis.set("xiuxian:player:" + usr_qq + ":game_action2", 1);
        //清除未押注判断
        //清除金额
        yazhu[usr_qq] = 0;
        //清除游戏定时检测CD
        clearTimeout(gametime[usr_qq]);
        e.reply("媚娘:钱不够也想玩？");
        return false;
      }
    }

    return false;
  }

  //大|小
  async Moneycheckguess(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    //统一用户ID名
    let usr_qq = e.user_id;
    //获取当前时间戳
    let now_time = new Date().getTime();
    //文档
    let ifexistplay = await existplayer(usr_qq);
    //得到此人的状态
    //判断是否是押注用户
    let game_action = await redis.get(
      "xiuxian:player:" + usr_qq + ":game_action2"
    );
    if (!ifexistplay || game_action != 0) {
      //不是就返回
      return false;
    }
    if (isNaN(yazhu[usr_qq])) {
      return false;
    }
    //判断是否押注金额
    //是对应的押注用户。
    //检查此人是否已经押注
    if (!gane_key_user) {
      e.reply("媚娘:公子，你还没押注呢");
      return false;
    }
    let player = await Read_player(usr_qq);
    let es = e.msg;
    //随机数并取整【1，7）
    let randtime = Math.trunc(Math.random() * 6) + 1;
    //点子
    let touzi;
    var n;
    //防止娶不到整，我们自己取
    for (n = 1; n <= randtime; n++) {
      //是1.111就取1 --是2.0就取到2。没有7.0是不可能取到7的。也就是得到6
      //随机并取整
      touzi = n;
    }
    //发送固定点数的touzi
    e.reply(segment.dice(touzi));
    const configdata = config.getconfig("xiuxian", "xiuxian");
    //你说大，touzi是大。赢了
    if ((es == "大" && touzi > 3) || (es == "小" && touzi < 4)) {
      //赢了
      //获奖倍率
      var x = configdata.percentage.Moneynumber;
      var y = 1;
      var z = configdata.size.Money * 10000;
      //增加金银坊赌博记录
      //押注大于一百万
      if (yazhu[usr_qq] >= z) {
        //扣一半的押注
        x = configdata.percentage.punishment;
        //并提示这是被扣了一半
        y = 0;
      }

      let addWorldmoney = yazhu[usr_qq] * (1 - x);

      yazhu[usr_qq] = Math.trunc(yazhu[usr_qq] * x);

      //金库
      let Worldmoney = await redis.get("Xiuxian:Worldmoney");
      if (
        Worldmoney == null ||
        Worldmoney == undefined ||
        Worldmoney <= 0 ||
        Worldmoney == NaN
      ) {
        Worldmoney = 1;
      }
      Worldmoney = Number(Worldmoney);

      Worldmoney = Worldmoney + addWorldmoney;

      Worldmoney = Number(Worldmoney);
      await redis.set("Xiuxian:Worldmoney", Worldmoney);

      //获得灵石超过100w
      //积累
      if (isNotNull(player.金银坊胜场)) {
        player.金银坊胜场 = parseInt(player.金银坊胜场) + 1;
        player.金银坊收入 =
          parseInt(player.金银坊收入) + parseInt(yazhu[usr_qq]);
      } else {
        player.金银坊胜场 = 1;
        player.金银坊收入 = parseInt(yazhu[usr_qq]);
      }
      //把记录写入
      data.setData("player", usr_qq, player);
      //得到的
      Add_灵石(usr_qq, yazhu[usr_qq]);
      if (y == 1) {
        e.reply([
          segment.at(usr_qq),
          `骰子最终为 ${touzi} 你猜对了！`,
          "\n",
          `现在拥有灵石:${player.灵石 + yazhu[usr_qq]}`,
        ]);
      } else {
        e.reply([
          segment.at(usr_qq),
          `骰子最终为 ${touzi} 你虽然猜对了，但是金银坊怀疑你出老千，准备打断你的腿的时候，你选择破财消灾。`,
          "\n",
          `现在拥有灵石:${player.灵石 + yazhu[usr_qq]}`,
        ]);
      }
      //重新记录本次时间
      await redis.set("xiuxian:player:" + usr_qq + ":last_game_time", now_time); //存入缓存
      //清除游戏状态
      await redis.set("xiuxian:player:" + usr_qq + ":game_action", 1);
      //清除未押注判断
      //清除金额
      yazhu[usr_qq] = 0;
      //清除游戏CD
      clearTimeout(gametime[usr_qq]);
      return false;
    }
    //你说大，但是touzi<4,是输了
    else if ((es == "大" && touzi < 4) || (es == "小" && touzi > 3)) {
      //输了
      //增加金银坊赌博记录
      if (isNotNull(player.金银坊败场)) {
        player.金银坊败场 = parseInt(player.金银坊败场) + 1;
        player.金银坊支出 =
          parseInt(player.金银坊支出) + parseInt(yazhu[usr_qq]);
      } else {
        player.金银坊败场 = 1;
        player.金银坊支出 = parseInt(yazhu[usr_qq]);
      }
      //把记录写入
      data.setData("player", usr_qq, player);
      //只要花灵石的地方就要查看是否存在游戏状态
      Add_灵石(usr_qq, -yazhu[usr_qq]);
      let msg = [
        segment.at(usr_qq),
        `骰子最终为 ${touzi} 你猜错了！`,
        "\n",
        `现在拥有灵石:${player.灵石 - yazhu[usr_qq]}`,
      ];
      let now_money = player.灵石 - yazhu[usr_qq];
      //重新记录本次时间
      await redis.set("xiuxian:player:" + usr_qq + ":last_game_time", now_time); //存入缓存
      //清除游戏状态
      await redis.set("xiuxian:player:" + usr_qq + ":game_action", 1);
      //清除未押注判断
      //清除金额
      yazhu[usr_qq] = 0;
      //清除游戏CD
      clearTimeout(gametime[usr_qq]);
      //如果扣了之后，钱被扣光了，就提示
      if (now_money <= 0) {
        msg.push(
          "\n媚娘:没钱了也想跟老娘耍？\n你已经裤衩都输光了...快去降妖赚钱吧！"
        );
      }
      e.reply(msg);
      return false;
    }
  }

  async Moneyrecord(e) {
    let qq = e.user_id;
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    //全局状态判断
    const T = await Go(e);
    if (!T) {
      return false;
    }
    //获取人物信息
    let player_data = data.getData("player", qq);
    let victory = isNotNull(player_data.金银坊胜场)
      ? player_data.金银坊胜场
      : 0;
    let victory_num = isNotNull(player_data.金银坊收入)
      ? player_data.金银坊收入
      : 0;
    let defeated = isNotNull(player_data.金银坊败场)
      ? player_data.金银坊败场
      : 0;
    let defeated_num = isNotNull(player_data.金银坊支出)
      ? player_data.金银坊支出
      : 0;
    let shenglv = 0;
    if (parseInt(victory) + parseInt(defeated) == 0) {
      shenglv = 0;
    } else {
      shenglv = ((victory / (victory + defeated)) * 100).toFixed(2);
    }
    e.reply([
      segment.at(qq),
      "\n" +
        "金银坊记录如下:\n" +
        "胜场:" +
        victory +
        "\n" +
        "共卷走" +
        victory_num +
        "灵石\n" +
        "败场" +
        defeated +
        "\n" +
        "送给金银坊" +
        defeated_num +
        "灵石\n" +
        "胜率:" +
        shenglv +
        "%",
    ]);
  }

  //来张卡片
  async getOneCard(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let template_path = await common.getTemplatePath();
    let cards = [
      "A",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "J",
      "Q",
      "K",
    ]; //扑克数字
    let backgroundList = ["01.jpg", "02.jpg", "10.jpg"]; //背景图片
    let card_border = ["orange", "white", "rebeccapurple"]; //边框颜色,最好是跟图片对应
    let flower_color = ["红桃.png", "方片.png", "黑桃.png", "梅花.png"];
    let font_color = ["red", "red", "black", "black"];
    let random = parseInt(Math.random() * 3);
    let random_color = parseInt(Math.random() * 4);
    let arr = {
      size: cards[parseInt(Math.random() * 12)],
      flower_color: flower_color[random_color],
      font_color: font_color[random_color],
      img_path: template_path,
      background_img: backgroundList[random],
      background_color: card_border[random],
    };
    await common.generateHtml(
      template_path + "template/poke/poke.html",
      template_path + "html/poke.html",
      arr
    );
    let param = {
      clip: {
        x: 0,
        y: 0,
        width: 310,
        height: 470,
      },
    };
    let img = await common.generateImgByHtml(
      template_path + "html/poke.html",
      template_path + "img/poke.jpg",
      param
    );
    e.reply([segment.image(img)]);
    return false;
  }

  //双修
  async Couple(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    //双修开关
    let gameswitch = config.getconfig("xiuxian", "xiuxian").switch.couple;
    if (gameswitch != true) {
      return false;
    }
    let A = e.user_id;
    //全局状态判断
    const T = await Go(e);
    if (!T) {
      return false;
    }

    //B
    let isat = e.message.some((item) => item.type === "at");
    if (!isat) {
      return false;
    }
    let atItem = e.message.filter((item) => item.type === "at");
    //对方QQ
    let B = atItem[0].qq;
    if (A == B) {
      e.reply("你咋这么爱撸自己呢?");
      return false;
    }

    var Time = config.getconfig("xiuxian", "xiuxian").CD.couple; //6个小时
    let shuangxiuTimeout = parseInt(60000 * Time);

    //自己的cd
    let now_Time = new Date().getTime(); //获取当前时间戳
    let last_timeA = await redis.get(
      "xiuxian:player:" + A + ":last_shuangxiu_time"
    ); //获得上次的时间戳,
    last_timeA = parseInt(last_timeA);
    if (now_Time < last_timeA + shuangxiuTimeout) {
      let Couple_m = Math.trunc(
        (last_timeA + shuangxiuTimeout - now_Time) / 60 / 1000
      );
      let Couple_s = Math.trunc(
        ((last_timeA + shuangxiuTimeout - now_Time) % 60000) / 1000
      );
      e.reply(`双修冷却:  ${Couple_m}分 ${Couple_s}秒`);
      return false;
    }

    let last_timeB = await redis.get(
      "xiuxian:player:" + B + ":last_shuangxiu_time"
    ); //获得上次的时间戳,
    last_timeB = parseInt(last_timeB);
    if (now_Time < last_timeB + shuangxiuTimeout) {
      let Couple_m = Math.trunc(
        (last_timeB + shuangxiuTimeout - now_Time) / 60 / 1000
      );
      let Couple_s = Math.trunc(
        ((last_timeB + shuangxiuTimeout - now_Time) % 60000) / 1000
      );
      e.reply(`对方双修冷却:  ${Couple_m}分 ${Couple_s}秒`);
      return false;
    }

    //对方存档
    let ifexistplay_B = await existplayer(B);
    if (!ifexistplay_B) {
      e.reply("修仙者不可对凡人出手!");
      return false;
    }
    //拒绝
    let couple = await redis.get("xiuxian:player:" + B + ":couple");
    if (couple != 0) {
      e.reply("哎哟，你干嘛...");
      return false;
    }

    //对方游戏状态
    //获取游戏状态
    let game_action = await redis.get("xiuxian:player:" + B + ":game_action");
    //防止继续其他娱乐行为
    if (game_action == 0) {
      e.reply("修仙:游戏进行中...");
      return false;
    }

    //对方行为状态
    let B_action = await redis.get("xiuxian:player:" + B + ":action");
    B_action = JSON.parse(B_action);
    if (B_action != null) {
      let now_time = new Date().getTime();
      //人物任务的动作是否结束
      let B_action_end_time = B_action.end_time;
      if (now_time <= B_action_end_time) {
        let m = parseInt((B_action_end_time - now_time) / 1000 / 60);
        let s = parseInt((B_action_end_time - now_time - m * 60 * 1000) / 1000);
        e.reply(
          "对方正在" + B_action.action + "中,剩余时间:" + m + "分" + s + "秒"
        );
        return false;
      }
    }

    //前戏做完了!
    await redis.set("xiuxian:player:" + A + ":last_shuangxiu_time", now_Time);
    await redis.set("xiuxian:player:" + B + ":last_shuangxiu_time", now_Time);

    if (A != B) {
      let option = Math.random();
      let xiuwei = Math.random();
      let x = 0;
      let y = 0;
      if (option > 0 && option <= 0.5) {
        x = 28000;
        y = Math.trunc(xiuwei * x);
        await Add_修为(A, parseInt(y));
        await Add_修为(B, parseInt(y));
        e.reply("你们双方心无旁骛努力修炼，都增加了" + parseInt(y) + "修为");
        return false;
      } else if (option > 0.5 && option <= 0.6) {
        x = 21000;
        y = Math.trunc(xiuwei * x);
        await Add_修为(A, parseInt(y));
        await Add_修为(B, parseInt(y));
        e.reply("你们双方心无旁骛努力修炼，都增加了" + parseInt(y) + "修为");
      } else if (option > 0.6 && option <= 0.7) {
        x = 14000;
        y = Math.trunc(xiuwei * x);
        await Add_修为(A, parseInt(y));
        await Add_修为(B, parseInt(y));
        e.reply("你们双方努力修炼，过程平稳，都增加了" + parseInt(y) + "修为");
      } else if (option > 0.7 && option <= 0.9) {
        e.reply("你们双方默契不足，心也静不下来，并没有成功双修，只是聊了会天");
      } else {
        x = 20000;
        y = Math.trunc(xiuwei * x);
        await Add_修为(A, -parseInt(y));
        await Add_修为(B, -parseInt(y));
        e.reply(
          "你们双修时听到一声鸡叫，仿佛鸡说了句“你干嘛，哎哟~”，吓得你们心神不稳，都失去了" +
            parseInt(y) +
            "修为,是不是肾虚了，快去买药补补身子吧"
        );
      }
      return false;
    }
  }
}

//图开关
async function setu(e) {
  e.reply(
    `玩命加载图片中,请稍后...   ` +
      "\n(一分钟后还没有出图片,大概率被夹了,这个功能谨慎使用,机器人容易寄)"
  );
  let url;
  //setu接口地址
  url = "https://api.lolicon.app/setu/v2?proxy=i.pixiv.re&r18=0";
  let msg = [];
  let res;
  //
  try {
    let response = await fetch(url);
    res = await response.json();
  } catch (error) {
    console.log("Request Failed", error);
  }
  if (res !== "{}") {
    console.log("res不为空");
  } else {
    console.log("res为空");
  }
  let link = res.data[0].urls.original; //获取图链
  link = link.replace("pixiv.cat", "pixiv.re"); //链接改为国内可访问的域名
  let pid = res.data[0].pid; //获取图片ID
  let uid = res.data[0].uid; //获取画师ID
  let title = res.data[0].title; //获取图片名称
  let author = res.data[0].author; //获取画师名称
  let px = res.data[0].width + "*" + res.data[0].height; //获取图片宽高
  msg.push(
    "User: " +
      author +
      "\nUid: " +
      uid +
      "\nTitle: " +
      title +
      "\nPid: " +
      pid +
      "\nPx: " +
      px +
      "\nLink: " +
      link
  );
  await sleep(1000);
  e.reply(segment.image(link));
  await ForwardMsg(e, msg);
  return false;
}
