import listdata from '../data/listdata.js'
import User from './user.js'
import { GameApi } from '../../api/index.js'
class GameUser {
  userWarehouse({ UID, name, ACCOUNT }) {
    const thing = listdata.searchThing({
      condition: 'name',
      name
    })
    if (thing) {
      let Warehouse = listdata.controlAction({
        CHOICE: 'user_home_Warehouse',
        NAME: UID
      })
      Warehouse = this.userWarehouseAction({
        Warehouse,
        THING: thing,
        ACCOUNT
      })
      listdata.controlAction({
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
  userWarehouseAction(parameter) {
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
   * @param UID  UID
   * @param {物品名} name
   * @returns 返回该物品
   */

  userWarehouseSearch({ UID, name }) {
    const Warehouse = listdata.controlAction({
      CHOICE: 'user_home_Warehouse',
      NAME: UID
    })
    const ifexist = Warehouse.thing.find((item) => item.name == name)
    return ifexist
  }

  /**
   * @param UID  UID
   * @param {物品名} name
   * @returns 若仓库存在即返回物品信息,若不存在则undifind
   */
  getUserWarehouseName = (NAME, thingName) => {
    const Warehouse = listdata.controlAction({
      NAME,
      CHOICE: 'user_home_Warehouse'
    })
    return Warehouse.thing.find((item) => item.name == thingName)
  }

  // 家园
  Archive(UID) {
    const home = this.existhomeplugins(UID)
    let Msg = ''
    if (home == 1) {
      this.homejiazai(UID)
      Msg =
        '你是第一次使用家园功能，将为你建立存档，第一次建立家园需要前往极西联盟，然后执行(#|/)建立家园+地点名字，建立家园'
      return Msg
    } else {
      const ifexisthome = this.existhome(UID)
      if (!ifexisthome) {
        Msg = '您都还没建立过家园'
        return Msg
      }
    }
    return 0
  }

  // 牧场
  Archiverangeland(UID) {
    let life = listdata.controlActionInitial({
      NAME: 'life',
      CHOICE: 'userHomeLife',
      INITIAL: []
    })
    let fond = life.find((item) => item.qq == UID)
    let Msg = ''
    if (!fond) {
      this.homejiazai(UID)
      Msg =
        '你是第一次使用家园功能，将为你建立存档，第一次建立家园需要前往极西联盟，然后执行(#|/)建立家园+地点名字，建立家园'
      return Msg
    } else {
      if (fond.rangeland == undefined) {
        let rangeland = {
          rangeland: 1
        }
        fond = Object.assign(fond, rangeland)
        listdata.controlActionInitial({
          NAME: 'life',
          CHOICE: 'userHomeLife',
          DATA: life,
          INITIAL: []
        })
        try {
          listdata.controlAction({
            NAME: UID,
            CHOICE: 'user_home_rangeland',
            DATA: {
              rangelandlevel: 0,
              animalacount: 0
            }
          })
          listdata.controlAction({
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

  existhomeplugins(UID) {
    const life = listdata.controlActionInitial({
      NAME: 'life',
      CHOICE: 'userHomeLife',
      INITIAL: []
    })
    const find = life.find((item) => item.qq == UID)
    if (find == undefined) {
      return 1
    } else {
      return find
    }
  }

  homejiazai(UID) {
    try {
      listdata.controlAction({
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
      listdata.controlAction({
        NAME: UID,
        CHOICE: 'user_home_Warehouse',
        DATA: {
          grade: 1,
          dogeMax: 500000,
          doge: 0,
          thing: []
        }
      })
      listdata.controlAction({
        NAME: UID,
        CHOICE: 'user_home_landgoods',
        DATA: {
          thing: []
        }
      })
      const life = listdata.controlActionInitial({
        CHOICE: 'userHomeLife',
        NAME: 'life',
        INITIAL: []
      })
      const time = new Date().getTime()
      life.push({
        qq: UID,
        time
      })
      listdata.controlActionInitial({
        CHOICE: 'userHomeLife',
        NAME: 'life',
        DATA: life,
        INITIAL: []
      })
      return true
    } catch {
      return false
    }
  }

  existhome(UID) {
    const positionhome = listdata.controlActionInitial({
      NAME: 'position',
      CHOICE: 'user_home_position',
      INITIAL: []
    })
    const find = positionhome.find((item) => item.qq == UID)
    return find
  }

  addDoge({ UID, money }) {
    const home = listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      INITIAL: []
    })
    home.doge += money
    if (home.doge > 20000000) {
      home.doge = 20000000
    }
    listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      DATA: home,
      INITIAL: []
    })
  }

  addLandgrid({ UID, ACCOUNT }) {
    let home = listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      INITIAL: []
    })
    home.Landgrid += ACCOUNT
    listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      DATA: home,
      INITIAL: []
    })
  }

  addLandgoods(parameter) {
    const { landgoods, nowTime, acount } = parameter
    let name = landgoods.name
    let name1 = name.replace('种子', '')
    let crop1 = this.homesearchThingName({ name })
    let crop = this.homesearchThingName({ name: name1 })
    landgoods.acount = acount
    landgoods.time = nowTime
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
      quarter,
      mature: x
    }
    return a
  }

  addRangelandannimals({ rangelandannimals, nowTime }) {
    let id = rangelandannimals.id
    let animal = this.homesearchThingById({ id })
    id = id.split('-')
    let id1 = id[0] + '-2-' + id[2] + '-' + id[3]
    let animal1 = this.homesearchThingById({ id: id1 })
    let a = {
      id: id1,
      name: rangelandannimals.name,
      name1: animal1.name,
      time: nowTime,
      state: 0,
      stolen: 10,
      mature: animal.mature,
      deadtime: animal.deadtime,
      judgment: 1,
      acount: 1
    }
    return a
  }

  addDataThing(parameter) {
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

  homesearchThingName({ name }) {
    const all = listdata.controlAction({
      CHOICE: 'home_all',
      NAME: 'all'
    })
    let wupin = all.find((item) => item.name == name)
    return wupin
  }

  homesearchThingById({ id }) {
    const all = listdata.controlAction({
      CHOICE: 'home_all',
      NAME: 'all'
    })
    let wupin = all.find((item) => item.id == id)
    return wupin
  }

  generateCD({ UID, CDid }) {
    const CDname = [' 偷菜 ', ' 占领矿场 ', ' 偷动物 ', ' 做饭 ']
    const remainTime = redis.ttl('xiuxian:player:' + UID + ':' + CDid)
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

  addHomeexperience({ UID, experience }) {
    let home = listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      INITIAL: []
    })
    home.homeexperience += experience
    listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      DATA: home,
      INITIAL: []
    })
  }

  collectMinerals({ UID, time }) {
    let Warehouse = listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID
    })
    let thingTime = {
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
      crop.push(this.homesearchThingName({ name: item }))
    }
    crop.forEach((item, index) => {
      Warehouse = this.addDataThing({
        DATA: Warehouse,
        DATA1: item,
        quantity: thingTime[index]
      })
    })
    listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse,
      INITIAL: []
    })
    return [
      `获得了\n富煤晶石【${parseInt(time / 1800)}】个,玄铁晶石【${parseInt(
        time / 3600
      )}】个\n火铜晶石【${parseInt(time / 5400)}】个,秘银晶石【${parseInt(
        time / 7200
      )}】个\n精金晶石【${parseInt(time / 10800)}】个,熔岩晶石【${parseInt(time / 14400)}】个`
    ]
  }

  attribute(parameter) {
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

  foodshuxing(parameter) {
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
      id,
      name: name1,
      acount: 1,
      price: 1,
      doge
    }
    food = Object.assign(food, shuxinga)
    return food
  }

  foodjudge(parameter) {
    const { name } = parameter
    let x
    let wuping = this.homesearchThingName({ name })
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

  addCookThing(parameter) {
    let { cook, cookThing, thingAcount } = parameter
    if (thingAcount == 0) {
      return cook
    }
    let thing = cook.find((item) => item.id == cookThing.id)
    if (thing) {
      let acount = thing.acount + thingAcount
      if (acount < 1) {
        cook = cook.filter((item) => item.id != cookThing.id)
      } else {
        cook.find((item) => item.id == cookThing.id).acount = acount
      }
      return cook
    } else {
      cookThing.acount = thingAcount
      cook.push(cookThing)
      return cook
    }
  }

  addFoodThing(parameter) {
    let { food, foodThing, thingAcount } = parameter
    if (thingAcount == 0) {
      return food
    }
    let thing = food.find((item) => item.id == foodThing.id)
    if (thing) {
      let acount = thing.acount + thingAcount
      if (acount < 1) {
        food = food.filter((item) => item.id != foodThing.id)
      } else {
        food.find((item) => item.id == foodThing.id).acount = acount
      }
      return food
    } else {
      foodThing.acount = thingAcount
      food.push(foodThing)
      return food
    }
  }

  addNowblood({ UID, nowblood }) {
    let battle = GameApi.UserData.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID
    })
    // 判断百分比
    if (battle.blood < Math.floor(battle.nowblood + nowblood)) {
      battle.nowblood = battle.blood
    } else {
      battle.nowblood = battle.nowblood + nowblood
    }
    GameApi.UserData.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID,
      DATA: battle
    })
  }

  addLife(parameter) {
    const { UID, life } = parameter
    let life1 = GameApi.UserData.controlAction({
      CHOICE: 'userHomeLife',
      NAME: 'life'
    })
    let userHomeLife = life1.find((obj) => obj.qq == UID)
    userHomeLife.Age = userHomeLife.Age - life
    if (userHomeLife.Age < 0) {
      userHomeLife.Age = 0
    }
    GameApi.UserData.controlAction({
      CHOICE: 'userHomeLife',
      NAME: 'life',
      DATA: life1
    })
  }

  homeexistWarehouseThingName(parameter) {
    const { UID, name } = parameter
    const Warehouse = listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    const ifexist = Warehouse.thing.find((item) => item.name == name)
    if (ifexist == undefined) {
      return 1
    }
    return ifexist
  }

  homeexistWarehouseThingById(parameter) {
    const { UID, id } = parameter
    const Warehouse = listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    const ifexist = Warehouse.thing.find((item) => item.id == id)
    if (ifexist == undefined) {
      return 1
    }
    return ifexist
  }

  homeexistAllThingByName(name) {
    const all = GameApi.UserData.controlAction({
      CHOICE: 'generate_all',
      NAME: 'all'
    })
    const ifexist = all.find((item) => item.name == name)
    if (ifexist == undefined) {
      return 1
    }
    return ifexist
  }

  homeexistAllThingById({ id }) {
    const all = GameApi.UserData.controlAction({
      CHOICE: 'generate_all',
      NAME: 'all'
    })
    const ifexist = all.find((item) => item.id == id)
    if (ifexist == undefined) {
      return 1
    }
    return ifexist
  }

  Slaughter({ UID, name }) {
    let rangelandannimals2 = User.homesearchThingName({
      name
    })
    let MSG = ``
    for (let i = 0; i < rangelandannimals2.x.length; i++) {
      let z = this.homesearchThingById({ id: rangelandannimals2.x[i] })
      let Warehouse = listdata.controlActionInitial({
        NAME: UID,
        CHOICE: 'user_home_Warehouse',
        INITIAL: []
      })
      Warehouse = User.addDataThing({
        DATA: Warehouse,
        DATA1: z,
        quantity: 1
      })
      listdata.controlActionInitial({
        NAME: UID,
        CHOICE: 'user_home_Warehouse',
        DATA: Warehouse,
        INITIAL: []
      })
      MSG = MSG + ` 【${z.name}】`
    }
    return MSG
  }

  addAll(parameter) {
    let { data } = parameter
    let all = listdata.controlActionInitial({
      CHOICE: 'home_all',
      NAME: 'all',
      INITIAL: []
    })
    let boxall = GameApi.UserData.controlAction({
      CHOICE: 'generate_all',
      NAME: 'all'
    })
    let all1 = all.concat(data)
    let all2 = boxall.concat(data)
    listdata.controlActionInitial({
      CHOICE: 'home_all',
      NAME: 'all',
      DATA: all1,
      INITIAL: []
    })
    GameApi.UserData.controlAction({
      CHOICE: 'generate_all',
      NAME: 'all',
      DATA: all2
    })
  }

  shiwubj(parameter) {
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
