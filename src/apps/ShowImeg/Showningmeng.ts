import {
  __PATH,
  get_gongfa_img,
  get_danyao_img,
  get_wuqi_img,
  get_daoju_img,
  get_XianChong_img,
  get_valuables_img,
  get_ningmenghome_img
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class Showningmeng extends plugin {
  constructor() {
    super({
      name: 'Showningmeng',
      dsc: '修仙存档展示',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: /^(#|\/)万宝楼$/,
          fnc: 'show_valuables'
        },
        {
          reg: /^(#|\/)装备楼$/,
          fnc: 'Show_WuQi'
        },
        {
          reg: /^(#|\/)丹药楼$/,
          fnc: 'Show_DanYao'
        },
        {
          reg: /^(#|\/)skill楼$/,
          fnc: 'Show_GongFa'
        },
        {
          reg: /^(#|\/)道具楼$/,
          fnc: 'Show_DaoJu'
        },
        {
          reg: /^(#|\/)仙宠楼$/,
          fnc: 'Show_XianChong'
        },

        {
          reg: /^(#|\/)柠檬堂(装备|丹药|skill|道具|草药|weapon|protective_clothing|magic_weapon|血量|now_exp|血气|天赋)?$/,
          fnc: 'show_ningmenghome'
        }
      ]
    })
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

  //weapon楼
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
  //skill楼
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
