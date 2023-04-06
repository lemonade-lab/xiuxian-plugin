import { BotApi, GameApi, plugin, name, dsc } from "../../../model/api/api.js";
export class BoxBank extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: "^#金银坊$", fnc: "moneyWorkshop" },
        { reg: "^#金银置换.*$", fnc: "substitution" },
        //   {
        //     reg: "^#金银存储.*$",
        //     fnc: "storage",
        //   },
        //   {
        //     reg: "^#金银取出.*$",
        //     fnc: "withdraw",
        //   },
        //   {
        //     reg: "^#金银白条.*$",
        //     fnc: "whiteBar",
        //   },
        //   {
        //     reg: "^#金银消条.*$",
        //     fnc: "deleteWhiteBar",
        //   },
      ],
    });
  }

  moneyWorkshop = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
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
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
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

  storage = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const UID = e.user_id;
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply("已死亡");
      return false;
    }
    const account = await GameApi.GamePublic.leastOne({
      value: e.msg.replace("#金银存储", ""),
    });
    const money = await GameApi.GameUser.userBagSearch({
      UID,
      name: "下品灵石",
    });
    if (!money || money.acount < account) {
      e.reply(`[金银坊]金老三\n?哪儿来的穷鬼`);
      return false;
    }
    if (account < 5000) {
      e.reply(`[金银坊]金老三\n少于5000下品不要`);
      return false;
    }
    const StorageList = await GameApi.UserData.listActionInitial({
      NAME: "storage",
      CHOICE: "user_bank",
      INITIAL: {},
    });
    if (StorageList.hasOwnProperty(UID)) {
      const NOW_TIME = new Date().getTime();
      let money = StorageList[UID].account; //
      if (StorageList[UID].time + 86400000 < NOW_TIME) {
        const yers = Math.floor((NOW_TIME - StorageList[UID].time) / 3600000);
        money += Math.floor(StorageList[UID].account * yers * 0.005);
      }
      money += account;
      await GameApi.GameUser.userBag({
        UID,
        name: "下品灵石",
        ACCOUNT: -Number(account),
      });
      const isreply = await e.reply(
        `${UID}成功再存储${account}下品灵石,当前存储总金额${money}`
      );
      await BotApi.User.surveySet({ e, isreply });
      StorageList[UID].account = money;
      await GameApi.UserData.listActionInitial({
        NAME: "storage",
        CHOICE: "user_bank",
        INITIAL: {},
        DATA: StorageList,
      });
      return false;
    }
    StorageList[UID] = {
      account,
      time: new Date().getTime(),
    };
    await GameApi.UserData.listActionInitial({
      NAME: "storage",
      CHOICE: "user_bank",
      INITIAL: {},
      DATA: StorageList,
    });
    await GameApi.GameUser.userBag({
      UID,
      name: "下品灵石",
      ACCOUNT: -Number(account),
    });
    const isreply = await e.reply(`${UID}成功存储${account}下品灵石`);
    await BotApi.User.surveySet({ e, isreply });
    return false;
  };

  withdraw = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const UID = e.user_id;
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply("已死亡");
      return false;
    }
    const account = await GameApi.GamePublic.leastOne({
      value: await GameApi.GamePublic.leastOne({
        value: e.msg.replace("#金银取出", ""),
      }),
    });
    if (account < 5000) {
      e.reply(`[金银坊]金老三\n取出少于5000`);
      return false;
    }
    const StorageList = await GameApi.UserData.listActionInitial({
      NAME: "storage",
      CHOICE: "user_bank",
      INITIAL: {},
    });
    if (!StorageList.hasOwnProperty(UID)) {
      e.reply("无存款记录");
      return false;
    }
    const NOW_TIME = new Date().getTime();
    let money = StorageList[UID].account;
    if (StorageList[UID].time + 86400000 < NOW_TIME) {
      const yers = Math.floor((NOW_TIME - StorageList[UID].time) / 3600000);
      money += Math.floor(StorageList[UID].account * yers * 0.005);
    }
    if (money < account) {
      e.reply(`不足${account}`);
      return false;
    }
    if (money - account <= 0) {
      StorageList[UID] = undefined;
    } else {
      StorageList[UID].account = money - account;
    }
    await GameApi.UserData.listActionInitial({
      NAME: "storage",
      CHOICE: "user_bank",
      INITIAL: {},
      DATA: StorageList,
    });
    await GameApi.GameUser.userBag({
      UID,
      name: "下品灵石",
      ACCOUNT: Number(account),
    });
    const isreply = await e.reply(`${UID}成功取出${account}`);
    await BotApi.User.surveySet({ e, isreply });
    return false;
  };

  whiteBar = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const UID = e.user_id;
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply("已死亡");
      return false;
    }
    const WhiteBarList = await GameApi.UserData.listActionInitial({
      NAME: "whiteBar",
      CHOICE: "user_bank",
      INITIAL: {},
    });
    if (WhiteBarList.hasOwnProperty(UID)) {
      e.reply(`尚有${WhiteBarList[UID].money}白条记录,请先[#金银消条+金额]`);
      return false;
    }
    /**借钱需要一定的境界 */
    const level = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: "user_level",
    });
    if (level.level_id <= 3) {
      e.reply(`哪儿来的毛头小子`);
      return false;
    }
    const money = await GameApi.GamePublic.leastOne({
      value: e.msg.replace("#金银白条", ""),
    });
    if (money < 10000) {
      e.reply(`白条不足10000`);
      return false;
    }
    if (money > 10000 * level.level_id) {
      e.reply(`白条最高${10000 * level.level_id}`);
      return false;
    }
    const time = new Date().getTime();
    WhiteBarList[UID] = {
      time,
      money,
    };
    await GameApi.UserData.listActionInitial({
      NAME: "whiteBar",
      CHOICE: "user_bank",
      INITIAL: {},
      DATA: WhiteBarList,
    });
    await GameApi.GameUser.userBag({
      UID,
      name: "下品灵石",
      ACCOUNT: Number(money),
    });
    e.reply(`成功白条${money}`);
    return false;
  };

  deleteWhiteBar = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const UID = e.user_id;
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply("已死亡");
      return false;
    }
    const WhiteBarList = await GameApi.UserData.listActionInitial({
      NAME: "whiteBar",
      CHOICE: "user_bank",
      INITIAL: {},
    });
    if (!WhiteBarList.hasOwnProperty(UID)) {
      e.reply(`未有白条记录`);
      return false;
    }
    const money = await GameApi.GamePublic.leastOne({
      value: e.msg.replace("#金银消条", ""),
    });
    const bag_money = await GameApi.GameUser.userBagSearch({
      UID,
      name: "下品灵石",
    });
    if (!bag_money || bag_money.acount < money) {
      e.reply(`背包不足${money}`);
      return false;
    }
    let account = money;
    if (money <= WhiteBarList[UID].money) {
      WhiteBarList[UID].money -= money;
      if (WhiteBarList[UID].money <= 0) {
        WhiteBarList[UID] = undefined;
      }
    } else {
      account = WhiteBarList[UID].money;
      WhiteBarList[UID] = undefined;
    }
    await GameApi.UserData.listActionInitial({
      NAME: "whiteBar",
      CHOICE: "user_bank",
      INITIAL: {},
      DATA: WhiteBarList,
    });
    await GameApi.GameUser.userBag({
      UID,
      name: "下品灵石",
      ACCOUNT: -Number(account),
    });
    e.reply(`${UID}成功消条${account}`);
    return false;
  };
}
