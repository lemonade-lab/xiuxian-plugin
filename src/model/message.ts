import { UserMessageBase } from './base'
import { readArchiveData, writeArchiveData } from './data'

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
  writeArchiveData('player', uid, UserMessageBase)
  return UserMessageBase
}
