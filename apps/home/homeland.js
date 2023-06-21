import { BotApi, GameApi, HomeApi, plugin } from '../../model/api/index.js'
// 秋雨
export class Homeland extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)开垦土地$/,
          fnc: 'ReceiveLand'
        },
        {
          reg: /^(#|\/)种下(.*)$/,
          fnc: 'zhongxia'
        },
        {
          reg: /^(#|\/)收获(.*)$/,
          fnc: 'shouhuo'
        },
        {
          reg: /^(#|\/)查看农田$/,
          fnc: 'lookland'
        },
        {
          reg: /^(#|\/)查看他人农田.*$/,
          fnc: 'otherlookland'
        },
        {
          reg: /^(#|\/)偷菜(.*)$/,
          fnc: 'Stealvegetables'
        }
      ]
    })
  }

  // 开垦土地
  async ReceiveLand(e) {
    // 不开放私聊功能
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GP.Archive(UID)
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    const ifexisthome = HomeApi.GP.existhome(UID)
    const { state, msg } = GameApi.Wrap.GoMini(e.user_id)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    let region = ifexisthome.region
    let action = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    let region1 = action.region
    if (region != region1) {
      e.reply('您现在不在家园里，开垦土地必须回家')
      return false
    }
    let home = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL: []
    })
    let Land = home.Land
    let homelevel = home.homelevel
    if (homelevel < 3 && Land == 1) {
      e.reply('你的家园规模不够，不足以再开垦1块荒地')
      return false
    }
    if (homelevel < 6 && Land == 2) {
      e.reply('你的家园规模不够，不足以再开垦1块荒地')
      return false
    }
    if (homelevel < 9 && Land == 3) {
      e.reply('你的家园规模不够，不足以再开垦1块荒地')
      return false
    }
    if (Land == 4) {
      e.reply('目前只能开垦4块荒地')
      return false
    }
    let lingshi1 = Land * 20000 + 1000
    const lingshi = GameApi.Bag.searchBagByName({
      UID,
      name: '下品灵石'
    })
    if (!lingshi || lingshi.acount < lingshi1) {
      e.reply(`似乎没有${lingshi1}下品灵石`)
      return false
    }
    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: lingshi1
    })
    home.Land += 1
    home.Landgrid = home.Land * 25
    home.LandgridMax = home.Landgrid
    home.homeexperience += 1000
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home',
      NAME: UID,
      DATA: home
    })
    e.reply(`本次开垦土地开了${lingshi1}的工资给工人，成功开垦出一块地来，并获得1000家园经验`)

    return false
  }

  // 种植
  async zhongxia(e) {
    // 不开放私聊功能
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexisthome = HomeApi.GP.existhome(UID)
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GP.Archive(UID)
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    let region = ifexisthome.region
    let action = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    let region1 = action.region
    if (region != region1) {
      e.reply('您现在不在家园里，种地必须要回家种哦')
      return false
    }
    let thing = e.msg.replace(/^(#|\/)种下/, '')
    let code = thing.split('*')
    let thingName = code[0] // 种子名字
    let thingAcount = code[1] // 种子数量
    let name = thingName.replace('种子', '')
    let quantity = GameApi.Method.leastOne(thingAcount)
    let searchsthing = HomeApi.GP.userWarehouseSearch({
      UID,
      name: thingName
    }) // 查找种子
    if (searchsthing == undefined || searchsthing.acount < quantity) {
      e.reply('数量不足')
      return false
    }
    let id = searchsthing.id.split('-')
    if (id[0] != 11 || id[1] != 1) {
      e.reply(`这个物品不能种到农田里，请换其他的来种吧!`)
      return false
    }
    let lattice = searchsthing.lattice // 获取种子所需格子
    let doge = searchsthing.doge
    let timemin = doge * 4
    let home = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL: []
    }) // 获取home文件
    let Land = home.Land // 获取土地
    let Landgrid = home.Landgrid // 获取土地格子
    let LandgridMax = home.LandgridMax
    let a = quantity * lattice // 所需土地格子
    let Landgridsurplus = Landgrid - a
    if (Land == 0) {
      e.reply(`你还没有自己的土地哦`)
      return false
    }
    if (Landgrid > LandgridMax) {
      e.reply(`你的土地格子异常，请执行#农田重置 来修复异常格子!`)
      return false
    }
    if (Landgridsurplus < 0) {
      e.reply(`你的土地格子不够，请重新选择种植数量`)
      return false
    }
    if (searchsthing == 1) {
      e.reply(`世界没有[${thingName}]`)
      return false
    }
    let landgoods = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_landgoods',
      NAME: UID,
      INITIAL: []
    })
    let name1 = landgoods.thing.find((item) => item.name == name)
    if (name1 != undefined) {
      e.reply(`农田里已经有${thingName}了，请换一种种子吧`)
      return false
    }
    let nowTime = new Date().getTime()
    HomeApi.GP.addLandgrid({ UID, ACCOUNT: -a })
    let searchsthing1 = HomeApi.GP.addLandgoods({
      landgoods: searchsthing,
      nowTime,
      acount: quantity
    })
    landgoods = HomeApi.GP.addDataThing({
      DATA: landgoods,
      DATA1: searchsthing1,
      quantity
    })
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_landgoods',
      NAME: UID,
      DATA: landgoods
    })
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: searchsthing,
      quantity: -quantity
    })
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse
    })
    e.reply(`现在开始种地,预计${timemin}分钟后成熟`)
    return true
  }

  // 收获
  async shouhuo(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexisthome = HomeApi.GP.existhome(UID)
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GP.Archive(UID)
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    let region = ifexisthome.region
    let action = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    let region1 = action.region
    if (region != region1) {
      e.reply('您现在不在家园里，必须要回家才能收获哦')
      return false
    }
    let thing = e.msg.replace(/^(#|\/)收获/, '')
    let landgoods1 = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_landgoods',
      NAME: UID,
      INITIAL: []
    })
    let landgoods = landgoods1.thing.find((item) => item.name == thing)
    if (landgoods == undefined) {
      e.reply('未找到该作物')
      return false
    }
    let time = landgoods.time
    let mature = landgoods.mature * 60
    let nowTime = new Date().getTime()
    let time1 = Math.floor((nowTime - time) / 1000)
    let timeco1 = mature - time1
    let acount = landgoods.acount
    let lattice = landgoods.lattice
    // 判断是否够最低收益时间
    if (mature > time1) {
      e.reply(`你的作物还没成熟,预计还有${timeco1}秒成熟`)
      return false
    }
    this.upgrade(e, UID, landgoods, thing, acount, lattice)
    return false
  }

  upgrade(e, userId, landgoods1, name, acount, lattice) {
    let UID = userId
    let thing = landgoods1
    let crop = HomeApi.GP.homesearchThingName({ name })
    let stolen = landgoods1.stolen
    let q = 10 - stolen
    let z = stolen * 0.1
    let home = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL: []
    })
    let acount1 = Math.floor(acount)
    let a = acount1 * lattice
    let quarter = landgoods1.quarter
    if (quarter == undefined) {
      quarter = 1
    }
    // 收益
    if (quarter == 1) {
      let other = parseInt(10 * acount1 * z)
      let c = (crop.doge / 5) * other
      let x = parseInt(c)
      let Warehouse = GameApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        INITIAL: []
      })
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: crop,
        quantity: other
      })
      GameApi.Listdata.controlAction({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        DATA: Warehouse
      })
      let landgoods = GameApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_landgoods',
        NAME: UID,
        INITIAL: []
      })
      landgoods = HomeApi.GP.addDataThing({
        DATA: landgoods,
        DATA1: thing,
        quantity: -acount1
      })
      GameApi.Listdata.controlAction({
        CHOICE: 'user_home_landgoods',
        NAME: UID,
        DATA: landgoods
      })
      home.Landgrid += a
      home.homeexperience += x
      GameApi.Listdata.controlAction({
        CHOICE: 'user_home_user',
        NAME: UID,
        DATA: home
      })
      if (q == 0) {
        e.reply(`本次种植收获了作物${other},并增加${x}的家园经验`)
      } else {
        e.reply(`由于被偷了${q}次，本次种植收获了作物${other},并增加${x}的家园经验`)
      }
      return false
    } else {
      let other = parseInt(10 * acount1 * z)
      let c = (crop.doge / 5) * other
      let x = parseInt(c)
      let Warehouse = GameApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        INITIAL: []
      })
      let nowTime = new Date().getTime()
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: crop,
        quantity: other
      })
      GameApi.Listdata.controlAction({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        DATA: Warehouse
      })
      let landgoods = GameApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_landgoods',
        NAME: UID
      })
      let landgoodsThing = landgoods.thing
      const nongzuowu = landgoodsThing.find((obj) => obj.name === name)
      nongzuowu.quarter -= 1
      nongzuowu.time = nowTime
      GameApi.Listdata.controlAction({
        CHOICE: 'user_home_landgoods',
        NAME: UID,
        DATA: landgoods
      })
      home.homeexperience += x
      GameApi.Listdata.controlAction({
        CHOICE: 'user_home_user',
        NAME: UID,
        DATA: home
      })
      if (q == 0) {
        e.reply(`本次种植收获了作物${other},并增加${x}的家园经验`)
      } else {
        e.reply(`由于被偷了${q}次，本次种植收获了作物${other},并增加${x}的家园经验`)
      }
      return false
    }
  }

  // 查看农田
  async lookland(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GP.Archive(UID)
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    const { path, name, data } = HomeApi.Information.userLooklandShow({
      UID
    })
    e.reply(await BotApi.obtainingImages({ path, name, data }))
    return false
  }

  // 偷菜
  async Stealvegetables(e) {
    if (!this.verify(e)) return false
    const { state, msg } = GameApi.Wrap.Go(e.user_id)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const user = {
      A: e.user_id,
      C: 0,
      UID: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user.B = BotApi.Robot.at({ e })
    if (!user.B) {
      return false
    }
    const ifexisthome1 = HomeApi.GP.existhome(user.B)
    if (!ifexisthome1) {
      e.reply(`对方还没建立过家园`)
      return false
    }
    if (!GameApi.Player.getUserLifeSatus(user.A)) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GP.Archive(user.A)
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    let region = ifexisthome1.region
    let action = GameApi.Listdata.controlAction({
      NAME: user.A,
      CHOICE: 'playerAction'
    })
    let region1 = action.region
    if (region != region1) {
      e.reply('您现在不在对方家园所在地内，偷菜请到对方家园所在地后进行偷菜')
      return false
    }
    const CDid = '0'
    const CDTime = 30
    const CD = HomeApi.GP.generateCD({ UID: user.A, CDid })
    if (CD != 0) {
      e.reply(CD)
      return false
    }
    let thing = e.msg.replace(/^(#|\/)偷菜/, '')
    let landgoods2 = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_landgoods',
      NAME: user.B,
      INITIAL: []
    })
    let landgoods = landgoods2.thing.find((item) => item.name == thing)
    if (landgoods == undefined) {
      e.reply(`对方农田里没有这种农作物!`)
      return false
    }
    let a = landgoods.stolen
    let time = landgoods.time
    let mature = landgoods.mature * 60
    let nowTime = new Date().getTime()
    let time1 = Math.floor((nowTime - time) / 1000)
    // 判断是否够最低收益时间
    if (mature > time1) {
      e.reply(`他的作物还没成熟,预计不知道多少秒成熟`)
      return false
    }
    if (a == 1) {
      e.reply('偷这么多了，还是给他留点吧!')
      return false
    }
    let other = 1
    let crop = HomeApi.GP.homesearchThingName({ name: thing })
    let z = parseInt((crop.doge / 5) * other)
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: user.A,
      INITIAL: []
    })
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: crop,
      quantity: other
    })
    GameApi.Listdata.controlAction({
      CHOICE: 'user_Warehouse',
      NAME: user.A,
      DATA: Warehouse
    })
    let landgoods1 = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_landgoods',
      NAME: user.B,
      INITIAL: []
    })
    let nameIwant = thing
    const target = landgoods1.thing.find((obj) => obj.name === nameIwant)
    target.stolen = target.stolen - 1
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_landgoods',
      NAME: user.B,
      DATA: landgoods1
    })
    let home = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home',
      NAME: user.A,
      INITIAL: []
    })
    home.homeexperience += z
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_user',
      NAME: user.A,
      DATA: home
    })
    e.reply(`成功盗取数量为${other}的${thing},并增加${z}的家园经验`)
    GameApi.Wrap.setRedis(user.A, CDid, nowTime, CDTime)
    return false
  }

  // 查看他人农田
  async otherlookland(e) {
    if (!this.verify(e)) return false
    const user = {
      A: e.user_id,
      C: 0,
      UID: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user.B = BotApi.Robot.at({ e })
    if (!user.B) {
      return
    }
    const ifexisthome1 = HomeApi.GP.existhome(user.B)
    if (!ifexisthome1) {
      e.reply(`对方没建立过家园`)
      return
    }
    const ifexisthome = GameApi.Player.getUserLifeSatus(user.A)
    if (!ifexisthome) {
      e.reply('已仙鹤')
      return
    }
    const archive = HomeApi.GP.Archive(user.A)
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    let region = ifexisthome1.region
    let action = GameApi.Listdata.controlAction({
      NAME: user.A,
      CHOICE: 'playerAction'
    })
    let region1 = action.region
    if (region != region1) {
      e.reply('您现在不在对方家园所在地内，偷看请到对方家园所在地后进行偷看')
      return
    }
    const { path, name, data } = HomeApi.Information.userLooklandShow({
      UID: user.B
    })
    e.reply(await BotApi.obtainingImages({ path, name, data }))
  }
}
