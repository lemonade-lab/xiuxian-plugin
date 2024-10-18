import { BaseLevel, LevelNameMap } from '@src/model/base'

/**
 * 得到指定境界的攻击力
 * @param id
 * @returns
 */
function getAttackById(id: number) {
  if (id <= 0) {
    return BaseLevel.attack
  } else if (id < 13) {
    return BaseLevel.attack * (id + 3) * 0.3
  } else if (13 >= id && id < 17) {
    return BaseLevel.attack * id * 2 * 0.4
  } else if (17 >= id && id < 21) {
    return BaseLevel.attack * id * 3 * 0.5
  } else if (21 >= id && id < 25) {
    return BaseLevel.attack * id * 4 * 0.6
  } else if (25 >= id && id < 29) {
    return BaseLevel.attack * id * 5 * 0.7
  } else if (29 >= id && id < 33) {
    return BaseLevel.attack * id * 6 * 0.8
  } else if (33 >= id && id < 37) {
    return BaseLevel.attack * id * 7 * 0.9
  } else if (37 >= id && id < 46) {
    return BaseLevel.attack * id * 10 * 1.0
  } else if (46 >= id && id < 51) {
    return BaseLevel.attack * id * 11 * 1.1
  } else if (51 >= id && id < 56) {
    return BaseLevel.attack * id * 12 * 1.2
  } else if (56 >= id && id < 61) {
    return BaseLevel.attack * id * 13 * 1.3
  } else if (61 >= id && id < 66) {
    return BaseLevel.attack * id * 14 * 1.4
  } else if (66 >= id && id < 71) {
    return BaseLevel.attack * id * 15 * 1.5
  } else if (71 >= id && id < 76) {
    return BaseLevel.attack * id * 16 * 1.6
  } else if (76 >= id && id < 81) {
    return BaseLevel.attack * id * 17 * 1.7
  } else if (81 >= id && id < 86) {
    return BaseLevel.attack * id * 18 * 1.8
  } else if (86 >= id && id < 91) {
    return BaseLevel.attack * id * 19 * 1.9
  } else if (91 >= id && id < 96) {
    return BaseLevel.attack * id * 20 * 2.0
  } else if (96 >= id && id < 101) {
    return BaseLevel.attack * id * 21 * 2.1
  } else {
    return BaseLevel.attack * id * 21 * 2.2
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
  } else if (46 >= id && id < 51) {
    return BaseLevel.defense * id * 11 * 0.9
  } else if (51 >= id && id < 56) {
    return BaseLevel.defense * id * 12 * 1.0
  } else if (56 >= id && id < 61) {
    return BaseLevel.defense * id * 13 * 1.1
  } else if (61 >= id && id < 66) {
    return BaseLevel.defense * id * 14 * 1.2
  } else if (61 >= id && id < 66) {
    return BaseLevel.defense * id * 15 * 1.3
  } else if (66 >= id && id < 71) {
    return BaseLevel.defense * id * 16 * 1.4
  } else if (71 >= id && id < 76) {
    return BaseLevel.defense * id * 17 * 1.5
  } else if (76 >= id && id < 81) {
    return BaseLevel.defense * id * 18 * 1.6
  } else if (81 >= id && id < 86) {
    return BaseLevel.defense * id * 19 * 1.7
  } else if (86 >= id && id < 91) {
    return BaseLevel.defense * id * 20 * 1.8
  } else if (91 >= id && id < 96) {
    return BaseLevel.defense * id * 21 * 1.9
  } else if (96 >= id && id < 101) {
    return BaseLevel.defense * id * 22 * 2.0
  } else {
    return BaseLevel.defense * id * 23 * 2.1
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
  } else if (46 >= id && id < 51) {
    return BaseLevel.attack * id * 11 * 1.2
  } else if (51 >= id && id < 56) {
    return BaseLevel.blood * id * 12 * 1.3
  } else if (56 >= id && id < 61) {
    return BaseLevel.blood * id * 13 * 1.4
  } else if (61 >= id && id < 66) {
    return BaseLevel.blood * id * 14 * 1.5
  } else if (66 >= id && id < 71) {
    return BaseLevel.blood * id * 15 * 1.6
  } else if (71 >= id && id < 76) {
    return BaseLevel.blood * id * 16 * 1.7
  } else if (76 >= id && id < 81) {
    return BaseLevel.blood * id * 17 * 1.8
  } else if (81 >= id && id < 86) {
    return BaseLevel.blood * id * 18 * 1.9
  } else if (86 >= id && id < 91) {
    return BaseLevel.blood * id * 19 * 2.0
  } else if (91 >= id && id < 96) {
    return BaseLevel.blood * id * 20 * 2.1
  } else if (96 >= id && id < 101) {
    return BaseLevel.blood * id * 21 * 2.2
  } else {
    // 假设100级及以上有一个特别的计算方式
    return BaseLevel.blood * id * 25 * 2.5
  }
}

/**
 * 敏捷
 */
function getAgileById(level) {
  if (level <= 0) {
    return BaseLevel.agile
  } else if (level < 13) {
    return BaseLevel.agile * (level + 3) * 0.3
  } else if (13 >= level && level < 17) {
    return BaseLevel.agile * level * 2 * 0.4
  } else if (17 >= level && level < 21) {
    return BaseLevel.agile * level * 3 * 0.5
  } else if (21 >= level && level < 25) {
    return BaseLevel.agile * level * 4 * 0.6
  } else if (25 >= level && level < 29) {
    return BaseLevel.agile * level * 5 * 0.7
  } else if (29 >= level && level < 33) {
    return BaseLevel.agile * level * 6 * 0.8
  } else if (33 >= level && level < 37) {
    return BaseLevel.agile * level * 7 * 0.9
  } else if (37 >= level && level < 46) {
    return BaseLevel.agile * level * 10 * 1.0
  } else if (46 >= level && level < 51) {
    return BaseLevel.agile * level * 11 * 1.2
  } else if (51 >= level && level < 56) {
    return BaseLevel.agile * level * 12 * 1.3
  } else if (56 >= level && level < 61) {
    return BaseLevel.agile * level * 13 * 1.4
  } else if (61 >= level && level < 66) {
    return BaseLevel.agile * level * 14 * 1.5
  } else if (66 >= level && level < 71) {
    return BaseLevel.agile * level * 15 * 1.6
  } else if (71 >= level && level < 76) {
    return BaseLevel.agile * level * 16 * 1.7
  } else if (76 >= level && level < 81) {
    return BaseLevel.agile * level * 17 * 1.8
  } else if (81 >= level && level < 86) {
    return BaseLevel.agile * level * 18 * 1.9
  } else if (86 >= level && level < 91) {
    return BaseLevel.agile * level * 19 * 2.0
  } else if (91 >= level && level < 96) {
    return BaseLevel.agile * level * 20 * 2.1
  } else if (96 >= level && level < 101) {
    return BaseLevel.agile * level * 21 * 2.2
  } else {
    // 假设100级及以上有一个特别的计算方式
    return BaseLevel.agile * level * 25 * 2.5
  }
}

/**
 * 得到指定编号数据
 * @param id
 */
export function getLevelById(id: number) {
  // 计算得到境界数
  return {
    ...BaseLevel,
    id: id,
    // 如果境界，则name必然存在
    name: LevelNameMap[id],
    attack: Math.floor(getAttackById(id)),
    defense: Math.floor(getDefenseById(id)),
    blood: Math.floor(getBloodById(id)),
    agile: Math.floor(getAgileById(id))
  }
}
