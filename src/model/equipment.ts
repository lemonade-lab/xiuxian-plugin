// 基础境界
const BaseEquipment = {
  // 攻击
  attack: 200,
  // 防御
  defense: 100,
  // 血量
  blood: 300
}

// 境界名
export const EquipmentNameMap = {
  '0': '匕首',
  '1': '练气一层'
}

/**
 * 得到指定编号数据
 * @param id
 */
export function getEuipmentById(id: number) {
  // 计算得到境界数
  return {
    id: id
  }
}
