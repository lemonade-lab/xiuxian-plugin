import Data from '../data/index.js'
class Special {
  /**
   * 写入
   * @param {*} UID
   * @param {*} DATA
   */
  write(UID, DATA) {
    Data.write(UID, 'playerSpecial', DATA)
  }

  /**
   * 读取
   * @param {*} UID
   * @returns
   */
  read(UID) {
    return Data.read(UID, 'playerSpecial')
  }

  /**
   * 增加特殊属性
   * @param {*} UID
   * @param {*} arr
   * @param {*} SIZE
   */
  addSpecial(UID, arr, SIZE) {
    const data = this.write(UID)
    data[arr] += Math.trunc(SIZE)
    this.write(UID, data)
  }

  /**
   * 减少特殊属性
   * @param {*} UID
   * @param {*} arr
   * @param {*} SIZE
   */
  reduceSpecial(UID, arr, SIZE) {
    const data = this.write(UID)
    data[arr] -= Math.trunc(SIZE)
    this.write(UID, data)
  }
}
export default new Special()
