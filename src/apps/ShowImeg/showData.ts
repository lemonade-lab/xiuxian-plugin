import {
  __PATH,
  get_equipment_img,
  get_adminset_img,
  get_power_img,
  get_statezhiye_img,
  get_state_img,
  get_statemax_img,
  get_association_img
} from '../../model/index.js'
import { plugin } from '../../../import.js'
export class showData extends plugin {
  constructor() {
    super({
      name: 'showData',
      dsc: '修仙存档展示',
      event: 'message',
      priority: 600,
      rule: [
        {
          reg: /^(#|\/)我the装备$/,
          fnc: 'show_equipment'
        },
        {
          reg: /^(#|\/)我the炼体$/,
          fnc: 'show_power'
        },
        {
          reg: /^(#|\/)练气境界$/,
          fnc: 'show_Level'
        },
        {
          reg: /^(#|\/)职业等级$/,
          fnc: 'show_Levelzhiye'
        },
        {
          reg: /^(#|\/)炼体境界$/,
          fnc: 'show_LevelMax'
        },
        {
          reg: /^(#|\/)我the宗门$/,
          fnc: 'show_association'
        },
        {
          reg: /^(#|\/)修仙设置$/,
          fnc: 'show_adminset'
        }
      ]
    })
    this.path = __PATH.player_path
  }

  //修仙设置
  async show_adminset(e) {
    if (!e.isMaster) return false

    let img = await get_adminset_img(e)
    e.reply(img)
    return false
  }

  async show_power(e) {
    let img = await get_power_img(e)
    e.reply(img)
    return false
  }
  async show_equipment(e) {
    let img = await get_equipment_img(e)
    e.reply(img)
    return false
  }

  async show_Levelzhiye(e) {
    let img = await get_statezhiye_img(e)
    e.reply(img)
    return false
  }

  async show_Level(e) {
    let img = await get_state_img(e)
    e.reply(img)
    return false
  }

  async show_LevelMax(e) {
    let img = await get_statemax_img(e)
    e.reply(img)
    return false
  }

  //我the宗门
  async show_association(e) {
    let img = await get_association_img(e)
    e.reply(img)
    return false
  }
}
