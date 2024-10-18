import { getEquipmentById } from '@src/model/equipment'
import { getLevelById } from '@src/model/level'
import { UserMessageType } from '@src/model/types'

/**
 *
 * @param data
 * @returns
 */
export function getBaseVal(data: UserMessageType) {
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
    const db = getEquipmentById(Number(data.equipments[KEY]))
    for (const key in db) {
      equipment[key] = db[key]
    }
  }
  // 修为 --- 战力指数
  const attack = level.attack + equipment.attack + data.base.attack
  const defense = level.defense + equipment.defense + data.base.defense
  const blood = level.blood + equipment.blood + data.base.blood
  const agile = level.agile + equipment.agile + data.base.agile
  const critical_hit_rate =
    level.critical_hit_rate +
    equipment.critical_hit_rate +
    data.base.critical_hit_rate
  const critical_damage =
    level.critical_damage +
    equipment.critical_damage +
    data.base.critical_damage
  return { attack, defense, blood, agile, critical_hit_rate, critical_damage }
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
  console.log(aBase)

  const bBase = getBaseVal(bData)
  // 计算伤害
  const aDamage =
    aBase.attack - bBase.defense > 0 ? aBase.attack - bBase.defense : 0
  const bDamage =
    bBase.attack - aBase.defense > 0 ? bBase.attack - aBase.defense : 0
  let l = true
  let msg = [`${aData.name}对${bData.name}发起攻击`]
  while (T) {
    if (aBase.agile > bBase.agile) {
      // a先出手
      if (aDamage > 0) {
        if (Math.random() < aBase.critical_hit_rate) {
          bData.blood -= Math.floor(aDamage * (aBase.critical_damage + 1))
          msg.push(
            `${aData.name}触发了暴击，对${bData.name}造成${Math.floor(
              aDamage * (aBase.critical_damage + 1)
            )}点伤害`
          )
        } else {
          bData.blood -= aDamage
          msg.push(`${aData.name}对${bData.name}造成${aDamage}点伤害`)
        }
      } else {
        msg.push(`${aData.name}破不了${bData.name}的防，攻击无效`)
      }
      if (bData.blood <= 0) {
        bData.blood = 0
        msg.push(`${bData.name}被${aData.name}击败`)
        l = true
        T = false
        break
      }
      if (bDamage > 0) {
        if (Math.random() < bBase.critical_hit_rate) {
          aData.blood -= Math.floor(bDamage * (bBase.critical_damage + 1))
          msg.push(
            `${bData.name}触发了暴击，对${aData.name}造成${Math.floor(
              bDamage * (bBase.critical_damage + 1)
            )}点伤害`
          )
        } else {
          aData.blood -= bDamage
          msg.push(`${bData.name}对${aData.name}造成${bDamage}点伤害`)
        }
      } else {
        msg.push(`${bData.name}破不了${aData.name}的防，攻击无效`)
      }
      if (aData.blood <= 0) {
        aData.blood = 0
        msg.push(`${aData.name}被${bData.name}击败`)
        l = false
        T = false
        break
      }
    } else {
      // b先出手
      msg.push(`${bData.name}敏捷更高，发现了${aData.name}，并抢先出手`)
      if (bDamage > 0) {
        if (Math.random() < bBase.critical_hit_rate) {
          aData.blood -= Math.floor(bDamage * (bBase.critical_damage + 1))
          msg.push(
            `${bData.name}触发了暴击，对${aData.name}造成${Math.floor(
              bDamage * (bBase.critical_damage + 1)
            )}点伤害`
          )
        } else {
          aData.blood -= bDamage
          msg.push(`${bData.name}对${aData.name}造成${bDamage}点伤害`)
        }
      }
      if (aData.blood <= 0) {
        aData.blood = 0
        msg.push(`${aData.name}被${bData.name}击败`)
        l = false
        T = false
        break
      }
      if (aDamage > 0) {
        if (Math.random() < aBase.critical_hit_rate) {
          bData.blood -= Math.floor(aDamage * (aBase.critical_damage + 1))
          msg.push(
            `${aData.name}触发了暴击，对${bData.name}造成${Math.floor(
              aDamage * (aBase.critical_damage + 1)
            )}点伤害`
          )
        } else {
          bData.blood -= aDamage
          msg.push(`${aData.name}对${bData.name}造成${aDamage}点伤害`)
        }
      } else {
        msg.push(`${aData.name}破不了${bData.name}的防，攻击无效`)
      }
      if (bData.blood <= 0) {
        bData.blood = 0
        msg.push(`${bData.name}被${aData.name}击败`)
        l = true
        T = false
        break
      }
    }
  }
  // 结束之后
  return { l, aData, bData, msg }
}
