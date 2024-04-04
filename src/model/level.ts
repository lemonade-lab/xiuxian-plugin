import { BaseLevel } from './base'

// 境界名
export const LevelNameMap = {
  '0': '凡人',
  '1': '练气一层',
  '2': '练气二层',
  '3': '练气三层',
  '4': '练气四层',
  '5': '练气五层',
  '6': '练气六层',
  '7': '练气七层',
  '8': '练气八层',
  '9': '练气九层',
  '10': '练气十层',
  '11': '练气十一层',
  '12': '练气十二层',
  '13': '筑基初期',
  '14': '筑基中期',
  '15': '筑基后期',
  '16': '筑基大圆满',
  '17': '金丹初期',
  '18': '金丹中期',
  '19': '金丹后期',
  '20': '金丹大圆满',
  '21': '元婴初期',
  '22': '元婴中期',
  '23': '元婴后期',
  '24': '元婴大圆满',
  '25': '化神初期',
  '26': '化神中期',
  '27': '化神后期',
  '28': '化神大圆满',
  '29': '洞虚初期',
  '30': '洞虚中期',
  '31': '洞虚后期',
  '32': '洞虚大圆满',
  '33': '大乘初期',
  '34': '大乘中期',
  '35': '大乘后期',
  '36': '大乘大圆满',
  '37': '渡劫期',
  '38': '地仙',
  '39': '天仙',
  '40': '真仙',
  '41': '金仙',
  '42': '大罗金仙',
  '43': '仙王',
  '44': '仙帝',
  '45': '超凡入圣'
}

/**
 * 得到指定境界的攻击力
 * @param id
 * @returns
 */
function getAttackById(id: number) {
  if (id <= 0) {
    return BaseLevel.attack
  } else if (id < 13) {
    return BaseLevel.defense * (id + 3) * 0.3
  } else if (13 <= id && id < 17) {
    return BaseLevel.attack * id * 2 * 0.4
  } else if (17 <= id && id < 21) {
    return BaseLevel.attack * id * 3 * 0.5
  } else if (21 <= id && id < 25) {
    return BaseLevel.attack * id * 4 * 0.6
  } else if (25 <= id && id < 29) {
    return BaseLevel.attack * id * 5 * 0.7
  } else if (29 <= id && id < 33) {
    return BaseLevel.attack * id * 6 * 0.8
  } else if (33 <= id && id < 37) {
    return BaseLevel.attack * id * 7 * 0.9
  } else if (37 <= id && id < 46) {
    return BaseLevel.attack * id * 10 * 1.0
  } else {
    return 0
  }
}

/**
 * 得到指定境界的防御
 */
function getDefenseById(id: number) {
  if (id <= 0) {
    return BaseLevel.defense
  } else if (id < 13) {
    return BaseLevel.defense * (id + 3) * 0.3
  } else if (13 >= id && id < 17) {
    return BaseLevel.defense * id * 2 * 0.2
  } else if (17 >= id && id < 21) {
    return BaseLevel.defense * id * 3 * 0.3
  } else if (21 >= id && id < 25) {
    return BaseLevel.defense * id * 4 * 0.4
  } else if (25 >= id && id < 29) {
    return BaseLevel.defense * id * 5 * 0.5
  } else if (29 >= id && id < 33) {
    return BaseLevel.defense * id * 6 * 0.6
  } else if (33 >= id && id < 37) {
    return BaseLevel.defense * id * 7 * 0.7
  } else if (37 >= id && id < 46) {
    return BaseLevel.defense * id * 10 * 0.8
  } else {
    return 0
  }
}

/**
 * 得到指定境界的血量
 * @param id
 * @returns
 */
function getBloodById(id: number) {
  if (id <= 0) {
    return BaseLevel.blood
  } else if (id < 13) {
    return BaseLevel.blood * (id + 3) * 0.3
  } else if (13 >= id && id < 17) {
    return BaseLevel.blood * id * 2 * 0.4
  } else if (17 >= id && id < 21) {
    return BaseLevel.blood * id * 3 * 0.5
  } else if (21 >= id && id < 25) {
    return BaseLevel.blood * id * 4 * 0.6
  } else if (25 >= id && id < 29) {
    return BaseLevel.blood * id * 5 * 0.7
  } else if (29 >= id && id < 33) {
    return BaseLevel.blood * id * 6 * 0.8
  } else if (33 >= id && id < 37) {
    return BaseLevel.blood * id * 7 * 0.9
  } else if (37 >= id && id < 46) {
    return BaseLevel.blood * id * 10 * 1.0
  } else {
    return 0
  }
}

/**
 * 得到指定编号数据
 * @param id
 */
export function getLevelById(id: number) {
  // 计算得到境界数
  return {
    id: id,
    name: LevelNameMap[id],
    attack: Math.floor(getAttackById(id)),
    defense: Math.floor(getDefenseById(id)),
    blood: Math.floor(getBloodById(id))
  }
}
