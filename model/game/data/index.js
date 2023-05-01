import fs from 'node:fs'
import path from 'node:path'
import createdata from './createdata.js'
import genertate from './generate.js'
import { __dirname } from '../../../app.config.js'
import listdata from './listdata.js'
export const __PATH = {
  /*玩家存档*/
  user_player: path.join(__dirname, '/resources/data/birth/xiuxian/player'),
  user_extend: path.join(__dirname, '/resources/data/birth/xiuxian/extend'),
  user_action: path.join(__dirname, '/resources/data/birth/xiuxian/action'),
  user_battle: path.join(__dirname, '/resources/data/birth/xiuxian/battle'),
  user_equipment: path.join(__dirname, '/resources/data/birth/xiuxian/equipment'),
  user_level: path.join(__dirname, '/resources/data/birth/xiuxian/level'),
  user_talent: path.join(__dirname, '/resources/data/birth/xiuxian/talent'),
  user_wealth: path.join(__dirname, '/resources/data/birth/xiuxian/wealth'),
  user_bag: path.join(__dirname, '/resources/data/birth/xiuxian/najie'),

  user_material: path.join(__dirname, '/resources/data/birth/xiuxian/material'),

  user_life: path.join(__dirname, '/resources/data/birth/xiuxian/life'),

  /* 金银坊 */
  user_bank: path.join(__dirname, '/resources/data/birth/xiuxian/bank'),

  generate_exchange: path.join(__dirname, '/resources/data/birth/xiuxian/exchange'),
  generate_forum: path.join(__dirname, '/resources/data/birth/xiuxian/forum'),
  /**新增玩家概率事件存档*/

  /*基础信息*/
  fixed_point: path.join(__dirname, '/resources/data/fixed/point'),
  fixed_position: path.join(__dirname, '/resources/data/fixed/position'),
  fixed_equipment: path.join(__dirname, '/resources/data/fixed/equipment'),
  fixed_goods: path.join(__dirname, '/resources/data/fixed/goods'),
  fixed_level: path.join(__dirname, '/resources/data/fixed/level'),
  fixed_occupation: path.join(__dirname, '/resources/data/fixed/occupation'),
  fixed_talent: path.join(__dirname, '/resources/data/fixed/talent'),
  fixed_material: path.join(__dirname, '/resources/data/fixed/material'),
  fixed_history: path.join(__dirname, '/resources/data/fixed/history'),
  /*管理员自定义表*/
  custom_goods: path.join(__dirname, '/resources/goods'),
  /*生成信息*/
  generate_all: path.join(__dirname, '/resources/data/birth/all'),
  generate_position: path.join(__dirname, '/resources/data/birth/position'),
  generate_level: path.join(__dirname, '/resources/data/birth/level'),
  generate_plugins: path.join(__dirname, '/plugins'),
  generate_config: path.join(__dirname, '/plugins')
}
/**生成游戏数据*/
class DateIndex {
  constructor() {
    /**生成特定目录*/
    /** 这里遍历底下所有.png文件名？*/
    /** 图片数据*/
    createdata.generateImg()
    /**生成yaml配置数据 */
    createdata.moveConfig({})
    /** 生成jsoon数据 */
    genertate.talent_list = JSON.parse(fs.readFileSync(`${__PATH.fixed_talent}/talent_list.json`))
    genertate.newlist(__PATH.generate_level, 'gaspractice', [])
    genertate.newlist(__PATH.generate_level, 'gaspractice', [
      ...genertate.getlist(__PATH.fixed_level, 'gaspractice.json')
    ])
    genertate.newlist(__PATH.generate_level, 'bodypractice', [])
    genertate.newlist(__PATH.generate_level, 'bodypractice', [
      ...genertate.getlist(__PATH.fixed_level, 'bodypractice.json')
    ])
    /*全物品表*/
    genertate.newlist(__PATH.generate_all, 'all', [])
    genertate.newlist(__PATH.generate_all, 'all', [
      ...genertate.getlist(__PATH.fixed_equipment, 'json'),
      ...genertate.getlist(__PATH.fixed_goods, 'json'),
      ...genertate.getlist(__PATH.custom_goods, 'json')
    ])
    /*商品数据*/
    genertate.newlist(__PATH.generate_all, 'commodities', [])
    genertate.newlist(__PATH.generate_all, 'commodities', [
      ...genertate.getlist(__PATH.fixed_goods, '0.json'),
      ...genertate.getlist(__PATH.custom_goods, '0.json')
    ])
    /*怪物掉落表:部分稀有的不能放进去，所有需要有所控制:只放1级物品、二级物品获取途径待增加？*/
    genertate.newlist(__PATH.generate_all, 'dropsItem', [])
    genertate.newlist(__PATH.generate_all, 'dropsItem', [
      /*只放一级装备和物品*/
      ...genertate.getlist(__PATH.fixed_equipment, '.json'),
      ...genertate.getlist(__PATH.fixed_goods, '.json'),
      ...genertate.getlist(__PATH.custom_goods, '.json')
    ])
    /*地图系统数据*/
    genertate.newlist(__PATH.generate_position, 'position', [])
    genertate.newlist(__PATH.generate_position, 'position', [
      ...genertate.getlist(__PATH.fixed_position, 'json')
    ])
    genertate.newlist(__PATH.generate_position, 'point', [])
    genertate.newlist(__PATH.generate_position, 'point', [
      ...genertate.getlist(__PATH.fixed_point, 'json')
    ])
  }
  /**
   * 你的地址,要选择的box地址,操作表名
   * @param {PATH, CHOICE, NAME} parameter
   * @returns
   */
  addListArr = async ({ PATH, CHOICE, NAME }) => {
    const data = await listdata.listAction({ NAME, CHOICE })
    genertate.newlist(__PATH[CHOICE], NAME, [...data, ...genertate.getlist(PATH, 'json')])
    return
  }
}
export default new DateIndex()
