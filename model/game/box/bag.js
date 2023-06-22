import Listdata from '../data/listdata.js'
class Bag {
  /**
   * 给UID添加物品name的数量为account
   * @param { UID, name, ACCOUNT } param0
   * @returns
   */
  addBagThing({ UID, name, ACCOUNT }) {
    const THING = Listdata.searchAllThing('name', name)
    if (!THING) return false
    /* 两者匹配 */
    let BAG = Listdata.controlAction({ CHOICE: 'playerBag', NAME: UID })
    const FINDDATA = BAG.thing.find((item) => item.id == THING.id)
    /* 匹配成功 */
    if (!FINDDATA) {
      // 直接推送
      THING.acount = Number(ACCOUNT)
      BAG.thing.push(THING)
    } else {
      // 删除物品
      BAG.thing = BAG.thing.filter((item) => item.id != THING.id)
      let SIZE = Number(FINDDATA.acount) + Number(ACCOUNT)
      // 如果小了,跳过
      // 如果大了,重新放回去
      if (SIZE > 1) {
        THING.acount = SIZE
        BAG.thing.push(THING)
      }
    }
    Listdata.controlAction({ CHOICE: 'playerBag', NAME: UID, DATA: BAG })
    return true
  }

  /**
   * 搜索UID的背包有没有物品名为NAME
   * @param { UID, name } param0
   * @returns 返回该物品
   */
  searchBagByName({ UID, name }) {
    const bag = Listdata.controlAction({ CHOICE: 'playerBag', NAME: UID })
    return bag.thing.find((item) => item.name == name)
  }
}
export default new Bag()
