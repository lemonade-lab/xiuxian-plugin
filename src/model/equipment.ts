import { EquipmentNameMap } from './base'

/**
 * @param id
 */
export function getEuipmentById(id: number) {
  // 计算得到境界数
  return {
    id: id,
    name: EquipmentNameMap[id],
    attack: Math.floor(0),
    defense: Math.floor(0),
    blood: Math.floor(0)
  }
}
