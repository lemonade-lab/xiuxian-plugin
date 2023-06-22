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
   * @param {*} UID
   * @param {*} name
   * @param {*} SIZE
   */
  addSpecial(UID, name, SIZE) {
    const data = this.write(UID)
    data[name] += Math.trunc(SIZE)
    this.write(UID, data)
  }

  reduceSpecial(UID, name, SIZE) {
    const data = this.write(UID)
    data[name] -= Math.trunc(SIZE)
    this.write(UID, data)
  }
}
export default new Special()
