import Redis from './redis.js'
import Method from './method.js'
import { CDMAP, ReadiName } from './config.js'

class Burial {
  /**
   * 设置redis
   * @param {*} UID 用户
   * @param {*} CDID 类型
   * @param {*} nowTime 现在的时间：毫秒
   * @param {*} CDTime 要锁定的时间：分
   */
  set(UID, CDID, nowTime, CDTime) {
    Redis.set(`${ReadiName}:${UID}:${CDID}`, {
      val: nowTime,
      expire: CDTime * 60000
    })
  }

  /**
   * 得到redis
   * @param {*} UID
   * @param {*} CDID
   * @returns
   */
  get(UID, CDID) {
    return Redis.get(`${ReadiName}:${UID}:${CDID}`)
  }

  /**
   * 删除redis
   * @param {*} key
   */
  delete(key) {
    Redis.deleteReids(key)
  }

  deleteAll(key) {
    Redis.delall(key)
  }

  /**
   * @returns
   */
  cooling(UID, CDID) {
    const data = Redis.get(`${ReadiName}:${UID}:${CDID}`)
    // 设置了时间
    if (data != undefined) {
      /**
       * 当时的时间
       * 要锁定的时间
       */
      const { val, expire } = data
      // 现在的时间
      const NowTime = new Date().getTime()
      const onTime = val + expire
      if (NowTime >= onTime) {
        Redis.del(`${ReadiName}:${UID}:${CDID}`)
        return {
          state: 2000,
          msg: '通过'
        }
      }
      // 剩余时间计算
      const theTime = onTime - NowTime
      return {
        state: 4001,
        msg: `${CDMAP[CDID]}冷却:${Method.convertTime(theTime)}`
      }
    }
    // 没设置时间
    return {
      state: 2000,
      msg: '通过'
    }
  }
}
export default new Burial()
