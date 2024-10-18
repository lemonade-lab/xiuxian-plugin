import { getUserName } from '@src/model/utils'
import { userBattle } from '@src/system/battle'
import Utils from '@src/utils'
import RedisClient from '@src/model/redis'
import { Messages, setBotTask } from 'yunzaijs'
import { DB } from '@src/model/db-system'
import utils from '@src/utils'
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
    const instance = await RedisClient.get('instance', uid)
    if (instance.type) {
      e.reply(instance.msg)
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
    const { l, aData, bData, msg } = userBattle(data, uData)
    let log = `${data.name}打劫${uData.name}${l ? '成功' : '失败'}`
    if (l) {
      const size = Math.floor(0.03 * bData.money)
      if (size > 0) {
        bData.money -= size
        aData.money += size
        e.reply(['你战胜了,抢走了', size, '颗灵石'].join(''))
        log += `，抢走了${size}颗灵石`
      } else {
        e.reply('你战胜了, 但是对方没有钱')
        log += '，对方没有钱'
      }
      utils.forwardMsg(e, msg)
    } else {
      const size = Math.floor(0.03 * aData.money)
      if (size > 0) {
        aData.money -= size
        bData.money += size
        e.reply('你输了,被抢走了' + size + '颗灵石')
        log += `，被抢走了${size}颗灵石`
      } else {
        e.reply('你输了, 但是你没有钱，对方也拿你没办法')
        log += '没钱，对方也拿你没办法'
      }
      utils.forwardMsg(e, msg)
    }
    const robLog = await RedisClient.get('rob', 'log')

    if (robLog.type) {
      robLog.data.push({
        robber: uid,
        beRob: UID,
        log,
        time: Date.now()
      })
    } else {
      robLog.data = [
        {
          robber: uid,
          beRob: UID,
          log,
          time: Date.now()
        }
      ]
    }
    RedisClient.set('rob', 'log', '打劫记录', robLog.data)

    DB.create(uid, aData)

    DB.create(UID, bData)

    return false
  },
  [/^(#|\/)?打劫/]
)

message.use(
  async e => {
    const uid = e.user_id
    const robLog = await RedisClient.get('rob', 'log')
    if (!robLog.type) {
      e.reply('没有打劫记录')
      return
    }
    const list = robLog.data.filter((item: any) => {
      return item.robber == uid || item.beRob == uid
    })
    utils.forwardMsg(
      e,
      list.map((item: any) => new Date(item.time).toLocaleString() + item.log)
    )
  },
  [/^(#|\/)?打劫记录/]
)
/**
 * 清理打劫记录
 */
setBotTask(async () => {
  const robLog = await RedisClient.get('rob', 'log')
  if (!robLog.type) return
  for (const item of robLog.data) {
    if (Date.now() - item.time > 1000 * 60 * 60 * 48) {
      robLog.data.splice(robLog.data.indexOf(item), 1)
    }
  }
  RedisClient.set('rob', 'log', '打劫记录', robLog.data)
  console.log('打劫记录清理完成')
}, '0 0 0/2 * * ? ')

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
    const instance = await RedisClient.get('instance', uid)
    if (instance.type) {
      e.reply(instance.msg)
      return
    }
    const taken = await RedisClient.get('taken', uid)
    if (taken.type) {
      e.reply(taken.msg)
      return
    }
    const uData = await DB.findOne(UID)
    if (!uData) {
      e.reply('操作频繁')
      return
    }
    if (uData.blood <= 0) {
      e.reply('对方已无战意')
      return
    }
    const { l, msg } = userBattle(data, uData)
    if (l) {
      e.reply('你战胜了对方')
    } else {
      e.reply('你输了')
    }
    utils.forwardMsg(e, msg)
  },
  [/^(#|\/)?比武/]
)
export default message
