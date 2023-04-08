import { BotApi, GameApi, plugin, name, dsc } from "../../../model/api/api.js";
export class BoxTransaction extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: "^#万宝楼$", fnc: "showComodities" },
        { reg: "^#购买.*$", fnc: "buyComodities" },
        { reg: "^#出售.*$", fnc: "sellComodities" },
      ],
    });
  }
  showComodities = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    if (!BotApi.User.surveySet({ e })) return false;
    const UID = e.user_id;
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply("已死亡");
      return false;
    }
    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: "user_action",
    });
    const address_name = "万宝楼";
    const map = await GameApi.GameMap.mapExistence({
      action,
      addressName: address_name,
    });
    if (!map) {
      e.reply(`需[#前往+城池名+${address_name}]`);
      return false;
    }
    const msg = ["___[万宝楼]___\n[#购买+物品名*数量]\n不填数量,默认为1"];
    const commodities_list = await GameApi.UserData.listAction({
      NAME: "commodities",
      CHOICE: "generate_all",
    });
    commodities_list.forEach((item) => {
      const id = item.id.split("-");
      switch (id[0]) {
        case "1": {
          msg.push(
            `物品:${item.name}\n攻击:${item.attack}%\n价格:${item.price}`
          );
          break;
        }
        case "2": {
          msg.push(
            `物品:${item.name}\n防御:${item.defense}%\n价格:${item.price}`
          );
          break;
        }
        case "3": {
          msg.push(
            `物品:${item.name}\n暴伤:${item.burstmax}%\n价格:${item.price}`
          );
          break;
        }
        case "4": {
          if (id[1] == 1) {
            msg.push(
              `物品:${item.name}\n气血:${item.blood}%\n价格:${item.price}`
            );
          } else {
            msg.push(
              `物品:${item.name}\n修为:${item.experience}\n价格:${item.price}`
            );
          }
          break;
        }
        case "5": {
          msg.push(`物品:${item.name}\n天赋:${item.size}%\n价格:${item.price}`);
          break;
        }
        case "6": {
          msg.push(`物品:${item.name}\n价格:${item.price}`);
          break;
        }
        default: {
          break;
        }
      }
    });
    await BotApi.User.forwardMsgSurveySet({ e, data: msg });
    return false;
  };
  buyComodities = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return;
    if (blackid.indexOf(e.user_id) != -1) return;
    const UID = e.user_id;
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply("已死亡");
      return false;
    }
    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: "user_action",
    });
    const address_name = "万宝楼";
    const map = await GameApi.GameMap.mapExistence({
      action,
      addressName: address_name,
    });
    if (!map) {
      e.reply(`需[#前往+城池名+${address_name}]`);
      return false;
    }
    const [thing_name, thing_acount] = e.msg.replace("#购买", "").split("*");
    let quantity = await GameApi.GamePublic.leastOne({ value: thing_acount });
    if (quantity > 99) {
      quantity = 99;
    }
    const Commodities = await GameApi.UserData.listAction({
      NAME: "commodities",
      CHOICE: "generate_all",
    });
    const ifexist = Commodities.find((item) => item.name == thing_name);
    if (!ifexist) {
      e.reply(`[万宝楼]小二\n不卖[${thing_name}]`);
      return false;
    }
    const money = await GameApi.GameUser.userBagSearch({
      UID,
      name: "下品灵石",
    });
    if (!money || money.acount < ifexist.price * quantity) {
      e.reply(`似乎没有${ifexist.price * quantity}*[下品灵石]`);
      return false;
    }
    await GameApi.GameUser.userBag({
      UID,
      name: "下品灵石",
      ACCOUNT: -Number(ifexist.price * quantity),
    });
    await GameApi.GameUser.userBag({
      UID,
      name: ifexist.name,
      ACCOUNT: Number(quantity),
    });
    e.reply(
      `[万宝楼]薛仁贵\n你花[${
        ifexist.price * quantity
      }]下品灵石购买了[${thing_name}]*${quantity},`
    );
    return false;
  };
  sellComodities = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    if (!BotApi.User.surveySet({ e })) return false;
    const UID = e.user_id;
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply("已死亡");
      return false;
    }
    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: "user_action",
    });
    const address_name = "万宝楼";
    const map = await GameApi.GameMap.mapExistence({
      action,
      addressName: address_name,
    });
    if (!map) {
      e.reply(`需[#前往+城池名+${address_name}]`);
      return false;
    }
    const [thing_name, thing_acount] = e.msg.replace("#出售", "").split("*");
    let quantity = await GameApi.GamePublic.leastOne({ value: thing_acount });
    if (quantity > 99) {
      quantity = 99;
    }
    const najie_thing = await GameApi.GameUser.userBagSearch({
      UID,
      name: thing_name,
    });
    if (!najie_thing) {
      e.reply(`[万宝楼]小二\n你没[${thing_name}]`);
      return false;
    }
    if (najie_thing.acount < quantity) {
      e.reply("[万宝楼]小二\n数量不足");
      return false;
    }
    await GameApi.GameUser.userBag({
      UID,
      name: najie_thing.name,
      ACCOUNT: -Number(quantity),
    });
    const commodities_price = najie_thing.price * quantity;
    await GameApi.GameUser.userBag({
      UID,
      name: "下品灵石",
      ACCOUNT: Number(commodities_price),
    });
    e.reply(`[万宝楼]欧阳峰\n出售得${commodities_price}*[下品灵石]`);
    return false;
  };
}
