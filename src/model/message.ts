import { UserMessageBase } from './base'
import { readArchiveData, writeArchiveData } from './data'
import { getEuipmentById } from './equipment'
import { getKillById } from './kills'

/**
 * 根据uid得到信息
 * 如果得不到就初始化
 * @param uid
 */
export function getUserMessageByUid(uid: number) {
  const data = readArchiveData('player', uid)
  // 计算数值
  if (data) return data
  UserMessageBase.uid = uid
  writeArchiveData('player', uid, UserMessageBase)
  return UserMessageBase
}

/**
 * 根据uid得到重新信息
 * @param uid
 */
export function getReStartUserMessageByUid(uid: number) {
  UserMessageBase.uid = uid
  // 重生少一半
  UserMessageBase.money = 18
  writeArchiveData('player', uid, UserMessageBase)
  return UserMessageBase
}

export function getDataByType(type: number, id: number) {
  if (type === 0) {
    return getKillById[id]
  } else if (type === 1) {
    return getEuipmentById[id]
  }
  return -1
}
