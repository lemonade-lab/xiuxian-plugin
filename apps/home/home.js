import { BotApi, GameApi, HomeApi, plugin } from '../../model/api/index.js'
const forwardsetTime = []
const useraction = []
// 秋雨
export class home extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)我的家园$/,
          fnc: 'myhome'
        },
        {
          reg: /^(#|\/)家园仓库$/,
          fnc: 'Warehouse'
        },
        {
          reg: /^(#|\/)家园扩建/,
          fnc: 'extensionhome'
        },
        {
          reg: /^(#|\/)查看家园扩建/,
          fnc: 'unextensionhome'
        },
        {
          reg: /^(#|\/)建立家园.*$/,
          fnc: 'buildhome'
        },
        {
          reg: /^(#|\/)搬迁家园到.*$/,
          fnc: 'movehome'
        }
      ]
    })
  }

  async myhome(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    const { path, name, data } = HomeApi.Information.userhomeShow({
      UID
    })
    const img = await BotApi.obtainingImages({ path, name, data })
    e.reply(img)
    return false
  }

  async Warehouse(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    const { path, name, data } = HomeApi.Information.userWarehouseShow({
      UID
    })
    e.reply(await BotApi.obtainingImages({ path, data, name }))
    return false
  }

  async buildhome(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GameUser.Archive({ UID })
    if (archive != 0 && archive != '您都还没建立过家园') {
      e.reply(`${archive}`)
      return false
    }
    const ifexisthome = HomeApi.Listdata.controlAction({
      NAME: 'position',
      CHOICE: 'position'
    })
    const ifexisthome1 = ifexisthome.find((item) => item.qq == UID)
    if (ifexisthome1) {
      e.reply(`您已经建立过家园，如需搬迁请执行#家园搬迁至+地点`)
      return false
    }
    const address = e.msg.replace(/^(#|\/)建立家园/, '')
    const action = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const addressName = '极西联盟'
    const map = GameApi.WrapMap.mapExistence({
      action,
      addressName
    })
    if (!map) {
      e.reply(`第一次建立家园，需到${addressName}寻求联盟帮助`)
      return false
    }
    const point0 = GameApi.UserData.controlAction({
      NAME: 'point',
      CHOICE: 'generate_position'
    })
    const point = point0.find((item) => item.name == address)
    if (!point) {
      return false
    }
    const x = point.x
    const y = point.y
    const PointId = point.id.split('-')
    const region = PointId[1]
    const level = GameApi.GameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (level.levelId < PointId[3]) {
      e.reply('您选择的地点您还无法前往\n请道友重新选择')
      return false
    }
    const the = 10
    const time1 = the >= 0 ? the : 1
    useraction[UID] = setTimeout(() => {
      forwardsetTime[UID] = 0
      const positionhome = HomeApi.Listdata.controlActionInitial({
        NAME: 'position',
        CHOICE: 'position',
        INITIAL: []
      })
      const time = new Date()
      positionhome.push({
        qq: UID,
        createTime: time.getTime(),
        address,
        x,
        y,
        region
      })
      HomeApi.Listdata.controlActionInitial({
        NAME: 'position',
        CHOICE: 'position',
        DATA: positionhome,
        INITIAL: []
      })
      e.reply(`成功在${address}建立了自己的家园`)
    }, 1000 * time1)
    forwardsetTime[UID] = 1
    e.reply(`联盟人员正在加紧修建你的住所...\n预计需要${time1}秒`)
    return false
  }

  // 家园扩建
  async extensionhome(e) {
    // 不开放私聊功能
    if (!this.verify(e)) return false
    // 有无存档
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    const ifexisthome = HomeApi.GameUser.existhome({ UID })
    const region = ifexisthome.region
    const action = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const region1 = action.region
    if (region != region1) {
      e.reply('您现在不在家园里，请回到家园所在地进行操作')
      return false
    }
    const { homemsg } = HomeApi.UserAction.userextensionhome({ UID })
    if (homemsg) {
      e.reply(homemsg)
    }
    return false
  }

  async unextensionhome(e) {
    // 不开放私聊功能
    if (!this.verify(e)) return false
    // 有无存档
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    let action = GameApi.Wrap.getAction(UID)
    if (action.actionName != '扩建') {
      return false
    }
    const time1 = action.time1
    const startTime = action.startTime
    const time = Math.floor((new Date().getTime() - startTime) / 1000)
    const time2 = time1 - time
    if (time < time1) {
      e.reply(`你提前回来查看，但是工人还在努力的扩建中，预计还有${time2}秒，请耐心等待一下把`)
      return false
    }
    let home = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL: []
    })
    let homeexperience = home.homeexperience
    let homeexperienceMax = home.homeexperienceMax
    let x = homeexperience - homeexperienceMax
    home.homeexperience = x
    home.homelevel += 1
    home.homeexperienceMax = home.homelevel * 10000 + 10000
    HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home',
      NAME: UID,
      DATA: home,
      INITIAL: []
    })
    HomeApi.GameUser.offaction({ UID })
    e.reply(`你的家园已成功扩建`)
  }

  async movehome(e) {
    // 不开放私聊功能
    if (!this.verify(e)) return false
    // 有无存档
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GameUser.Archive({ UID })
    if (archive != 0) {
      e.reply(`${archive}`)
      return false
    }
    const ifexisthome = HomeApi.GameUser.existhome({ UID })
    if (ifexisthome == undefined) {
      e.reply('您都还没建立过家园')
      return false
    }
    const address = e.msg.replace(/^(#|\/)搬迁家园到/, '')
    if (ifexisthome.address == address) {
      e.reply(`你家就在${address}，建筑队看了看你家，再看了看你要搬的地点，随后投来了异样的眼光`)
      return false
    }
    const point0 = GameApi.UserData.controlAction({
      NAME: 'point',
      CHOICE: 'generate_position'
    })
    const point = point0.find((item) => item.name == address)
    if (!point) {
      return false
    }
    const x = point.x
    const y = point.y
    const PointId = point.id.split('-')
    const region = PointId[1]
    const level = GameApi.GameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (level.levelId < PointId[3]) {
      e.reply('您选择的地点您还无法前往\n请道友重新选择')
      return false
    }
    const thingName = '木板'
    const searchsthing = HomeApi.GameUser.userWarehouseSearch({
      UID,
      name: thingName
    })
    if (searchsthing == undefined) {
      e.reply(`你的仓库里没有木板!`)
      return false
    }
    const home = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL: []
    })
    const homelevel = home.homelevel
    const a = 40 * homelevel
    const z = a - searchsthing.acount
    if (searchsthing.acount < a) {
      e.reply(`你的木板不够，还需要筹备${z}块木板!`)
      return false
    }
    if (home.doge < 2000) {
      e.reply(`这点灵晶可请不动建筑队帮扩建家园哦!要想请动他们，至少准备2000灵晶`)
      return false
    }
    const the = 5
    const time1 = the >= 0 ? the : 1
    let positionhome = HomeApi.Listdata.controlActionInitial({
      CHOICE: 'position',
      NAME: 'position',
      INITIAL: []
    })
    useraction[UID] = setTimeout(() => {
      forwardsetTime[UID] = 0
      const target = positionhome.find((obj) => obj.qq === UID)
      let minefield = HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_minefield',
        NAME: 'minefield',
        INITIAL: []
      })
      const target1 = minefield.find((obj) => obj.qq === UID)
      if (target1 != undefined) {
        let qq = target1.qq
        if (qq == UID) {
          let minefield1 = minefield.filter((item) => item.qq != UID)
          HomeApi.Listdata.controlActionInitial({
            CHOICE: 'user_home_minefield',
            NAME: 'minefield',
            DATA: minefield1,
            INITIAL: []
          })
        }
      }
      const time = new Date()
      target.createTime = time.getTime()
      target.address = address
      target.x = x
      target.y = y
      target.region = region
      HomeApi.Listdata.controlActionInitial({
        CHOICE: 'user_position',
        NAME: 'position',
        DATA: positionhome,
        INITIAL: []
      })
      HomeApi.GameUser.userWarehouse({
        UID,
        name: thingName,
        ACCOUNT: -a
      })
      HomeApi.GameUser.addDoge({ UID, money: -2000 })
      e.reply(
        `成功在${address}建立了新的家园，花费2000灵晶(原来家园所在地如果占领了的话将会撤走哦!)`
      )
    }, 1000 * time1)
    forwardsetTime[UID] = 1
    e.reply(`建筑人员正在加紧修建你的新住所...\n预计需要${time1}秒`)
    return false
  }
}
