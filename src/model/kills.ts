import { KillNameMap, BaseKill } from './base'
function getEfficiencyById(id: number) {
  if (id <= 0) {
    return BaseKill.efficiency
  } else {
    return BaseKill.efficiency * 2
  }
}
function getPriceById(id: number) {
  if (id <= 0) {
    return BaseKill.price
  } else {
    return BaseKill.price * 2
  }
}
/**
 * @param id
 */
export function getKillById(id: number | string) {
  return {
    ...BaseKill,
    id: id,
    name: KillNameMap[id],
    efficiency: Math.floor(getEfficiencyById(Number(id))),
    price: Math.floor(getPriceById(Number(id)))
  }
}
