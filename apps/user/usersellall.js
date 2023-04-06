import { plugin, name, dsc } from "../../api/api.js";
import data from "../../model/xiuxiandata.js";
import {
  Read_player,
  existplayer,
  exist_najie_thing,
  instead_equipment,
} from "../../model/xiuxian.js";
import {
  Add_灵石,
  Add_najie_thing,
  Add_修为,
  Add_player_学习功法,
} from "../../model/xiuxian.js";
import { __PATH } from "../../model/xiuxian.js";
import { get_equipment_img } from "../../model/information.js";
import config from "../../model/config.js";
export class usersellall extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        {
          reg: "^#一键出售(.*)$",
          fnc: "Sell_all_comodities",
        },
        {
          reg: "^#一键服用修为丹$",
          fnc: "all_xiuweidan",
        },
        {
          reg: "^#一键装备$",
          fnc: "all_zhuangbei",
        },
        {
          reg: "^#一键学习$",
          fnc: "all_learn",
        },
      ],
    });
  }

  //一键出售
  async Sell_all_comodities(e) {
    if (!e.isGroup  || e.user_id == 80000000)
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
    let najie = await data.getData("najie", usr_qq);
    let commodities_price = 0;
    let wupin = ["装备", "丹药", "道具", "功法", "草药"];
    let wupin1 = [];
    if (e.msg != "#一键出售") {
      let thing = e.msg.replace("#一键出售", "");
      for (var i of wupin) {
        if (thing.includes(i)) {
          wupin1.push(i);
          thing = thing.replace(i, "");
        }
      }
      if (thing.length == 0) {
        wupin = wupin1;
      } else {
        return false;
      }
    }

    for (var i of wupin) {
      for (var l of najie[i]) {
        if (l) {
          //纳戒中的数量
          let quantity = await exist_najie_thing(usr_qq, l.name, l.class);
          await Add_najie_thing(usr_qq, l.name, l.class, -quantity);
          commodities_price = commodities_price + l.出售价 * quantity;
        }
      }
    }
    await Add_灵石(usr_qq, commodities_price);
    e.reply(`出售成功!  获得${commodities_price}灵石 `);
    return false;
  }

  //#(装备|服用|使用)物品*数量
  async all_xiuweidan(e) {
    if (!e.isGroup  || e.user_id == 80000000)
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

    //检索方法
    let najie = await data.getData("najie", usr_qq);
    let xiuwei = 0;
    for (var l of najie.丹药) {
      if (l.type == "修为") {
        //纳戒中的数量
        let quantity = await exist_najie_thing(usr_qq, l.name, l.class);
        await Add_najie_thing(usr_qq, l.name, l.class, -quantity);
        xiuwei = xiuwei + l.exp * quantity;
      }
    }
    await Add_修为(usr_qq, xiuwei);
    e.reply(`服用成功,修为增加${xiuwei}`);
    return false;
  }

  async all_zhuangbei(e) {
    if (!e.isGroup  || e.user_id == 80000000)
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
    //检索方法
    let najie = await data.getData("najie", usr_qq);
    let equipment = await data.getData("equipment", usr_qq);
    let wuqi = [];
    let fabao = [];
    let huju = [];
    let xiuwei = 0;

    for (var l of najie.装备) {
      if (l.type == "武器") {
        //纳戒中的数量
        wuqi.push(l);
      } else if (l.type == "法宝") {
        fabao.push(l);
      } else {
        huju.push(l);
      }
    }

    //选择最高攻击武器
    let wuqi1 = equipment.武器;
    for (var i of wuqi) {
      logger.info(i);
      if (i.atk > wuqi1.atk) {
        wuqi1 = i;
      }
    }

    if (wuqi1.name != equipment.武器.name) {
      await instead_equipment(usr_qq, wuqi1.name);
    }

    //选择最高攻击法宝
    let fabao1 = equipment.法宝;
    for (var i of fabao) {
      logger.info(i);
      if (i.atk > fabao1.atk) {
        fabao1 = i;
      }
    }
    if (fabao1.name != equipment.法宝.name) {
      await instead_equipment(usr_qq, fabao1.name);
    }

    //选择最高防御护具
    let huju1 = equipment.护具;
    for (var i of huju) {
      logger.info(i);
      if (i.def > huju1.def) {
        huju1 = i;
      }
    }
    if (huju1.name != equipment.护具.name) {
      await instead_equipment(usr_qq, huju1.name);
    }
    let img = await get_equipment_img(e);
    e.reply(img);
    return false;
  }

  async all_learn(e) {
    if (!e.isGroup  || e.user_id == 80000000)
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
    //检索方法
    let najie = await data.getData("najie", usr_qq);
    let player = await Read_player(usr_qq);
    let name = "";
    for (var l of najie.功法) {
      let islearned = player.学习的功法.find((item) => item == l.name);
      if (!islearned) {
        await Add_najie_thing(usr_qq, l.name, "功法", -1);
        await Add_player_学习功法(usr_qq, l.name);
        name = name + " " + l.name;
      }
    }
    if (name) {
      e.reply(`你学会了${name},可以在【#我的炼体】中查看`);
    } else {
      e.reply("无新功法");
    }
    return false;
  }
}
