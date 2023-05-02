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
  generate_plugins: algorithm.getReq('/plugins'),
  generate_config: algorithm.getReq('/plugins')
}

/**生成游戏数据*/
class DateIndex {
  constructor() {
    /**生成yaml配置数据 */
    createdata.moveConfig({})
    /**
     * 读取文件,当文件与当前时间不同时,
     */

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
