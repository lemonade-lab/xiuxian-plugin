import { BotApi, GameApi, plugin, name, dsc } from "../../../model/api/api.js";
export class BoxBank extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: "^#金银坊$", fnc: "moneyWorkshop" },
        { reg: "^#金银置换.*$", fnc: "substitution" },
      ],
    });
  }
  moneyWorkshop = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    if (!BotApi.User.controlMessage({ e })) return false;
    const UID = e.user_id;
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply("已死亡");
      return false;
    }
    const StorageList = await GameApi.UserData.listActionInitial({
      NAME: "storage",
      CHOICE: "user_bank",
      INITIAL: {},
    });
    const WhiteBarList = await GameApi.UserData.listActionInitial({
      NAME: "whiteBar",
      CHOICE: "user_bank",
      INITIAL: {},
    });
    const msg = [];
    if (!StorageList.hasOwnProperty(UID)) {
      msg.push("无存款记录");
    } else {
      msg.push(`存款:${StorageList[UID].account}`);
    }
    if (!WhiteBarList.hasOwnProperty(UID)) {
      msg.push("无白条记录");
    } else {
      msg.push(`借款:${WhiteBarList[UID].money}`);
    }
    await BotApi.User.forwardMsgSurveySet({ e, data: msg });
    return false;
  };

  substitution = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    if (!BotApi.User.controlMessage({ e })) return false;
    const UID = e.user_id;
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply("已死亡");
      return false;
    }
    const [account, name] = e.msg.replace("#金银置换", "").split("*");
    let new_account = await GameApi.GamePublic.leastOne({ value: account });
    const money = await GameApi.GameUser.userBagSearch({
      UID,
      name: "下品灵石",
    });
    if (!money || money.acount < new_account) {
      e.reply(`[金银坊]金老三\n?哪儿来的穷鬼！`);
      return false;
    }
    if (new_account < 5000) {
      e.reply(`[金银坊]金老三\n少于5000不换`);
      return false;
    }
    let new_name = "中品灵石";
    let size = 30;
    switch (name) {
      case "上品灵石": {
        new_name = name;
        size = 400;
        break;
      }
      case "极品灵石": {
        new_name = name;
        size = 5000;
        break;
      }
      default: {
        new_name = "中品灵石";
        size = 30;
        break;
      }
    }
    const new_money = Math.floor(new_account / size);
    await GameApi.GameUser.userBag({
      UID,
      name: "下品灵石",
      ACCOUNT: -Number(new_account),
    });
    await GameApi.GameUser.userBag({
      UID,
      name: new_name,
      ACCOUNT: Number(new_money),
    });
    e.reply(`[下品灵石]*${new_account}\n置换成\n[${new_name}]*${new_money}`);
    return false;
  };
}
