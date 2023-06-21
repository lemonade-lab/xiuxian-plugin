import { BotApi, GameApi, HomeApi, plugin } from '../../model/api/index.js'
const forwardsetTime = []
const useraction = []
// 秋雨
export class Homecook extends plugin {
  constructor() {
    super({
      name: 'xiuxian@cook',
      dsc: 'xiuxian@cook',
      rule: [
        {
          reg: /^(#|\/)起火炼丹$/,
          fnc: 'Occupy_the_mine'
        },
        {
          reg: /^(#|\/)用.*$/,
          fnc: 'stir_fry'
        },
        {
          reg: /^(#|\/)吃.*$/,
          fnc: 'eat'
        },
        {
          reg: /^(#|\/)发布.*$/,
          fnc: 'fabucaipu'
        },
        {
          reg: /^(#|\/)炼丹阁$/,
          fnc: 'wanmin'
        },
        {
          reg: /^(#|\/)炼丹阁购买.*$/,
          fnc: 'wanminbug'
        }
      ]
    })
  }

  async Occupy_the_mine(e) {
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
    let msg1 = []
    let goods = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    let goodsthing = goods.thing
    for (let i = 0; i < goodsthing.length; i++) {
      let wupin = goodsthing[i]
      let id = wupin.id.split('-')
      if (id[0] == 13 && id[1] == 2) {
        msg1.push(`\n${wupin.name}`)
      }
    }
    if (msg1.length == 0) {
      e.reply(`你没有锅具`)
      return false
    }
    let msg = [`您仓库里只有以下锅具，请选择的所要用的锅具\n${msg1}`]
    e.reply(msg)
    this.setContext('choose_cook')
  }

  async choose_cook(e) {
    let UID = e.user_id
    let theMsg = this.e.message
    let choice = theMsg[0].text
    if (choice == '退出') {
      this.finish('choose_cook')
      e.reply(`做饭结束`)
      return false
    }
    let cook1 = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    let cook = cook1.thing.find((item) => item.name == choice)
    if (cook == undefined) {
      e.reply(`你没有这样的锅具，请重新选择`)
      return false
    }
    GameApi.Action.set(UID, {
      name: choice,
      startTime: 1000 * 60
    })
    this.finish('choose_cook')
    let msg = [`您是否要使用丹方，请输入1或2\n【1】不使用丹方\n【2】使用丹方`]
    e.reply(`${msg}`)
    this.setContext('choose')
    return false
  }

  async choose(e) {
    let UID = e.user_id
    let theMsg = this.e.message
    let choice = theMsg[0].text
    if (choice == '退出') {
      this.finish('choose')
      e.reply(`做饭结束`)
      return false
    }
    if (choice == 1) {
      this.finish('choose')
      e.reply(`请使用#丹方名字*药1*药2*药3，制作出你独一无二的药品吧`)
      this.setContext('choose_food1')
      return false
    } else if (choice == 2) {
      let msg1 = []
      let goods = GameApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        INITIAL: []
      })
      let goodsthing = goods.thing
      for (let i = 0; i < goodsthing.length; i++) {
        let wupin = goodsthing[i]
        let id = wupin.id.split('-')
        if (id[0] == 13 && id[1] == 1) {
          msg1.push(`\n${wupin.name}`)
        }
      }
      if (msg1.length == 0) {
        this.finish('choose')
        e.reply(`你没有丹方，请执行\n#丹方名字*药1*药2*药3 制作出你独一无二的药品吧`)
        this.setContext('choose_food1')
        return false
      } else {
        this.finish('choose')
        let msg = [`您仓库里只有以下丹方，请选择的所要使用的丹方\n${msg1}`]
        e.reply(`${msg}`)
        this.setContext('choose_food')
        return false
      }
    }
  }

  async choose_food(e) {
    let UID = e.user_id
    let theMsg = this.e.message
    let choice = theMsg[0].text
    if (choice == '退出') {
      this.finish('choose_food')
      e.reply(`做饭结束`)
      return false
    }
    let thing = choice.replace('丹方', '')
    let name2 = choice.replace(thing, '')
    if (name2 != '丹方') {
      e.reply(`你输入的丹方名中必须要以丹方结尾，请重新输入!`)
      return false
    }
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    let food = Warehouse.thing.find((item) => item.name == choice)
    if (food == undefined) {
      e.reply(`好像没有这种丹方，请重新选择!`)
      return false
    }
    let action = GameApi.Action.get(UID)

    let nameIwant = action.name
    let zhushi = food.zhushi
    let fushi = food.fushi
    let tiaoliao = food.tiaoliao
    const shipu = Warehouse.thing.find((item) => item.name === choice)
    if (shipu.proficiency != undefined) {
      if (shipu.proficiency == 0) {
        e.reply(`试用丹方次数已用完，请前往炼丹阁发布丹方!`)
        this.finish('choose_food')
        return false
      }
    }
    let zhushi1 = Warehouse.thing.find((item) => item.name === zhushi)
    if (zhushi1 == undefined) {
      e.reply(`您的仓库里没有${zhushi}!`)
      this.finish('choose_food')
      return false
    }
    let fushi1 = Warehouse.thing.find((item) => item.name === fushi)
    if (fushi1 == undefined) {
      e.reply(`您的仓库里没有${fushi}!`)
      this.finish('choose_food')
      return false
    }
    let tiaoliao1 = Warehouse.thing.find((item) => item.name === tiaoliao)
    if (tiaoliao1 == undefined) {
      e.reply(`您的仓库里没有${tiaoliao}!`)
      this.finish('choose_food')
      return false
    }
    let guo = Warehouse.thing.find((item) => item.name === nameIwant)
    let shuxing1 = HomeApi.GP.attribute({ thing: zhushi1 })
    let shuxing2 = HomeApi.GP.attribute({ thing: fushi1 })
    let shuxing3 = HomeApi.GP.attribute({ thing: tiaoliao1 })
    let rand = Math.ceil(Math.random() * 3) - 1
    let shu = [shuxing1, shuxing2, shuxing3]
    let shuxinga = shu[rand]
    let a = 1
    for (var i in shuxinga) {
      shuxinga[i] = shuxinga[i] * guo.a
    }
    let recipes1 = HomeApi.GP.foodshuxing({
      shuxinga,
      id: food.caiid,
      name1: thing,
      doge: food.doge
    })
    const the = 20
    const time1 = the >= 0 ? the : 1
    useraction[UID] = setTimeout(() => {
      forwardsetTime[UID] = 0
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: recipes1,
        quantity: a
      })
      let thing1 = Warehouse.thing
      const target = Warehouse.thing.find((obj) => obj.name === nameIwant)
      target.durable = target.durable - 1
      if (target.durable == 0) {
        Warehouse.thing = thing1.filter((item) => item.name != nameIwant)
      }
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: zhushi1,
        quantity: -1
      })
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: fushi1,
        quantity: -1
      })
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: tiaoliao1,
        quantity: -1
      })
      let msg = '还好字迹还算看得清'
      if (shipu.proficiency != undefined) {
        shipu.proficiency -= 1
        e.reply(
          `恭喜你，成功炒出【${recipes1.name}】，消耗${nameIwant}一点耐久度，试用丹方熟练度当前为${
            100 - shipu.proficiency
          }`
        )
      } else {
        shipu.durable -= 1
        if (shipu.durable == 0) {
          Warehouse.thing = thing1.filter((item) => item.name != shipu.name)
          msg = '使用后，发现丹方已经被翻得字迹模糊了，已经不能用了'
        }
        e.reply(
          `恭喜你，成功炒出【${recipes1.name}】，消耗${nameIwant}一点耐久度，丹方有些许磨损，\n${msg}`
        )
      }
      GameApi.Listdata.controlAction({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        DATA: Warehouse
      })
    }, 1000 * time1)
    forwardsetTime[UID] = 1
    e.reply(`正在给你制作【${thing}】...\n预计需要${time1}秒`)
    this.finish('choose_food')
    return false
  }

  async choose_food1(e) {
    let UID = e.user_id
    let theMsg = this.e.message
    let choice = theMsg[0].text
    if (choice == '退出') {
      this.finish('choose_food1')
      e.reply(`做饭结束`)
      return false
    }
    let thing = choice.replace(/^(#|\/)/, '')
    let code = thing.split('*')
    let name = code[0]
    let zhushi = code[1]
    let fushi = code[2]
    let tiaoliao = code[3]
    let judge = HomeApi.GP.foodjudge({ name: zhushi })
    let judge1 = HomeApi.GP.foodjudge({ name: fushi })
    let judge2 = HomeApi.GP.foodjudge({ name: tiaoliao })
    if (judge == 1 || judge1 == 1 || judge2 == 1) {
      e.reply(`你输入的药无法制作成丹药!`)
      return false
    }
    let name1 = name.replace('丹方', '')
    let name2 = name.replace(name1, '')
    if (name2 != '丹方') {
      e.reply(`你输入的丹方名中必须要丹方结尾，请重新输入!`)
      return false
    }
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    let zhushi1 = Warehouse.thing.find((item) => item.name === zhushi)
    if (zhushi1 == undefined) {
      e.reply(`你仓库里没有${zhushi}，请重新选择!`)
      return false
    }
    let fushi1 = Warehouse.thing.find((item) => item.name === fushi)
    if (fushi1 == undefined) {
      e.reply(`你仓库里没有${fushi}，请重新选择!`)
      return false
    }
    let tiaoliao1 = Warehouse.thing.find((item) => item.name === tiaoliao)
    if (tiaoliao1 == undefined) {
      e.reply(`你仓库里没有${tiaoliao}，请重新选择!`)
      return false
    }
    let doge = (zhushi1.doge + tiaoliao1.doge + fushi1.doge) * 2
    let action = GameApi.Action.get(UID)
    let nameIwant = action.name
    let guo = Warehouse.thing.find((item) => item.name === nameIwant)
    let shuxing1 = HomeApi.GP.attribute({ thing: zhushi1 })
    let shuxing2 = HomeApi.GP.attribute({ thing: fushi1 })
    let shuxing3 = HomeApi.GP.attribute({ thing: tiaoliao1 })
    let rand = Math.ceil(Math.random() * 3) - 1
    let shu = [shuxing1, shuxing2, shuxing3]
    let shuxinga = shu[rand]
    let a = 1
    for (var i in shuxinga) {
      shuxinga[i] = shuxinga[i] * guo.a
    }
    let data = [
      {
        id: 13 - 1 - 1,
        caiid: 13 - 3 - 1,
        name: '初始',
        doge: 0,
        zhushi: '无',
        fushi: '无',
        tiaoliao: '无',
        proficiency: 100
      }
    ]
    let cook = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_cook',
      NAME: 'cook',
      INITIAL: data
    })
    let ifexist1 = cook.find((item) => item.name == name)
    let ifexist0 = cook.find(
      (item) => item.zhushi == zhushi && item.fushi == fushi && item.tiaoliao == tiaoliao
    )
    if (ifexist0) {
      e.reply(`此配方已有人参悟出来，请购买他的药单或者另外调配配方`)
      return false
    }
    if (ifexist1) {
      e.reply(`此配方名字已经被人占用，请重新为你的丹方命名`)
      return false
    }
    let id = '13-1-'
    let three = cook.length + 1
    id = id + three
    let fenid = id.split('-')
    let caiid = fenid[0] + '-3-' + fenid[2]
    let peifang = {
      id,
      caiid,
      name,
      doge,
      zhushi,
      fushi,
      tiaoliao,
      acount: 1,
      proficiency: 100
    }
    const the = 20
    const time1 = the >= 0 ? the : 1
    useraction[UID] = setTimeout(() => {
      let peifang2 = peifang
      peifang = HomeApi.GP.addCookThing({
        cook,
        cookThing: peifang,
        thingAcount: 1
      })
      GameApi.Listdata.controlAction({
        CHOICE: 'user_cook',
        NAME: 'cook',
        DATA: peifang
      })
      let foodThing = GameApi.Listdata.controlActionInitial({
        CHOICE: 'user_food',
        NAME: 'food',
        INITIAL: data
      })
      let food = HomeApi.GP.foodshuxing({
        shuxinga,
        id: caiid,
        name1,
        doge
      })
      foodThing = HomeApi.GP.addFoodThing({
        food: foodThing,
        foodThing: food,
        thingAcount: 1
      })
      GameApi.Listdata.controlAction({
        CHOICE: 'user_food',
        NAME: 'food',
        DATA: foodThing
      })
      HomeApi.GP.addAll({ data: peifang2 })
      HomeApi.GP.addAll({ data: food })
      let Warehouse = GameApi.Listdata.controlActionInitial({
        CHOICE: 'user_Warehouse',
        NAME: UID,
        INITIAL: []
      })
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: peifang2,
        quantity: 1
      })
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: food,
        quantity: a
      })
      let thing1 = Warehouse.thing
      const target = thing1.find((obj) => obj.name === nameIwant)
      target.durable = target.durable - 1
      if (target.durable == 0) {
        Warehouse.thing = thing1.filter((item) => item.name != nameIwant)
      }
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: zhushi1,
        quantity: -1
      })
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: fushi1,
        quantity: -1
      })
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: tiaoliao1,
        quantity: -1
      })
      GameApi.Listdata.controlAction({
        CHOICE: 'user_Warehouse',
        NAME: UID,
        DATA: Warehouse
      })
      e.reply(
        `恭喜你，成功炒出【${food.name}】，消耗${nameIwant}一点耐久度，获得了${name}的试用丹方，熟练度为0，熟练度为100后可前往炼丹阁申请发布流通丹方`
      )
    }, 1000 * time1)
    e.reply(`正在给你制作【${name1}】...\n预计需要${time1}秒`)
    this.finish('choose_food1')
    return false
  }

  async eat(e) {
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
      return
    }
    let thing = e.msg.replace(/^(#|\/)吃/, '')
    let code = thing.split('*')
    let code1 = code[0] + ' · ' + code[1]
    let nowTime = new Date().getTime()
    let endtime = nowTime + 300000
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    let shiwu = Warehouse.thing.find((item) => item.name === code1)
    if (shiwu == undefined) {
      e.reply(`你仓库里没有这道药!`)
      return false
    }
    const map = {
      攻击: 'attack',
      防御: 'defense',
      血量上限: 'blood',
      暴击: 'burst',
      爆伤: 'burstMax',
      敏捷: 'speed'
    }
    if (Object.prototype.hasOwnProperty.call(map, code[1])) {
      if (map[code[1]] == 'speed') {
        GameApi.GP.addExtendTimes({
          NAME: UID,
          FLAG: 'home',
          TYPE: map[code[1]],
          VALUE: shiwu[map[code[1]]],
          ENDTIME: endtime
        })
      } else {
        GameApi.GP.addExtendTimes({
          NAME: UID,
          FLAG: 'home',
          TYPE: map[code[1]],
          VALUE: shiwu[map[code[1]]] * 100,
          ENDTIME: endtime
        })
      }
      e.reply(`成功服用${code1}!`)
    } else {
      switch (code[1]) {
        case '血量恢复': {
          let nowblood = parseInt(shiwu.nowblood)
          HomeApi.GP.addNowblood({ UID, nowblood })
          e.reply(`成功服用${shiwu.name},血量恢复了${nowblood}`)
          break
        }
        case '寿命': {
          let life = parseInt(shiwu.life)
          HomeApi.GP.addLife({ UID, life })
          e.reply(`成功服用${shiwu.name},年轻了${life}年`)
          break
        }
        default: {
          console.info('无')
        }
      }
    }
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: shiwu,
      quantity: -1
    })
    GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse,
      INITIAL: []
    })
    return false
  }

  async fabucaipu(e) {
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
    const action = GameApi.Listdata.controlAction({ CHOICE: 'playerAction', NAME: UID })
    const addressName = '炼丹阁'
    const map = GameApi.Map.mapExistence({ action, addressName })
    if (!map) {
      e.reply(`需要前往各大主城中的${addressName}才能发布`)
      return false
    }
    let thing = e.msg.replace(/^(#|\/)发布/, '')
    let caipu = HomeApi.GP.homeexistWarehouseThingName({ UID, name: thing })
    if (caipu == 1) {
      e.reply(`你没有该物品`)
      return false
    }
    if (caipu.proficiency != 0) {
      e.reply(`该丹方的熟练度未到达100，暂时不给予发布资格`)
      return false
    }
    const cook = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_cook',
      NAME: 'cook'
    })
    let target = cook.find((obj) => obj.name === caipu.name)
    delete target.proficiency
    GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_cook',
      NAME: 'cook',
      DATA: cook
    })
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    let wanmin = {
      UID,
      durable: 100
    }
    target = Object.assign(target, wanmin)
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: caipu,
      quantity: -1
    })
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: target,
      quantity: 1
    })
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse
    })
    let wanmin1 = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_wanmin',
      NAME: 'wanmin',
      INITIAL: []
    })
    wanmin1 = HomeApi.GP.addDataThing({ DATA: wanmin1, DATA1: target, quantity: 1 })
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home_wanmin',
      NAME: 'wanmin',
      DATA: wanmin1
    })
    e.reply(`恭喜${UID}成功在炼丹阁发布一份丹方，可前往炼丹阁购买，发布者可获得50%出售收益的版权费`)
    return false
  }

  async wanmin(e) {
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
    const action = GameApi.Listdata.controlAction({ CHOICE: 'playerAction', NAME: UID })
    const addressName = '炼丹阁'
    const map = GameApi.Map.mapExistence({ action, addressName })
    if (!map) {
      e.reply(`需要前往各大主城中的${addressName}`)
      return false
    }
    let msg = ['___[炼丹阁]___\n#炼丹阁购买+物品名']
    let wanmin = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_wanmin',
      NAME: 'wanmin',
      INITIAL: []
    })
    wanmin.forEach((item) => {
      msg.push('丹方名字：' + item.name + '\n丹方提供者：' + item.UID + '\n灵晶：' + item.doge)
    })
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    return false
  }

  async wanminbug(e) {
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
    const action = GameApi.Listdata.controlAction({ CHOICE: 'playerAction', NAME: UID })
    const addressName = '炼丹阁'
    const map = GameApi.Map.mapExistence({ action, addressName })
    if (!map) {
      e.reply(`需要前往各大主城中的${addressName}才能购买`)
      return false
    }
    let thing = e.msg.replace(/^(#|\/)炼丹阁购买/, '')
    let code = thing.split('*')
    let thingName = code[0] // 物品
    let shipu = HomeApi.GP.homeexistWarehouseThingName({ UID, thingName })
    if (shipu != 1) {
      e.reply(`您已经有该丹方，请把该丹方消耗完再来吧!`)
      return false
    }
    let ifexist1 = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_wanmin',
      NAME: 'wanmin',
      INITIAL: []
    })
    let ifexist = ifexist1.find((item) => item.name == thingName)
    if (!ifexist) {
      e.reply(`不卖:${thingName}`)
      return false
    }
    let home = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL: []
    })
    let doge = home.doge
    let commoditiesDoge1 = ifexist.doge
    let lt = [0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3]
    let ex = Math.ceil(Math.random() * 6)
    let rand = lt[ex]
    let commoditiesDoge = parseInt(commoditiesDoge1 * rand)
    if (doge < commoditiesDoge) {
      e.reply(`灵晶不足`)
      return false
    }
    let money = commoditiesDoge * 0.5
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: ifexist,
      quantity: 1
    })
    GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse,
      INITIAL: []
    })
    HomeApi.GP.addDoge({ UID, money: -commoditiesDoge })
    if (ifexist.UID == UID) {
      e.reply(
        `感谢您的购买，这次税率为【${rand}】,最终花了[${commoditiesDoge}]灵晶从炼丹阁购买了[${thingName}]`
      )
      return false
    } else {
      HomeApi.GP.addDoge({ UID: ifexist.UID, money })
      e.reply(
        `感谢您的购买，这次税率为【${rand}】,最终花了[${commoditiesDoge}]灵晶从炼丹阁购买了[${thingName}]，丹方提供者：${ifexist.UID} 获得了${money}版权费`
      )
      return false
    }
  }

  async stir_fry(e) {
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
    let thing0 = e.msg.replace(/^(#|\/)用/, '')
    let thing1 = thing0.split('炒')
    let code = thing1[1].split('*')
    let Warehouse = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      INITIAL: []
    })
    let guo = Warehouse.thing.find((item) => item.name == thing1[0])
    if (guo == undefined) {
      e.reply(`你没有${thing1[0]}，请重新选择!`)
      return false
    }
    let id = guo.id.split('-')
    let quantity = GameApi.Method.leastOne(code[1])
    if (guo.durable < quantity) {
      e.reply(`你的${thing1[0]}耐久不够，请重新选择数量!`)
      return false
    }
    let choice = code[0] + '丹方'
    let shipu = Warehouse.thing.find((item) => item.name == choice)
    if (shipu == undefined) {
      e.reply(`你没有${choice}，请重新选择!`)
      return false
    }
    if (id[0] != 13 || id[1] != 2) {
      Warehouse = HomeApi.GP.addDataThing({
        DATA: Warehouse,
        DATA1: guo,
        quantity: -1
      })
      GameApi.Listdata.controlAction({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        DATA: Warehouse
      })
      e.reply(`你的${thing1[0]}不是锅，刚放到火上就被烧没了!`)
      return false
    }
    let zhushi = shipu.zhushi
    let fushi = shipu.fushi
    let tiaoliao = shipu.tiaoliao
    if (shipu.proficiency != undefined) {
      if (shipu.proficiency < 1) {
        e.reply(`试用丹方次数已用完，请前往炼丹阁发布丹方!`)
        return false
      }
      if (shipu.proficiency < quantity) {
        e.reply(`试用丹方次数不够，无法完成制作，请重新选择数量!`)
        return false
      }
    } else {
      if (shipu.durable < quantity) {
        e.reply(`丹方使用次数不够，无法完成制作，请重新选择数量!`)
        return false
      }
    }
    let zhushi1 = Warehouse.thing.find((item) => item.name === zhushi)
    if (zhushi1 == undefined || zhushi1.acount < quantity) {
      e.reply(`您的仓库里${zhushi}数量不够!`)
      return false
    }
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: zhushi1,
      quantity: -quantity
    })
    let fushi1 = Warehouse.thing.find((item) => item.name === fushi)
    if (fushi1 == undefined || fushi1.acount < quantity) {
      e.reply(`您的仓库里${fushi}数量不够!`)
      return false
    }
    Warehouse = HomeApi.GP.addDataThing({
      DATA: Warehouse,
      DATA1: fushi1,
      quantity: -quantity
    })
    let tiaoliao1 = Warehouse.thing.find((item) => item.name === tiaoliao)
    if (tiaoliao1 == undefined || tiaoliao1.acount < quantity) {
      e.reply(`您的仓库里${tiaoliao}数量不够!`)
      return false
    }
    let shuxing1 = HomeApi.GP.attribute({ thing: zhushi1 })
    let shuxing2 = HomeApi.GP.attribute({ thing: fushi1 })
    let shuxing3 = HomeApi.GP.attribute({ thing: tiaoliao1 })
    let rand = Math.ceil(Math.random() * 3) - 1
    let shu = [shuxing1, shuxing2, shuxing3]
    let shuxinga = shu[rand]
    for (var i in shuxinga) {
      shuxinga[i] = shuxinga[i] * guo.a
    }
    let recipes1 = HomeApi.GP.foodshuxing({
      shuxinga,
      id: shipu.caiid,
      name1: code[0],
      doge: shipu.doge
    })
    const CDid = '3'
    const CDTime = 20 * quantity
    let nowTime = new Date().getTime()
    const CD = HomeApi.GP.generateCD({ UID, CDid })
    if (CD != 0) {
      e.reply(CD)
      return false
    }
    const time = 20
    useraction[UID] = setTimeout(() => {
      forwardsetTime[UID] = 0
      let Warehouse1 = GameApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        INITIAL: []
      })
      let zhushi1 = Warehouse1.thing.find((item) => item.name === zhushi)
      if (zhushi1 == undefined || zhushi1.acount < quantity) {
        e.reply(`您的仓库里${zhushi}数量不够!`)
        return false
      }
      Warehouse1 = HomeApi.GP.addDataThing({
        DATA: Warehouse1,
        DATA1: zhushi1,
        quantity: -quantity
      })
      let fushi1 = Warehouse1.thing.find((item) => item.name === fushi)
      if (fushi1 == undefined || fushi1.acount < quantity) {
        e.reply(`您的仓库里${fushi}数量不够!`)
        return false
      }
      Warehouse1 = HomeApi.GP.addDataThing({
        DATA: Warehouse1,
        DATA1: fushi1,
        quantity: -quantity
      })
      let tiaoliao1 = Warehouse1.thing.find((item) => item.name === tiaoliao)
      if (tiaoliao1 == undefined || tiaoliao1.acount < quantity) {
        e.reply(`您的仓库里${tiaoliao}数量不够!`)
        return false
      }
      Warehouse1 = HomeApi.GP.addDataThing({
        DATA: Warehouse1,
        DATA1: tiaoliao1,
        quantity: -quantity
      })
      let guo = Warehouse1.thing.find((item) => item.name == thing1[0])
      if (guo == undefined) {
        e.reply(`由于你在做饭的时候将锅拿开了，你的食材部浪费掉了!`)
        return false
      }
      let shipu1 = Warehouse1.thing.find((item) => item.name === choice)
      Warehouse1 = HomeApi.GP.addDataThing({
        DATA: Warehouse1,
        DATA1: recipes1,
        quantity
      })
      let thing2 = Warehouse1.thing
      const target = Warehouse1.thing.find((obj) => obj.name === thing1[0])
      target.durable = target.durable - quantity
      if (target.durable < 1) {
        Warehouse1.thing = thing2.filter((item) => item.name != thing1[0])
      }
      let msg = '还好字迹还算看得清'
      if (shipu1.proficiency != undefined) {
        shipu1.proficiency -= quantity
        e.reply(
          `恭喜你，成功炒出【${quantity}】份【${recipes1.name}】，消耗${
            thing1[0]
          }【${quantity}】点耐久度，试用丹方熟练度当前为${100 - shipu1.proficiency}`
        )
      } else {
        shipu1.durable -= quantity
        if (shipu1.durable < 1) {
          Warehouse1.thing = thing2.filter((item) => item.name != shipu1.name)
          msg = '使用后，发现丹方已经被翻得字迹模糊了，已经不能用了'
        }
        e.reply(
          `恭喜你，成功炒出【${quantity}】份【${recipes1.name}】，消耗${thing1[0]}【${quantity}】点耐久度，丹方有些许磨损，\n${msg}`
        )
      }
      GameApi.Listdata.controlAction({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        DATA: Warehouse1
      })
    }, 1000 * time * quantity)
    forwardsetTime[UID] = 1
    e.reply(`正在给你制作【${quantity}】份【${code[0]}】...\n预计需要${time * quantity}秒`)
    GameApi.Burial.set(UID, CDid, nowTime, CDTime)
    return false
  }
}
