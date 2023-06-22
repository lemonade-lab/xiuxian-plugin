import genertate from './generate.js'
import algorithm from './algorithm.js'

/* 存档地址 */
const GPPath = '/xiuxian-player'

export const getPathAddress = (key) => __PATH[key]

/* 数据索引 */
export const __PATH = {
  /* 玩家存档:已不在插件内 */
  playerExtend: algorithm.getProcessCwd(`${GPPath}/box/extend`), // 增浮
  playerAction: algorithm.getProcessCwd(`${GPPath}/box/action`), // 地图行为
  playerBattle: algorithm.getProcessCwd(`${GPPath}/box/battle`), // 战斗
  playerEquipment: algorithm.getProcessCwd(`${GPPath}/box/equipment`), // 装备
  playerSpecial: algorithm.getProcessCwd(`${GPPath}/box/special`), // 特殊值
  playerLevel: algorithm.getProcessCwd(`${GPPath}/box/level`), // 境界
  playerTalent: algorithm.getProcessCwd(`${GPPath}/box/talent`), // 天赋
  playerBag: algorithm.getProcessCwd(`${GPPath}/box/najie`), // 背包
  playerLife: algorithm.getProcessCwd(`${GPPath}/box/life`), // 寿命
  playerMaterial: algorithm.getProcessCwd(`${GPPath}/box/material`), //
  playerBank: algorithm.getProcessCwd(`${GPPath}/box/bank`), // 金银坊
  generate_exchange: algorithm.getProcessCwd(`${GPPath}/box/exchange`), // 虚空境

  /* 基础数据：插件内 */
  fixed_point: algorithm.getPath('/resources/datafixed/point'), // 点位
  fixed_position: algorithm.getPath('/resources/datafixed/position'), // 区域位
  fixed_equipment: algorithm.getPath('/resources/datafixed/equipment'), // 装备
  fixed_goods: algorithm.getPath('/resources/datafixed/goods'), // 物品
  fixed_talent: algorithm.getPath('/resources/datafixed/talent'), // 灵根
  fixed_material: algorithm.getPath('/resources/datafixed/material'), //
  fixed_monster: algorithm.getPath('/resources/datafixed/monster'), // 怪物
  fixed_levels: algorithm.getPath('/resources/datafixed/levels'), // 境界

  /* 生成数据：插件内 */
  generate_all: algorithm.getPath('/resources/databirth/all'), // 所有数据
  generate_position: algorithm.getPath('/resources/databirth/position'), // 位置
  generate_dogshop: algorithm.getPath('/resources/databirth/dogshop'), // 灵瑶阁

  /* 洞府路径 */

  homeUser: algorithm.getProcessCwd(`${GPPath}/home/user`), // 家园信息
  homeWarehouse: algorithm.getProcessCwd(`${GPPath}/home/Warehouse`), // 家园仓库
  homeLife: algorithm.getProcessCwd(`${GPPath}/home/life`), // 家园存档
  homeRangelandannimals: algorithm.getProcessCwd(`${GPPath}/home/rangelandannimals`), // 牧场
  homeRangeland: algorithm.getProcessCwd(`${GPPath}/home/rangeland`), // 牧场
  homePosition: algorithm.getProcessCwd(`${GPPath}/home/position`), // 家园点位

  user_home_minefield: algorithm.getProcessCwd(`${GPPath}/home/minefield`),
  user_home_cook: algorithm.getProcessCwd(`${GPPath}/home/cook`),
  user_home_food: algorithm.getProcessCwd(`${GPPath}/home/food`),
  user_home_wanmin: algorithm.getProcessCwd(`${GPPath}/home/wanmin`),
  user_home_state: algorithm.getProcessCwd(`${GPPath}/home/state`),

  /* 门派路径 */

  assGP: algorithm.getProcessCwd(`${GPPath}/ass/gp`), // 玩家的基础信息
  assRelation: algorithm.getProcessCwd(`${GPPath}/ass/relation`), // 所有门派的基础存档
  assOciation: algorithm.getProcessCwd(`${GPPath}/ass/ociation`), // 门派的基础信息
  assTreasure: algorithm.getProcessCwd(`${GPPath}/ass/treasure`), // 门派的藏宝阁
  assArchive: algorithm.getProcessCwd(`${GPPath}/ass/archive`), // 门派的秘境

  assTreasureVault: algorithm.getPath('/resources/datafixed/treasurevault'), // 隐藏门派的藏宝阁
  /**
   * Ass000000 基础
   * Ass000001 - Ass000004 传承宗门
   */
  assRelate: algorithm.getPath('/resources/datafixed/relate') // 门派相关资料
  /**
   * | assRelate |
   * AssLabyrinth
   * BlessPlace  山门
   */
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
    genertate.createList(__PATH.generate_all, 'goods', [])
    genertate.createList(__PATH.generate_all, 'goods', [
      ...genertate.getlist(__PATH.fixed_equipment, 'json'), // 物品
      ...genertate.getlist(__PATH.fixed_goods, 'json') // 装备
    ])
    /** 万宝楼：回血丹与基础的新手装备 */
    genertate.createList(__PATH.generate_all, 'commodities', [])
    genertate.createList(__PATH.generate_all, 'commodities', [
      ...genertate.getlist(__PATH.fixed_goods, '0.json') // 一类丹药
    ])
    /** 联盟商城 */
    genertate.createList(__PATH.generate_all, 'alliancemall', [])
    genertate.createList(__PATH.generate_all, 'alliancemall', [
      ...genertate.getlist(__PATH.fixed_goods, 'daoju2.json') // 二类道具
    ])
    /* 命运转盘 */
    genertate.createList(__PATH.generate_all, 'wheeldisc', [])
    genertate.createList(__PATH.generate_all, 'wheeldisc', [
      ...genertate.getlist(__PATH.fixed_goods, 'daoju2.json'), // 二类道具
      ...genertate.getlist(__PATH.fixed_goods, 'danyao2.json'), // 二类丹药
      ...genertate.getlist(__PATH.fixed_goods, 'gongfa2.json') // 二类功法
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
