import Listdata from '../data/listdata.js'
class Special {
  /**
   *
   * @param {*} UID
   * @param {*} name
   * @param {*} SIZE
   */
  updataSpecial(UID, name, SIZE) {
    // 读取原数据
    const data = Listdata.controlAction({ NAME: UID, CHOICE: 'playerSpecial' })
    data[name] += Math.trunc(SIZE)
    Listdata.controlAction({ NAME: UID, CHOICE: 'playerSpecial', DATA: data })
  }
}
export default new Special()
