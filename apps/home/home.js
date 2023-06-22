import { BotApi, GameApi, HomeApi, plugin } from '../../model/api/index.js'
const forwardsetTime = {}
const useraction = {}
// 秋雨
export class Homestart extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)开辟洞府.*$/,
          fnc: 'buildhome'
        },
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
          reg: /^(#|\/)搬迁洞府到.*$/,
          fnc: 'movehome'
        }
      ]
    })
  }

  async buildhome(e) {
    if (!this.verify(e)) return false
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
    /** 查看家园表 */
    const PositionList = GameApi.Data.controlActionInitial({
      NAME: 'position',
      CHOICE: 'homePosition',
      INITIAL: []
    })

    const ifexishome = PositionList.find((item) => item.UID == UID)
    if (ifexishome) {
      e.reply('已建有洞府~')
      return false
    }

    if (forwardsetTime[UID]) {
      e.reply(`联盟人员正在加紧修建洞府...`)
      return false
    }

    /** 开始修建 */
    const address = e.msg.replace(/^(#|\/)开辟洞府/, '')
    const addressName = '联盟'
    if (!GameApi.Map.mapAction({ UID: e.user_id, addressName })) {
      e.reply(`需[(#|/)前往+城池名+${addressName}]寻求联盟帮助`)
      return false
    }

    // 查看点位表
    const point0 = GameApi.Data.controlAction({
      NAME: 'point',
      CHOICE: 'generate_position'
    })

    // 搜索点位
    const point = point0.find((item) => item.name == address)
    if (!point) {
      e.reply('未知地点')
      return false
    }

    //
    const PointId = point.id.split('-')
    const region = PointId[1]
    const LevelData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    if (LevelData.gaspractice.realm < PointId[3] - 1) {
      e.reply('您选择的地点您还无法前往\n请道友重新选择')
      return false
    }

    /**
     * 设置修建行为冷却
     */
    forwardsetTime[UID] = setTimeout(() => {
      // 清除定时
      delete forwardsetTime[UID]
      const positionhome = GameApi.Data.controlActionInitial({
        NAME: 'position',
        CHOICE: 'homePosition',
        INITIAL: []
      })
      positionhome.push({
        UID,
        address,
        x: point.x,
        y: point.y,
        region,
        createTime: new Date().getTime()
      })
      GameApi.Data.controlAction({
        NAME: 'position',
        CHOICE: 'homePosition',
        DATA: positionhome
      })
      e.reply(`成功在${address}开辟了自己的洞府`)
    }, 1000 * 10)

    return false
  }

  async myhome(e) {
    if (!this.verify(e)) return false
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
    const { path, name, data } = HomeApi.Information.showhomeUser({
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
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }

    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const { path, name, data } = HomeApi.Information.showWarehouse(UID)
    e.reply(await BotApi.obtainingImages({ path, data, name }))
    return false
  }

  // 洞府扩建
  async extensionhome(e) {
    // 不开放私聊功能
    if (!this.verify(e)) return false
    const UID = e.user_id
    // 验证主存档
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    // 验证家园存档
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    const ifexisthome = HomeApi.GP.getPositionHome(UID)
    const ActionData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    if (ifexisthome.region != ActionData.region) {
      e.reply('请回到洞府~')
      return false
    }
    const home = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'homeUser'
    })
    if (home.homelevel > 9) {
      e.reply('洞府等级已达上限')
      return false
    }
    let thingNameh = '木板'
    let h = 40 * Math.pow(2, home.homelevel)
    let g = 40
    let thingNameg = this.map[home.homelevel]
    const searchsthing = HomeApi.GP.searchWarehouseByName({
      UID,
      name: thingNameg
    })
    const searchsthingh = HomeApi.GP.searchWarehouseByName({
      UID,
      name: thingNameh
    })
    if (searchsthing == undefined) {
      e.reply(`仓库里没有${thingNameg}!`)
      return false
    }
    if (searchsthingh == undefined) {
      e.reply(`仓库里没有${thingNameh}!`)
      return false
    }
    let x = g - searchsthing.acount
    let y = h - searchsthingh.acount
    if (searchsthing.acount < g) {
      e.reply(`${thingNameg}不够，还需要筹备${x}块${thingNameg}!`)
      return false
    }
    if (searchsthingh.acount < h) {
      e.reply(`${thingNameh}不够，还需要筹备${y}块${thingNameh}!`)
      return false
    }
    let homeexperience = home.homeexperience
    let homeexperienceMax = home.homeexperienceMax
    let doge = home.doge
    let money = 10000 * Math.trunc(home.homelevel) + 10000
    if (homeexperience < homeexperienceMax) {
      let x = homeexperienceMax - homeexperience
      e.reply(`洞府经验不够!要升级还缺${x}洞府经验`)
      return false
    }
    if (doge < money) {
      let x = money - doge
      e.reply(`还缺${x}灵晶`)
      return false
    }
    const time = (Math.trunc(home.homelevel) + 1) * 10
    const nowTime = new Date().getTime()
    GameApi.Burial.setAction(UID, {
      actionID: 5,
      startTime: nowTime,
      time1: time
    })
    HomeApi.GP.addWarehouseThing({
      UID,
      name: thingNameg,
      ACCOUNT: -g
    })
    HomeApi.GP.addWarehouseThing({
      UID,
      name: thingNameh,
      ACCOUNT: -h
    })
    HomeApi.GP.addDoge({ UID, money: -money })
    e.reply(`联盟联盟人员正在扩建洞府，预计需要${time}秒`)
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
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
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
    let home = GameApi.Data.controlActionInitial({
      CHOICE: 'homeUser',
      NAME: UID,
      INITIAL: []
    })
    let homeexperience = home.homeexperience
    home.homeexperience = homeexperience - home.homeexperienceMax
    home.homelevel += 1
    home.homeexperienceMax = home.homelevel * 10000 + 10000
    GameApi.Data.controlAction({
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
    const { state, msg } = HomeApi.GP.Archive(UID)
    if (state == 2000) {
      e.reply(msg)
      return false
    }
    const ifexisthome = HomeApi.GP.getPositionHome(UID)
    if (ifexisthome == undefined) {
      e.reply('您都还没开辟过洞府')
      return false
    }
    if (useraction[UID]) {
      e.reply(`联盟人员正在加紧修建...`)
      return false
    }
    const address = e.msg.replace(/^(#|\/)搬迁洞府到/, '')
    if (ifexisthome.address == address) {
      e.reply(
        `你的洞府就在${address}，联盟人员看了看你的洞府，再看了看你要搬的地点，随后投来了异样的眼光`
      )
      return false
    }
    const point0 = GameApi.Data.controlAction({
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
    const LevelData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    if (LevelData.gaspractice.realm < PointId[3] - 1) {
      e.reply('您选择的地点您还无法前往\n请道友重新选择')
      return false
    }
    const thingName = '木板'
    const searchsthing = HomeApi.GP.searchWarehouseByName({
      UID,
      name: thingName
    })
    if (searchsthing == undefined) {
      e.reply(`你的仓库里没有木板!`)
      return false
    }
    const home = GameApi.Data.controlActionInitial({
      CHOICE: 'homeUser',
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
      e.reply(`这点灵晶可请不动联盟人员帮扩建洞府哦!要想请动他们，至少准备2000灵晶`)
      return false
    }
    const the = 5
    const time1 = the >= 0 ? the : 1
    let positionhome = GameApi.Data.controlActionInitial({
      CHOICE: 'homePosition',
      NAME: 'position',
      INITIAL: []
    })
    useraction[UID] = setTimeout(() => {
      delete forwardsetTime[UID]
      const target = positionhome.find((obj) => obj.UID === UID)
      let minefield = GameApi.Data.controlActionInitial({
        CHOICE: 'user_home_minefield',
        NAME: 'minefield',
        INITIAL: []
      })
      const target1 = minefield.find((obj) => obj.UID === UID)
      if (target1 != undefined) {
        let qq = target1.UID
        if (qq == UID) {
          let minefield1 = minefield.filter((item) => item.UID != UID)
          GameApi.Data.controlAction({
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
      GameApi.Data.controlAction({
        CHOICE: 'user_position',
        NAME: 'position',
        DATA: positionhome
      })
      HomeApi.GP.addWarehouseThing({
        UID,
        name: thingName,
        ACCOUNT: -a
      })
      HomeApi.GP.addDoge({ UID, money: -2000 })
      e.reply(
        `成功在${address}开辟了新的洞府，花费2000灵晶(原来洞府所在地如果占领了的话将会撤走哦!)`
      )
    }, 1000 * time1)
    return false
  }
}
