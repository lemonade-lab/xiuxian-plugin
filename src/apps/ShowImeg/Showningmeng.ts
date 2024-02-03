import { plugin } from '../../api/api.js'
import { __PATH } from '../../model/xiuxian.js'
import {
  get_gongfa_img,
  get_danyao_img,
  get_wuqi_img,
  get_daoju_img,
  get_XianChong_img,
  get_valuables_img,
  get_ningmenghome_img
} from '../../model/xiuxian.js'
export class Showningmeng extends plugin {
  constructor(e) {
    super({
      name: 'Showningmeng',
      dsc: '修仙存档展示',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: '^#万宝楼$',
          fnc: 'show_valuables'
        },
        {
          reg: '^#装备楼$',
          fnc: 'Show_WuQi'
        },
        {
          reg: '^#丹药楼$',
          fnc: 'Show_DanYao'
        },
        {
          reg: '^#功法楼$',
          fnc: 'Show_GongFa'
        },
        {
          reg: '^#道具楼$',
          fnc: 'Show_DaoJu'
        },
        {
          reg: '^#仙宠楼$',
          fnc: 'Show_XianChong'
        },

        {
          reg: '^#柠檬堂(装备|丹药|功法|道具|草药|武器|护具|法宝|血量|修为|血气|天赋)?$',
          fnc: 'show_ningmenghome'
        }
      ]
    })
    this.path = __PATH.player_path
  }
  //柠檬堂
  async show_ningmenghome(e) {
    let thing_type = e.msg.replace('#柠檬堂', '')
    let img = await get_ningmenghome_img(e, thing_type)
    e.reply(img)
    return false
  }
  //万宝楼
  async show_valuables(e) {
    let img = await get_valuables_img(e)
    e.reply(img)
    return false
  }
  //仙宠楼
  async Show_XianChong(e) {
    let img = await get_XianChong_img(e)
    e.reply(img)
    return false
  }

  //武器楼
  async Show_WuQi(e) {
    let img = await get_wuqi_img(e)
    e.reply(img)
    return false
  }

  //丹药楼
  async Show_DanYao(e) {
    let img = await get_danyao_img(e)
    e.reply(img)
    return false
  }
  //功法楼
  async Show_GongFa(e) {
    let img = await get_gongfa_img(e)
    e.reply(img)
    return false
  }

  //道具楼
  async Show_DaoJu(e) {
    let img = await get_daoju_img(e)
    e.reply(img)
    return false
  }
}
