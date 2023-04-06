import { plugin, segment, name, dsc } from "../../api/api.js";
import data from "../../model/xiuxiandata.js";
import {
  Read_player,
  existplayer,
  exist_najie_thing,
  instead_equipment,
  player_efficiency,
  Read_najie,
  get_random_talent,
  Write_player,
} from "../../model/xiuxian.js";
import {
  Add_灵石,
  Add_najie_thing,
  Add_HP,
  Add_修为,
  Add_player_学习功法,
  Add_najie_灵石,
  isNotNull,
  __PATH,
  Go,
} from "../../model/xiuxian.js";
import { get_equipment_img } from "../../model/information.js";
import config from "../../model/config.js";
export class userhome extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        {
          reg: "^#(存|取)灵石(.*)$",
          fnc: "Take_lingshi",
        },
        {
          reg: "^#(装备|消耗|服用|学习)((.*)|(.*)*(.*))$",
          fnc: "Player_use",
        },
        {
          reg: "^#购买((.*)|(.*)*(.*))$",
          fnc: "Buy_comodities",
        },
        {
          reg: "^#出售((.*)|(.*)*(.*))$",
          fnc: "Sell_comodities",
        },
      ],
    });
  }

  //存取灵石
  async Take_lingshi(e) {
    if (!e.isGroup || e.self_id != e.target_id || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let usr_qq = e.user_id;

    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return false;
    }

    const T = await Go(e);
    if (!T) {
      return false;
    }

    //检索方法
    var reg = new RegExp(/取|存/);
    let func = reg.exec(e.msg);
    let msg = e.msg.replace(reg, "");
    msg = msg.replace("#", "");
    let lingshi = msg.replace("灵石", "");
    if (func == "存" && lingshi == "全部") {
      let P = await Read_player(usr_qq);
      lingshi = P.灵石;
    }
    if (func == "取" && lingshi == "全部") {
      let N = await Read_najie(usr_qq);
      lingshi = N.灵石;
    }

    if (parseInt(lingshi) != parseInt(lingshi)) {
      e.reply([segment.at(usr_qq), `请在指令后面加上灵石数量`]);
      return false;
    } else {
      lingshi = parseInt(lingshi);
      if (lingshi < 1) {
        e.reply([segment.at(usr_qq), `灵石数量不能为负数`]);
        return false;
      }
    }
    if (func == "存") {
      let player_lingshi = await Read_player(usr_qq);
      player_lingshi = player_lingshi.灵石;
      if (player_lingshi < lingshi) {
        e.reply([
          segment.at(usr_qq),
          `灵石不足,你目前只有${player_lingshi}灵石`,
        ]);
        return false;
      }
      let najie = await Read_najie(usr_qq);
      if (najie.灵石上限 < najie.灵石 + lingshi) {
        await Add_najie_灵石(usr_qq, najie.灵石上限 - najie.灵石);
        await Add_灵石(usr_qq, -najie.灵石上限 + najie.灵石);
        e.reply([
          segment.at(usr_qq),
          `已为您放入${najie.灵石上限 - najie.灵石}灵石,纳戒存满了`,
        ]);
        return false;
      }
      await Add_najie_灵石(usr_qq, lingshi);
      await Add_灵石(usr_qq, -lingshi);
      e.reply([
        segment.at(usr_qq),
        `储存完毕,你目前还有${player_lingshi - lingshi}灵石,纳戒内有${
          najie.灵石 + lingshi
        }灵石`,
      ]);
      return false;
    }
    if (func == "取") {
      let najie = await Read_najie(usr_qq);
      if (najie.灵石 < lingshi) {
        e.reply([
          segment.at(usr_qq),
          `纳戒灵石不足,你目前最多取出${najie.灵石}灵石`,
        ]);
        return false;
      }
      let player_lingshi = await Read_player(usr_qq);
      player_lingshi = player_lingshi.灵石;
      await Add_najie_灵石(usr_qq, -lingshi);
      await Add_灵石(usr_qq, lingshi);
      e.reply([
        segment.at(usr_qq),
        `本次取出灵石${lingshi},你的纳戒还剩余${najie.灵石 - lingshi}灵石`,
      ]);
      return false;
    }
    return false;
  }

  //#(装备|服用|消耗)物品*数量
  async Player_use(e) {
    if (!e.isGroup || e.self_id != e.target_id || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return false;
    }

    let player = await Read_player(usr_qq);

    //检索方法
    var reg = new RegExp(/装备|服用|消耗|学习/);
    let func = reg.exec(e.msg);
    let msg = e.msg.replace(reg, "");
    msg = msg.replace("#", "");
    let code = msg.split("*");
    let thing_name = code[0];
    let quantity = 0;
    if (parseInt(code[1]) != parseInt(code[1])) {
      quantity = 1;
    } else if (parseInt(code[1]) < 1) {
      e.reply(`输入物品数量小于1,现在默认为1`);
      quantity = 1;
    } else {
      quantity = parseInt(code[1]);
    }
    //看看物品名称有没有设定,是不是瞎说的
    if (
      !data.daoju_list.find((item) => item.name == thing_name) &&
      !data.danyao_list.find((item) => item.name == thing_name) &&
      !data.equipment_list.find((item) => item.name == thing_name) &&
      !data.gongfa_list.find((item) => item.name == thing_name) &&
      !data.timegongfa_list.find((item) => item.name == thing_name) &&
      !data.timeequipmen_list.find((item) => item.name == thing_name) &&
      !data.timedanyao_list.find((item) => item.name == thing_name)
    ) {
      e.reply(`你在瞎说啥呢?哪来的【${thing_name}】?`);
      return false;
    }
    if (func == "装备") {
      //x是纳戒内有的数量
      let x = await exist_najie_thing(usr_qq, thing_name, "装备");
      if (!x) {
        //没有
        e.reply(`你没有【${thing_name}】这样的装备`);
        return false;
      }
      if (x < quantity) {
        //不够
        e.reply(`你目前只有【${thing_name}】*${x},数量不够`);
        return false;
      }
      await instead_equipment(usr_qq, thing_name);
      let img = await get_equipment_img(e);
      e.reply(img);
      return false;
    }

    if (func == "服用") {
      let x = await exist_najie_thing(usr_qq, thing_name, "丹药");

      if (!x) {
        //没有
        e.reply(`你没有【${thing_name}】这样的丹药`);
        return false;
      }

      if (x < quantity) {
        //不够
        e.reply(`你目前只有【${thing_name}】*${x},数量不够`);
        return false;
      }

      Add_najie_thing(usr_qq, thing_name, "丹药", -quantity);

      //这里要找到丹药
      let this_danyao;
      try {
        this_danyao = data.danyao_list.find((item) => item.name == thing_name);
        try {
          if (this_danyao == undefined) {
            this_danyao = data.timedanyao_list.find(
              (item) => item.name == thing_name
            );
          }
        } catch {
          this_danyao = data.timedanyao_list.find(
            (item) => item.name == thing_name
          );
        }
      } catch {
        this_danyao = data.timedanyao_list.find(
          (item) => item.name == thing_name
        );
      }

      if (this_danyao.type == "血量") {
        let player = await Read_player(usr_qq);
        let blood = parseInt(
          player.血量上限 * this_danyao.HPp + this_danyao.HP
        );
        await Add_HP(usr_qq, quantity * blood);
        let now_HP = await Read_player(usr_qq);
        e.reply(`服用成功,当前血量为:${now_HP.当前血量} `);
        return false;
      }
      if (this_danyao.type == "修为") {
        await Add_修为(usr_qq, quantity * this_danyao.exp);
        e.reply(`服用成功,修为增加${quantity * this_danyao.exp}`);
        return false;
      }
    }

    if (func == "消耗") {
      let x = await exist_najie_thing(usr_qq, thing_name, "道具");

      if (!x) {
        e.reply(`你没有【${thing_name}】这样的道具`);
        return false;
      }

      if (
        data.daoju_list.find((item) => item.name == thing_name).type == "洗髓"
      ) {
        if ((await player.linggenshow) != 0) {
          await e.reply("你未开灵根，无法洗髓！");
          return false;
        }

        //这里要判断境界，
        let now_level_id;
        if (!isNotNull(player.level_id)) {
          await e.reply("请先#刷新信息");
          return false;
        }

        now_level_id = data.level_list.find(
          (item) => item.level_id == player.level_id
        ).level_id;
        if (now_level_id > 21) {
          await e.reply("你灵根已定，不可再洗髓灵根！");
          return false;
        }

        await Add_najie_thing(usr_qq, thing_name, "道具", -1);
        player.灵根 = await get_random_talent();
        data.setData("player", usr_qq, player);
        await player_efficiency(usr_qq);
        e.reply([
          segment.at(usr_qq),
          `  服用成功,剩余 ${thing_name}数量: ${x - 1}，新的灵根为 "${
            player.灵根.type
          }":${player.灵根.name}`,
          "\n可以在【#我的练气】中查看",
        ]);
        return false;
      } else if (thing_name == "隐身水") {
        e.reply(`该道具无法在纳戒中消耗,在打劫非空闲群友时自动消耗`);
        return false;
      } else if (thing_name == "定灵珠") {
        await Add_najie_thing(usr_qq, thing_name, "道具", -1);
        player.linggenshow = 0;
        await Write_player(usr_qq, player);
        e.reply(
          `你眼前一亮，看到了自己的灵根,` +
            `"${player.灵根.type}":${player.灵根.name}`
        );
        return false;
      } else {
        e.reply(`功能开发中,敬请期待`);
        return false;
      }
    }

    if (func == "学习") {
      let x = await exist_najie_thing(usr_qq, thing_name, "功法");
      if (!x) {
        e.reply(`你没有【${thing_name}】这样的功法`);
        return false;
      }
      let player = await Read_player(usr_qq);
      let islearned = player.学习的功法.find((item) => item == thing_name);
      if (islearned) {
        e.reply(`你已经学过该功法了`);
        return false;
      }
      await Add_najie_thing(usr_qq, thing_name, "功法", -1);
      //
      await Add_player_学习功法(usr_qq, thing_name);
      e.reply(`你学会了${thing_name},可以在【#我的炼体】中查看`);
    }
    return false;
  }

  //购买商品
  async Buy_comodities(e) {
    if (!e.isGroup || e.self_id != e.target_id || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return false;
    }

    const T = await Go(e);
    if (!T) {
      return false;
    }

    let thing = e.msg.replace("#", "");
    thing = thing.replace("购买", "");
    let code = thing.split("*");
    let thing_name = code[0];

    //默认没有数量
    let quantity = 0;

    if (parseInt(code[1]) != parseInt(code[1])) {
      quantity = 1;
    } else if (parseInt(code[1]) < 1) {
      e.reply(`输入物品数量小于1,现在默认为1`);
      quantity = 1;
    } else if (parseInt(code[1]) > 99) {
      e.reply(`客官，一次只能卖99瓶哦，货物稀缺呢~`);
      quantity = 99;
    } else {
      quantity = parseInt(code[1]);
    }
    //e.reply(`thing_name:${thing_name},   quantity:${quantity}`);
    let ifexist = data.commodities_list.find((item) => item.name == thing_name);
    if (!ifexist) {
      e.reply(`柠檬堂还没有这样的东西:${thing_name}`);
      return false;
    }

    let player = await Read_player(usr_qq);
    let lingshi = player.灵石;

    //如果没钱，或者为负数
    if (lingshi <= 0) {
      e.reply(`掌柜:就你这穷酸样，也想来柠檬堂？走走走！`);
      return false;
    }
    // 价格倍率
    //价格
    let commodities_price = ifexist.出售价 * 1.2 * quantity;
    let addWorldmoney = ifexist.出售价 * 0.2 * quantity;
    //判断金额
    if (lingshi < commodities_price) {
      e.reply(
        `口袋里的灵石不足以支付${thing_name},还需要${
          commodities_price - lingshi
        }灵石`
      );
      return false;
    }

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

    //符合就往戒指加
    await Add_najie_thing(usr_qq, thing_name, ifexist.class, quantity);
    await Add_灵石(usr_qq, -commodities_price);
    //发送消息
    e.reply([
      `购买成功!  获得[${thing_name}]*${quantity},花[${commodities_price}]灵石,剩余[${
        lingshi - commodities_price
      }]灵石  `,
      "\n可以在【我的纳戒】中查看",
    ]);
    return false;
  }

  //出售商品
  async Sell_comodities(e) {
    if (!e.isGroup || e.self_id != e.target_id || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) {
      return false;
    }

    //命令判断
    let thing = e.msg.replace("#", "");
    thing = thing.replace("出售", "");
    let code = thing.split("*");

    //数量判断
    let thing_name = code[0];
    let quantity = 0; //指令里写的数量
    if (parseInt(code[1]) != parseInt(code[1])) {
      quantity = 1;
    } else if (parseInt(code[1]) < 1) {
      e.reply(`输入物品数量小于1,现在默认为1`);
      quantity = 1;
    } else {
      quantity = parseInt(code[1]);
    }
    //e.reply(`thing_name:${thing_name},   quantity:${quantity}`);

    //查找丹药列表
    let ifexist0 = data.danyao_list.find((item) => item.name == thing_name);
    //查找道具列表
    let ifexist1 = data.daoju_list.find((item) => item.name == thing_name);
    //查找功法列表
    let ifexist2 = data.gongfa_list.find((item) => item.name == thing_name);
    //查找装备列表
    let ifexist3 = data.equipment_list.find((item) => item.name == thing_name);
    //查找药草列表
    let ifexist4 = data.caoyao_list.find((item) => item.name == thing_name);

    if (ifexist0) {
      ifexist0 = ifexist0;
    } else if (ifexist1) {
      ifexist0 = ifexist1;
    } else if (ifexist2) {
      ifexist0 = ifexist2;
    } else if (ifexist3) {
      ifexist0 = ifexist3;
    } else if (ifexist4) {
      ifexist0 = ifexist4;
    } else {
      e.reply(`柠檬堂不回收这样的东西:${thing_name}`);
      return false;
    }

    //纳戒中的数量
    let thing_quantity = await exist_najie_thing(
      usr_qq,
      thing_name,
      ifexist0.class
    );

    if (!thing_quantity) {
      //没有
      e.reply(`你没有【${thing_name}】这样的${ifexist0.class}`);
      return false;
    }
    if (thing_quantity < quantity) {
      //不够
      e.reply(`你目前只有【${thing_name}】*${thing_quantity},数量不够`);
      return false;
    }
    //数量够,数量减少,灵石增加
    await Add_najie_thing(usr_qq, thing_name, ifexist0.class, -quantity);
    let commodities_price = ifexist0.出售价 * quantity;
    await Add_灵石(usr_qq, commodities_price);
    e.reply(
      `出售成功!  获得${commodities_price}灵石,还剩余${thing_name}*${
        thing_quantity - quantity
      } `
    );
    return false;
  }
}
