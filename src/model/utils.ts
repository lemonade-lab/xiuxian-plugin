/**
 * 获取随机数
 * @param min
 * @param max
 * @returns
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 获取用户昵称
 * @param name1
 * @param name
 * @returns
 */
export function getUserName(name1: string, name: string) {
  if (name1 !== '柠檬冲水') return name1
  const nickname = name.replace(/[^\u4e00-\u9fa5]/g, '')
  if (nickname.length >= 1) return nickname
  return name1
}
