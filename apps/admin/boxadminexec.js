import { BotApi, GameApi, plugin, name, dsc } from "../../model/api/api.js";
export class boxadminexec extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: "^#修仙插件列表$", fnc: "execList" },
        { reg: "^#修仙安装.*$", fnc: "execAdd" },
        { reg: "^#修仙卸载.*$", fnc: "execDelete" },
      ],
    });
  }
  execList = async (e) => {
    if (!e.isMaster) return false;
    if (!e.isGroup || e.user_id == 80000000) return false;
    if (!BotApi.User.surveySet({ e })) return false;
    e.reply("[插件列表]\n1.宗门(势力玩法)\n2.家园(休闲玩法)\n3.青楼(施工中)");
    return false;
  };
  execAdd = async (e) => {
    if (!e.isMaster) return false;
    if (!e.isGroup || e.user_id == 80000000) return false;
    if (!BotApi.User.surveySet({ e })) return false;
    const name = e.msg.replace("#修仙安装", "");
    const storehouseName = {
      宗门: "xiuxian-association-plugin",
      家园: "xiuxian-home-plugin",
    };
    const storehouse = {
      宗门: `https://gitee.com/mg1105194437/${storehouseName[name]}.git ./plugins/${storehouseName[name]}/`,
      家园: `https://gitee.com/mmmmmddddd/${storehouseName[name]}.git ./plugins/${storehouseName[name]}/`,
    };
    if (!storehouse.hasOwnProperty(name)) {
      e.reply(`没有[${name}]`);
      return false;
    }
    if (GameApi.Algorithm.isPlugin(storehouseName[name])) {
      e.reply("已存在该插件");
      return false;
    }
    const cmd = `git clone --depth=1 -b master ${storehouse[name]}`;
    console.log(cmd);
    const push = {
      updata: "修新版",
      err: "安装失败",
      success: "安装成功",
    };
    await BotApi.Exec.onExec({ cmd, e, push });
    return false;
  };
  execDelete = async (e) => {
    if (!e.isMaster) return false;
    if (!e.isGroup || e.user_id == 80000000) return false;
    if (!BotApi.User.surveySet({ e })) return false;
    const name = e.msg.replace("#修仙卸载", "");
    const storehouseName = {
      宗门: "xiuxian-association-plugin",
      家园: "xiuxian-home-plugin",
    };
    const storehouse = {
      宗门: `plugins/${storehouseName[name]}`,
      家园: `plugins/${storehouseName[name]}`,
    };
    if (!storehouse.hasOwnProperty(name)) {
      e.reply(`没有[${name}]`);
      return false;
    }
    if (!GameApi.Algorithm.isPlugin(storehouseName[name])) {
      e.reply("不存在该插件");
      return false;
    }
    const cmd = `rm -rf ${storehouse[name]}`;
    console.log(cmd);
    const push = {
      updata: "修新版",
      err: "卸载失败",
      success: "卸载成功",
    };
    await BotApi.Exec.onExec({ cmd, e, push });
    return false;
  };
}
