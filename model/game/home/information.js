import Data from '../data/index.js'
// 秋雨
class Information {
  /**
   * 显示数据
   * @param {*} UID
   * @returns
   */
  showWarehouse(UID,user_avatar) {
    let life = Data.controlAction({
      NAME: 'life',
      CHOICE: 'homeLife'
    })
    life = life.find((item) => item.UID == UID)
    const GP = Data.controlAction({
      CHOICE: 'user_home_GP',
      NAME: UID
    })
    const battle = Data.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID
    })
    const Warehouse = Data.controlActionInitial({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      INITIAL: []
    })
    const thing = Warehouse.thing
    const cropList = []
    const cubList = []
    const seedList = []
    const stuffList = []
    const mineralList = []
    const cookList = []
    const foodList = []
    const KitchenwareList = []
    const condimentList = []
    const fargment = []
    const other = []
    thing.forEach((item, index) => {
      let id = item.id.split('-')
      if (id[0] == 11) {
        if (id[1] == 1) {
          seedList.push(item)
          thing.splice(index, 0)
        } else if (id[1] == 2) {
          cropList.push(item)
          thing.splice(index, 0)
        }
      } else if (id[0] == 12) {
        mineralList.push(item)
        thing.splice(index, 0)
      } else if (id[0] == 13) {
        if (id[1] == 1) {
          cookList.push(item)
          thing.splice(index, 0)
        } else if (id[1] == 3) {
          foodList.push(item)
          thing.splice(index, 0)
        } else if (id[1] == 2) {
          KitchenwareList.push(item)
          thing.splice(index, 0)
        } else if (id[1] == 4) {
          condimentList.push(item)
          thing.splice(index, 0)
        } else if (id[1] == 5) {
          fargment.push(item)
          thing.splice(index, 0)
        }
      } else if (id[0] == 14) {
        stuffList.push(item)
        thing.splice(index, 0)
      } else if (id[0] == 50) {
        cubList.push(item)
        thing.splice(index, 0)
      } else {
        other.push(item)
        thing.splice(index, 0)
      }
    })
    return {
      path: 'user/Warehouse',
      name: 'Warehouse',
      data: {
        user_id: UID,
        GP,
        life,
        battle,
        Warehouse,
        thing,
        cropList,
        seedList,
        stuffList,
        mineralList,
        cookList,
        foodList,
        KitchenwareList,
        condimentList,
        cubList,
        fargment,
        other,
        user_avatar
      }
    }
  }

  /**
   * 显示数据
   * @param {*} UID
   * @returns
   */
  showhomeUser(UID,user_avatar) {
    const GP = Data.controlAction({
      CHOICE: 'user_home_GP',
      NAME: UID
    })
    const home = Data.controlActionInitial({
      CHOICE: 'homeDoge',
      NAME: UID,
      INITIAL: []
    })
    const battle = Data.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID
    })
    let life = Data.controlAction({
      NAME: 'life',
      CHOICE: 'homeLife'
    })
    life = life.find((item) => item.UID == UID)
    const ifexisthome1 = Data.controlActionInitial({
      CHOICE: 'fixed_position',
      NAME: 'position',
      INITIAL: []
    })
    let ifexisthome = ifexisthome1.find((item) => item.UID == UID)
    if (ifexisthome == undefined) {
      ifexisthome.address = '无'
    }
    return {
      path: 'user/home',
      name: 'home',
      data: {
        user_id: UID,
        life,
        GP,
        battle,
        homelevel: home.homelevel,
        homeexperience: home.homeexperience,
        homeexperienceMax: home.homeexperienceMax,
        Land: home.Land,
        doge: home.doge,
        address: ifexisthome.address,
        user_avatar
      }
    }
  }

  /**
   * 显示数据
   * @param {*} UID
   * @returns
   */
  showLookland(UID,user_avatar) {
    let life = Data.controlAction({
      NAME: 'life',
      CHOICE: 'homeLife'
    })
    life = life.find((item) => item.UID == UID)
    const landgoods = Data.controlActionInitial({
      CHOICE: 'fixed_goods',
      NAME: UID,
      INITIAL: []
    })
    const thing = landgoods.thing
    let nowTime = new Date().getTime()
    const landList = []
    thing.forEach((item, index) => {
      landList.push(item)
      thing.splice(index, 0)
      let time = item.time
      let time1 = Math.floor((nowTime - time) / 60000)
      let mature = item.mature
      item.state = mature < time1 ? '成熟' : '未成熟'
    })
    return {
      path: 'user/landgoods',
      name: 'landgoods',
      data: {
        user_id: UID,
        life,
        landgoods,
        thing,
        landList,
        user_avatar
      }
    }
  }

  /**
   * 显示数据
   * @param {*} UID
   * @returns
   */
  showLookrangeland(UID,user_avatar) {
    const rangelandannimals = Data.controlActionInitial({
      CHOICE: 'homeRangelandannimals',
      NAME: UID,
      INITIAL: []
    })
    const thing = rangelandannimals.thing
    const rangelandannimalsList = []
    thing.forEach((item, index) => {
      rangelandannimalsList.push(item)
      let mature = item.mature * 3600
      let nowTime = new Date().getTime()
      let time = item.time
      let time1 = Math.floor((nowTime - time) / 1000)
      if (mature > time1) {
        item.judgment = 1
      } else {
        item.judgment = 2
      }
      thing.splice(index, 0)
    })
    return {
      path: 'user/rangelandannimals',
      name: 'rangelandannimals',
      data: {
        user_id: UID,
        rangelandannimals,
        thing,
        rangelandannimalsList,
        user_avatar
      }
    }
  }
}
export default new Information()
