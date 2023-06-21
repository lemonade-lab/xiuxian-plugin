import { BotApi, GameApi, HomeApi, plugin } from '../../model/api/index.js'
const forwardsetTime = []
const useraction = []
// 秋雨
export class Homestart extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)我的洞府$/,
          fnc: 'myhome'
        },
        {
          reg: /^(#|\/)洞府仓库$/,
          fnc: 'Warehouse'
        },
        {
          reg: /^(#|\/)洞府扩建/,
          fnc: 'extensionhome'
        },
        {
          reg: /^(#|\/)查看洞府扩建/,
          fnc: 'unextensionhome'
        },
        {
          reg: /^(#|\/)建立洞府.*$/,
          fnc: 'buildhome'
        },
        {
          reg: /^(#|\/)搬迁洞府到.*$/,
          fnc: 'movehome'
        }
      ]
    })
  }

  async myhome(e) {
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
    const { path, name, data } = HomeApi.Information.userhomeShow({
      UID
    })
    e.reply(await BotApi.obtainingImages({ path, name, data }))
    return false
  }

  async Warehouse(e) {
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
    const { path, name, data } = HomeApi.Information.userWarehouseShow(UID)
    e.reply(await BotApi.obtainingImages({ path, data, name }))
    return false
  }

  async buildhome(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const archive = HomeApi.GP.Archive(UID)
    if (archive != 0 && archive != '您都还没建立过洞府') {
      e.reply(`${archive}`)
      return false
    }
    const ifexisthome = GameApi.Listdata.controlAction({
      NAME: 'position',
      CHOICE: 'position'
    })
    const ifexisthome1 = ifexisthome.find((item) => item.UID == UID)
    if (ifexisthome1) {
      e.reply(`您已经建立过洞府，如需搬迁请执行#洞府搬迁至+地点`)
      return false
    }
    const address = e.msg.replace(/^(#|\/)建立洞府/, '')
    const action = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const addressName = '极西联盟'
    const map = GameApi.Map.mapExistence({
      action,
      addressName
    })
    if (!map) {
      e.reply(`第一次建立洞府，需到${addressName}寻求联盟帮助`)
      return false
    }
    const point0 = GameApi.Listdata.controlAction({
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
    const LevelData = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    if (LevelData.gaspractice.realm < PointId[3] - 1) {
      e.reply('您选择的地点您还无法前往\n请道友重新选择')
      return false
    }
    const the = 10
    const time1 = the >= 0 ? the : 1
    useraction[UID] = setTimeout(() => {
      forwardsetTime[UID] = 0
      const positionhome = GameApi.Listdata.controlActionInitial({
        NAME: 'position',
        CHOICE: 'position',
        INITIAL: []
      })
      const time = new Date().getTime()
      positionhome.push({
        UID,
        createTime: time.getTime(),
        address,
        x,
        y,
        region
      })
      GameApi.Listdata.controlAction({
        NAME: 'position',
        CHOICE: 'position',
        DATA: positionhome
      })
      e.reply(`成功在${address}建立了自己的洞府`)
    }, 1000 * time1)
    forwardsetTime[UID] = 1
    e.reply(`联盟人员正在加紧修建你的住所...\n预计需要${time1}秒`)
    return false
  }

  // 洞府扩建
  async extensionhome(e) {
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
    const region = ifexisthome.region
    const action = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const region1 = action.region
    if (region != region1) {
      e.reply('您现在不在洞府里，请回到洞府所在地进行操作')
      return false
    }
    const { homemsg } = HomeApi.UserAction.userextensionhome(UID)
    if (homemsg) {
      e.reply(homemsg)
    }
    return false
  }

  async unextensionhome(e) {
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
    let action = GameApi.Action.get(UID)
    if (action.actionID != 5) {
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
    let home = GameApi.Listdata.controlActionInitial({
      CHOICE: 'user_home_user',
      NAME: UID,
      INITIAL: []
    })
    let homeexperience = home.homeexperience
    home.homeexperience = homeexperience - home.homeexperienceMax
    home.homelevel += 1
    home.homeexperienceMax = home.homelevel * 10000 + 10000
    GameApi.Listdata.controlAction({
      CHOICE: 'user_home',
      NAME: UID,
      DATA: home
    })
    HomeApi.GP.deleteAction(UID)
    e.reply(`你的洞府已成功扩建`)
  }

  async movehome(e) {
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
    if (ifexisthome == undefined) {
      e.reply('您都还没建立过洞府')
      return false
    }
    const address = e.msg.replace(/^(#|\/)搬迁洞府到/, '')
    if (ifexisthome.address == address) {
      e.reply(`你家就在${address}，建筑队看了看你家，再看了看你要搬的地点，随后投来了异样的眼光`)
      return false
    }
    const point0 = GameApi.Listdata.controlAction({
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
    const LevelData = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    if (LevelData.gaspractice.realm < PointId[3] - 1) {
      e.reply('您选择的地点您还无法前往\n请道友重新选择')
      return false
    }
    const thingName = '木板'
    const searchsthing = HomeApi.GP.userWarehouseSearch({
      UID,
      name: thingName
    })
    if (searchsthing == undefined) {
      e.reply(`你的仓库里没有木板!`)
      return false
    }
    const home = GameApi.Listdata.controlActionInitial({
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
      e.reply(`这点灵晶可请不动建筑队帮扩建洞府哦!要想请动他们，至少准备2000灵晶`)
      return false
    }
    const the = 5
    const time1 = the >= 0 ? the : 1
    let positionhome = GameApi.Listdata.controlActionInitial({
      CHOICE: 'position',
      NAME: 'position',
      INITIAL: []
    })
    useraction[UID] = setTimeout(() => {
      forwardsetTime[UID] = 0
      const target = positionhome.find((obj) => obj.UID === UID)
      let minefield = GameApi.Listdata.controlActionInitial({
        CHOICE: 'user_home_minefield',
        NAME: 'minefield',
        INITIAL: []
      })
      const target1 = minefield.find((obj) => obj.UID === UID)
      if (target1 != undefined) {
        let qq = target1.UID
        if (qq == UID) {
          let minefield1 = minefield.filter((item) => item.UID != UID)
          GameApi.Listdata.controlAction({
            CHOICE: 'user_home_minefield',
            NAME: 'minefield',
            DATA: minefield1
          })
        }
      }
      const time = new Date().getTime()
      target.createTime = time.getTime()
      target.address = address
      target.x = x
      target.y = y
      target.region = region
      GameApi.Listdata.controlAction({
        CHOICE: 'user_position',
        NAME: 'position',
        DATA: positionhome
      })
      HomeApi.GP.userWarehouse({
        UID,
        name: thingName,
        ACCOUNT: -a
      })
      HomeApi.GP.addDoge({ UID, money: -2000 })
      e.reply(
        `成功在${address}建立了新的洞府，花费2000灵晶(原来洞府所在地如果占领了的话将会撤走哦!)`
      )
    }, 1000 * time1)
    forwardsetTime[UID] = 1
    e.reply(`建筑人员正在加紧修建你的新住所...\n预计需要${time1}秒`)
    return false
  }
}
