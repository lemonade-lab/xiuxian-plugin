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
}
export default new Method()
