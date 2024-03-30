// 基础境界
const BaseLevel = {
  // 攻击
  attack: 200,
  // 防御
  defense: 100,
  // 血量
  blood: 300
}

// 境界名
const MapName = {
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
  '16': '筑基大圆满'
}

/**
 * 得到指定境界的攻击力
 * @param id
 * @returns
 */
function getAttackById(id: number) {
  if (id < 13) {
    return BaseLevel.attack * id * 0.3
  } else if (13 <= id && id < 17) {
    return BaseLevel.attack * id * 2 * 0.4
  } else {
    return BaseLevel.attack * id * 3 * 0.5
  }
}

/**
 * 得到指定境界的防御
 */
function getDefenseById(id: number) {
  if (id < 13) {
    return BaseLevel.attack * id * 0.1
  } else if (13 <= id && id < 17) {
    return BaseLevel.attack * id * 2 * 0.2
  } else {
    return BaseLevel.attack * id * 3 * 0.3
  }
}

/**
 * 得到指定境界的血量
 * @param id
 * @returns
 */
function getBloodById(id: number) {
  if (id < 13) {
    return BaseLevel.attack * id * 0.3
  } else if (13 <= id && id < 17) {
    return BaseLevel.attack * id * 2 * 0.4
  } else {
    return BaseLevel.attack * id * 3 * 0.5
  }
}

/**
 * 得到指定编号数据
 * @param id
 */
export function getLevelById(id: number) {
  // 不存在该境界
  if (!MapName[id]) return false
  // 计算得到境界数
  return {
    id: id,
    name: MapName[id],
    attack: getAttackById(id),
    defense: getDefenseById(id),
    blood: getBloodById(id)
  }
}
