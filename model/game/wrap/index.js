import { REDIS } from './redis.js'
import Listdata from '../data/listdata.js'

/** 自定义冷却反馈 */
const CDMAP = {
  0: '攻击',
  1: '降妖',
  2: '闭关',
  3: '改名',
  4: '道宣',
  5: '赠送',
  6: '突破',
  7: '破体',
  8: '转世',
  9: '行为',
  10: '击杀',
  11: '决斗',
  12: '修行',
  13: '渡劫',
  99: 'action'
}

/**
 * 这里记录所有的map名称
 */

const ACTIONMAP = {
  0: '闭关',
  1: '降妖',
  2: '赶路',
  3: '传送',
  4: '渡劫',
  5: '扩建',
  6: '秘境'
}

const ReadiName = 'xiuxian@2.1'

class Wrap {
  /**
   * 删除redis
   * @param {*} key
   */
  deleteReids(key) {
    REDIS.deleteReids(key)
  }

  deleteAllReids(key) {
    REDIS.delall(key)
  }

  /**
   * 设置redis
   * @param {*} UID 用户
   * @param {*} CDID 类型
   * @param {*} nowTime 现在的时间：毫秒
   * @param {*} CDTime 要锁定的时间：分
   */
  setRedis(UID, CDID, nowTime, CDTime) {
    REDIS.set(`${ReadiName}:${UID}:${CDID}`, {
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
  getRedis(UID, CDID) {
    return REDIS.get(`${ReadiName}:${UID}:${CDID}`)
  }

  /**
   * @returns
   */
  cooling(UID, CDID) {
    const data = REDIS.get(`${ReadiName}:${UID}:${CDID}`)
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
        REDIS.del(`${ReadiName}:${UID}:${CDID}`)
        return {
          state: 2000,
          msg: '通过'
        }
      }
      // 剩余时间计算
      const theTime = onTime - NowTime
      return {
        state: 4001,
        msg: `${CDMAP[CDID]}冷却:${convertTime(theTime)}`
      }
    }
    // 没设置时间
    return {
      state: 2000,
      msg: '通过'
    }
  }

  /**
   * 设置action
   * @param {*} UID
   * @param {*} actionObject
   */
  setAction(UID, actionObject) {
    REDIS.set(`${ReadiName}:${UID}:${CDMAP[99]}`, actionObject)
  }

  /**
   * 得到action
   * @param {*} UID
   * @returns
   */
  getAction(UID) {
    return REDIS.get(`${ReadiName}:${UID}:${CDMAP[99]}`)
  }

  /**
   * 删除action
   * @param {*} param0
   */
  deleteAction(UID) {
    REDIS.del(`${ReadiName}:${UID}:${CDMAP[99]}`)
  }

  /**
   * @returns
   */
  GoMini(UID) {
    const action = REDIS.get(`${ReadiName}:${UID}:${CDMAP[99]}`)
    if (action) {
      return {
        state: 4001,
        msg: `${ACTIONMAP[action.actionID]}中...`
      }
    }
    return {
      state: 2000,
      smg: '通过'
    }
  }

  /**
   * 行为检测
   * @returns 若存在对象MSG则为flase
   */

  Go(UID) {
    // 得到val
    const action = REDIS.get(`${ReadiName}:${UID}:${CDMAP[99]}`)
    if (action) {
      // 存在
      return {
        state: 4001,
        msg: `${ACTIONMAP[action.actionID]}中...`
      }
    }
    const GP = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    if (GP.nowblood <= 1) {
      return {
        state: 4001,
        msg: '血量不足'
      }
    }
    return {
      sate: 2000,
      msg: '成功'
    }
  }
}
export default new Wrap()

function convertTime(time) {
  const ms = time % 1000
  time = (time - ms) / 1000
  const secs = time % 60
  time = (time - secs) / 60
  const mins = time % 60
  time = (time - mins) / 60
  const hrs = time % 24
  const days = (time - hrs) / 24
  return `${days}d${hrs}h${mins}m${secs}s`
}
