import genertate from './generate.js'
import algorithm from './algorithm.js'

/* 存档地址 */
const GPPath = '/xiuxianfile'

/* 数据索引 */
export const __PATH = {
  /* 玩家存档:已不在插件内 */
  user_extend: algorithm.getFliePath(`${GPPath}/extend`), // 增浮
  user_action: algorithm.getFliePath(`${GPPath}/action`), // 地图行为
  user_battle: algorithm.getFliePath(`${GPPath}/battle`), // 战斗
  user_equipment: algorithm.getFliePath(`${GPPath}/equipment`), // 装备
  user_level: algorithm.getFliePath(`${GPPath}/level`), // 境界
  user_talent: algorithm.getFliePath(`${GPPath}/talent`), // 天赋
  user_bag: algorithm.getFliePath(`${GPPath}/najie`), // 背包
  user_life: algorithm.getFliePath(`${GPPath}/life`), // 寿命
  user_material: algorithm.getFliePath(`${GPPath}/material`), //
  user_bank: algorithm.getFliePath(`${GPPath}/bank`), // 金银坊
  generate_exchange: algorithm.getFliePath(`${GPPath}/exchange`), // 虚空境
  /* 基础数据：插件内 */
  fixed_point: algorithm.getReq('/resources/datafixed/point'), // 点位
  fixed_position: algorithm.getReq('/resources/datafixed/position'), // 区域位
  fixed_equipment: algorithm.getReq('/resources/datafixed/equipment'), // 装备
  fixed_goods: algorithm.getReq('/resources/datafixed/goods'), // 物品
  fixed_occupation: algorithm.getReq('/resources/datafixed/occupation'), //
  fixed_talent: algorithm.getReq('/resources/datafixed/talent'), // 灵根
  fixed_material: algorithm.getReq('/resources/datafixed/material'), //
  fixed_monster: algorithm.getReq('/resources/datafixed/monster'), // 怪物
  fixed_levels: algorithm.getReq('/resources/datafixed/levels'), // 境界

  /* 生成数据：插件内 */
  generate_all: algorithm.getReq('/resources/databirth/all'), // 所有数据
  generate_position: algorithm.getReq('/resources/databirth/position'), // 位置
  generate_dogshop: algorithm.getReq('/resources/databirth/dogshop'), // 灵瑶阁

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

  /* 宗门路径 */

  association: algorithm.getReq('/resources/databirth/assItem'), // 玩家存档
  // 用户数据
  assGP: algorithm.getReq('/resources/databirth/assGP'),
  assTreasureVault: algorithm.getReq('/resources/databirth/assTreasureVault'),
  interimArchive: algorithm.getReq('/resources/databirth/interimArchive'),
  generateUncharted: algorithm.getReq('/resources/databirth/generateUncharted'),
  // 固定数据
  assRelation: algorithm.getReq('/resources/datafixed/assRelation'),
  assRelate: algorithm.getReq('/resources/datafixed/assRelate'),
  assProduct: algorithm.getReq('/resources/datafixed/assProduct'),
  assDrop: algorithm.getReq('/resources/datafixed/assDrop')
}

/** 生成游戏数据 */
class DateIndex {
  constructor() {
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
    /** 全物品数据 */
    genertate.createList(__PATH.generate_all, 'all', [])
    genertate.createList(__PATH.generate_all, 'all', [
      ...genertate.getlist(__PATH.fixed_equipment, 'json'), // 物品
      ...genertate.getlist(__PATH.fixed_goods, 'json') // 装备
    ])
    /** 万宝楼数据：万宝楼可以购买  回血丹与基础的新手装备 */
    genertate.createList(__PATH.generate_all, 'commodities', [])
    genertate.createList(__PATH.generate_all, 'commodities', [
      ...genertate.getlist(__PATH.fixed_goods, '0.json') // 0标记可购买的物品
    ])
    /** 怪物掉落 */
    genertate.createList(__PATH.generate_all, 'dropsItem', [])
    genertate.createList(__PATH.generate_all, 'dropsItem', [
      ...genertate.getlist(__PATH.fixed_equipment, '.json'), // 装备
      ...genertate.getlist(__PATH.fixed_goods, '.json') // 物品
    ])
  }
}
export default new DateIndex()
