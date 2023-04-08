import { GameApi, plugin, name, dsc } from "../../../model/api/api.js";
export class BoxOnekey extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: "^#置换所有物品$", fnc: "substitution" },
        { reg: "^#一键出售.*$", fnc: "shellAllType" },
      ],
    });
  }
  substitution = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    if(!BotApi.User.surveySet({e})) return false
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
    let bag = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: "user_bag",
    });
    let money = Number(0);
    bag.thing.forEach((item) => {
      money += item.acount * item.price;
    });
    if (money == 0) {
      return false;
    }
    bag.thing = [];
    await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: "user_bag",
      DATA: bag,
    });
    await GameApi.GameUser.userBag({ UID, name: "下品灵石", ACCOUNT: money });
    e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`);
    return false;
  };
  shellAllType = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    if(!BotApi.User.surveySet({e})) return false
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
    const type = e.msg.replace("#一键出售", "");
    const maptype = {
      武器: "1",
      护具: "2",
      法宝: "3",
      丹药: "4",
      功法: "5",
      道具: "6",
    };
    if (!maptype.hasOwnProperty(type)) {
      e.reply(`[蜀山派]叶凡\n此处不收[${type}]`);
      return false;
    }
    let bag = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: "user_bag",
    });
    let money = Number(0);
    const arr = [];
    bag.thing.forEach((item, index) => {
      const id = item.id.split("-");
      if (id[0] == maptype[type]) {
        money += Number(item.acount * item.price);
      } else {
        arr.push(item);
      }
    });
    if (money == 0) {
      return false;
    }
    bag.thing = arr;
    await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: "user_bag",
      DATA: bag,
    });
    await GameApi.GameUser.userBag({ UID, name: "下品灵石", ACCOUNT: money });
    e.reply(`[蜀山派]叶铭\n这是${money}*[下品灵石],道友慢走`);
    return false;
  };
}
