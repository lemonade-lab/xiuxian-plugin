import { getUserName } from '../model/utils'
import { userBattle } from '../system/battle'
import Utils from '../utils'
import RedisClient from '../model/redis'
import { Messages } from 'yunzai'
import { DB } from '../model/db-system'
const message = new Messages('message.group')
message.use(
  async e => {
    const UID = Utils.at(e)
    if (!UID) return false
    const uid = e.user_id
    if (uid == UID) {
      e.reply('自己干自己？')
      return false
    }
    const data = await DB.findOne(uid)
    if (!data) {
      e.reply('操作频繁')
      return
    }
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
    const uData = await DB.findOne(UID)
    if (!uData) {
      e.reply('操作频繁')
      return
    }
    if (uData.blood <= 0) {
      e.reply('对方已无战意')
      return
    }

    if (data.level_id > 37 && uData.level_id <= 37) {
      e.reply('仙人不可对凡人出手！')
      return
    }
    if (uData.level_id == 0) {
      e.reply('不可对普通人下手！')
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
      const size = Math.floor(0.03 * bData.money)
      if (size > 0) {
        bData.money -= size
        aData.money += size
        e.reply(['你战胜了,抢走了', size, '颗灵石'].join(''))
      } else {
        e.reply('你战胜了, 但是对方没有钱')
      }
    } else {
      const size = Math.floor(0.03 * aData.money)
      if (size > 0) {
        aData.money -= size
        bData.money += size
        e.reply('你输了,被抢走了' + size + '颗灵石')
      } else {
        e.reply('你输了, 但是你没有钱，对方也拿你没办法')
      }
    }

    DB.create(uid, aData)

    DB.create(UID, bData)

    return false
  },
  [/^(#|\/)?打劫/]
)

export default message
