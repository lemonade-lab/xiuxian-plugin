import { HomeApi, GameApi, BotApi, plugin } from '../../model/api/index.js'
//秋雨
export class homerangeland extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)建立牧场$/,
          fnc: 'EstablishRangeland'
        },
        {
          reg: /^(#|\/)养殖(.*)$/,
          fnc: 'Breed'
        },
        {
          reg: /^(#|\/)宰杀(.*)$/,
          fnc: 'Slaughter'
        },
        {
          reg: /^(#|\/)查看牧场$/,
          fnc: 'Checkpasture'
        },
        {
          reg: /^(#|\/)查看他人牧场.*$/,
          fnc: 'Checkotherpasture'
        },
        // {
        //   reg: /^(#|\/)偷动物(.*)$/,
        //   fnc: "Stealanimals",
        // },
        {
          reg: /^(#|\/)搭建草场$/,
          fnc: 'seeding'
        },
        {
          reg: /^(#|\/)栽种树林/,
          fnc: 'Plantforest'
        },
        {
          reg: /^(#|\/)开塘养鱼/,
          fnc: 'Raisefish'
        },
        {
          reg: /^(#|\/)设置加工坊/,
          fnc: 'Processing'
        }
      ]
    })
  }

  //修建牧场
  async EstablishRangeland(e) {
    if (!this.verify(e)) return false
    //有无存档
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archiverangeland({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    const ifexisthome = await HomeApi.GameUser.existhome({ UID })
    let good = await HomeApi.GameApi.GamePublic.GoMini({ UID: e.user_id })
    if (!good) {
      return
    }
    let region = ifexisthome.region
    let action = await HomeApi.GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    let region1 = action.region
    if (region != region1) {
      e.reply('您现在不在家园里，修建牧场必须回家')
      return
    }
    let home = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL:[]
    })
    let rangeland = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangeland',
      NAME: UID,
      INITIAL:[]
    })
    let rangelandlevel = rangeland.rangelandlevel
    let homelevel = home.homelevel
    if (homelevel < 2) {
      e.reply('你的家园等级不够，不足以建立牧场')
      return
    }
    if (rangelandlevel > 0) {
      e.reply('你已经建立过牧场了')
      return
    }
    let lingshi1 = rangelandlevel * 20000 + 1000
    const lingshi = await GameApi.GameUser.userBagSearch({
      UID: UID,
      name: '下品灵石'
    })
    if (!lingshi || lingshi.acount < lingshi1) {
      e.reply(`你没有足够的材料，工人决定不干了`)
      return
    }
    await GameApi.GameUser.userBag({
      UID: UID,
      name: '下品灵石',
      ACCOUNT: lingshi1
    })
    rangeland.rangelandlevel += 1
    await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangeland',
      NAME: UID,
      DATA: rangeland,
      INITIAL:[]
    })
    e.reply(`你准备了足够的材料，工人高高兴兴地给你建立了牧场`)
    return
  }
  //搭建草场
  async seeding(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archiverangeland({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    //确认位置
    const ifexisthome = await HomeApi.GameUser.existhome({ UID })
    let region = ifexisthome.region
    let action = await HomeApi.GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_home_action'
    })
    let region2 = action.region
    if (region != region2) {
      e.reply('您现在不在家园里，搭建草场必须回家')
      return
    }
    let home = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL:[]
    })
    let rangeland = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangeland',
      NAME: UID,
      INITIAL:[]
    })
    let rangelandlevel = rangeland.rangelandlevel
    let homelevel = home.homelevel
    if (homelevel < 4) {
      e.reply('你的家园等级不够，不足以搭建草场')
      return
    }
    if (rangelandlevel < 1) {
      e.reply('请先建立牧场')
      return
    }
    if (rangelandlevel > 1) {
      e.reply('你已经建立过草场了')
      return
    }
    let lingshi2 = rangelandlevel * 20000 + 1000
    const lingshi = await GameApi.GameUser.userBagSearch({
      UID: UID,
      name: '下品灵石'
    })
    const material1 = await HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: '木板'
    })
    const material2 = await HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: '石头'
    })
    if (!lingshi) {
      e.reply(`没有1000灵石`)
      return
    } else if (lingshi < lingshi2) {
      e.reply(`没有1000灵石`)
      return
    } else if (!material1) {
      e.reply(`没有20木板`)
      return
    } else if (material1 < 20) {
      e.reply(`没有20木板`)
      return
    } else if (!material2) {
      e.reply(`没有10石头`)
      return
    } else if (material2 < 10) {
      e.reply(`没有10石头`)
      return
    }
    await GameApi.GameUser.userBag({
      UID: UID,
      name: '下品灵石',
      ACCOUNT: lingshi2
    })
    await HomeApi.GameUser.userWarehouse({
      UID: UID,
      name: '木板',
      ACCOUNT: -20
    })
    await HomeApi.GameUser.userWarehouse({
      UID: UID,
      name: '石头',
      ACCOUNT: -10
    })
    rangeland.rangelandlevel += 1
    await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangeland',
      NAME: UID,
      DATA: rangeland,
      INITIAL:[]
    })
    e.reply(`你准备了足够的材料，工人高高兴兴地给你搭建了草场`)
    return
  }
  //栽种树林
  async Plantforest(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archiverangeland({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    //确认位置
    const ifexisthome = await HomeApi.GameUser.existhome({ UID })
    let region = ifexisthome.region
    let action = await HomeApi.GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_home_action'
    })
    let region3 = action.region
    if (region != region3) {
      e.reply('您不在家是没有办法升级牧场的哦')
      return
    }
    let home = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL:[]
    })
    let rangeland = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangeland',
      NAME: UID,
      INITIAL:[]
    })
    let rangelandlevel = rangeland.rangelandlevel
    let homelevel = home.homelevel
    if (homelevel < 6) {
      e.reply('你的家园等级不够，不足以栽种树林')
      return
    }
    if (rangelandlevel < 2) {
      e.reply('您要先搭建草场才行哦')
      return
    }
    if (rangelandlevel > 2) {
      e.reply('你已经搭建过树林了')
      return
    }
    let lingshi3 = rangelandlevel * 20000 + 1000
    const lingshi = await GameApi.GameUser.userBagSearch({
      UID: UID,
      name: '下品灵石'
    })
    const material1 = await HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: '木板'
    })
    const material2 = await HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: '石头'
    })
    const material3 = await HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: '树苗'
    })
    if (!lingshi) {
      e.reply(`没有41000灵石`)
      return
    } else if (lingshi < lingshi3) {
      e.reply(`没有41000灵石`)
      return
    } else if (!material1) {
      e.reply(`没有15木板`)
      return
    } else if (material1 < 15) {
      e.reply(`没有15木板`)
      return
    } else if (!material2) {
      e.reply(`没有15石头`)
      return
    } else if (material2 < 15) {
      e.reply(`没有15石头`)
      return
    } else if (!material3) {
      e.reply(`没有25树苗`)
      return
    } else if (material3 < 25) {
      e.reply(`没有25树苗`)
      return
    }
    await GameApi.GameUser.userBag({
      UID: UID,
      name: '下品灵石',
      ACCOUNT: lingshi3
    })
    await HomeApi.GameUser.userWarehouse({
      UID: UID,
      name: '木板',
      ACCOUNT: -15
    })
    await HomeApi.GameUser.userWarehouse({
      UID: UID,
      name: '石头',
      ACCOUNT: -15
    })
    await HomeApi.GameUser.userWarehouse({
      UID: UID,
      name: '树苗',
      ACCOUNT: -25
    })
    rangeland.rangelandlevel += 1
    await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_rangeland',
      NAME: UID,
      DATA: rangeland,
      INITIAL:[]
    })
    e.reply(`你准备了足够的材料，工人高高兴兴地给你建起了一片树林`)
    return
  }
  //开塘养鱼
  async Raisefish(e) {
    //不开放私聊功能
    if (!this.verify(e)) return false
    //检查存档
    let UID = e.user_id
    const ifexisthome = await HomeApi.GameUser.existhome({ UID })
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archiverangeland({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
    }
    //确认位置
    let region = ifexisthome.region
    let action = await HomeApi.GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_home_action'
    })
    let region1 = action.region
    if (region != region1) {
      e.reply('您不在家是没有办法升级牧场的哦')
      return
    }
    let home = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_home',
      NAME: UID,
      INITIAL:[]
    })
    let rangeland = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangeland',
      NAME: UID,
      INITIAL:[]
    })
    let rangelandlevel = rangeland.rangelandlevel
    let homelevel = home.homelevel
    if (homelevel < 8) {
      e.reply('你的家园等级不够，不足以开塘养鱼')
      return
    }
    if (rangelandlevel < 3) {
      e.reply('您要先栽种树林哦')
    }
    if (rangelandlevel == 4) {
      e.reply('你已经建立过鱼塘了')
      return
    }
    let lingshi3 = rangelandlevel * 20000 + 1000
    const lingshi = await GameApi.GameUser.userBagSearch({
      UID: UID,
      name: '下品灵石'
    })
    const material1 = await HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: '木板'
    })
    const material2 = await HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: '石头'
    })
    const material3 = await HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: '水草'
    })
    if (!lingshi) {
      e.reply(`没有61000灵石`)
      return
    } else if (lingshi < lingshi3) {
      e.reply(`没有61000灵石`)
      return
    } else if (!material1) {
      e.reply(`没有25木板`)
      return
    } else if (material1 < 25) {
      e.reply(`没有25木板`)
      return
    } else if (!material2) {
      e.reply(`没有20石头`)
      return
    } else if (material2 < 20) {
      e.reply(`没有20石头`)
      return
    } else if (!material3) {
      e.reply(`没有10水草种子`)
      return
    } else if (material3 < 10) {
      e.reply(`没有10水草种子`)
      return
    }
    await GameApi.GameUser.userBag({
      UID: UID,
      name: '下品灵石',
      ACCOUNT: lingshi3
    })
    await HomeApi.GameUser.userWarehouse({
      UID: UID,
      name: '木板',
      ACCOUNT: -25
    })
    await HomeApi.GameUser.userWarehouse({
      UID: UID,
      name: '石头',
      ACCOUNT: -20
    })
    await HomeApi.GameUser.userWarehouse({
      UID: UID,
      name: '水草',
      ACCOUNT: -10
    })
    rangeland.rangelandlevel += 1
    await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangeland',
      NAME: UID,
      DATA: rangeland,
      INITIAL:[]
    })
    e.reply(`你准备了足够的材料，工人高高兴兴地给你挖了个坑，哦不鱼塘`)
    return
  }
  //放养动物
  async Breed(e) {
    //不开放私聊功能
    if (!this.verify(e)) return false
    //检查存档
    let UID = e.user_id
    const ifexisthome = await HomeApi.GameUser.existhome({ UID })
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archiverangeland({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
    }
    //确定位置
    let region = ifexisthome.region
    let action = await HomeApi.GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_home_action'
    })
    let region1 = action.region
    if (region != region1) {
      e.reply('您现在不在家园里，动物必须放在家园牧场里哦')
      return
    }
    // let muc = await HomeApi.Listdata.controlAction({ NAME: UID, CHOICE: 'user_rangelandannimals' })
    // let x
    // for(let i = 0; i < muc.length; i++){
    //   x = x + muc[i].animalacount
    // }
    // console.log(x)
    let thing = e.msg.replace(/^(#|\/)养殖/, '')
    let code = thing.split('*')
    let thing_name = code[0] //动物名字
    let searchsthing = await HomeApi.GameUser.userWarehouseSearch({
      UID: UID,
      name: thing_name
    }) //查找动物
    if (searchsthing == undefined) {
      e.reply('你并没有这个动物哦')
      return
    }
    let id = searchsthing.id.split('-')
    if (id[0] != 50 || id[1] != 1) {
      e.reply(`这个物品不能放生哦，请换个正常的幼崽!`)
      return
    }
    if (searchsthing == 1) {
      e.reply(`世界上没有[${thing_name}]`)
      return
    }
    let rangeland = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangeland',
      NAME: UID,
      INITIAL:[]
    }) //获取rangeland文件
    let rangelandlevel = rangeland.rangelandlevel
    if (rangelandlevel == 0) {
      e.reply('你仔细想想你建牧场了吗XDD)BO}R%$LQPF$J)`K9DWP.png')
      return
    }
    let rangelandannimals = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangelandannimals',
      NAME: UID,
      INITIAL:[]
    }) //获取rangeland文件
    let rangelandannimals1 = rangelandannimals.thing.find((item) => item.name == thing_name)
    if (rangelandannimals1 != undefined) {
      e.reply(`你牧场里已经有了${thing_name}`)
      return
    }
    if (rangelandlevel > rangelandannimals.thing.length) {
      let now_time = new Date().getTime()
      let searchsthing1 = await HomeApi.GameUser.Add_rangelandannimals({
        rangelandannimals: searchsthing,
        now_time
      })
      rangelandannimals = await HomeApi.GameUser.Add_DATA_thing({
        DATA: rangelandannimals,
        DATA1: searchsthing1,
        quantity: 1
      })
      await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_rangelandannimals',
        NAME: UID,
        DATA: rangelandannimals,
        INITIAL:[]
      })
      let Warehouse = await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        INITIAL:[]
      })
      Warehouse = await HomeApi.GameUser.Add_DATA_thing({
        DATA: Warehouse,
        DATA1: searchsthing,
        quantity: -1
      })
      await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_Warehouse',
        NAME: UID,
        DATA: Warehouse,
        INITIAL:[]
      })
      e.reply(`成功`)
      return
    } else {
      e.reply('进不去，怎么想都进不去')
      return
    }
  }
  //宰杀动物
  async Slaughter(e) {
    if (!this.verify(e)) return false
    //检查存档
    let UID = e.user_id
    const ifexisthome = await HomeApi.GameUser.existhome({ UID })
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archiverangeland({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
    }
    let thing = e.msg.replace(/^(#|\/)宰杀/, '')
    let rangelandannimals1 = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangelandannimals',
      NAME: UID,
      INITIAL:[]
    })
    let rangelandannimals = rangelandannimals1.thing.find((item) => item.name1 == thing)
    if (rangelandannimals == undefined) {
      e.reply(`您的牧场里没有${thing}`)
      return
    }
    let time = rangelandannimals.time
    let mature = rangelandannimals.mature * 3600
    let deadtime = rangelandannimals.deadtime * 3600
    let now_time = new Date().getTime()
    let time1 = Math.floor((now_time - time) / 1000)
    let timeco1 = mature - time1
    if (rangelandannimals == undefined) {
      e.reply('找不到该动物了')
      return
    }
    //判断是否够最低收益时间
    if (mature > time1) {
      e.reply(`你的动物物还没长大,预计还有${timeco1}秒成熟`)
      return
    }
    // else if (timeco1 + deadtime < 0) {
    //   rangelandannimals1.thing = rangelandannimals1.thing.filter(item => item.name1 != thing)
    //   await HomeApi.Listdata.controlActionInitial({ CHOICE: 'user_rangelandannimals', NAME: UID ,DATA:rangelandannimals1})
    //   e.reply("你太久没管它，它已经悄悄地死去了")
    //   return
    // }
    else {
      rangelandannimals1.thing = rangelandannimals1.thing.filter((item) => item.name1 != thing)
      await HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_rangelandannimals',
        NAME: UID,
        DATA: rangelandannimals1,
        INITIAL:[]
      })
      let MSG = await HomeApi.GameUser.Slaughter({
        UID,
        name: rangelandannimals.name1
      })
      e.reply(`您获得了${MSG}`)
      return
    }
  }
  //查看牧场
  async Checkpasture(e) {
    if (!this.verify(e)) return false
    let UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archiverangeland({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    const { path, name, data } = await HomeApi.Information.get_lookrangeland_img({ UID })
    await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
    return
  }
  //偷
  Stealanimals = async (e) => {
    if (!this.verify(e)) return false
    const good = await HomeApi.GameApi.GamePublic.Go({ UID: e.user_id })
    if (!good) {
      return
    }
    const user = {
      A: e.user_id,
      C: 0,
      QQ: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user['B'] = await BotApi.User.at({ e })
    if (!user['B']) {
      return
    }
    const ifexisthome1 = await HomeApi.GameUser.existhome({ UID: user.B })
    if (!ifexisthome1) {
      e.reply(`对方还没建立过家园`)
      return
    }
    if (!(await GameApi.GameUser.existUserSatus({ UID: user.A }))) {
      e.reply('对方已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archiverangeland({ UID: user.A })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    let region = ifexisthome1.region
    let action = await HomeApi.GameApi.UserData.controlAction({
      NAME: user.A,
      CHOICE: 'user_home_action'
    })
    let region1 = action.region
    if (region != region1) {
      e.reply('您现在不在对方家园所在地内，请到对方家园所在地')
      return
    }
    const CDid = '0'
    const CDTime = 30
    const CD = await HomeApi.GameUser.GenerateCD({ UID: user.A, CDid })
    if (CD != 0) {
      e.reply(CD)
      return
    }
    let thing = e.msg.replace(/^(#|\/)偷动物/, '')
    let rangelandannimals2 = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangelandannimals',
      NAME: user.B,
      INITIAL:[]
    })
    let rangelandannimals = rangelandannimals2.thing.find((item) => item.name1 == thing)
    if (rangelandannimals == undefined) {
      e.reply(`对方牧场里没有这种动物啦!`)
      return
    }
    let a = rangelandannimals.stolen
    let time = rangelandannimals.time
    let mature = rangelandannimals.mature * 60
    let now_time = new Date().getTime()
    let time1 = Math.floor((now_time - time) / 1000)
    //判断是否够最低收益时间
    if (mature > time1) {
      e.reply(`他的动物还没成熟,偷幼崽是得不到任何东西的哦`)
      return
    }
    if (a == 1) {
      e.reply('偷这么多真的好吗？!')
      return
    }
    let rangelandannimals1 = await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangelandannimals',
      NAME: user.B,
      INITIAL:[]
    })
    rangelandannimals1.thing = rangelandannimals1.thing.filter((item) => item.name1 != thing)
    await HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_rangelandannimals',
      NAME: user.B,
      DATA: rangelandannimals1,
      INITIAL:[]
    })
    let MSG = await HomeApi.GameUser.Slaughter({
      UID: user.A,
      name: rangelandannimals.name1
    })
    e.reply(`您获得了${MSG}`)
    await redis.set(`xiuxian:player:${user.A}:${CDid}`, now_time)
    await redis.expire(`xiuxian:player:${user.A}:${CDid}`, CDTime * 60)
    return
  }
  //查看他人牧场
  async Checkotherpasture(e) {
    if (!this.verify(e)) return false
    const user = {
      A: e.user_id,
      C: 0,
      QQ: 0,
      p: Math.floor(Math.random() * (99 - 1) + 1)
    }
    user['B'] = await BotApi.User.at({ e })
    if (!user['B']) {
      return
    }
    const ifexisthome1 = await HomeApi.GameUser.existhome({ UID: user.B })
    if (!ifexisthome1) {
      e.reply(`对方没建立过家园`)
      return
    }
    if (!(await GameApi.GameUser.existUserSatus({ UID: user.A }))) {
      e.reply('已死亡')
      return
    }
    const archive = await HomeApi.GameUser.Archiverangeland({ UID: user.A })
    if (archive != 0) {
      e.reply(`${archive}`)
      return
    }
    let region = ifexisthome1.region
    let action = await HomeApi.GameApi.UserData.controlAction({
      NAME: user.A,
      CHOICE: 'user_action'
    })
    let region1 = action.region
    if (region != region1) {
      e.reply('您现在不在对方家园所在地内，偷看请到对方家园所在地后进行偷看')
      return
    }
    const { path, name, data } = await HomeApi.Information.get_lookrangeland_img({ UID: user.B })
    await e.reply(await BotApi.ImgIndex.showPuppeteer({ path, name, data }))
    return
  }
}
