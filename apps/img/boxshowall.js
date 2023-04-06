import { BotApi, GameApi, plugin, name, dsc } from "../../model/api/api.js";
export class boxshowall extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: "^#修仙地图$", fnc: "showMap" },
        { reg: "^#修仙配置$", fnc: "showConfig" },
        { reg: "^#修仙管理$", fnc: "adminSuper" },
        { reg: "^#修仙(帮助|菜单|help|列表)$", fnc: "boxhelp" },
        { reg: "^#黑市(帮助|菜单|help|列表)$", fnc: "darkhelp" },
      ],
    });
  }
  showMap = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const isreply = await e.reply(
      await BotApi.ImgIndex.showPuppeteer({ path: "map", name: "map" })
    );
    await BotApi.User.surveySet({ e, isreply });
    return false;
  };
  showConfig = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const cf = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "cooling",
    });
    const Ttwist = cf["switch"] ? cf["switch"]["twist"] : true;
    const Tcome = cf["switch"] ? cf["switch"]["come"] : true;
    const isreply = await e.reply(
      await BotApi.ImgIndex.showPuppeteer({
        path: "defset",
        name: "defset",
        data: {
          ...cf,
          Ttwist: Ttwist ? "开启" : "关闭",
          Tcome: Tcome ? "开启" : "关闭",
        },
      })
    );
    await BotApi.User.surveySet({ e, isreply });
    return false;
  };
  adminSuper = async (e) => {
    if (!e.isMaster) return false;
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const data = await BotApi.ImgHelp.getboxhelp({ name: "admin" });
    if (!data) return false;
    const isreply = await e.reply(
      await BotApi.ImgCache.helpcache({ i: 0, data })
    );
    await BotApi.User.surveySet({ e, isreply });
    return false;
  };
  boxhelp = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const data = await BotApi.ImgHelp.getboxhelp({ name: "help" });
    if (!data) return false;
    const isreply = await e.reply(
      await BotApi.ImgCache.helpcache({ i: 1, data })
    );
    await BotApi.User.surveySet({ e, isreply });
    return false;
  };
  darkhelp = async (e) => {
    if (!e.isGroup || e.user_id == 80000000) return false;
    const { whitecrowd, blackid } = await GameApi.DefsetUpdata.getConfig({
      app: "parameter",
      name: "namelist",
    });
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    const data = await BotApi.ImgHelp.getboxhelp({ name: "darkhelp" });
    if (!data) return false;
    const isreply = await e.reply(
      await BotApi.ImgCache.helpcache({ i: 2, data })
    );
    await BotApi.User.surveySet({ e, isreply });
    return false;
  };
}
