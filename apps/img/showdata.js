import { plugin, name, dsc } from "../../api/api.js";
import {
  get_adminset_img,
  get_power_img,
  get_equipment_img,
  get_state_img,
  get_statemax_img,
  get_updata_img,
  get_association_img,
} from "../../model/information.js";
import config from "../../model/config.js";
export class showdata extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        {
          reg: "^#我的装备$",
          fnc: "show_equipment",
        },
        {
          reg: "^#我的炼体$",
          fnc: "show_power",
        },
        {
          reg: "^#练气境界$",
          fnc: "show_level",
        },
        {
          reg: "^#炼体境界$",
          fnc: "show_levelMax",
        },
        {
          reg: "^#我的宗门$",
          fnc: "show_association",
        },
        {
          reg: "^#(修仙版本|更新预告)$",
          fnc: "show_updata",
        },
        {
          reg: "^#修仙设置$",
          fnc: "show_adminset",
        },
      ],
    });
  }

  //修仙设置
  async show_adminset(e) {
    if (!e.isMaster) return false;
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let img = await get_adminset_img(e);
    e.reply(img);
    return false;
  }

  async show_power(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let img = await get_power_img(e);
    e.reply(img);
    return false;
  }

  async show_equipment(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let img = await get_equipment_img(e);
    e.reply(img);
    return false;
  }

  async show_level(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let img = await get_state_img(e);
    e.reply(img);
    return false;
  }

  async show_levelMax(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let img = await get_statemax_img(e);
    e.reply(img);
    return false;
  }

  //我的宗门
  async show_association(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let img = await get_association_img(e);
    e.reply(img);
    return false;
  }

  //更新记录
  async show_updata(e) {
    if (!e.isGroup  || e.user_id == 80000000)
      return false;
    const { whitecrowd, blackid } = config.getconfig("parameter", "namelist");
    if (whitecrowd.indexOf(e.group_id) == -1) return false;
    if (blackid.indexOf(e.user_id) != -1) return false;
    let img = await get_updata_img(e);
    e.reply(img);
    return false;
  }
}
