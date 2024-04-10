/**
 * 战斗模型
 */

import { getEuipmentById } from '../model/equipment'
import { getLevelById } from '../model/level'
import { UserMessageType } from '../model/types'

function getBaseVal(data: UserMessageType) {
  const level = getLevelById(data.level_id)
  const equipment = {
    attack: 0,
    defense: 0,
    agile: 0,
    critical_hit_rate: 0,
    critical_damage: 0,
    blood: 0
  }
  for (const KEY in data.equipments) {
    // 这个key 没有 标记
    if (data.equipments[KEY] === null) continue
    // 有标记
    const db = getEuipmentById(Number(data.equipments[KEY]))
    for (const key in db) {
      equipment[key] = db[key]
    }
  }
  // 修为 --- 战力指数
  const attack = level.attack + equipment.attack + data.base.attack
  const defense = level.defense + equipment.defense + data.base.defense
  const blood = level.blood + equipment.blood + data.base.blood
  return { attack, defense, blood }
}

/**
 *
 * @param aData
 * @param bData
 */
export function userBattle(aData: UserMessageType, bData: UserMessageType) {
  // 记录当前血量
  let T = true
  const aBase = getBaseVal(aData)
  const bBase = getBaseVal(bData)
  // 计算伤害
  const aDamage = aBase.attack - bBase.defense
  const bDamage = bBase.attack - aBase.defense
  let l = true
  while (T) {
    // 左边攻击
    bData.blood -= aDamage
    if (bData.blood <= 0) {
      bData.blood = 0
      l = true
      T = false
      break
    }
    // 右边触发被动伤害
    aData.blood -= Math.floor(bDamage / 2)
    if (aData.blood <= 0) {
      aData.blood = 0
      l = false
      T = false
      break
    }
    // 右边攻击
    aData.blood -= Math.floor(bDamage)
    if (aData.blood <= 0) {
      aData.blood = 0
      l = false
      T = false
      break
    }
    // 左边触发被动伤害
    bData.blood -= Math.floor(aDamage / 2)
    if (bData.blood <= 0) {
      bData.blood = 0
      l = true
      T = false
      break
    }
  }
  // 结束之后
  return { l, aData, bData }
}
