class Method {
  /**
   * 进程沉睡
   * @param {*} time
   * @returns
   */
  sleep(time) {
    return new Promise((resolve) => {
      setTimeout(resolve, time)
    })
  }

  /**
   * @param { ARR } ARR
   * @returns 随机一个元素
   */
  Anyarray(ARR) {
    const randindex = Math.trunc(Math.random() * ARR.length)
    return ARR[randindex]
  }

  /**
   * 强制修正至少为1
   * @param { value } value
   * @returns
   */
  leastOne(value) {
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
   * 转化为对象
   * @param {*} time
   * @returns
   */
  timeInvert(time) {
    const dateObj = {}
    const date = new Date(time)
    dateObj.Y = date.getFullYear()
    dateObj.M = date.getMonth() + 1
    dateObj.D = date.getDate()
    dateObj.h = date.getHours()
    dateObj.m = date.getMinutes()
    dateObj.s = date.getSeconds()
    return dateObj
  }

  /**
   * 判断是否废undefied或null
   * @param {} obj
   * @returns
   */
  isNotNull(obj) {
    if (obj == undefined || obj == null) return false
    return true
  }

  /**
   * 转换为字符
   * @param {*} timestamp
   * @returns
   */
  timeChange(timestamp) {
    const date = new Date(timestamp)
    const M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    return `${date.getFullYear()}-${M}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  /**
   * 参数转换为数字类型
   * @param {*} num
   * @returns
   */
  numberVerify(input) {
    const value = Number(input.trim())
    const num = isNaN(value) ? 1 : Math.abs(value) || 1
    return num
  }

  /**
   * 暴击率
   * @param {*} P
   * @returns
   */
  isProbability(P) {
    if (P > 100) {
      return true
    }
    if (P < 0) {
      return false
    }
    const rand = Math.floor(Math.random() * (100 - 1) + 1)
    if (P > rand) {
      return true
    }
    return false
  }
}
export default new Method()
