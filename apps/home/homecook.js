import { BotApi, GameApi, HomeApi, plugin } from '../../model/api/index.js'
const forwardsetTime = []
const useraction = []
//秋雨
export class homecook extends plugin {
  constructor() {
    super({
      name: 'xiuxian@cook',
      dsc: 'xiuxian@cook',
      rule: [
        {
          reg: /^(#|\/)起锅做饭$/,
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
          reg: /^(#|\/)万民堂$/,
          fnc: 'wanmin'
        },
        {
          reg: /^(#|\/)万民堂购买.*$/,
          fnc: 'wanminbug'
        }
      ]
    })
  }

  Occupy_the_mine = async (e) => {
    //不开放私聊功能
    if (!this.verify(e)) return false
    //有无存档
    let UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    let msg1 = []
    let goods = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL:[]
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
      return
    }
    let msg = [`您仓库里只有以下锅具，请选择的所要用的锅具\n${msg1}`]
    e.reply(msg)
    this.setContext('choose_cook')
  }

  async choose_cook(e) {
    let UID = e.user_id
    let new_msg = this.e.message
    let choice = new_msg[0].text
    if (choice == '退出') {
      this.finish('choose_cook')
      e.reply(`做饭结束`)
      return
    }
    let cook1 = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL:[]
    })
    let cook = cook1.thing.find((item) => item.name == choice)
    if (cook == undefined) {
      e.reply(`你没有这样的锅具，请重新选择`)
      return
    }
    let actionObject = {
      name: choice
    }
    await redis.set('xiuxianhome:cook:' + UID + ':action', JSON.stringify(actionObject))
    this.finish('choose_cook')
    let msg = [`您是否要使用食谱，请输入1或2\n【1】不使用食谱\n【2】使用食谱`]
    e.reply(`${msg}`)
    this.setContext('choose')
    return
  }

  async choose(e) {
    let UID = e.user_id
    let new_msg = this.e.message
    let choice = new_msg[0].text
    if (choice == '退出') {
      this.finish('choose')
      e.reply(`做饭结束`)
      return
    }
    if (choice == 1) {
      this.finish('choose')
      e.reply(`请使用#食谱名字*菜1*菜2*菜3，制作出你独一无二的菜品吧`)
      this.setContext('choose_food1')
      return
    } else if (choice == 2) {
      let msg1 = []
      let goods = await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        INITIAL:[]
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
        e.reply(`你没有食谱，请执行\n#食谱名字*菜1*菜2*菜3 制作出你独一无二的菜品吧`)
        this.setContext('choose_food1')
        return
      } else {
        this.finish('choose')
        let msg = [`您仓库里只有以下食谱，请选择的所要使用的食谱\n${msg1}`]
        e.reply(`${msg}`)
        this.setContext('choose_food')
        return
      }
    }
  }

  async choose_food(e) {
    let UID = e.user_id
    let new_msg = this.e.message
    let choice = new_msg[0].text
    if (choice == '退出') {
      this.finish('choose_food')
      e.reply(`做饭结束`)
      return
    }
    let thing = choice.replace('食谱', '')
    let name2 = choice.replace(thing, '')
    if (name2 != '食谱') {
      e.reply(`你输入的食谱名中必须要以食谱结尾，请重新输入!`)
      return
    }
    let Warehouse = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL:[]
    })
    let food = Warehouse.thing.find((item) => item.name == choice)
    if (food == undefined) {
      e.reply(`好像没有这种食谱，请重新选择!`)
      return
    }
    let action = await redis.get('xiuxianhome:cook:' + UID + ':action')
    action = JSON.parse(action)
    let nameIwant = action.name
    let zhushi = food.zhushi
    let fushi = food.fushi
    let tiaoliao = food.tiaoliao
    const shipu = Warehouse.thing.find((item) => item.name === choice)
    if (shipu.proficiency != undefined) {
      if (shipu.proficiency == 0) {
        e.reply(`试用食谱次数已用完，请前往万民堂发布食谱!`)
        this.finish('choose_food')
        return
      }
    }
    let zhushi1 = Warehouse.thing.find((item) => item.name === zhushi)
    if (zhushi1 == undefined) {
      e.reply(`您的仓库里没有${zhushi}!`)
      this.finish('choose_food')
      return
    }
    let fushi1 = Warehouse.thing.find((item) => item.name === fushi)
    if (fushi1 == undefined) {
      e.reply(`您的仓库里没有${fushi}!`)
      this.finish('choose_food')
      return
    }
    let tiaoliao1 = Warehouse.thing.find((item) => item.name === tiaoliao)
    if (tiaoliao1 == undefined) {
      e.reply(`您的仓库里没有${tiaoliao}!`)
      this.finish('choose_food')
      return
    }
    let guo = Warehouse.thing.find((item) => item.name === nameIwant)
    let shuxing1 = await HomeApi.GameUser.attribute({ thing: zhushi1 })
    let shuxing2 = await HomeApi.GameUser.attribute({ thing: fushi1 })
    let shuxing3 = await HomeApi.GameUser.attribute({ thing: tiaoliao1 })
    let rand = Math.ceil(Math.random() * 3) - 1
    let shu = [shuxing1, shuxing2, shuxing3]
    let shuxinga = shu[rand]
    let a = 1
    for (var i in shuxinga) {
      shuxinga[i] = shuxinga[i] * guo.a
    }
    let recipes1 = await HomeApi.GameUser.foodshuxing({
      shuxinga: shuxinga,
      id: food.caiid,
      name1: thing,
      doge: food.doge
    })
    const the = 20
    const time1 = the >= 0 ? the : 1
    useraction[UID] = setTimeout(async () => {
      forwardsetTime[UID] = 0
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
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
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: zhushi1,
        quantity: -1
      })
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: fushi1,
        quantity: -1
      })
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: tiaoliao1,
        quantity: -1
      })
      let msg = '还好字迹还算看得清'
      if (shipu.proficiency != undefined) {
        shipu.proficiency -= 1
        e.reply(
          `恭喜你，成功炒出【${recipes1.name}】，消耗${nameIwant}一点耐久度，试用食谱熟练度当前为${
            100 - shipu.proficiency
          }`
        )
      } else {
        shipu.durable -= 1
        if (shipu.durable == 0) {
          Warehouse.thing = thing1.filter((item) => item.name != shipu.name)
          msg = '使用后，发现食谱已经被翻得字迹模糊了，已经不能用了'
        }
        e.reply(
          `恭喜你，成功炒出【${recipes1.name}】，消耗${nameIwant}一点耐久度，食谱有些许磨损，\n${msg}`
        )
      }
      await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        DATA: Warehouse,
        INITIAL:[]
      })
    }, 1000 * time1)
    forwardsetTime[UID] = 1
    e.reply(`正在给你制作【${thing}】...\n预计需要${time1}秒`)
    this.finish('choose_food')
    return
  }

  async choose_food1(e) {
    let UID = e.user_id
    let new_msg = this.e.message
    let choice = new_msg[0].text
    if (choice == '退出') {
      this.finish('choose_food1')
      e.reply(`做饭结束`)
      return
    }
    let thing = choice.replace(/^(#|\/)/, '')
    let code = thing.split('*')
    let name = code[0]
    let zhushi = code[1]
    let fushi = code[2]
    let tiaoliao = code[3]
    let judge = await HomeApi.GameUser.foodjudge({ name: zhushi })
    let judge1 = await HomeApi.GameUser.foodjudge({ name: fushi })
    let judge2 = await HomeApi.GameUser.foodjudge({ name: tiaoliao })
    if (judge == 1 || judge1 == 1 || judge2 == 1) {
      e.reply(`你输入的菜无法制作成食物!`)
      return
    }
    let name1 = name.replace('食谱', '')
    let name2 = name.replace(name1, '')
    if (name2 != '食谱') {
      e.reply(`你输入的食谱名中必须要食谱结尾，请重新输入!`)
      return
    }
    let Warehouse = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      INITIAL:[]
    })
    let zhushi1 = Warehouse.thing.find((item) => item.name === zhushi)
    if (zhushi1 == undefined) {
      e.reply(`你仓库里没有${zhushi}，请重新选择!`)
      return
    }
    let fushi1 = Warehouse.thing.find((item) => item.name === fushi)
    if (fushi1 == undefined) {
      e.reply(`你仓库里没有${fushi}，请重新选择!`)
      return
    }
    let tiaoliao1 = Warehouse.thing.find((item) => item.name === tiaoliao)
    if (tiaoliao1 == undefined) {
      e.reply(`你仓库里没有${tiaoliao}，请重新选择!`)
      return
    }
    let doge = (zhushi1.doge + tiaoliao1.doge + fushi1.doge) * 2
    let action = await redis.get('xiuxianhome:cook:' + UID + ':action')
    action = JSON.parse(action)
    let nameIwant = action.name
    let guo = Warehouse.thing.find((item) => item.name === nameIwant)
    let shuxing1 = await HomeApi.GameUser.attribute({ thing: zhushi1 })
    let shuxing2 = await HomeApi.GameUser.attribute({ thing: fushi1 })
    let shuxing3 = await HomeApi.GameUser.attribute({ thing: tiaoliao1 })
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
    let cook = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_cook',
      NAME: 'cook',
      INITIAL: data,
      INITIAL:[]
    })
    let ifexist1 = cook.find((item) => item.name == name)
    let ifexist0 = cook.find(
      (item) => item.zhushi == zhushi && item.fushi == fushi && item.tiaoliao == tiaoliao
    )
    if (ifexist0) {
      e.reply(`此配方已有人参悟出来，请购买他的菜单或者另外调配配方`)
      return
    }
    if (ifexist1) {
      e.reply(`此配方名字已经被人占用，请重新为你的食谱命名`)
      return
    }
    let id = '13-1-'
    let three = cook.length + 1
    id = id + three
    let fenid = id.split('-')
    let caiid = fenid[0] + '-3-' + fenid[2]
    let peifang = {
      id: id,
      caiid: caiid,
      name: name,
      doge: doge,
      zhushi: zhushi,
      fushi: fushi,
      tiaoliao: tiaoliao,
      acount: 1,
      proficiency: 100
    }
    const the = 20
    const time1 = the >= 0 ? the : 1
    useraction[UID] = setTimeout(async () => {
      let peifang2 = peifang
      peifang = await HomeApi.GameUser.Add_cook_thing({
        cook: cook,
        cook_thing: peifang,
        thing_acount: 1
      })
      await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_cook',
        NAME: 'cook',
        DATA: peifang,
        INITIAL:[]
      })
      let food_thing = await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_food',
        NAME: 'food',
        INITIAL: data,
        INITIAL:[]
      })
      let food = await HomeApi.GameUser.foodshuxing({
        shuxinga,
        id: caiid,
        name1,
        doge
      })
      food_thing = await HomeApi.GameUser.Add_food_thing({
        food: food_thing,
        food_thing: food,
        thing_acount: 1
      })
      await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_food',
        NAME: 'food',
        DATA: food_thing,
        INITIAL:[]
      })
      await HomeApi.GameUser.Add_all({ data: peifang2 })
      await HomeApi.GameUser.Add_all({ data: food })
      let Warehouse = await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_Warehouse',
        NAME: UID,
        INITIAL:[]
      })
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: peifang2,
        quantity: 1
      })
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
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
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: zhushi1,
        quantity: -1
      })
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: fushi1,
        quantity: -1
      })
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: tiaoliao1,
        quantity: -1
      })
      await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_Warehouse',
        NAME: UID,
        DATA: Warehouse,
        INITIAL:[]
      })
      e.reply(
        `恭喜你，成功炒出【${food.name}】，消耗${nameIwant}一点耐久度，获得了${name}的试用食谱，熟练度为0，熟练度为100后可前往万民堂申请发布流通食谱`
      )
    }, 1000 * time1)
    e.reply(`正在给你制作【${name1}】...\n预计需要${time1}秒`)
    this.finish('choose_food1')
    return
  }

  eat = async (e) => {
    //不开放私聊功能
    if (!this.verify(e)) return false
    //有无存档
    let UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    let thing = e.msg.replace(/^(#|\/)吃/, '')
    let code = thing.split('*')
    let code1 = code[0] + ' · ' + code[1]
    let now_time = new Date().getTime()
    let endtime = now_time + 300000
    let Warehouse = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      INITIAL:[]
    })
    let shiwu = Warehouse.thing.find((item) => item.name === code1)
    if (shiwu == undefined) {
      e.reply(`你仓库里没有这道菜!`)
      return
    }
    const map = {
      攻击: 'attack',
      防御: 'defense',
      血量上限: 'blood',
      暴击: 'burst',
      爆伤: 'burstMax',
      敏捷: 'speed'
    }
    if (map.hasOwnProperty(code[1])) {
      if (map[code[1]] == 'speed') {
        await GameApi.GameUser.addExtendTimes({
          NAME: UID,
          FLAG: 'home',
          TYPE: map[code[1]],
          VALUE: shiwu[map[code[1]]],
          ENDTIME: endtime
        })
      } else {
        await GameApi.GameUser.addExtendTimes({
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
          await HomeApi.GameUser.Add_nowblood({ UID, nowblood })
          e.reply(`成功服用${shiwu.name},血量恢复了${nowblood}`)
          break
        }
        case '寿命': {
          let life = parseInt(shiwu.life)
          await HomeApi.GameUser.Add_life({ UID, life })
          e.reply(`成功服用${shiwu.name},年轻了${life}年`)
          break
        }
        default: {
        }
      }
    }
    Warehouse = await HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: shiwu,
      quantity: -1
    })
    await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse,
      INITIAL:[]
    })
    return
  }

  fabucaipu = async (e) => {
    //不开放私聊功能
    if (!this.verify(e)) return false
    //有无存档
    let UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    const action = await GameApi.UserData.controlAction({ CHOICE: 'user_action', NAME: UID })
    const address_name = '万民堂'
    const map = await GameApi.GameMap.mapExistence({ action, addressName: address_name })
    if (!map) {
      e.reply(`需要前往各大主城中的${address_name}才能发布`)
      return
    }
    let thing = e.msg.replace(/^(#|\/)发布/, '')
    let caipu = await HomeApi.GameUser.homeexist_Warehouse_thing_name({ UID, name: thing })
    if (caipu == 1) {
      e.reply(`你没有该物品`)
      return
    }
    if (caipu.proficiency != 0) {
      e.reply(`该食谱的熟练度未到达100，暂时不给予发布资格`)
      return
    }
    const cook = await HomeApi.Listdata.controlActionInitial({ CHOICE: 'user_home_cook', NAME: 'cook' })
    let target = cook.find((obj) => obj.name === caipu.name)
    delete target.proficiency
    await HomeApi.Listdata.controlActionInitial({ CHOICE: 'user_home_cook', NAME: 'cook', DATA: cook })
    let Warehouse = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL:[]
    })
    let wanmin = {
      qq: UID,
      durable: 100
    }
    target = Object.assign(target, wanmin)
    Warehouse = await HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: caipu,
      quantity: -1
    })
    Warehouse = await HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: target,
      quantity: 1
    })
    await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse,
      INITIAL:[]
    })
    let wanmin1 = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_wanmin',
      NAME: 'wanmin',
      INITIAL:[]
    })
    wanmin1 = await HomeApi.GameUser.Add_DATA_thing({ DATA: wanmin1, DATA1: target, quantity: 1 })
    await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_wanmin',
      NAME: 'wanmin',
      DATA: wanmin1,
      INITIAL:[]
    })
    e.reply(
      `恭喜${UID}成功在万民堂发布一份食谱，玩家可前往万民堂购买，发布者可获得50%出售收益的版权费`
    )
    return
  }

  wanmin = async (e) => {
    //不开放私聊功能
    if (!this.verify(e)) return false
    //有无存档
    let UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    const action = await GameApi.UserData.controlAction({ CHOICE: 'user_action', NAME: UID })
    const address_name = '万民堂'
    const map = await GameApi.GameMap.mapExistence({ action, addressName: address_name })
    if (!map) {
      e.reply(`需要前往各大主城中的${address_name}`)
      return
    }
    let msg = ['___[万民堂]___\n#万民堂购买+物品名']
    let wanmin = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_wanmin',
      NAME: 'wanmin',
      INITIAL:[]
    })
    wanmin.forEach((item) => {
      msg.push('食谱名字：' + item.name + '\n食谱提供者：' + item.qq + '\n灵晶：' + item.doge)
    })
    await BotApi.User.forwardMsg({ e, data: msg })
    return
  }

  wanminbug = async (e) => {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    const action = await GameApi.UserData.controlAction({ CHOICE: 'user_action', NAME: UID })
    const address_name = '万民堂'
    const map = await GameApi.GameMap.mapExistence({ action, addressName: address_name })
    if (!map) {
      e.reply(`需要前往各大主城中的${address_name}才能购买`)
      return
    }
    let thing = e.msg.replace(/^(#|\/)万民堂购买/, '')
    let code = thing.split('*')
    let thing_name = code[0] //物品
    let shipu = await HomeApi.GameUser.homeexist_Warehouse_thing_name({ UID, thing_name })
    if (shipu != 1) {
      e.reply(`您已经有该食谱，请把该食谱消耗完再来吧!`)
      return
    }
    let ifexist1 = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_wanmin',
      NAME: 'wanmin',
      INITIAL:[]
    })
    let ifexist = ifexist1.find((item) => item.name == thing_name)
    if (!ifexist) {
      e.reply(`不卖:${thing_name}`)
      return
    }
    let home = await HomeApi.Listdata.controlActionInitial({ CHOICE: 'user_home_user', NAME: UID,
    INITIAL:[] })
    let doge = home.doge
    let commodities_doge1 = ifexist.doge
    let lt = [0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3]
    let ex = Math.ceil(Math.random() * 6)
    let rand = lt[ex]
    let commodities_doge = parseInt(commodities_doge1 * rand)
    if (doge < commodities_doge) {
      e.reply(`灵晶不足`)
      return
    }
    let money = commodities_doge * 0.5
    let Warehouse = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      INITIAL:[]
    })
    Warehouse = await HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: ifexist,
      quantity: 1
    })
    await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_Warehouse',
      NAME: UID,
      DATA: Warehouse,
      INITIAL:[]
    })
    await HomeApi.GameUser.Add_doge({ UID, money: -commodities_doge })
    if (ifexist.qq == UID) {
      e.reply(
        `感谢您的购买，这次税率为【${rand}】,最终花了[${commodities_doge}]灵晶从万民堂购买了[${thing_name}]`
      )
      return
    } else {
      await HomeApi.GameUser.Add_doge({ UID: ifexist.qq, money })
      e.reply(
        `感谢您的购买，这次税率为【${rand}】,最终花了[${commodities_doge}]灵晶从万民堂购买了[${thing_name}]，食谱提供者：${ifexist.qq} 获得了${money}版权费`
      )
      return
    }
  }

  stir_fry = async (e) => {
    //不开放私聊功能
    if (!this.verify(e)) return false
    //有无存档
    let UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    let thing0 = e.msg.replace(/^(#|\/)用/, '')
    let thing1 = thing0.split('炒')
    let code = thing1[1].split('*')
    let Warehouse = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_Warehouse',
      NAME: UID,
      INITIAL:[]
    })
    let guo = Warehouse.thing.find((item) => item.name == thing1[0])
    if (guo == undefined) {
      e.reply(`你没有${thing1[0]}，请重新选择!`)
      return
    }
    let id = guo.id.split('-')
    let quantity = await GameApi.GamePublic.leastOne({ value: code[1] })
    if (guo.durable < quantity) {
      e.reply(`你的${thing1[0]}耐久不够，请重新选择数量!`)
      return
    }
    let choice = code[0] + '食谱'
    let shipu = Warehouse.thing.find((item) => item.name == choice)
    if (shipu == undefined) {
      e.reply(`你没有${choice}，请重新选择!`)
      return
    }
    if (id[0] != 13 || id[1] != 2) {
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: guo,
        quantity: -1
      })
      await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        DATA: Warehouse,
        INITIAL:[]
      })
      e.reply(`你的${thing1[0]}不是锅，刚放到火上就被烧没了!`)
      return
    }
    let zhushi = shipu.zhushi
    let fushi = shipu.fushi
    let tiaoliao = shipu.tiaoliao
    if (shipu.proficiency != undefined) {
      if (shipu.proficiency < 1) {
        e.reply(`试用食谱次数已用完，请前往万民堂发布食谱!`)
        return
      }
      if (shipu.proficiency < quantity) {
        e.reply(`试用食谱次数不够，无法完成制作，请重新选择数量!`)
        return
      }
    } else {
      if (shipu.durable < quantity) {
        e.reply(`食谱使用次数不够，无法完成制作，请重新选择数量!`)
        return
      }
    }
    let zhushi1 = Warehouse.thing.find((item) => item.name === zhushi)
    if (zhushi1 == undefined || zhushi1.acount < quantity) {
      e.reply(`您的仓库里${zhushi}数量不够!`)
      return
    }
    Warehouse = await HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: zhushi1,
      quantity: -quantity
    })
    let fushi1 = Warehouse.thing.find((item) => item.name === fushi)
    if (fushi1 == undefined || fushi1.acount < quantity) {
      e.reply(`您的仓库里${fushi}数量不够!`)
      return
    }
    Warehouse = await HomeApi.GameUser.Add_DATA_thing({
      DATA: Warehouse,
      DATA1: fushi1,
      quantity: -quantity
    })
    let tiaoliao1 = Warehouse.thing.find((item) => item.name === tiaoliao)
    if (tiaoliao1 == undefined || tiaoliao1.acount < quantity) {
      e.reply(`您的仓库里${tiaoliao}数量不够!`)
      return
    }
    let shuxing1 = await HomeApi.GameUser.attribute({ thing: zhushi1 })
    let shuxing2 = await HomeApi.GameUser.attribute({ thing: fushi1 })
    let shuxing3 = await HomeApi.GameUser.attribute({ thing: tiaoliao1 })
    let rand = Math.ceil(Math.random() * 3) - 1
    let shu = [shuxing1, shuxing2, shuxing3]
    let shuxinga = shu[rand]
    for (var i in shuxinga) {
      shuxinga[i] = shuxinga[i] * guo.a
    }
    let recipes1 = await HomeApi.GameUser.foodshuxing({
      shuxinga: shuxinga,
      id: shipu.caiid,
      name1: code[0],
      doge: shipu.doge
    })
    const CDid = '3'
    const CDTime = 20 * quantity
    let now_time = new Date().getTime()
    const CD = await HomeApi.GameUser.GenerateCD({ UID: UID, CDid })
    if (CD != 0) {
      e.reply(CD)
      return
    }
    const time = 20
    useraction[UID] = setTimeout(async () => {
      forwardsetTime[UID] = 0
      let Warehouse1 = await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        INITIAL:[]
      })
      let zhushi1 = Warehouse1.thing.find((item) => item.name === zhushi)
      if (zhushi1 == undefined || zhushi1.acount < quantity) {
        e.reply(`您的仓库里${zhushi}数量不够!`)
        return
      }
      Warehouse1 = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse1,
        DATA1: zhushi1,
        quantity: -quantity
      })
      let fushi1 = Warehouse1.thing.find((item) => item.name === fushi)
      if (fushi1 == undefined || fushi1.acount < quantity) {
        e.reply(`您的仓库里${fushi}数量不够!`)
        return
      }
      Warehouse1 = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse1,
        DATA1: fushi1,
        quantity: -quantity
      })
      let tiaoliao1 = Warehouse1.thing.find((item) => item.name === tiaoliao)
      if (tiaoliao1 == undefined || tiaoliao1.acount < quantity) {
        e.reply(`您的仓库里${tiaoliao}数量不够!`)
        return
      }
      Warehouse1 = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse1,
        DATA1: tiaoliao1,
        quantity: -quantity
      })
      let guo = Warehouse1.thing.find((item) => item.name == thing1[0])
      if (guo == undefined) {
        e.reply(`由于你在做饭的时候将锅拿开了，你的食材部浪费掉了!`)
        return
      }
      let shipu1 = Warehouse1.thing.find((item) => item.name === choice)
      Warehouse1 = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse1,
        DATA1: recipes1,
        quantity: quantity
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
          }【${quantity}】点耐久度，试用食谱熟练度当前为${100 - shipu1.proficiency}`
        )
      } else {
        shipu1.durable -= quantity
        if (shipu1.durable < 1) {
          Warehouse1.thing = thing2.filter((item) => item.name != shipu1.name)
          msg = '使用后，发现食谱已经被翻得字迹模糊了，已经不能用了'
        }
        e.reply(
          `恭喜你，成功炒出【${quantity}】份【${recipes1.name}】，消耗${thing1[0]}【${quantity}】点耐久度，食谱有些许磨损，\n${msg}`
        )
      }
      await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        DATA: Warehouse1,
        INITIAL:[]
      })
    }, 1000 * time * quantity)
    forwardsetTime[UID] = 1
    e.reply(`正在给你制作【${quantity}】份【${code[0]}】...\n预计需要${time * quantity}秒`)
    await redis.set(`xiuxian:player:${UID}:${CDid}`, now_time)
    await redis.expire(`xiuxian:player:${UID}:${CDid}`, CDTime)
    return
  }
}
