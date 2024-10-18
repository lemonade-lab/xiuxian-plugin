import { UserMessageBase } from '@src/model/base'
import { DB } from '@src/model/db-system'

/**
 * 根据uid得到重新信息
 * @param uid
 */
export function getReStartUserMessageByUid(uid: number) {
  UserMessageBase.uid = uid
  // 重生少一半
  UserMessageBase.money = 18
  DB.create(uid, UserMessageBase)
  return UserMessageBase
}
