import { type Event, plugin, define } from '../../../import'
import { writeArchiveData } from '../../model/data'
import { getUserMessageByUid } from '../../model/message'
import { getUserName } from '../../model/utils'
import { userBattle } from '../../system/battel'
import Utils from '../../utils'
import RedisClient from '../../model/redis'
export class battel extends plugin {
  constructor() {
    super({
      ...define,
      rule: [
        {
          reg: /^(#|\/)?打劫/,
          fnc: 'robbery'
        }
      ]
    })
  }

  /**
   * 储物袋
   * @param e
   * @returns
   */
  async robbery(e: Event) {
    const UID = Utils.at(e)
    if (!UID) return false
    const uid = e.user_id
    const data = getUserMessageByUid(uid)
    if (data.blood <= 0) {
      e.reply('血量不足')
      return
    }

    // 不能在闭关
    const Biguan = await RedisClient.get('door', uid)
    if (Biguan.type) {
      e.reply(Biguan.msg)
      return
    }

    data.name = getUserName(data.name, e.sender.nickname)
    // 你at了对方
    const uData = getUserMessageByUid(UID)
    if (uData.blood <= 0) {
      e.reply('对方已无战意')
      return
    }

    // 不能在闭关
    const bBiguan = await RedisClient.get('door', UID)
    if (bBiguan.type) {
      e.reply(bBiguan.msg)
      return
    }

    const { l, aData, bData } = userBattle(data, uData)
    if (l) {
      let size = 0
      if (bData.money <= 0) {
        size = 0
      } else if (bData.money <= 1) {
        size = 1
      } else if (bData.money <= 2) {
        size = 2
      } else {
        size = 3
      }
      if (size == 0) {
        e.reply(['你战胜了'])
      } else {
        bData.money -= size
        aData.money += size
        e.reply(['你战胜了,抢走了', size, '颗灵石'].join(''))
      }
    } else {
      let size = 0
      if (aData.money <= 0) {
        size = 0
      } else if (aData.money <= 1) {
        size = 1
      } else if (aData.money <= 2) {
        size = 2
      } else {
        size = 3
      }
      if (size == 0) {
        e.reply(['你战败了'])
      } else {
        aData.money -= size
        bData.money += size
        e.reply(['你战败了,反而被抢走了', size, '颗灵石'].join(''))
      }
    }
    writeArchiveData('player', uid, aData)
    writeArchiveData('player', UID, bData)
    return false
  }
}
