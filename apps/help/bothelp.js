import { plugin, puppeteer } from "../../api/api.js";
import Help from "../../model/help.js";
import md5 from "md5";
let helpData = {
  md5: "",
  img: "",
};
export class bothelp extends plugin {
  constructor() {
    super({
      name: "XiuxianBotHelp",
      dsc: "XiuxianBotHelp",
      event: "message",
      priority: 400,
      rule: [
        {
          reg: "^#修仙帮助$",
          fnc: "Xiuxianhelp",
        },
        {
          reg: "^#修仙管理$",
          fnc: "adminsuper",
        },
        {
          reg: "^#宗门管理$",
          fnc: "AssociationAdmin",
        },
        {
          reg: "^#修仙扩展$",
          fnc: "Xiuxianhelpcopy",
        },
      ],
    });
  }

  async Xiuxianhelpcopy(e) {
    if (!e.isGroup) return;
    let data = await Help.gethelpcopy(e);
    if (!data) return;
    let img = await this.cache(data);
    await e.reply(img);
  }

  async Xiuxianhelp(e) {
    if (!e.isGroup) return;
    let data = await Help.get(e);
    if (!data) return;
    let img = await this.cache(data);
    await e.reply(img);
  }

  async adminsuper(e) {
    if (!e.isGroup) return;
    let data = await Help.setup(e);
    if (!data) return;
    let img = await this.cache(data);
    await e.reply(img);
  }

  async AssociationAdmin(e) {
    if (!e.isGroup) return;
    let data = await Help.Association(e);
    if (!data) return;
    let img = await this.cache(data);
    await e.reply(img);
  }

  async cache(data) {
    let tmp = md5(JSON.stringify(data));
    if (helpData.md5 == tmp) return helpData.img;
    helpData.img = await puppeteer.screenshot("help", data);
    helpData.md5 = tmp;
    return helpData.img;
  }
}
