import Data from '../data/index.js'
class Equipment {
  /**
   * 写入
   * @param {*} NMAE
   * @param {*} DATA
   */
  write(NMAE, DATA) {
    Data.write(NMAE, 'playerLife', DATA)
  }

  /**
   * 读取
   * @param {*} NMAE
   * @returns
   */
  read(NMAE) {
    return Data.read(NMAE, 'playerLife')
  }
}

export default new Equipment()
