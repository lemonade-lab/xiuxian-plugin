import fs from 'node:fs'
import genertate from './generate.js'
import algorithm from './algorithm.js'

/* 存档地址 */
const playerPath = '/xiuxianfile'

function getJsonPare(val) {
  return JSON.parse(fs.readFileSync(val))
}

/* 数据索引 */
export const __PATH = {
  /* 玩家存档:已不在插件内 */
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

  /* 自定义数据 */
  custom_goods: algorithm.getFliePath(`/xiuxiangoods`),

  /* 基础数据：插件内 */
  fixed_point: algorithm.getReq('/resources/datafixed/point'),
  fixed_position: algorithm.getReq('/resources/datafixed/position'),
  fixed_equipment: algorithm.getReq('/resources/datafixed/equipment'),
  fixed_goods: algorithm.getReq('/resources/datafixed/goods'),
  fixed_level: algorithm.getReq('/resources/datafixed/level'),
  fixed_occupation: algorithm.getReq('/resources/datafixed/occupation'),
  fixed_talent: algorithm.getReq('/resources/datafixed/talent'),
  fixed_material: algorithm.getReq('/resources/datafixed/material'),
  fixed_monster: algorithm.getReq('/resources/datafixed/monster'),

  /* 生成数据 */
  generate_all: algorithm.getReq('/resources/databirth/all'),
  generate_position: algorithm.getReq('/resources/databirth/position'),
  generate_level: algorithm.getReq('/resources/databirth/level'),
  // 物品信息
  generate_dogshop: algorithm.getReq('/resources/databirth/dogshop'),

  /* 家园路径 */

  // 玩家存档
  user_home_user: algorithm.getReq('/resources/databirth/home/user'),
  user_home_landgoods: algorithm.getReq('/resources/databirth/home/landgoods'),
  userHomeLife: algorithm.getReq('/resources/databirth/home/life'),
  user_home_minefield: algorithm.getReq('/resources/databirth/home/minefield'),
  user_home_position: algorithm.getReq('/resources/databirth/home/position'),
  user_home_Warehouse: algorithm.getReq('/resources/databirth/home/Warehouse'),
  user_home_cook: algorithm.getReq('/resources/databirth/home/cook'),
  user_home_food: algorithm.getReq('/resources/databirth/home/food'),
  user_home_wanmin: algorithm.getReq('/resources/databirth/home/wanmin'),
  user_home_state: algorithm.getReq('/resources/databirth/home/state'),
  user_home_rangelandannimals: algorithm.getReq('/resources/databirth/home/rangelandannimals'),
  user_home_rangeland: algorithm.getReq('/resources/databirth/home/rangeland'),
  // 物品信息
  home_home_dogshop: algorithm.getReq('/resources/databirth/dogshop'),

  /* 宗门路径 */

  // 玩家存档
  association: algorithm.getReq('/resources/databirth/assItem'),
  // 用户的宗门数据
  assPlayer: algorithm.getReq('/resources/databirth/assPlayer'),
  assTreasureVault: algorithm.getReq('/resources/databirth/assTreasureVault'),
  interimArchive: algorithm.getReq('/resources/databirth/interimArchive'),
  generateUncharted: algorithm.getReq('/resources/databirth/generateUncharted'),
  // 固定
  assRelation: algorithm.getReq('/resources/datafixed/assRelation'),
  assRelate: algorithm.getReq('/resources/datafixed/assRelate'),
  assProduct: algorithm.getReq('/resources/datafixed/assProduct'),
  assDrop: algorithm.getReq('/resources/datafixed/assDrop')
}

/** 生成游戏数据 */
class DateIndex {
  constructor() {
    /* 静态灵根数据 */
    genertate.talent_list = getJsonPare(`${__PATH.fixed_talent}/talent_list.json`)
    /** 动态境界数据  */
    genertate.createList(__PATH.generate_level, 'gaspractice', [])
    genertate.createList(__PATH.generate_level, 'gaspractice', [
      ...genertate.getlist(__PATH.fixed_level, 'gaspractice.json')
    ])
    genertate.createList(__PATH.generate_level, 'bodypractice', [])
    genertate.createList(__PATH.generate_level, 'bodypractice', [
      ...genertate.getlist(__PATH.fixed_level, 'bodypractice.json')
    ])
    /** 全物品数据 */
    genertate.createList(__PATH.generate_all, 'all', [])
    genertate.createList(__PATH.generate_all, 'all', [
      ...genertate.getlist(__PATH.fixed_equipment, 'json'),
      ...genertate.getlist(__PATH.fixed_goods, 'json'),
      ...genertate.getlist(__PATH.custom_goods, 'json')
    ])
    /** 万宝楼数据：万宝楼可以购买  回血丹与基础的新手装备 */
    genertate.createList(__PATH.generate_all, 'commodities', [])
    genertate.createList(__PATH.generate_all, 'commodities', [
      ...genertate.getlist(__PATH.fixed_goods, '0.json'),
      ...genertate.getlist(__PATH.custom_goods, '0.json')
    ])
    /** 怪物掉落 */
    genertate.createList(__PATH.generate_all, 'dropsItem', [])
    genertate.createList(__PATH.generate_all, 'dropsItem', [
      ...genertate.getlist(__PATH.fixed_equipment, '.json'),
      ...genertate.getlist(__PATH.fixed_goods, '.json'),
      ...genertate.getlist(__PATH.custom_goods, '.json')
    ])
    /** 地图：区域位 */
    genertate.createList(__PATH.generate_position, 'position', [])
    genertate.createList(__PATH.generate_position, 'position', [
      ...genertate.getlist(__PATH.fixed_position, 'json')
    ])
    /** 地图：点位  */
    genertate.createList(__PATH.generate_position, 'point', [])
    genertate.createList(__PATH.generate_position, 'point', [
      ...genertate.getlist(__PATH.fixed_point, 'json')
    ])
  }
}
export default new DateIndex()
