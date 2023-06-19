import listdata from '../data/listdata.js'
class Bag {
  /**
   * 给UID添加物品name的数量为account
   * @param { UID, name, ACCOUNT } param0
   * @returns
   */
  addBagThing({ UID, name, ACCOUNT }) {
    // 搜索物品信息
    const thing = listdata.searchThing({
      condition: 'name',
      name
    })
    if (thing) {
      let bag = listdata.controlAction({ CHOICE: 'user_bag', NAME: UID })
      bag = this.addBagThingAction({
        BAG: bag,
        THING: thing,
        ACCOUNT: Number(ACCOUNT)
      })
      listdata.controlAction({ CHOICE: 'user_bag', NAME: UID, DATA: bag })
      return true
    }
    return false
  }

  /**
   * tudp
   * 材料仓库物品增减
   * @param { UID, name, ACCOUNT } param0
   * @returns
   */
  updateMaterial({ UID, name, ACCOUNT }) {
    // 搜索物品信息
    const thing = listdata.searchThing({
      CHOICE: 'fixed_material',
      NAME: 'MaterialGUIDe',
      condition: 'name',
      name
    })
    if (thing) {
      let bag = listdata.controlAction({
        CHOICE: 'user_material',
        NAME: UID
      })
      bag = this.updateMaterialAction({
        BAG: bag,
        THING: thing,
        ACCOUNT: Number(ACCOUNT)
      })
      listdata.controlAction({
        CHOICE: 'user_material',
        NAME: UID,
        DATA: bag
      })
      return true
    }
    return false
  }

  /**
   * tudo
   * @param {*} parameter
   * @returns
   */
  updateMaterialAction(parameter) {
    let { BAG, THING, ACCOUNT } = parameter
    const thing = BAG.find((item) => item.id == THING.id)
    if (thing) {
      let acount = Number(thing.acount) + Number(ACCOUNT)
      if (Number(acount) < 1) {
        BAG = BAG.filter((item) => item.id != THING.id)
      } else {
        BAG.find((item) => item.id == THING.id).acount = Number(acount)
      }
      return BAG
    } else {
      THING.acount = Number(ACCOUNT)
      BAG.thing.push(THING)
      return BAG
    }
  }

  /**
   * tudo
   * 给储物袋添加物品
   * @param { BAG, THING, ACCOUNT } param0
   * @returns
   */
  addBagThingAction(parameter) {
    const { BAG, THING, ACCOUNT } = parameter
    const thing = BAG.thing.find((item) => item.id == THING.id)
    if (thing) {
      let acount = Number(thing.acount) + Number(ACCOUNT)
      if (Number(acount) < 1) {
        BAG.thing = BAG.thing.filter((item) => item.id != THING.id)
      } else {
        BAG.thing.find((item) => item.id == THING.id).acount = Number(acount)
      }
      return BAG
    } else {
      THING.acount = Number(ACCOUNT)
      BAG.thing.push(THING)
      return BAG
    }
  }

  /**
   * 搜索UID的背包有没有物品名为NAME
   * @param { UID, name } param0
   * @returns 返回该物品
   */

  searchBagByName({ UID, name }) {
    const bag = listdata.controlAction({ CHOICE: 'user_bag', NAME: UID })
    return bag.thing.find((item) => item.name == name)
  }
}

export default new Bag()
