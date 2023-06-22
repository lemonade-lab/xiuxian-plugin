import Listdata from '../data/listdata.js'
import User from './user.js'
// 秋雨
class GP {
  /**
   * 仓库
   * @param {*} param0
   * @returns
   */
  addWarehouseThing({ UID, name, ACCOUNT }) {
    // 搜索物品
    const FindThing = Listdata.searchAllThing('name', name)
    // 不存在
    if (!FindThing) return false
    // 读取数据
    let Warehouse = Listdata.controlAction({
      CHOICE: 'homeWarehouse',
      NAME: UID
    })
    const WarehouseThing = Warehouse.thing.find((item) => item.id == FindThing.id)
    if (!WarehouseThing || WarehouseThing.acount <= 0) {
      // 仓库里没有,或者为 负了
      FindThing.acount = ACCOUNT
      Warehouse.thing.push(FindThing)
    } else {
      // 删除原来的
      Warehouse.thing = Warehouse.thing.filter((item) => item.id != FindThing.id)
      // 更新新的
      WarehouseThing.acount += ACCOUNT
      // 推送新的
      Warehouse.thing.push(WarehouseThing)
    }
    Listdata.controlAction({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      DATA: Warehouse
    })
    return true
  }

  /**
   * 搜索家园仓库
   * @param { UID, name } param0
   * @returns
   */
  searchWarehouseByName({ UID, name }) {
    const Warehouse = Listdata.controlAction({
      CHOICE: 'homeWarehouse',
      NAME: UID
    })
    const ifexist = Warehouse.thing.find((item) => item.name == name)
    return ifexist
  }

  /**
   * 验证洞府是否存在
   * @param {*} UID
   * @returns
   */
  Archive(UID) {
    // 初始化成功
    const LifeData = Listdata.read('life', 'playerLife')
    /** 判断时间是否相同 */
    const LifeHome = Listdata.read('life', 'homeLife')
    // 不存在
    if (!LifeHome[UID]) {
      // 初始化
      this.createHomePlayer(UID)
      return {
        state: 4001,
        msg: '不存在洞府'
      }
    }
    // 死掉了
    if (LifeData[UID].createTime != LifeHome[UID].createTime) {
      // 初始化
      this.createHomePlayer(UID)
      return {
        state: 4001,
        msg: '不存在洞府'
      }
    }
    // 查看家园位置
    const ifexisthome = this.getPositionHome(UID)
    // 不存在家园位置
    if (!ifexisthome) {
      return {
        state: 4001,
        msg: '不存在洞府'
      }
    }
    // 存在家园位置
    return {
      state: 2000,
      msg: '已存在洞府'
    }
  }

  /**
   * 初始化存档
   * @param {*} UID
   * @returns
   */
  createHomePlayer(UID) {
    try {
      // 写入家园数据
      Listdata.controlAction({
        NAME: UID,
        CHOICE: 'homeDoge',
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
      // 加入家园仓库数据
      Listdata.controlAction({
        NAME: UID,
        CHOICE: 'homeWarehouse',
        DATA: {
          grade: 1,
          dogeMax: 500000,
          doge: 0,
          thing: []
        }
      })
      // 写入家园
      Listdata.controlAction({
        NAME: UID,
        CHOICE: 'fixed_goods',
        DATA: {
          thing: []
        }
      })
      // 寿命表
      const LifeData = Listdata.controlActionInitial({
        CHOICE: 'homeLife',
        NAME: 'life',
        INITIAL: {}
      })
      LifeData[UID] = {
        state: 0,
        createTime: new Date().getTime()
      }
      Listdata.controlAction({
        CHOICE: 'homeLife',
        NAME: 'life',
        DATA: LifeData
      })
      //
      Listdata.controlAction({
        NAME: UID,
        CHOICE: 'homeRangeland',
        DATA: {
          rangelandlevel: 0,
          animalacount: 0
        }
      })
      //
      Listdata.controlAction({
        NAME: UID,
        CHOICE: 'homeRangelandannimals',
        DATA: {
          thing: []
        }
      })
      return true
    } catch {
      return false
    }
  }

  /**
   * 得到家园位置
   * @param {*} UID
   * @returns
   */
  getPositionHome(UID) {
    const positionhome = Listdata.controlActionInitial({
      NAME: 'position',
      CHOICE: 'homePosition',
      INITIAL: []
    })
    const find = positionhome.find((item) => item.UID == UID)
    return find
  }

  /**
   *
   * @param {*} param0
   */
  addDoge({ UID, money }) {
    const home = Listdata.controlActionInitial({
      NAME: UID,
      CHOICE: 'homeDoge',
      INITIAL: [] // ？？todo
    })
    home.doge += money
    if (home.doge > 20000000) {
      home.doge = 20000000
    }
    Listdata.controlAction({
      NAME: UID,
      CHOICE: 'homeDoge',
      DATA: home
    })
  }

  /**
   *
   * @param {*} param0
   */
  addLandgrid({ UID, ACCOUNT }) {
    let home = Listdata.controlActionInitial({
      NAME: UID,
      CHOICE: 'homeDoge',
      INITIAL: []
    })
    home.Landgrid += ACCOUNT
    Listdata.controlAction({
      NAME: UID,
      CHOICE: 'homeDoge',
      DATA: home
    })
  }

  /**
   *
   * @param {*} parameter
   * @returns
   */
  addLandgoods({ landgoods, nowTime, acount }) {
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
    return {
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
  }

  /**
   *
   * @param {*} param0
   * @returns
   */
  addRangelandannimals({ rangelandannimals, nowTime }) {
    let id = rangelandannimals.id
    let animal = Listdata.searchThingById(id)
    id = id.split('-')
    let id1 = id[0] + '-2-' + id[2] + '-' + id[3]
    let animal1 = Listdata.searchThingById(id1)
    return {
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
  }

  /**
   *
   * @param {*} parameter
   * @returns
   */
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

  /**
   *
   * @param {*} param0
   * @returns
   */
  homesearchThingName({ name }) {
    const all = Listdata.controlAction({
      CHOICE: 'home_all',
      NAME: 'all'
    })
    let wupin = all.find((item) => item.name == name)
    return wupin
  }

  /**
   *
   * @param {*} param0
   * @returns
   */
  generateCD({ UID, CDid }) {
    const CDname = [' 偷药 ', ' 占领矿场 ', ' 偷动物 ', ' 做饭 ']
    const remainTime = redis.ttl('xiuxian:GP:' + UID + ':' + CDid)
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

  /**
   *
   * @param {*} param0
   */
  addHomeexperience({ UID, experience }) {
    let home = Listdata.controlActionInitial({
      CHOICE: 'homeDoge',
      NAME: UID,
      INITIAL: []
    })
    home.homeexperience += experience
    Listdata.controlAction({
      CHOICE: 'homeDoge',
      NAME: UID,
      DATA: home
    })
  }

  /**
   *
   * @param {*} param0
   * @returns
   */
  collectMinerals({ UID, time }) {
    let Warehouse = Listdata.controlAction({
      CHOICE: 'homeWarehouse',
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
    Listdata.controlAction({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      DATA: Warehouse
    })
    return [
      `获得了\n富煤晶石【${parseInt(time / 1800)}】个,玄铁晶石【${parseInt(
        time / 3600
      )}】个\n火铜晶石【${parseInt(time / 5400)}】个,秘银晶石【${parseInt(
        time / 7200
      )}】个\n精金晶石【${parseInt(time / 10800)}】个,熔岩晶石【${parseInt(time / 14400)}】个`
    ]
  }

  /**
   *
   * @param {*} parameter
   * @returns
   */
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

  /**
   *
   * @param {*} parameter
   * @returns
   */
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

  /**
   *
   * @param {*} obj
   * @returns
   */
  foodjudge(obj) {
    let x
    let wuping = this.homesearchThingName(obj)
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

  /**
   *
   * @param {*} parameter
   * @returns
   */
  addCookThing({ cook, cookThing, thingAcount }) {
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

  /**
   *
   * @param {*} parameter
   * @returns
   */
  addFoodThing({ food, foodThing, thingAcount }) {
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

  /**
   *
   * @param {*} param0
   */
  addNowblood({ UID, nowblood }) {
    let battle = Listdata.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID
    })
    // 判断百分比
    if (battle.blood < Math.floor(battle.nowblood + nowblood)) {
      battle.nowblood = battle.blood
    } else {
      battle.nowblood = battle.nowblood + nowblood
    }
    Listdata.controlAction({
      CHOICE: 'user_home_battle',
      NAME: UID,
      DATA: battle
    })
  }

  /**
   *
   * @param {*} parameter
   */
  addLife(UID, life) {
    const LifeData = Listdata.controlAction({
      CHOICE: 'playerLife',
      NAME: 'life'
    })
    LifeData[UID].Age -= life
    if (LifeData[UID].Age < 0) {
      LifeData[UID].Age = 0
    }
    Listdata.controlAction({
      CHOICE: 'playerLife',
      NAME: 'life',
      DATA: LifeData
    })
  }

  /**
   *
   * @param {*} parameter
   * @returns
   */
  homeexistWarehouseThingName(UID, name) {
    const Warehouse = Listdata.controlActionInitial({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      INITIAL: []
    })
    const ifexist = Warehouse.thing.find((item) => item.name == name)
    if (!ifexist) {
      return false
    }
    return ifexist
  }

  /**
   *
   * @param {*} name
   * @returns
   */
  homeexistAllThingByName(name) {
    const goods = Listdata.controlAction({
      CHOICE: 'generate_all',
      NAME: 'goods'
    })
    const ifexist = goods.find((item) => item.name == name)
    if (!ifexist) {
      return false
    }
    return ifexist
  }

  /**
   *
   * @param {*} param0
   * @returns
   */
  homeexistAllThingById(id) {
    const goods = Listdata.controlAction({
      CHOICE: 'generate_all',
      NAME: 'goods'
    })
    const ifexist = goods.find((item) => item.id == id)
    if (!ifexist) {
      return false
    }
    return ifexist
  }

  /**
   *
   * @param {*} param0
   * @returns
   */
  Slaughter(UID, name) {
    let rangelandannimals2 = User.homesearchThingName({
      name
    })
    let MSG = ``
    for (let i = 0; i < rangelandannimals2.x.length; i++) {
      let z = Listdata.searchThingById(rangelandannimals2.x[i])
      let Warehouse = Listdata.controlActionInitial({
        NAME: UID,
        CHOICE: 'homeWarehouse',
        INITIAL: []
      })
      Warehouse = User.addDataThing({
        DATA: Warehouse,
        DATA1: z,
        quantity: 1
      })
      Listdata.controlAction({
        NAME: UID,
        CHOICE: 'homeWarehouse',
        DATA: Warehouse
      })
      MSG = MSG + ` 【${z.name}】`
    }
    return MSG
  }

  /**
   *
   * @param {*} parameter
   */
  addAll(data) {
    let all = Listdata.controlAction({
      CHOICE: 'home_all',
      NAME: 'all'
    })
    let boxall = Listdata.controlAction({
      CHOICE: 'generate_all',
      NAME: 'all'
    })
    let all1 = all.concat(data)
    let all2 = boxall.concat(data)
    Listdata.controlAction({
      CHOICE: 'home_all',
      NAME: 'all',
      DATA: all1
    })
    Listdata.controlAction({
      CHOICE: 'generate_all',
      NAME: 'all',
      DATA: all2
    })
  }
}
export default new GP()
