import { BaseLevel, LevelNameMap } from './base'

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
    return BaseLevel.attack * id * 10 * 1.2
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
    return BaseLevel.defense * id * 10 * 1.2
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
    return BaseLevel.blood * id * 10 * 1.2
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
    // 如果境界，则name必然存在
    name: LevelNameMap[id],
    attack: Math.floor(getAttackById(id)),
    defense: Math.floor(getDefenseById(id)),
    blood: Math.floor(getBloodById(id))
  }
}
