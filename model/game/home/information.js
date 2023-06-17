import { GameApi } from '../../api/index.js'
import listdata from '../data/listdata.js'
class information {
  userDataShow = ({ UID }) => {
    return {
      path: 'user/information',
      name: 'information',
      data: {
        user_id: UID
      }
    }
  }

  userWarehouseShow = ({ UID }) => {
    let life = GameApi.GameUser.userMsgAction({
      NAME: 'life',
      CHOICE: 'userHomeLife'
    })
    life = life.find((item) => item.qq == UID)
    const player = GameApi.UserData.controlAction({
      CHOICE: 'user_home_player',
      NAME: UID
    })
    const battle = GameApi.UserData.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID
    })
    const Warehouse = listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
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
        player,
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
        other
      }
    }
  }

  userhomeShow = ({ UID }) => {
    const player = GameApi.UserData.controlAction({
      CHOICE: 'user_home_player',
      NAME: UID
    })
    const home = listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      INITIAL: []
    })
    const battle = GameApi.UserData.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID
    })
    let life = GameApi.GameUser.userMsgAction({
      NAME: 'life',
      CHOICE: 'userHomeLife'
    })
    life = life.find((item) => item.qq == UID)
    const ifexisthome1 = listdata.controlActionInitial({
      CHOICE: 'user_home_position',
      NAME: 'position',
      INITIAL: []
    })
    let ifexisthome = ifexisthome1.find((item) => item.qq == UID)
    if (ifexisthome == undefined) {
      ifexisthome.address = '无'
    }
    return {
      path: 'user/home',
      name: 'home',
      data: {
        user_id: UID,
        life,
        player,
        battle,
        homelevel: home.homelevel,
        homeexperience: home.homeexperience,
        homeexperienceMax: home.homeexperienceMax,
        Land: home.Land,
        doge: home.doge,
        address: ifexisthome.address
      }
    }
  }

  get_lookland_img = ({ UID }) => {
    let life = GameApi.GameUser.userMsgAction({
      NAME: 'life',
      CHOICE: 'userHomeLife'
    })
    life = life.find((item) => item.qq == UID)
    const landgoods = listdata.controlActionInitial({
      CHOICE: 'user_home_landgoods',
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
        landList
      }
    }
  }

  get_lookrangeland_img = ({ UID }) => {
    const rangelandannimals = listdata.controlActionInitial({
      CHOICE: 'user_home_rangelandannimals',
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
        rangelandannimalsList
      }
    }
  }
}
export default new information()
