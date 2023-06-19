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
   * 时间初始化
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

  isNotNull(obj) {
    if (obj == undefined || obj == null) return false
    return true
  }
}
export default new Method()
