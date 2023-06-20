import genertate from './generate.js'
import algorithm from './algorithm.js'

/* 存档地址 */
const GPPath = '/xiuxianfile'

export const getPathAddress = (key) => __PATH[key]

/* 数据索引 */
export const __PATH = {
  /* 玩家存档:已不在插件内 */
  playerExtend: algorithm.getFliePath(`${GPPath}/extend`), // 增浮
  playerAction: algorithm.getFliePath(`${GPPath}/action`), // 地图行为
  playerBattle: algorithm.getFliePath(`${GPPath}/battle`), // 战斗
  playerEquipment: algorithm.getFliePath(`${GPPath}/equipment`), // 装备
  playerLevel: algorithm.getFliePath(`${GPPath}/level`), // 境界
  playerTalent: algorithm.getFliePath(`${GPPath}/talent`), // 天赋
  playerBag: algorithm.getFliePath(`${GPPath}/najie`), // 背包
  playerLife: algorithm.getFliePath(`${GPPath}/life`), // 寿命
  playerMaterial: algorithm.getFliePath(`${GPPath}/material`), //
  playerBank: algorithm.getFliePath(`${GPPath}/bank`), // 金银坊
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

  // 用户数据
  assGP: algorithm.getReq('/resources/databirth/assGP'), // 玩家信息
  assRelation: algorithm.getReq('/resources/databirth/assRelation'), // 玩家宗门存档

  // ??
  association: algorithm.getReq('/resources/databirth/assItem'), //
  interimArchive: algorithm.getReq('/resources/databirth/interimArchive'), // 内部档案
  assTreasure: algorithm.getReq('/resources/databirth/assTreasure'), // 宗门
  generate_uncharted: algorithm.getReq('/resources/databirth/uncharted'), // 生成

  // 固定数据
  assProduct: algorithm.getReq('/resources/datafixed/assProduct'), // 宗门所有物品
  assassTreasu: algorithm.getReq('/resources/datafixed/assTreasure'), // 隐藏宗门的藏宝阁
  assRelate: algorithm.getReq('/resources/datafixed/assRelate') // 宗门相关资料
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
      ...genertate.getlist(__PATH.fixed_goods, 'json'), // 装备
      ...genertate.getlist(__PATH.assProduct, 'json') // 宗门系列
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
