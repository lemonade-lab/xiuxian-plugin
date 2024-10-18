import { SkillNameMap, BaseSkill } from '@src/model/base'
/**
 *
 * @param id
 * @returns
 */
function getEfficiencyById(id: number) {
  if (id <= 0) {
    return BaseSkill.efficiency
  } else {
    return BaseSkill.efficiency * 2
  }
}
/**
 *
 * @param id
 * @returns
 */
function getPriceById(id: number) {
  if (id <= 0) {
    return BaseSkill.price
  } else {
    return BaseSkill.price * 2
  }
}
/**
 * @param id
 */
export function getSkillById(id: number | string) {
  return {
    ...BaseSkill,
    id: id,
    name: SkillNameMap[id],
    efficiency: Math.floor(getEfficiencyById(Number(id))),
    price: Math.floor(getPriceById(Number(id)))
  }
}
