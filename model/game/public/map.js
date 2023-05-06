import listdata from '../data/listdata.js'
class GameMap {
  /*输入:模糊搜索名字并判断是否在此地*/
  mapExistence = async ({ action, addressName }) => {
    const point = await listdata.listAction({
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
   * @param {} address_name
   * @returns
   */

  mapAction = async ({ UID, address_name }) => {
    const action = await listdata.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const map = await this.mapExistence({
      action,
      addressName: address_name
    })
    if (!map) return false
    return true
  }
}
export default new GameMap()
