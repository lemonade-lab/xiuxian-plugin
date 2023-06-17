import fs from 'node:fs'
import createdata from './createdata.js'
import genertate from './generate.js'
import listdata from './listdata.js'
import algorithm from './algorithm.js'

/* 存档地址 */
const playerPath = '/xiuxianfile'

/* 数据索引 */
export const __PATH = {
  /*玩家存档*/
  user_player: algorithm.getFliePath(`${playerPath}/player`),
  user_extend: algorithm.getFliePath(`${playerPath}/extend`),
  user_action: algorithm.getFliePath(`${playerPath}/action`),
  user_battle: algorithm.getFliePath(`${playerPath}/battle`),
  user_equipment: algorithm.getFliePath(`${playerPath}/equipment`),
  user_level: algorithm.getFliePath(`${playerPath}/level`),
  user_talent: algorithm.getFliePath(`${playerPath}/talent`),
  user_wealth: algorithm.getFliePath(`${playerPath}/wealth`),
  user_bag: algorithm.getFliePath(`${playerPath}/najie`),

  user_life: algorithm.getFliePath(`${playerPath}/life`),

  user_material: algorithm.getFliePath(`${playerPath}/material`),

  /* 金银坊 */
  user_bank: algorithm.getFliePath(`${playerPath}/bank`),
  /* 虚空境 */
  generate_exchange: algorithm.getFliePath(`${playerPath}/exchange`),
  /* 虚空栈 */
  generate_forum: algorithm.getFliePath(`${playerPath}/forum`),

  /*自定义数据*/
  custom_goods: algorithm.getFliePath(`/xiuxiangoods`),

  /*基础数据*/
  fixed_point: algorithm.getReq('/resources/datafixed/point'),
  fixed_position: algorithm.getReq('/resources/datafixed/position'),
  fixed_equipment: algorithm.getReq('/resources/datafixed/equipment'),
  fixed_goods: algorithm.getReq('/resources/datafixed/goods'),
  fixed_level: algorithm.getReq('/resources/datafixed/level'),
  fixed_occupation: algorithm.getReq('/resources/datafixed/occupation'),
  fixed_talent: algorithm.getReq('/resources/datafixed/talent'),
  fixed_material: algorithm.getReq('/resources/datafixed/material'),
  fixed_history: algorithm.getReq('/resources/datafixed/history'),
  fixed_monster: algorithm.getReq('/resources/datafixed/monster'),

  /*生成数据*/
  generate_all: algorithm.getReq('/resources/databirth/all'),
  generate_position: algorithm.getReq('/resources/databirth/position'),
  generate_level: algorithm.getReq('/resources/databirth/level'),

  /* 家园路径 */

  //玩家存档
  user_home_home: algorithm.getReq('/resources/databirth/home/home'),
  user_home_landgoods: algorithm.getReq('/resources/databirth/home/landgoods'),
  user_home_life: algorithm.getReq('/resources/databirth/home/life'),
  user_home_minefield: algorithm.getReq('/resources/databirth/home/minefield'),
  user_home_position: algorithm.getReq('/resources/databirth/home/position'),
  user_home_Warehouse: algorithm.getReq('/resources/databirth/home/Warehouse'),
  user_home_cook: algorithm.getReq('/resources/databirth/home/cook'),
  user_home_food: algorithm.getReq('/resources/databirth/home/food'),
  user_home_wanmin: algorithm.getReq('/resources/databirth/home/wanmin'),
  user_home_state: algorithm.getReq('/resources/databirth/home/state'),
  user_home_rangelandannimals: algorithm.getReq('/resources/databirth/home/rangelandannimals'),
  user_home_rangeland: algorithm.getReq('/resources/databirth/home/rangeland'),
  //物品信息
  home_home_goods: algorithm.getReq('/resources/datafixed/goods'),
  home_home_point: algorithm.getReq('/resources/datafixed/point'),
  //生成信息
  home_home_all: algorithm.getReq('/resources/databirth/all'),
  home_home_dogshop: algorithm.getReq('/resources/databirth/dogshop')
}

/**生成游戏数据*/
class DateIndex {
  constructor() {
    /**生成yaml配置数据 */
    createdata.moveConfig()
    /**
     * 动态境界数据
     */
    genertate.talent_list = JSON.parse(fs.readFileSync(`${__PATH.fixed_talent}/talent_list.json`))
    genertate.newlist(__PATH.generate_level, 'gaspractice', [])
    genertate.newlist(__PATH.generate_level, 'gaspractice', [
      ...genertate.getlist(__PATH.fixed_level, 'gaspractice.json')
    ])
    genertate.newlist(__PATH.generate_level, 'bodypractice', [])
    genertate.newlist(__PATH.generate_level, 'bodypractice', [
      ...genertate.getlist(__PATH.fixed_level, 'bodypractice.json')
    ])
    /**
     * 全物品数据
     */
    genertate.newlist(__PATH.generate_all, 'all', [])
    genertate.newlist(__PATH.generate_all, 'all', [
      ...genertate.getlist(__PATH.fixed_equipment, 'json'),
      ...genertate.getlist(__PATH.fixed_goods, 'json'),
      ...genertate.getlist(__PATH.custom_goods, 'json')
    ])
    /**
     * #万宝楼数据：万宝楼可以购买  回血丹与基础的新手装备
     */
    genertate.newlist(__PATH.generate_all, 'commodities', [])
    genertate.newlist(__PATH.generate_all, 'commodities', [
      ...genertate.getlist(__PATH.fixed_goods, '0.json'),
      ...genertate.getlist(__PATH.custom_goods, '0.json')
    ])
    /**
     * 怪物掉落
     */
    genertate.newlist(__PATH.generate_all, 'dropsItem', [])
    genertate.newlist(__PATH.generate_all, 'dropsItem', [
      ...genertate.getlist(__PATH.fixed_equipment, '.json'),
      ...genertate.getlist(__PATH.fixed_goods, '.json'),
      ...genertate.getlist(__PATH.custom_goods, '.json')
    ])
    /**
     * 地图：区域位
     */
    genertate.newlist(__PATH.generate_position, 'position', [])
    genertate.newlist(__PATH.generate_position, 'position', [
      ...genertate.getlist(__PATH.fixed_position, 'json')
    ])
    /**
     * 地图：点位
     */
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
