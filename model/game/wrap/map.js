import listdata from '../data/listdata.js'
class WrapMap {
  /* 输入:模糊搜索名字并判断是否在此地 */
  mapExistence = ({ action, addressName }) => {
    const point = listdata.controlAction({
      NAME: 'point',
      CHOICE: 'generate_position'
    })
    for (let item of point) {
      if (item.name.includes(addressName)) {
        if (action.x == item.x && action.y == item.y) {
          return true
        }
      }
    }
    return false
  }

  /**
   * 判断是否在某地
   * @param {} addressName
   * @returns
   */

  mapAction = ({ UID, addressName }) => {
    const action = listdata.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const map = this.mapExistence({
      action,
      addressName
    })
    if (!map) return false
    return true
  }
}
export default new WrapMap()
