import { GameApi } from '../../api/index.js'
import listdata from '../data/listdata.js'
class information {
  userDataShow = async ({ UID }) => {
    return {
      path: 'user/information',
      name: 'information',
      data: {
        user_id: UID
      }
    }
  }
  userWarehouseShow = async ({ UID }) => {
    let life = await GameApi.GameUser.userMsgAction({
      NAME: 'life',
      CHOICE: 'user_home_life'
    })
    life = life.find((item) => item.qq == UID)
    const player = await GameApi.UserData.controlAction({
      CHOICE: 'user_home_player',
      NAME: UID
    })
    const battle = await GameApi.UserData.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID
    })
    const Warehouse = await listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    const thing = Warehouse.thing
    const crop_list = []
    const cub_list = []
    const seed_list = []
    const stuff_list = []
    const mineral_list = []
    const cook_list = []
    const food_list = []
    const Kitchenware_list = []
    const condiment_list = []
    const fargment = []
    const other = []
    thing.forEach((item, index) => {
      let id = item.id.split('-')
      if (id[0] == 11) {
        if (id[1] == 1) {
          seed_list.push(item)
          thing.splice(index, 0)
        } else if (id[1] == 2) {
          crop_list.push(item)
          thing.splice(index, 0)
        }
      } else if (id[0] == 12) {
        mineral_list.push(item)
        thing.splice(index, 0)
      } else if (id[0] == 13) {
        if (id[1] == 1) {
          cook_list.push(item)
          thing.splice(index, 0)
        } else if (id[1] == 3) {
          food_list.push(item)
          thing.splice(index, 0)
        } else if (id[1] == 2) {
          Kitchenware_list.push(item)
          thing.splice(index, 0)
        } else if (id[1] == 4) {
          condiment_list.push(item)
          thing.splice(index, 0)
        } else if (id[1] == 5) {
          fargment.push(item)
          thing.splice(index, 0)
        }
      } else if (id[0] == 14) {
        stuff_list.push(item)
        thing.splice(index, 0)
      } else if (id[0] == 50) {
        cub_list.push(item)
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
        player: player,
        life: life,
        battle: battle,
        Warehouse: Warehouse,
        thing: thing,
        crop_list: crop_list,
        seed_list: seed_list,
        stuff_list: stuff_list,
        mineral_list: mineral_list,
        cook_list: cook_list,
        food_list: food_list,
        Kitchenware_list: Kitchenware_list,
        condiment_list: condiment_list,
        cub_list: cub_list,
        fargment: fargment,
        other: other
      }
    }
  }
  userhomeShow = async ({ UID }) => {
    const player = await GameApi.UserData.controlAction({
      CHOICE: 'user_home_player',
      NAME: UID
    })
    const home = await listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      INITIAL: []
    })
    const battle = await GameApi.UserData.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID
    })
    let life = await GameApi.GameUser.userMsgAction({
      NAME: 'life',
      CHOICE: 'user_home_life'
    })
    life = life.find((item) => item.qq == UID)
    const ifexisthome1 = await listdata.controlActionInitial({
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
        life: life,
        player: player,
        battle: battle,
        homelevel: home.homelevel,
        homeexperience: home.homeexperience,
        homeexperienceMax: home.homeexperienceMax,
        Land: home.Land,
        doge: home.doge,
        address: ifexisthome.address
      }
    }
  }
  get_lookland_img = async ({ UID }) => {
    let life = await GameApi.GameUser.userMsgAction({
      NAME: 'life',
      CHOICE: 'user_home_life'
    })
    life = life.find((item) => item.qq == UID)
    const landgoods = await listdata.controlActionInitial({
      CHOICE: 'user_home_landgoods',
      NAME: UID,
      INITIAL: []
    })
    const thing = landgoods.thing
    let now_time = new Date().getTime()
    const land_list = []
    thing.forEach((item, index) => {
      land_list.push(item)
      thing.splice(index, 0)
      let time = item.time
      let time1 = Math.floor((now_time - time) / 60000)
      let mature = item.mature
      item.state = mature < time1 ? '成熟' : '未成熟'
    })
    return {
      path: 'user/landgoods',
      name: 'landgoods',
      data: {
        user_id: UID,
        life: life,
        landgoods: landgoods,
        thing: thing,
        land_list: land_list
      }
    }
  }
  get_lookrangeland_img = async ({ UID }) => {
    const rangelandannimals = await listdata.controlActionInitial({
      CHOICE: 'user_home_rangelandannimals',
      NAME: UID,
      INITIAL: []
    })
    const thing = rangelandannimals.thing
    const rangelandannimals_list = []
    thing.forEach((item, index) => {
      rangelandannimals_list.push(item)
      let mature = item.mature * 3600
      let now_time = new Date().getTime()
      let time = item.time
      let time1 = Math.floor((now_time - time) / 1000)
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
        rangelandannimals: rangelandannimals,
        thing: thing,
        rangelandannimals_list: rangelandannimals_list
      }
    }
  }
}
export default new information()
