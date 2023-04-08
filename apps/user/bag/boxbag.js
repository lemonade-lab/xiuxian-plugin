import { BotApi, GameApi, plugin, name, dsc } from "../../../model/api/api.js";
export class BoxBag extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: "^#储物袋$", fnc: "showBag" },
        { reg: "^#升级储物袋$", fnc: "bagUp" },
      ],
    });
  }
  showBag = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    if (!BotApi.User.surveySet({ e })) return false;
    const UID = e.user_id;
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply("已死亡");
      return false;
    }
    const { path, name, data } = await GameApi.Information.userBagShow({ UID });
    const isreply = await e.reply(
      await BotApi.ImgIndex.showPuppeteer({ path, name, data })
    );
    await BotApi.User.surveySet({ e, isreply });
    return false;
  };
  bagUp = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    if (!BotApi.User.surveySet({ e })) return false;
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply("已死亡");
      return false;
    }
    const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id });
    if (MSG) {
      e.reply(MSG);
      return false;
    }
    const UID = e.user_id;
    const najie = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: "user_bag",
    });
    const najie_price = GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "cooling",
    }).najie_price[najie.grade];
    if (!najie_price) {
      return false;
    }
    const thing = await GameApi.GameUser.userBagSearch({
      UID,
      name: "下品灵石",
    });
    if (!thing || thing.acount < najie_price) {
      e.reply(`灵石不足,需要准备${najie_price}*[下品灵石]`);
      return false;
    }
    najie.grade += 1;
    await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: "user_bag",
      DATA: najie,
    });
    await GameApi.GameUser.userBag({
      UID,
      name: "下品灵石",
      ACCOUNT: -Number(najie_price),
    });
    e.reply(`花了${najie_price}*[下品灵石]升级,目前储物袋为${najie.grade}`);
    return false;
  };
}
