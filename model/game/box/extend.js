import Data from '../data/index.js'
import Battle from './battle.js'

class Extend {
  constructor() {
    this.extendData = {
      times: [],
      perpetual: {
        attack: 0,
        defense: 0,
        blood: 0,
        burst: 0,
        burstmax: 0,
        speed: 0,
        efficiency: 0
      }
    }
  }

  /**
   *
   * @param {*} UID
   * @param {*} DATA
   */
  write(UID, DATA) {
    Data.write(UID, 'playerExtend', DATA)
  }

  /**
   *
   * @param {*} UID
   * @param {*} Initial
   */
  readInitial(UID, Initial) {
    return Data.readInitial(UID, 'playerExtend', Initial)
  }

  /**
   * 增加永久属性
   * @param { NAME, FLAG, TYPE, VALUE } param0
   * @returns
   */
  addExtendPerpetual({ NAME: UID, FLAG, TYPE, VALUE }) {
    const extend = this.readInitial(UID, {})
    if (!extend[FLAG]) {
      extend[FLAG] = this.extendData
    }
    extend[FLAG].perpetual[TYPE] = VALUE
    // 写入
    this.write(UID, extend)
    // 更新面板
    Battle.updatePanel(UID)
  }

  /**
   * 增加临时属性
   * @param { NAME, FLAG, TYPE, VALUE, ENDTIME } param0
   * @returns
   */
  addExtendTimes({ NAME, FLAG, TYPE, VALUE, ENDTIME }) {
    // 读取数据
    const extend = this.readInitial(NAME, {})
    if (!extend[FLAG]) {
      extend[FLAG] = this.extendData
    }
    const find = extend[FLAG].times.findIndex((item) => item.type == TYPE)
    const time = new Date().getTime()
    if (
      find != -1 &&
      extend[FLAG].times[find].timeLimit > time &&
      extend[FLAG].times[find].value >= VALUE
    ) {
      // 写入
      this.write(NAME, extend)
      // 更新面板
      Battle.updatePanel(NAME)
    } else if (
      find != -1 &&
      (extend[FLAG].times[find].timeLimit <= time || extend[FLAG].times[find].value < VALUE)
    ) {
      extend[FLAG].times[find].value = VALUE
      extend[FLAG].times[find].timeLimit = ENDTIME
      // 写入
      this.write(NAME, extend)
      // 更新面板
      Battle.updatePanel(NAME)
    } else {
      extend[FLAG].times.push({
        type: TYPE,
        value: VALUE,
        timeLimit: ENDTIME
      })
      // 写入
      this.write(NAME, extend)
      // 更新面板
      Battle.updatePanel(NAME)
    }
  }
}

export default new Extend()
