import Data from '../data/index.js'
class Equipment {
  /**
   * 写入
   * @param {*} UID
   * @param {*} DATA
   */
  write(UID, DATA) {
    Data.write(UID, 'playerEquipment', DATA)
  }

  /**
   * 读取
   * @param {*} UID
   * @returns
   */
  read(UID) {
    return Data.read(UID, 'playerEquipment')
  }
}

export default new Equipment()
