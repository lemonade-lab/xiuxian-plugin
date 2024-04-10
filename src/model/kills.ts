import { KillNameMap, BaseKill } from './base'
function getEfficiencyById(id) {
  if (id <= 0) {
    return BaseKill.efficiency
  } else {
    return BaseKill.efficiency * 2
  }
}
function getPriceById(id) {
  if (id <= 0) {
    return BaseKill.price
  } else {
    return BaseKill.price * 2
  }
}
/**
 * @param id
 */
export function getKillById(id: number) {
  // 计算得到境界数
  return {
    // 确保字段完整
    ...BaseKill,
    id: id,
    name: KillNameMap[id],
    efficiency: Math.floor(getEfficiencyById(id)),
    price: Math.floor(getPriceById(id))
  }
}
