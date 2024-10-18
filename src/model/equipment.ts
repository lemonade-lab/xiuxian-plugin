import { EquipmentNameMap, BaseEquipment } from '@src/model/base'

/**
 * 得到指定攻击力
 * @param id
 * @returns
 */
function getAttackById(id: number) {
  if (id <= 0) {
    return BaseEquipment.attack
  } else if (id < 13) {
    return BaseEquipment.attack * (id + 3) * 0.3
  } else if (13 <= id && id < 17) {
    return BaseEquipment.attack * id * 2 * 0.4
  } else if (17 <= id && id < 21) {
    return BaseEquipment.attack * id * 3 * 0.5
  } else if (21 <= id && id < 25) {
    return BaseEquipment.attack * id * 4 * 0.6
  } else if (25 <= id && id < 29) {
    return BaseEquipment.attack * id * 5 * 0.7
  } else if (29 <= id && id < 33) {
    return BaseEquipment.attack * id * 6 * 0.8
  } else if (33 <= id && id < 37) {
    return BaseEquipment.attack * id * 7 * 0.9
  } else if (37 <= id && id < 46) {
    return BaseEquipment.attack * id * 10 * 1.0
  } else {
    return BaseEquipment.attack * id * 10 * 1.2
  }
}

/**
 * 得到指定防御
 */
function getDefenseById(id: number) {
  if (id <= 0) {
    return BaseEquipment.defense
  } else if (id < 13) {
    return BaseEquipment.defense * (id + 3) * 0.3
  } else if (13 >= id && id < 17) {
    return BaseEquipment.defense * id * 2 * 0.2
  } else if (17 >= id && id < 21) {
    return BaseEquipment.defense * id * 3 * 0.3
  } else if (21 >= id && id < 25) {
    return BaseEquipment.defense * id * 4 * 0.4
  } else if (25 >= id && id < 29) {
    return BaseEquipment.defense * id * 5 * 0.5
  } else if (29 >= id && id < 33) {
    return BaseEquipment.defense * id * 6 * 0.6
  } else if (33 >= id && id < 37) {
    return BaseEquipment.defense * id * 7 * 0.7
  } else if (37 >= id && id < 46) {
    return BaseEquipment.defense * id * 10 * 0.8
  } else {
    return BaseEquipment.defense * id * 10 * 1.2
  }
}

/**
 * 得到指定的血量
 * @param id
 * @returns
 */
function getBloodById(id: number) {
  if (id <= 0) {
    return BaseEquipment.blood
  } else if (id < 13) {
    return BaseEquipment.blood * (id + 3) * 0.3
  } else if (13 >= id && id < 17) {
    return BaseEquipment.blood * id * 2 * 0.4
  } else if (17 >= id && id < 21) {
    return BaseEquipment.blood * id * 3 * 0.5
  } else if (21 >= id && id < 25) {
    return BaseEquipment.blood * id * 4 * 0.6
  } else if (25 >= id && id < 29) {
    return BaseEquipment.blood * id * 5 * 0.7
  } else if (29 >= id && id < 33) {
    return BaseEquipment.blood * id * 6 * 0.8
  } else if (33 >= id && id < 37) {
    return BaseEquipment.blood * id * 7 * 0.9
  } else if (37 >= id && id < 46) {
    return BaseEquipment.blood * id * 10 * 1.0
  } else {
    return BaseEquipment.blood * id * 10 * 1.2
  }
}

function getCriticalHitRateById(id: number) {
  if (id <= 0) {
    return BaseEquipment.critical_hit_rate
  } else if (id < 13) {
    return BaseEquipment.critical_hit_rate * (id + 3) * 0.3
  } else if (13 >= id && id < 17) {
    return BaseEquipment.critical_hit_rate * id * 2 * 0.4
  } else if (17 >= id && id < 21) {
    return BaseEquipment.critical_hit_rate * id * 3 * 0.5
  } else if (21 >= id && id < 25) {
    return BaseEquipment.critical_hit_rate * id * 4 * 0.6
  } else if (25 >= id && id < 29) {
    return BaseEquipment.critical_hit_rate * id * 5 * 0.7
  } else if (29 >= id && id < 33) {
    return BaseEquipment.critical_hit_rate * id * 6 * 0.8
  } else if (33 >= id && id < 37) {
    return BaseEquipment.critical_hit_rate * id * 7 * 0.9
  } else if (37 >= id && id < 46) {
    return BaseEquipment.critical_hit_rate * id * 10 * 1.0
  } else {
    return BaseEquipment.critical_hit_rate * id * 10 * 1.2
  }
}

function getCriticalDamageById(id: number) {
  if (id <= 0) {
    return BaseEquipment.critical_damage
  } else if (id < 13) {
    return BaseEquipment.critical_damage * (id + 3) * 0.3
  } else if (13 >= id && id < 17) {
    return BaseEquipment.critical_damage * id * 2 * 0.4
  } else if (17 >= id && id < 21) {
    return BaseEquipment.critical_damage * id * 3 * 0.5
  } else if (21 >= id && id < 25) {
    return BaseEquipment.critical_damage * id * 4 * 0.6
  } else if (25 >= id && id < 29) {
    return BaseEquipment.critical_damage * id * 5 * 0.7
  } else if (29 >= id && id < 33) {
    return BaseEquipment.critical_damage * id * 6 * 0.8
  } else if (33 >= id && id < 37) {
    return BaseEquipment.critical_damage * id * 7 * 0.9
  } else if (37 >= id && id < 46) {
    return BaseEquipment.critical_damage * id * 10 * 1.0
  } else {
    return BaseEquipment.critical_damage * id * 10 * 1.2
  }
}

function getAgileById(id: number) {
  if (id <= 0) {
    return BaseEquipment.agile
  } else if (id < 13) {
    return BaseEquipment.agile * (id + 3) * 0.3
  } else if (13 >= id && id < 17) {
    return BaseEquipment.agile * id * 2 * 0.4
  } else if (17 >= id && id < 21) {
    return BaseEquipment.agile * id * 3 * 0.5
  } else if (21 >= id && id < 25) {
    return BaseEquipment.agile * id * 4 * 0.6
  } else if (25 >= id && id < 29) {
    return BaseEquipment.agile * id * 5 * 0.7
  } else if (29 >= id && id < 33) {
    return BaseEquipment.agile * id * 6 * 0.8
  } else if (33 >= id && id < 37) {
    return BaseEquipment.agile * id * 7 * 0.9
  } else if (37 >= id && id < 46) {
    return BaseEquipment.agile * id * 10 * 1.0
  } else {
    return BaseEquipment.agile * id * 10 * 1.2
  }
}

function getPriceById(id: number) {
  if (id <= 0) {
    return BaseEquipment.price
  } else if (id < 13) {
    return BaseEquipment.price * (id + 3) * 0.3
  } else if (13 >= id && id < 17) {
    return BaseEquipment.price * id * 2 * 0.4
  } else if (17 >= id && id < 21) {
    return BaseEquipment.price * id * 3 * 0.5
  } else if (21 >= id && id < 25) {
    return BaseEquipment.price * id * 4 * 0.6
  } else if (25 >= id && id < 29) {
    return BaseEquipment.price * id * 5 * 0.7
  } else if (29 >= id && id < 33) {
    return BaseEquipment.price * id * 6 * 0.8
  } else if (33 >= id && id < 37) {
    return BaseEquipment.price * id * 7 * 0.9
  } else if (37 >= id && id < 46) {
    return BaseEquipment.price * id * 10 * 1.0
  } else {
    return BaseEquipment.price * id * 10 * 1.2
  }
}

/**
 * @param id
 */
export function getEquipmentById(id: number | string) {
  // 计算得到境界数
  return {
    ...BaseEquipment,
    id: id,
    name: EquipmentNameMap[id],
    attack: Math.floor(getAttackById(Number(id))),
    defense: Math.floor(getDefenseById(Number(id))),
    blood: Math.floor(getBloodById(Number(id))),
    agile: Math.floor(getAgileById(Number(id))),
    critical_hit_rate: Number(getCriticalHitRateById(Number(id)).toFixed(2)),
    critical_damage: Number(getCriticalDamageById(Number(id)).toFixed(2)),
    price: Math.floor(getPriceById(Number(id)))
  }
}
