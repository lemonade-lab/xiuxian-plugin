import { BotApi, GameApi, HomeApi, plugin } from "../../model/api/api.js";
export class HomeGetHelp extends plugin {
  constructor() {
    super(
      BotApi.SuperInex.getUser({
        rule: [
          {
            reg: "^#家园(帮助|菜单|help|列表)$",
            fnc: "homeHelp",
          },
          {
            reg: "^#家园管理$",
            fnc: "homeAdmin",
          },
        ],
      })
    );
  }
  homeHelp = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const data = await BotApi.ImgHelp.getboxhelp({ name: "home_help" });
    if (!data) {
      return;
    }
    const isreply = await e.reply(
      await BotApi.ImgCache.helpcache({ i: 1, data })
    );
    await BotApi.User.surveySet({ e, isreply });
  };
  homeAdmin = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const data = await BotApi.ImgHelp.getboxhelp({ name: "home_admin" });
    if (!data) {
      return;
    }
    const isreply = await e.reply(
      await BotApi.ImgCache.helpcache({ i: 0, data })
    );
    await BotApi.User.surveySet({ e, isreply });
  };
}
