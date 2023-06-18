import gameUer from '../box/index.js'
import { REDIS } from './redis.js'

/** 自定义冷却反馈 */
const MYCD = {
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

const ReadiName = 'xiuxian@2.1'

class Wrap {
  /**
   * 删除所有数据
   * @returns
   */
  deleteReids = () => {
    REDIS.delall()
  }

  /**
   * 设置redis
   * @param {*} UID
   * @param {*} CDID
   * @param {*} nowTime
   * @param {*} CDTime
   */
  setRedis = (UID, CDID, nowTime, CDTime) => {
    REDIS.set(`${ReadiName}:${UID}:${CDID}`, {
      val: nowTime,
      expire: CDTime * 60
    })
  }

  /**
   * 得到redis
   * @param {*} UID
   * @param {*} CDID
   * @returns
   */
  getRedis = (UID, CDID) => REDIS.get(`${ReadiName}:${UID}:${CDID}`)

  /**
   * 设置action
   * @param {*} UID
   * @param {*} actionObject
   */
  setAction(UID, actionObject) {
    REDIS.set(`${ReadiName}:${UID}:${MYCD[99]}`, actionObject)
  }

  /**
   * 得到action
   * @param {*} UID
   * @returns
   */
  getAction = (UID) => REDIS.get(`${ReadiName}:${UID}:${MYCD[99]}`)

  /**
   * 删除action
   * @param {*} param0
   */
  deleteAction({ UID }) {
    REDIS.del(`${ReadiName}:${UID}:${MYCD[99]}`)
  }

  /**
   * @param { UID } param0
   * @returns
   */
  offAction({ UID }) {
    REDIS.del(`${ReadiName}:${UID}:${MYCD[99]}`)
  }

  /**
   * @param { UID, CDID, CDMAP } param0
   * @returns
   */
  cooling({ UID, CDID, CDMAP }) {
    /* 得到的是当前的时间 */
    const data = REDIS.get(`${ReadiName}:${UID}:${CDID}`)
    if (data) {
      const NowTime = new Date() - data
      const time = {
        h: 0,
        m: 0,
        s: 0
      }
      time.h = Math.floor(NowTime / 60 / 60)
      time.h = time.h < 0 ? 0 : time.h
      time.m = Math.floor((NowTime - time.h * 60 * 60) / 60)
      time.m = time.m < 0 ? 0 : time.m
      time.s = Math.floor(NowTime - time.h * 60 * 60 - time.m * 60)
      time.s = time.s < 0 ? 0 : time.s
      if (time.h == 0 && time.m == 0 && time.s == 0) {
        return 0
      }
      if (CDMAP) {
        return { CDMSG: `${CDMAP[CDID]}冷却${time.h}h${time.m}m${time.s}s` }
      }
      return { CDMSG: `${MYCD[CDID]}冷却${time.h}h${time.m}m${time.s}s` }
    }
    return {}
  }

  /**
   * @returns
   */
  GoMini(UID) {
    const action = REDIS.get(`${ReadiName}:${UID}:${MYCD[99]}`)
    if (action) {
      if (action.actionName == undefined) {
        // 根据判断msg存不存在来识别是否成功
        return {
          MSG: `旧版数据残留,请联系主人使用[(#|/)修仙删除数据]`
        }
      }
      return {
        MSG: `${action.actionName}中...`
      }
    }
    return {}
  }

  /**
   * 行为检测
   * @returns 若存在对象MSG则为flase
   */

  Go(UID) {
    // 得到val
    const action = REDIS.get(`${ReadiName}:${UID}:${MYCD[99]}`)
    if (action) {
      // 存在
      return {
        MSG: `${action.actionName}中...`
      }
    }
    const player = gameUer.userMsgAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    if (player.nowblood <= 1) {
      return {
        MSG: '血量不足'
      }
    }
    return {}
  }
}
export default new Wrap()
