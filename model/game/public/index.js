import gameUer from '../user/index.js'

/**自定义冷却反馈*/
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
  13: '渡劫'
}

/** REDIS简单机制 */
const ReadiName = 'xiuxian@2.1'
const REDIS_DATA = {}
const REDIS = {
  get: (key) => REDIS_DATA[key],
  set: (key, val) => {
    REDIS_DATA[key] = val
  },
  del: (key) => delete REDIS_DATA[key],
  delall: () => {
    for (key in REDIS_DATA) {
      delete REDIS_DATA[key]
    }
  },
  val: () => REDIS_DATA
}

class GamePublic {
  /**
   * 进程沉睡
   * @param {*} time
   * @returns
   */
  sleep = async (time) => {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  /**
   * @param { ARR } ARR
   * @returns 随机一个元素
   */
  Anyarray = ({ ARR }) => {
    const randindex = Math.trunc(Math.random() * ARR.length)
    return ARR[randindex]
  }

  /**
   * 强制修正至少为1
   * @param { value } value
   * @returns
   */
  leastOne = async ({ value }) => {
    let size = value
    if (isNaN(parseFloat(size)) && !isFinite(size)) {
      return Number(1)
    }
    size = Number(Math.trunc(size))
    if (size == null || size == undefined || size < 1 || isNaN(size)) {
      return Number(1)
    }
    return Number(size)
  }

  /**
   * 删除所有数据
   * @returns
   */
  deleteReids = async () => {
    REDIS.delall()
  }

  /**
   * 设置redis
   * @param {*} UID
   * @param {*} CDID
   * @param {*} now_time
   * @param {*} CDTime
   */
  setRedis = async (UID, CDID, now_time, CDTime) => {
    REDIS.set(`${ReadiName}:${UID}:${CDID}`, {
      val: now_time,
      expire: CDTime * 60
    })
  }

  /**
   * 得到redis
   * @param {*} UID
   * @param {*} CDID
   * @returns
   */
  getRedis = async (UID, CDID) => REDIS.get(`${ReadiName}:${UID}:${CDID}`)

  /**
   * 设置action
   * @param {*} UID
   * @param {*} actionObject
   */
  setAction = async (UID, actionObject) => {
    REDIS.set(`${ReadiName}:${UID}:action`, actionObject)
  }

  /**
   * 得到action
   * @param {*} UID
   * @returns
   */
  getAction = async (UID) => REDIS.get(`${ReadiName}:${UID}:action`)

  /**
   * 删除action
   * @param {*} param0
   */
  deleteAction = async ({ UID }) => {
    REDIS.del(`${ReadiName}:${UID}:action`)
  }

  /**
   * @param { UID } param0
   * @returns
   */
  offAction = async ({ UID }) => {
    REDIS.del(`${ReadiName}:${UID}:action`)
  }

  /**
   * @param { UID, CDID, CDMAP } param0
   * @returns
   */
  cooling = async ({ UID, CDID, CDMAP }) => {
    /* 得到key设置的时间 */
    const data = REDIS.get(`${ReadiName}:${UID}:${CDID}`)
    if (data) {
      const time = {
        h: 0,
        m: 0,
        s: 0
      }
      time.h = Math.floor(data.expire / 60 / 60)
      time.h = time.h < 0 ? 0 : time.h
      time.m = Math.floor((data.expire - time.h * 60 * 60) / 60)
      time.m = time.m < 0 ? 0 : time.m
      time.s = Math.floor(data.expire - time.h * 60 * 60 - time.m * 60)
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
   * @param { UID } param0
   * @returns
   */
  GoMini = async ({ UID }) => {
    const action = REDIS.get(`${ReadiName}:${UID}:action`)
    if (action) {
      if (action.actionName == undefined) {
        //根据判断msg存不存在来识别是否成功
        return {
          MSG: `旧版数据残留,请联系主人使用[#修仙删除数据]`
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
   * @param { UID } UID
   * @returns 若存在对象MSG则为flase
   */
  Go = async ({ UID }) => {
    const action = REDIS.get(`${ReadiName}:${UID}:action`)
    if (action) {
      if (action.actionName == undefined) {
        //根据判断msg存不存在来识别是否成功
        return {
          MSG: '旧版数据残留,请联系主人使用[#修仙删除数据]'
        }
      }
      return {
        MSG: `${action.actionName}中...`
      }
    }
    const player = await gameUer.userMsgAction({
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
export default new GamePublic()
