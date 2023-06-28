import { GameApi, HomeApi, plugin } from '#xiuxian-api'
const forwardsetTime = []
const useraction = []
// 秋雨
export class Homeminefield extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)占领灵矿$/,
          fnc: 'Occupy_the_mine'
        },
        {
          reg: /^(#|\/)领取晶石$/,
          fnc: 'collectMinerals'
        },
        {
          reg: /^(#|\/)炼制.*$/,
          fnc: 'refining'
        },
        {
          reg: /^(#|\/)提炼富煤晶石.*$/,
          fnc: 'coal'
        },
        {
          reg: /^(#|\/)查看灵矿$/,
          fnc: 'look_minerals'
        },
        {
          reg: /^(#|\/)锻造.*$/,
          fnc: 'forging'
        },
        {
          reg: /^(#|\/)分解.*$/,
          fnc: 'resolve'
        },
        {
          reg: /^(#|\/)修理.*$/,
          fnc: 'repair'
        }
      ]
    })
  }

  // 占领灵矿
  async Occupy_the_mine(e) {
    // 不开放私聊功能
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    const ifexisthome = HomeApi.GP.getPositionHome(UID)
    let region2 = ifexisthome.region
    let action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    let region1 = action.region
    if (region2 != region1) {
      e.reply('您现在不在洞府所在地，无法抢夺该地的灵矿!')
      return false
    }
    let positionhome = GameApi.Data.controlActionInitial({
      CHOICE: 'homePosition',
      NAME: 'position',
      INITIAL: []
    })
    const target = positionhome.find((obj) => obj.UID === UID)
    const address = target.address
    const region = action.region
    const timeMax = 172800
    let time = new Date().getTime()
    let nowTime = time.getTime()
    let minefield = GameApi.Data.controlActionInitial({
      CHOICE: 'user_home_minefield',
      NAME: 'minefield',
      INITIAL: []
    })
    let minefieldName1 = minefield.find((item) => item.address === address)
    let B
    if (minefieldName1 != undefined) {
      B = minefieldName1.UID
    }
    let A = UID
    const CDid = '1'
    const CDTime = 60
    const CD = HomeApi.GP.generateCD({ UID: A, CDid })
    if (CD != 0) {
      e.reply(CD)
      return false
    }
    if (A == B) {
      e.reply(`你已经是该灵矿的主人了!`)
      return false
    }
    GameApi.Burial.set(A, CDid, nowTime, CDTime)
    if (minefieldName1 == undefined) {
      minefield.push({
        UID,
        address,
        region,
        createTime: nowTime,
        timeMax
      })
      GameApi.Data.controlAction({
        CHOICE: 'user_home_minefield',
        NAME: 'minefield',
        DATA: minefield
      })
      HomeApi.GP.addHomeexperience({ UID, experience: 300 })
      e.reply(`成功占领了${address}的灵矿，获得300洞府经验`)
    } else {
      let time1 = 3
      const LifeData = GameApi.Data.readInitial('life', 'playerLife', {})
      useraction[UID] = setTimeout(() => {
        forwardsetTime[UID] = 0
        const BattleDataA = GameApi.Data.read(A, 'playerBattle')
        const BattleDataB = GameApi.Data.read(B, 'playerBattle')
        let BMSG = GameApi.Fight.start(
          { battleA: BattleDataA, UIDA: A, NAMEA: LifeData[A].name },
          { battleB: BattleDataB, UIDB: B, NAMEB: LifeData[B].name }
        )
        GameApi.Data.write(A, 'playerBattle', BMSG.battleA)
        GameApi.Data.write(B, 'playerBattle', BMSG.battleB)
        let minefieldName = minefield.find((obj) => obj.address === address)
        if (BMSG.victory != B) {
          let timeMax = minefieldName.timeMax
          let time3 = minefieldName.createTime
          let time1 = Math.floor((nowTime - time3) / 1000)
          let time2 = 0
          if (time1 > timeMax) {
            time2 = timeMax
          } else {
            time2 = time1
          }
          let msg = HomeApi.GP.collectMinerals({
            UID: B,
            time: time2
          })
          minefieldName.UID = A
          minefieldName.createTime = nowTime
          minefieldName.timeMax = timeMax
          GameApi.Data.controlAction({
            CHOICE: 'user_home_minefield',
            NAME: 'minefield',
            DATA: minefield
          })
          HomeApi.GP.addHomeexperience({ UID, experience: 700 })
          e.reply(
            `矿主不敌你，乖乖让出了灵矿的占领权，你成功占领了${address}的灵矿，获得了700洞府经验。矿主拿着产出的矿物疯狂逃窜，矿主${msg}`
          )
        } else {
          let lingshi = GameApi.Bag.searchBagByName({
            UID,
            name: '下品灵石'
          })
          let lingshi1 = 1000
          if (lingshi < 1001) {
            lingshi1 = lingshi - 1
          }
          GameApi.Bag.addBagThing({
            UID: A,
            name: '下品灵石',
            ACCOUNT: -lingshi1
          })
          GameApi.Bag.addBagThing({
            UID: B,
            name: '下品灵石',
            ACCOUNT: lingshi1
          })
          HomeApi.GP.addHomeexperience({ UID, experience: 70 })
          e.reply(`你被矿主胖揍一顿，并且被他搜刮了${lingshi1}灵石作为赔偿，获得洞府经验70`)
        }
      }, 1000 * time1)
      forwardsetTime[UID] = 1
      e.reply(`在占领的途中被矿主发现，随后便鱼矿主厮杀起来!`)
      return false
    }
  }

  // 领取晶石
  async collectMinerals(e) {
    // 不开放私聊功能
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    const ifexisthome = HomeApi.GP.getPositionHome(UID)
    let region2 = ifexisthome.region
    let action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'user_home_action'
    })
    let region1 = action.region
    if (region2 != region1) {
      e.reply('您现在不在洞府所在地，无法领取晶石!')
      return false
    }
    const position = GameApi.Data.controlActionInitial({
      CHOICE: 'homePosition',
      NAME: 'position',
      INITIAL: []
    })
    const position1 = position.find((obj) => obj.UID === UID)
    const minefield = GameApi.Data.controlActionInitial({
      CHOICE: 'user_home_minefield',
      NAME: 'minefield',
      INITIAL: []
    })
    const target = minefield.find((obj) => obj.address === position1.address)
    if (target == undefined) {
      e.reply('该灵矿没被占领!')
      return false
    }
    let qq = target.UID
    if (qq != UID) {
      e.reply('你不是该灵矿的主人!')
      return false
    }
    let time = target.createTime
    let nowTime = new Date().getTime()
    let timeMax = target.timeMax
    let time1 = Math.floor((nowTime - time) / 1000)
    let time2 = 0
    if (time1 > timeMax) {
      time2 = timeMax
    } else {
      time2 = time1
    }
    if (time2 > 1800) {
      let msg = HomeApi.GP.collectMinerals({ UID, time: time2 })
      let experience = parseInt((time2 / 1800) * 20)
      HomeApi.GP.addHomeexperience({ UID, experience })
      target.createTime = nowTime
      GameApi.Data.controlAction({
        CHOICE: 'user_home_minefield',
        NAME: 'minefield',
        DATA: minefield
      })
      e.reply(`恭喜你，${msg}\n洞府经验增加${experience}`)
      return false
    } else {
      e.reply('时间太短了，工人都没开采出来!')
      return false
    }
  }

  async refining(e) {
    // 不开放私聊功能
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    let home = GameApi.Data.controlActionInitial({
      CHOICE: 'homeUser',
      NAME: UID,
      INITIAL: []
    })
    if (home.homelevel < 1) {
      e.reply(`你的洞府还太小，根本放不下炼制所需器具!`)
      return false
    }
    let thing = e.cmd_msg.replace(/^(#|\/)炼制/, '')
    let code = thing.split('*')
    let thingName = code[0] // 物品
    let wupin = thingName.replace('晶石', '')
    let thingAcount = code[1] // 数量
    let mei = '焦煤'
    if (wupin == '富煤') {
      e.reply('这富煤晶石无法炼制，只能提炼')
      return false
    }
    let quantity = GameApi.Method.leastOne(thingAcount)
    let searchswupin = HomeApi.GP.homeexistAllThingByName({
      name: wupin
    })
    let searchsmei = HomeApi.GP.homeexistAllThingByName({
      name: mei
    })
    let searchsthing = HomeApi.GP.homeexistAllThingByName({
      name: thingName
    })
    if (!searchsthing) {
      e.reply(`世界没有[${thingName}]`)
      return false
    }
    if (searchsthing.mine != 1) {
      e.reply('这玩意儿咋炼？')
      return false
    }
    let WarehouseThing = HomeApi.GP.homeexistWarehouseThingName(UID, thingName)
    if (!WarehouseThing || WarehouseThing.acount < quantity) {
      e.reply(`你[${thingName}]数量不够`)
      return false
    }
    let meiThing = HomeApi.GP.homeexistWarehouseThingName(UID, mei)
    let n = 5 * quantity
    if (!meiThing || meiThing.acount < n) {
      e.reply(`${mei}不足，无法炼制,炼制一颗矿石需要5块${mei}`)
      return false
    }
    const the = 300
    const time1 = the >= 0 ? the : 1
    useraction[UID] = setTimeout(() => {
      let Warehouse = GameApi.Data.controlActionInitial({
        CHOICE: 'homeWarehouse',
        NAME: UID,
        INITIAL: []
      })
      WarehouseThing = HomeApi.GP.homeexistWarehouseThingName(UID, thingName)
      if (!WarehouseThing || WarehouseThing.acount < quantity) {
        e.reply(`你[${thingName}]数量不够`)
        return false
      }
      let meiThing = HomeApi.GP.homeexistWarehouseThingName(UID, mei)
      if (!meiThing || meiThing.acount < n) {
        e.reply(`${mei}不足，无法炼制,炼制一颗矿石需要5块${mei}`)
        return false
      }
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: searchsthing,
        quantity: -quantity
      })
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: searchsmei,
        quantity: -n
      })
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: searchswupin,
        quantity
      })
      GameApi.Data.controlAction({
        CHOICE: 'homeWarehouse',
        NAME: UID,
        DATA: Warehouse
      })
      e.reply(`成功炼制出${quantity}块【${wupin}】`)
    }, 1000 * time1)
    forwardsetTime[UID] = 1
    e.reply(`联盟配备的炼制师正在加紧给你炼制【${thing}】...\n预计需要${time1}秒`)
    return false
  }

  async coal(e) {
    // 不开放私聊功能
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    let thing = e.cmd_msg.replace(/^(#|\/)提炼/, '')
    let code = thing.split('*')
    let thingName = code[0] // 物品
    let wupin = thingName.replace('晶石', '')
    let thingAcount = code[1] // 数量
    let mei1 = '富煤'
    let mei = '焦煤'
    if (wupin != mei1) {
      e.reply(`目前支持提炼的只有富煤晶石!`)
      return false
    }
    let quantity = GameApi.Method.leastOne(thingAcount)
    let searchsthing = HomeApi.GP.homeexistAllThingByName({
      name: mei
    })
    let searchswupin = HomeApi.GP.homeexistWarehouseThingName(UID, thingName)
    if (!searchswupin || searchswupin.acount < quantity) {
      e.reply(`你[${thingName}]不够`)
      return false
    }
    if (!searchsthing) {
      e.reply(`这个世界没有[${mei}]`)
      return false
    }
    const the = 300
    const time1 = the >= 0 ? the : 1
    useraction[UID] = setTimeout(() => {
      let Warehouse = GameApi.Data.controlActionInitial({
        CHOICE: 'user_Warehouse',
        NAME: UID,
        INITIAL: []
      })
      let WarehouseThing = HomeApi.GP.homeexistWarehouseThingName(UID, thingName)
      if (!WarehouseThing || WarehouseThing.acount < quantity) {
        e.reply(`你[${thingName}]数量不够`)
        return false
      }
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: searchsthing,
        quantity: quantity * 5
      })
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: searchswupin,
        quantity: -quantity
      })
      GameApi.Data.controlAction({
        CHOICE: 'homeWarehouse',
        NAME: UID,
        DATA: Warehouse
      })
      e.reply(`成功提炼出${quantity * 5}块【${mei}】`)
    }, 1000 * time1)
    forwardsetTime[UID] = 1
    e.reply(`联盟配备的炼制师正在加紧给你提炼【${thing}】...\n预计需要${time1}秒`)
    return false
  }

  // 查看占领时间
  async look_minerals(e) {
    // 不开放私聊功能
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    const minefield = GameApi.Data.controlActionInitial({
      CHOICE: 'user_home_minefield',
      NAME: 'minefield',
      INITIAL: []
    })
    const target = minefield.find((obj) => obj.UID === UID)
    if (target == undefined) {
      e.reply('你不是该灵矿的主人，无法获取灵矿的信息!')
      return false
    }
    let time = target.createTime
    let nowTime = new Date().getTime()
    let timeMax = target.timeMax
    let time1 = Math.floor((nowTime - time) / 60000)
    time1 = parseInt(time1)
    if (time1 > timeMax) {
      e.reply('你的灵矿已经堆满了，执行#领取灵矿来将其搬走吧!')
    }
    e.reply(`你的工人已经开采了${time1}分钟的灵矿!`)
    return false
  }

  async forging(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    let thing = e.cmd_msg.replace(/^(#|\/)锻造/, '')
    let all = GameApi.Data.controlActionInitial({
      CHOICE: 'all',
      NAME: 'all',
      INITIAL: []
    })
    let searchsthing = all.find((item) => item.name == thing)
    let Warehouse = GameApi.Data.controlActionInitial({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      INITIAL: []
    })
    let searchsthing1 = Warehouse.thing.find((item) => item.name == thing)
    if (searchsthing == undefined) {
      e.reply(`世界没有[${thing}]`)
      return false
    }
    if (searchsthing1 != undefined) {
      e.reply(`你已经有[${thing}]，请换一种锅`)
      return false
    }
    let dwg1 = thing + '图纸'
    let dwg = Warehouse.thing.find((item) => item.name == dwg1)
    if (dwg == undefined) {
      e.reply(`你没有[${dwg1}]`)
      return false
    }
    let id = dwg.id.split('-')
    let m = [25, 16, 12, 10, 8, 6]
    let s = [0, 0, 0, 0, 0, 0, 0]
    let m1 = ['焦煤', '玄铁', '火铜', '秘银', '精金', '熔岩']
    let stuff = dwg.stuff
    let item = []
    let thingx = []
    for (let i = 0; i < stuff.length; i++) {
      m1.push(stuff[i])
      m.push(s[i])
    }
    let x = 0
    // 读取矿物数量以及判断数量
    for (let i = 0; i < m1.length; i++) {
      x = m[i] * Math.pow(2, parseInt(id[2]) - 1) + 1
      let ifexist1 = HomeApi.GP.homesearchThingName({ name: m1[i] })
      let id1 = ifexist1.id.split('-')
      if (id1[0] == '13' && id1[1] == '3') {
        x = 2
      }
      thingx.push(x)
      let z = Warehouse.thing.find((item) => item.name == m1[i])
      if (z == undefined) {
        e.reply(`你没有[${m1[i]}]`)
        return false
      }
      let accounty = z.acount
      if (accounty < x) {
        e.reply(`你[${m1[i]}]数量不足,还缺${x - accounty}`)
        return false
      }
      item.push(z)
    }
    const the = 20
    const time1 = the >= 0 ? the : 1
    useraction[UID] = setTimeout(() => {
      for (let c = 0; c < thingx.length; c++) {
        // 矿物
        Warehouse = HomeApi.GP.addDataThing({
          DATA: Warehouse,
          DATA1: item[c],
          quantity: -thingx[c]
        })
      }
      // 图纸
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: dwg,
        quantity: -1
      })
      // 锅
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: searchsthing,
        quantity: 1
      })
      // 写入仓库
      GameApi.Data.controlAction({
        CHOICE: 'homeWarehouse',
        NAME: UID,
        DATA: Warehouse
      })
      e.reply(`你成功锻造出【${thing}】`)
    }, 1000 * time1)
    forwardsetTime[UID] = 1
    e.reply(`正在给你锻造【${thing}】...\n预计需要${time1}秒`)
    return false
  }

  // 分解
  async resolve(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    let thing = e.cmd_msg.replace(/^(#|\/)分解/, '')
    let code = thing.split('*')
    let thingName = code[0] // 物品
    let thingAcount = parseInt(code[1]) // 数量
    let quantity = GameApi.Method.leastOne(thingAcount)
    let Warehouse = GameApi.Data.controlActionInitial({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    let sp = [
      '地磁道芯',
      '九玄天晶',
      '天工秘物',
      '神兵碎片',
      '天造道芯',
      '八卦天晶',
      '离火秘物',
      '乾坤碎片'
    ]
    let cl = ['封仙印', '墨刀', '逆甲', '破天莲', '碧鳞剑', '逆鳞', '彩衣', '乾坤灯']
    let ifexist = Warehouse.thing.find((item) => item.name == thingName)
    if (ifexist == undefined || ifexist.account) {
      e.reply(`你没有足够数量的${thingName}`)
      return false
    }
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: ifexist,
      quantity: -quantity
    })
    let c = 10
    for (let i = 0; i < cl.length; i++) {
      if (thingName == cl[i]) {
        c = i
      }
    }
    if (c == 10) {
      e.reply(`${thing}放进分解池子，啥也没出`)
      GameApi.Data.controlAction({
        CHOICE: 'homeWarehouse',
        NAME: UID,
        DATA: Warehouse
      })
      return false
    }
    let name = sp[c]
    let ifexist1 = HomeApi.GP.homesearchThingName({ name })
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: ifexist1,
      quantity
    })
    GameApi.Data.controlAction({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      DATA: Warehouse
    })
    e.reply(`成功分解了${quantity}把${thingName}，得到${quantity}块${sp[c]}`)
    return false
  }

  // 修理
  async repair(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    let thing = e.cmd_msg.replace(/^(#|\/)修理/, '')
    let Warehouse = GameApi.Data.controlActionInitial({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      INITIAL: []
    })
    let guo = Warehouse.thing.find((item) => item.name == thing)
    if (guo == undefined) {
      e.reply(`你没有${thing}`)
      return false
    }
    let m1 = ['焦煤', '玄铁', '火铜', '秘银', '精金', '熔岩']
    let m = [25, 16, 12, 10, 8, 6]
    let tuzhi = thing + '图纸'
    let tu = HomeApi.GP.homesearchThingName({ name: tuzhi })
    let id = tu.id.split('-')
    for (let g = 0; g < m1.length; g++) {
      let x = parseInt(m[g] * Math.pow(2, parseInt(id[2]) - 1))
      let cail = Warehouse.thing.find((item) => item.name == m1[g])
      if (cail == undefined) {
        e.reply(`你没有[${m1[g]}]`)
        return false
      }
      let accounty = cail.acount
      if (accounty < x) {
        e.reply(`你[${m1[g]}]数量不足,还缺${x - accounty}`)
        return false
      }
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: cail,
        quantity: -x
      })
    }
    let guo1 = HomeApi.GP.homeexistAllThingByName({ name: thing })
    guo.durable = guo1.durable
    GameApi.Data.controlAction({
      CHOICE: 'homeWarehouse',
      NAME: UID,
      DATA: Warehouse
    })
    e.reply(`成功修好了${thing}`)
    return false
  }
}
