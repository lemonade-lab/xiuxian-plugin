/**
 * 判断对象是否不为undefined且不为null
 * @param obj 对象
 * @returns
 */
export function isNotNull(obj) {
  if (obj == undefined || obj == null) return false
  return true
}
