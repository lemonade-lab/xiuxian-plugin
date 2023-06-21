import Redis from './redis.js'
import Listdata from '../data/listdata.js'
import { CDMAP, ACTIONMAP, ReadiName } from './config.js'
class Action {
  /**
   * 设置action
   * @param {*} UID
   * @param {*} actionObject
   */
  set(UID, actionObject) {
    Redis.set(`${ReadiName}:${UID}:${CDMAP[99]}`, actionObject)
  }

  /**
   * 得到action
   * @param {*} UID
   * @returns
   */
  get(UID) {
    return Redis.get(`${ReadiName}:${UID}:${CDMAP[99]}`)
  }

  /**
   * 删除action
   * @param {*} param0
   */
  delete(UID) {
    Redis.del(`${ReadiName}:${UID}:${CDMAP[99]}`)
  }

  /**
   * @returns
   */
  miniGo(UID) {
    const action = Redis.get(`${ReadiName}:${UID}:${CDMAP[99]}`)
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
    const action = Redis.get(`${ReadiName}:${UID}:${CDMAP[99]}`)
    if (action) {
      // 存在
      return {
        state: 4001,
        msg: `${ACTIONMAP[action.actionID]}中...`
      }
    }
    const GP = Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle'
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

export default new Action()
