import { plugin,verc } from "../../api/api.js";
import {
  __PATH,
  get_equipment_img,
  get_adminset_img,
  get_power_img,
  get_statezhiye_img,
  get_state_img,
  get_statemax_img,
  get_association_img,
} from "../../model/xiuxian.js";
export class showData extends plugin {
  constructor(e) {
    super({
      name: "showData",
      dsc: "修仙存档展示",
      event: "message",
      priority: 600,
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
          fnc: "show_Level",
        },
        {
          reg: "^#职业等级$",
          fnc: "show_Levelzhiye",
        },
        {
          reg: "^#炼体境界$",
          fnc: "show_LevelMax",
        },
        {
          reg: "^#我的宗门$",
          fnc: "show_association",
        },
        {
          reg: "^#修仙设置$",
          fnc: "show_adminset",
        },
      ],
    });
    this.path = __PATH.player_path;
  }

  //修仙设置
  async show_adminset(e) {
    if (!e.isMaster) return;
if (!verc({ e })) return false;
    let img = await get_adminset_img(e);
    e.reply(img);
    return;
  }

  async show_power(e) {
if (!verc({ e })) return false;
    let img = await get_power_img(e);
    e.reply(img);
    return;
  }
  async show_equipment(e) {
if (!verc({ e })) return false;
    let img = await get_equipment_img(e);
    e.reply(img);
    return;
  }

  async show_Levelzhiye(e) {
if (!verc({ e })) return false;
    let img = await get_statezhiye_img(e);
    e.reply(img);
    return;
  }

  async show_Level(e) {
if (!verc({ e })) return false;
    let img = await get_state_img(e);
    e.reply(img);
    return;
  }

  async show_LevelMax(e) {
if (!verc({ e })) return false;
    let img = await get_statemax_img(e);
    e.reply(img);
    return;
  }

  //我的宗门
  async show_association(e) {
if (!verc({ e })) return false;
    let img = await get_association_img(e);
    e.reply(img);
    return;
  }
}
