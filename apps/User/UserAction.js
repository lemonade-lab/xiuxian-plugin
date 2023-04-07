import { plugin } from "../../api/api.js";
import config from "../../model/Config.js";
import {
  Read_player,
  existplayer,
  Read_najie,
  Write_najie,
  Add_灵石,
  __PATH,
  Go,
  get_najie_img,
} from "../../model/xiuxian.js";
export class UserAction extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: "UserAction",
      /** 功能描述 */
      dsc: "交易模块",
      event: "message",
      /** 优先级，数字越小等级越高 */
      priority: 600,
      rule: [
        {
          reg: "^#我的纳戒$",
          fnc: "Show_najie",
        },
        {
          reg: "^#升级纳戒$",
          fnc: "Lv_up_najie",
        },
      ],
    });
  }

  //#我的纳戒
  async Show_najie(e) {
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) return;
    let img = await get_najie_img(e);
    e.reply(img);
    return;
  }

  //纳戒升级
  async Lv_up_najie(e) {
    if (!e.isGroup) return;
    let flag = await Go(e);
    if (!flag) {
      return;
    }
    let usr_qq = e.user_id;
    //有无存档
    let ifexistplay = await existplayer(usr_qq);
    if (!ifexistplay) return;
    let najie = await Read_najie(usr_qq);
    let player = await Read_player(usr_qq);
    const cf = config.getConfig("xiuxian", "xiuxian");
    let najie_num = cf.najie_num;
    let najie_price = cf.najie_price;
    if (najie.等级 == najie_num.length) {
      e.reply("你的纳戒已经是最高级的了");
      return;
    }
    if (player.灵石 < najie_price[najie.等级]) {
      e.reply(
        `灵石不足,还需要准备${najie_price[najie.等级] - player.灵石}灵石`
      );
      return;
    }
    await Add_灵石(usr_qq, -najie_price[najie.等级]);
    najie.灵石上限 = najie_num[najie.等级];
    najie.等级 += 1;
    await Write_najie(usr_qq, najie);
    e.reply(
      `你的纳戒升级成功,花了${
        najie_price[najie.等级 - 1]
      }灵石,目前纳戒灵石存储上限为${najie.灵石上限},可以使用【#我的纳戒】来查看`
    );
    return;
  }
}
