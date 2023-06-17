import listdata from '../data/listdata.js'
import User from './user.js'
import { GameApi } from '../../api/index.js'
class GameUser {
  userWarehouse = async (parameter) => {
    const { UID, name, ACCOUNT } = parameter
    const thing = await listdata.searchThing({
      condition: 'name',
      name: name
    })
    if (thing) {
      let Warehouse = await listdata.controlAction({
        CHOICE: 'user_home_Warehouse',
        NAME: UID
      })
      Warehouse = await this.userWarehouseAction({
        Warehouse: Warehouse,
        THING: thing,
        ACCOUNT
      })
      await listdata.controlAction({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        DATA: Warehouse
      })
      return true
    }
    return false
  }
  /**
   * 给仓库添加物品
   * @param {用户的背包} Warehouse
   * @param {物品资料} THING
   * @param {数量} ACCOUNT
   * @returns
   */
  userWarehouseAction = async (parameter) => {
    const { Warehouse, THING, ACCOUNT } = parameter
    const thing = Warehouse.thing.find((item) => item.id == THING.id)
    if (thing) {
      let acount = thing.acount + ACCOUNT
      if (acount < 1) {
        Warehouse.thing = Warehouse.thing.filter((item) => item.id != THING.id)
      } else {
        Warehouse.thing.find((item) => item.id == THING.id).acount = acount
      }
      return Warehouse
    } else {
      THING.acount = ACCOUNT
      Warehouse.thing.push(THING)
      return Warehouse
    }
  }

  /**
   * 搜索UID的背包有没有物品名为NAME
   * @param {UID} UID
   * @param {物品名} name
   * @returns 返回该物品
   */

  userWarehouseSearch = async (parameter) => {
    const { UID, name } = parameter
    const Warehouse = await listdata.controlAction({
      CHOICE: 'user_home_Warehouse',
      NAME: UID
    })
    const ifexist = Warehouse.thing.find((item) => item.name == name)
    return ifexist
  }
  /**
   * @param {UID} UID
   * @param {物品名} name
   * @returns 若仓库存在即返回物品信息,若不存在则undifind
   */
  returnUserWarehouseName = async (NAME, THING_NAME) => {
    const Warehouse = await listdata.controlAction({
      NAME: NAME,
      CHOICE: 'user_home_Warehouse'
    })
    return Warehouse.thing.find((item) => item.name == THING_NAME)
  }
  //家园
  Archive = async ({ UID }) => {
    const home = await this.existhomeplugins({ UID: UID })
    let Msg = ''
    if (home == 1) {
      await this.homejiazai({ UID: UID })
      Msg =
        '你是第一次使用家园功能，将为你建立存档，第一次建立家园需要前往极西联盟，然后执行#建立家园+地点名字，建立家园'
      return Msg
    } else {
      const ifexisthome = await this.existhome({ UID: UID })
      if (!ifexisthome) {
        Msg = '您都还没建立过家园'
        return Msg
      }
    }
    return 0
  }
  //牧场
  Archiverangeland = async ({ UID }) => {
    let life = await listdata.controlActionInitial({
      NAME: 'life',
      CHOICE: 'user_home_life',
      INITIAL:[]
    })
    let fond = life.find((item) => item.qq == UID)
    let Msg = ''
    if (!fond) {
      await this.homejiazai({ UID: UID })
      Msg =
        '你是第一次使用家园功能，将为你建立存档，第一次建立家园需要前往极西联盟，然后执行#建立家园+地点名字，建立家园'
      return Msg
    } else {
      if (fond.rangeland == undefined) {
        let rangeland = {
          rangeland: 1
        }
        fond = Object.assign(fond, rangeland)
        await listdata.controlActionInitial({
          NAME: 'life',
          CHOICE: 'user_home_life',
          DATA: life,
          INITIAL:[]
        })
        try {
          await listdata.controlAction({
            NAME: UID,
            CHOICE: 'user_home_rangeland',
            DATA: {
              rangelandlevel: 0,
              animalacount: 0
            }
          })
          await listdata.controlAction({
            NAME: UID,
            CHOICE: 'user_home_rangelandannimals',
            DATA: {
              thing: []
            }
          })
          Msg = '你是第一次使用牧场功能，将为你建立存档'
          return Msg
        } catch {
          return 1
        }
      }
    }
    return 0
  }
  existhomeplugins = async ({ UID }) => {
    const life = await listdata.controlActionInitial({
      NAME: 'life',
      CHOICE: 'user_home_life',
      INITIAL:[]
    })
    const find = life.find((item) => item.qq == UID)
    if (find == undefined) {
      return 1
    } else {
      return find
    }
  }
  homejiazai = async ({ UID }) => {
    try {
      await listdata.controlAction({
        NAME: UID,
        CHOICE: 'user_home_home',
        DATA: {
          homelevel: 0,
          homeexperience: 0,
          homeexperienceMax: 10000,
          Land: 0,
          Landgrid: 0,
          LandgridMax: 0,
          doge: 100
        }
      })
      await listdata.controlAction({
        NAME: UID,
        CHOICE: 'user_home_Warehouse',
        DATA: {
          grade: 1,
          dogeMax: 500000,
          doge: 0,
          thing: []
        }
      })
      await listdata.controlAction({
        NAME: UID,
        CHOICE: 'user_home_landgoods',
        DATA: {
          thing: []
        }
      })
      const life = await listdata.controlActionInitial({
        CHOICE: 'user_home_life',
        NAME: 'life',
        INITIAL:[]
      })
      const time = new Date()
      life.push({
        qq: UID,
        time: time
      })
      await listdata.controlActionInitial({
        CHOICE: 'user_home_life',
        NAME: 'life',
        DATA: life,
        INITIAL:[]
      })
      return true
    } catch {
      return false
    }
  }
  existhome = async ({ UID }) => {
    const positionhome = await listdata.controlActionInitial({
      NAME: 'position',
      CHOICE: 'user_home_position',
      INITIAL:[]
    })
    const find = positionhome.find((item) => item.qq == UID)
    return find
  }
  Add_doge = async ({ UID, money }) => {
    const home = await listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      INITIAL:[]
    })
    home.doge += money
    if (home.doge > 20000000) {
      home.doge = 20000000
    }
    await listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      DATA: home,
      INITIAL:[]
    })
  }
  offaction = async (parameter) => {
    const { UID } = parameter
    const exists = await redis.exists(`xiuxian:player:${UID}:action`)
    if (exists == 1) {
      await redis.del(`xiuxian:player:${UID}:action`)
    }
    return
  }
  AddLandgrid = async (parameter) => {
    const { UID, ACCOUNT } = parameter
    let home = await listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      INITIAL:[]
    })
    home.Landgrid += ACCOUNT
    await listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      DATA: home,
      INITIAL:[]
    })
    return
  }
  Add_landgoods = async (parameter) => {
    const { landgoods, now_time, acount } = parameter
    let name = landgoods.name
    let name1 = name.replace('种子', '')
    let crop1 = await this.homesearch_thing_name({ name })
    let crop = await this.homesearch_thing_name({ name: name1 })
    landgoods.acount = acount
    landgoods.time = now_time
    landgoods.state = 0
    let x = landgoods.doge * 4
    let quarter = 1
    if (x > 600) {
      quarter = 2
    }
    let a = {
      id: crop.id,
      name: name1,
      acount: landgoods.acount,
      time: landgoods.time,
      state: landgoods.state,
      stolen: 10,
      lattice: crop1.lattice,
      quarter: quarter,
      mature: x
    }
    return a
  }
  Add_rangelandannimals = async ({ rangelandannimals, now_time }) => {
    let id = rangelandannimals.id
    let animal = await this.homesearch_thing_id({ id: id })
    id = id.split('-')
    let id1 = id[0] + '-2-' + id[2] + '-' + id[3]
    let animal1 = await this.homesearch_thing_id({ id: id1 })
    let a = {
      id: id1,
      name: rangelandannimals.name,
      name1: animal1.name,
      time: now_time,
      state: 0,
      stolen: 10,
      mature: animal.mature,
      deadtime: animal.deadtime,
      judgment: 1,
      acount: 1
    }
    return a
  }
  Add_DATA_thing = async (parameter) => {
    let { DATA, DATA1, quantity } = parameter
    if (DATA.thing != undefined) {
      if (quantity == 0) {
        return DATA
      }
      let thing = DATA.thing.find((item) => item.id == DATA1.id)
      if (thing) {
        let acount = thing.acount + quantity
        if (acount < 1) {
          DATA.thing = DATA.thing.filter((item) => item.id != DATA1.id)
        } else {
          DATA.thing.find((item) => item.id == DATA1.id).acount = acount
        }
        return DATA
      } else {
        DATA1.acount = quantity
        DATA.thing.push(DATA1)
        return DATA
      }
    } else {
      if (quantity == 0) {
        return DATA
      }
      let thing = DATA.find((item) => item.id == DATA1.id)
      if (thing) {
        let acount = thing.acount + quantity
        if (acount < 1) {
          DATA = DATA.filter((item) => item.id != DATA1.id)
        } else {
          DATA.find((item) => item.id == DATA1.id).acount = acount
        }
        return DATA
      } else {
        DATA1.acount = quantity
        DATA.push(DATA1)
        return DATA
      }
    }
  }
  homesearch_thing_name = async (parameter) => {
    const { name } = parameter
    const all = await listdata.controlAction({
      CHOICE: 'home_all',
      NAME: 'all'
    })
    let wupin = all.find((item) => item.name == name)
    return wupin
  }
  homesearch_thing_id = async (parameter) => {
    const { id } = parameter
    const all = await listdata.controlAction({
      CHOICE: 'home_all',
      NAME: 'all'
    })
    let wupin = all.find((item) => item.id == id)
    return wupin
  }
  GenerateCD = async (parameter) => {
    const { UID, CDid } = parameter
    const CDname = [' 偷菜 ', ' 占领矿场 ', ' 偷动物 ', ' 做饭 ']
    const remainTime = await redis.ttl('xiuxian:player:' + UID + ':' + CDid)
    const time = {
      h: 0,
      m: 0,
      s: 0
    }
    if (remainTime != -1) {
      time.h = Math.floor(remainTime / 60 / 60)
      time.h = time.h < 0 ? 0 : time.h
      time.m = Math.floor((remainTime - time.h * 60 * 60) / 60)
      time.m = time.m < 0 ? 0 : time.m
      time.s = Math.floor(remainTime - time.h * 60 * 60 - time.m * 60)
      time.s = time.s < 0 ? 0 : time.s
      if (time.h == 0 && time.m == 0 && time.s == 0) {
        return 0
      }
      return CDname[CDid] + '冷却:' + time.h + 'h' + time.m + 'm' + time.s + 's'
    }
    return 0
  }
  Add_homeexperience = async (parameter) => {
    const { UID, experience } = parameter
    let home = await listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      INITIAL:[]
    })
    home.homeexperience += experience
    await listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      DATA: home,
      INITIAL:[]
    })
    return
  }
  collect_minerals = async (parameter) => {
    const { UID, time } = parameter
    let Warehouse = await listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID
    })
    let thing_time = {
      0: parseInt(time / 1800),
      1: parseInt(time / 3600),
      2: parseInt(time / 5400),
      3: parseInt(time / 7200),
      4: parseInt(time / 10800),
      5: parseInt(time / 14400)
    }
    let thing = ['富煤晶石', '玄铁晶石', '火铜晶石', '秘银晶石', '精金晶石', '熔岩晶石']
    let crop = []
    for (let item of thing) {
      crop.push(await this.homesearch_thing_name({ name: item }))
    }
    crop.forEach(async (item, index) => {
      Warehouse = await this.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: item,
        quantity: thing_time[index]
      })
    })
    await listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse,
      INITIAL:[]
    })
    return [
      `获得了\n富煤晶石【${parseInt(time / 1800)}】个,玄铁晶石【${parseInt(
        time / 3600
      )}】个\n火铜晶石【${parseInt(time / 5400)}】个,秘银晶石【${parseInt(
        time / 7200
      )}】个\n精金晶石【${parseInt(time / 10800)}】个,熔岩晶石【${parseInt(time / 14400)}】个`
    ]
  }
  attribute = async (parameter) => {
    const { thing } = parameter
    let shuxing
    if (thing.attack != 1) {
      shuxing = {
        attack: thing.attack
      }
    }
    if (thing.defense != 1) {
      shuxing = {
        defense: thing.defense
      }
    }
    if (thing.blood != 1) {
      shuxing = {
        blood: thing.blood
      }
    }
    if (thing.burst != 1) {
      shuxing = {
        burst: thing.burst
      }
    }
    if (thing.burstmax != 1) {
      shuxing = {
        burstmax: thing.burstmax
      }
    }
    if (thing.speed != 1) {
      shuxing = {
        speed: thing.speed
      }
    }
    if (thing.nowblood != 1) {
      shuxing = {
        nowblood: thing.nowblood
      }
    }
    if (thing.life != 1) {
      shuxing = {
        life: thing.life
      }
    }
    return shuxing
  }
  foodshuxing = async (parameter) => {
    let { shuxinga, id, name1, doge } = parameter
    id = id + '-'
    if (shuxinga.attack != undefined) {
      id = id + '1'
      name1 = name1 + ' · 攻击'
    }
    if (shuxinga.defense != undefined) {
      id = id + '2'
      name1 = name1 + ' · 防御'
    }
    if (shuxinga.blood != undefined) {
      id = id + '3'
      name1 = name1 + ' · 血量上限'
    }
    if (shuxinga.burst != undefined) {
      id = id + '4'
      name1 = name1 + ' · 暴击'
    }
    if (shuxinga.burstmax != undefined) {
      id = id + '5'
      name1 = name1 + ' · 爆伤'
    }
    if (shuxinga.speed != undefined) {
      id = id + '6'
      name1 = name1 + ' · 敏捷'
    }
    if (shuxinga.nowblood != undefined) {
      id = id + '7'
      name1 = name1 + ' · 血量恢复'
    }
    if (shuxinga.life != undefined) {
      id = id + '8'
      name1 = name1 + ' · 寿命'
    }
    let food = {
      id: id,
      name: name1,
      acount: 1,
      price: 1,
      doge: doge
    }
    food = Object.assign(food, shuxinga)
    return food
  }
  foodjudge = async (parameter) => {
    const { name } = parameter
    let x
    let wuping = await this.homesearch_thing_name({ name })
    if (wuping == 1) {
      return wuping
    }
    let id = wuping.id.split('-')
    if (id[0] == 13 && id[1] == 4) {
      x = 0
    } else if (id[0] == 11 && id[1] == 2) {
      x = 0
    } else {
      x = 1
    }
    return x
  }
  Add_cook_thing = async (parameter) => {
    let { cook, cook_thing, thing_acount } = parameter
    if (thing_acount == 0) {
      return cook
    }
    let thing = cook.find((item) => item.id == cook_thing.id)
    if (thing) {
      let acount = thing.acount + thing_acount
      if (acount < 1) {
        cook = cook.filter((item) => item.id != cook_thing.id)
      } else {
        cook.find((item) => item.id == cook_thing.id).acount = acount
      }
      return cook
    } else {
      cook_thing.acount = thing_acount
      cook.push(cook_thing)
      return cook
    }
  }
  Add_food_thing = async (parameter) => {
    let { food, food_thing, thing_acount } = parameter
    if (thing_acount == 0) {
      return food
    }
    let thing = food.find((item) => item.id == food_thing.id)
    if (thing) {
      let acount = thing.acount + thing_acount
      if (acount < 1) {
        food = food.filter((item) => item.id != food_thing.id)
      } else {
        food.find((item) => item.id == food_thing.id).acount = acount
      }
      return food
    } else {
      food_thing.acount = thing_acount
      food.push(food_thing)
      return food
    }
  }
  Add_nowblood = async (parameter) => {
    const { UID, nowblood } = parameter
    let battle = await GameApi.UserData.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID
    })
    //判断百分比
    if (battle.blood < Math.floor(battle.nowblood + nowblood)) {
      battle.nowblood = battle.blood
    } else {
      battle.nowblood = battle.nowblood + nowblood
    }
    await GameApi.UserData.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID,
      DATA: battle
    })
    return
  }
  Add_life = async (parameter) => {
    const { UID, life } = parameter
    let life1 = await GameApi.UserData.controlAction({
      CHOICE: 'user_home_life',
      NAME: 'life'
    })
    let user_home_life = life1.find((obj) => obj.qq == UID)
    user_home_life.Age = user_home_life.Age - life
    if (user_home_life.Age < 0) {
      user_home_life.Age = 0
    }
    await GameApi.UserData.controlAction({
      CHOICE: 'user_home_life',
      NAME: 'life',
      DATA: life1
    })
    return
  }
  homeexist_Warehouse_thing_name = async (parameter) => {
    const { UID, name } = parameter
    const Warehouse = await listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL:[]
    })
    const ifexist = Warehouse.thing.find((item) => item.name == name)
    if (ifexist == undefined) {
      return 1
    }
    return ifexist
  }
  homeexist_Warehouse_thing_id = async (parameter) => {
    const { UID, id } = parameter
    const Warehouse = await listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL:[]
    })
    const ifexist = Warehouse.thing.find((item) => item.id == id)
    if (ifexist == undefined) {
      return 1
    }
    return ifexist
  }
  homeexist_all_thing_name = async (parameter) => {
    const { name } = parameter
    const all = await GameApi.UserData.controlAction({
      CHOICE: 'generate_all',
      NAME: 'all'
    })
    const ifexist = all.find((item) => item.name == name)
    if (ifexist == undefined) {
      return 1
    }
    return ifexist
  }
  homeexist_all_thing_id = async (parameter) => {
    const { id } = parameter
    const all = await GameApi.UserData.controlAction({
      CHOICE: 'generate_all',
      NAME: 'all'
    })
    const ifexist = all.find((item) => item.id == id)
    if (ifexist == undefined) {
      return 1
    }
    return ifexist
  }
  Slaughter = async (parameter) => {
    const { UID, name } = parameter
    let rangelandannimals2 = await User.homesearch_thing_name({
      name: name
    })
    let MSG = ``
    for (let i = 0; i < rangelandannimals2.x.length; i++) {
      let z = await this.homesearch_thing_id({ id: rangelandannimals2.x[i] })
      let Warehouse = await listdata.controlActionInitial({
        NAME: UID,
        CHOICE: 'user_home_Warehouse',
        INITIAL:[]
      })
      Warehouse = await User.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: z,
        quantity: 1
      })
      await listdata.controlActionInitial({
        NAME: UID,
        CHOICE: 'user_home_Warehouse',
        DATA: Warehouse,
        INITIAL:[]
      })
      MSG = MSG + ` 【${z.name}】`
    }
    return MSG
  }
  Add_all = async (parameter) => {
    let { data } = parameter
    let all = await listdata.controlActionInitial({
      CHOICE: 'home_all',
      NAME: 'all',
      INITIAL:[]
    })
    let boxall = await GameApi.UserData.controlAction({
      CHOICE: 'generate_all',
      NAME: 'all'
    })
    let all1 = all.concat(data)
    let all2 = boxall.concat(data)
    await listdata.controlActionInitial({
      CHOICE: 'home_all',
      NAME: 'all',
      DATA: all1,
      INITIAL:[]
    })
    await GameApi.UserData.controlAction({
      CHOICE: 'generate_all',
      NAME: 'all',
      DATA: all2
    })
    return
  }

  shiwubj = async (parameter) => {
    let { zhushi1, fushi1, tiaoliao1, quantity } = parameter
    let MSG
    if (zhushi1 == undefined || zhushi1.acount < quantity) {
      MSG = `您的仓库里${zhushi1.name}数量不够!`
      return MSG
    }
    zhushi1.acount = zhushi1.acount - quantity
    if (fushi1 == undefined || fushi1.acount < quantity) {
      MSG = `您的仓库里${fushi1.name}数量不够!`
      return MSG
    }
    fushi1.acount = fushi1.acount - quantity
    if (tiaoliao1 == undefined || tiaoliao1.acount < quantity) {
      MSG = `您的仓库里${tiaoliao1.name}数量不够!`
      return MSG
    }
    return 1
  }
}
export default new GameUser()
