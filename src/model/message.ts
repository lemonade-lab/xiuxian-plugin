import { UserMessageBase } from './base'
import { readArchiveData, writeArchiveData } from './data'
import { getLevelById } from './level'

/**
 * 根据uid得到信息
 * 如果得不到就初始化
 * @param uid
 */
export function getUserMessageByUid(uid: number) {
  const data = readArchiveData('player', uid)
  // 计算数值
  if (data) {
    const level = getLevelById(data.level_id)
    data.level = level
    return data
  }
  UserMessageBase.uid = uid
  const level = getLevelById(UserMessageBase.level_id)
  UserMessageBase.level = level
  writeArchiveData('player', uid, UserMessageBase)
  return UserMessageBase
}

/**
 * 根据uid得到信息
 * 如果得不到就初始化
 * @param uid
 */
export function getReStartUserMessageByUid(uid: number) {
  UserMessageBase.uid = uid
  const level = getLevelById(UserMessageBase.level_id)
  UserMessageBase.level = level
  writeArchiveData('player', uid, UserMessageBase)
  return UserMessageBase
}
