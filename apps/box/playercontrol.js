import { BotApi, GameApi, plugin } from '../../model/api/index.js'
export class BoxGPControl extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)降妖$/, fnc: 'dagong' },
        { reg: /^(#|\/)闭关$/, fnc: 'biguan' },
        { reg: /^(#|\/)出关$/, fnc: 'chuGuan' },
        { reg: /^(#|\/)归来$/, fnc: 'endWork' },
        { reg: /^(#|\/)传功$/, fnc: 'transmissionPower' },
        { reg: /^(#|\/)双修$/, fnc: 'ambiguous' }
      ]
    })
  }

  async ambiguous(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const UIDB = BotApi.Robot.at({ e })
    if (!UIDB) return false
    if (!GameApi.Player.getUserLifeSatus(UIDB)) {
      e.reply('已仙鹤')
      return false
    }
    e.reply('待更新~')
    return false
  }

  async transmissionPower(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const UIDB = BotApi.Robot.at({ e })
    if (!UIDB) return false
    if (!GameApi.Player.getUserLifeSatus(UIDB)) {
      e.reply('已仙鹤')
      return false
    }
    const { state: stateA, msg: msgA } = GameApi.Action.miniGo(UID)
    if (stateA == 4001) {
      e.reply(msgA)
      return false
    }
    const { state: stateB, msg: msgB } = GameApi.Action.miniGo(UIDB)
    if (stateB == 4001) {
      e.reply(msgB)
      return false
    }
    const LevelDataA = GameApi.Data.read(UID, 'playerLevel')
    if (LevelDataA.gaspractice.realm >= 21) {
      e.reply('至少元婴期!')
      return false
    }
    if (LevelDataA.gaspractice.experience <= 2200) {
      e.reply('所剩修为低于2200~')
      return false
    }
    const LevelDataB = GameApi.Data.read(UIDB, 'playerLevel')
    if (
      LevelDataB.gaspractice.realm > LevelDataA.gaspractice.realm - 9 &&
      LevelDataB.gaspractice.realm < LevelDataA.gaspractice.realm + 9
    ) {
      e.reply('仅可相差9个境界')
      return false
    }
    if (!GameApi.Method.isTrueInRange(1, 100, 75)) {
      /** 失败则a直接掉境界 */
      LevelDataA.gaspractice.realm -= 1
      LevelDataA.gaspractice.experience = 0
      GameApi.Data.write(UID, 'playerLevel', LevelDataA)
      e.reply('失败了~,你掉落了一个境界！')
      return false
    }
    /** 传功效果是不可逆的，会直接把身上已有的经验都传过去,而且效率只有0.35 */
    const size = Math.floor(LevelDataA.gaspractice.experience * 0.35)
    LevelDataB.gaspractice.experience += size
    LevelDataA.gaspractice.experience = 0
    GameApi.Data.write(UIDB, 'playerLevel', LevelDataB)
    GameApi.Data.write(UID, 'playerLevel', LevelDataA)
    const LifeData = GameApi.Data.read('life', 'playerFile')
    e.reply(`${LifeData[UID]}成功传功[修为]*${size}给${LifeData[UIDB]}`)
    return false
  }

  async biguan(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Action.miniGo(UID)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const nowTime = new Date().getTime()
    GameApi.Action.set(UID, {
      actionID: 0,
      startTime: nowTime
    })
    e.reply('开始两耳不闻窗外事...')
    return false
  }

  async dagong(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Action.Go(UID)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const nowTime = new Date().getTime()
    GameApi.Action.set(UID, {
      actionID: 1,
      startTime: nowTime
    })
    e.reply('开始外出...')
    return false
  }

  async chuGuan(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    let action = GameApi.Action.get(UID)
    if (!action) return false
    if (action.actionID != 0) return false
    const startTime = action.startTime
    const cf = GameApi.Defset.getConfig({
      name: 'cooling'
    })
    const timeUnit = cf.biguan.time ? cf.biguan.time : 5
    const time = Math.floor((new Date().getTime() - startTime) / 60000)
    if (time < timeUnit) {
      e.reply('只是呆了一会儿...')
      GameApi.Action.delete(UID)
      return false
    }
    GameApi.Action.delete(UID)
    upgrade(UID, time, action.actionID, e)
    return false
  }

  async endWork(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    let action = GameApi.Action.get(UID)
    if (!action) return false
    if (action.actionID != 1) return false
    const startTime = action.startTime
    const cf = GameApi.Defset.getConfig({
      name: 'cooling'
    })
    const timeUnit = cf.work.time ? cf.work.time : 5
    const time = Math.floor((new Date().getTime() - startTime) / 60000)
    if (time < timeUnit) {
      e.reply('只是呆了一会儿...')
      GameApi.Action.delete(UID)
      return false
    }
    GameApi.Action.delete(UID)
    upgrade(e, UID, time, action.actionID)
    return false
  }
}

function upgrade(e, UID, time, name) {
  const talent = GameApi.Data.controlAction({
    NAME: UID,
    CHOICE: 'playerTalent'
  })
  const buff = Math.floor(talent.talentsize / 100) + Number(1)
  const appSize = GameApi.Defset.getConfig({
    name: 'cooling'
  })
  let map = {
    闭关: 'biguan',
    降妖: 'work'
  }
  let other = Math.floor(appSize[map[name]].size * time * buff)
  if (Math.random() * (100 - 1) + 1 < 20) {
    other -= Math.floor(other / 3)
  }
  let othername = 0
  let msg = `闭关结束\n[修为]*${other}`
  if (name != '闭关') {
    othername = 1
    msg = `降妖归来\n[气血]*${other}`
  }
  // 经验增加
  GameApi.Levels.addExperience(UID, othername, other)
  // 更新血量
  GameApi.Player.updataUserBlood({ UID, SIZE: 90 })
  const LifeData = GameApi.Data.controlAction({
    NAME: 'life',
    CHOICE: 'playerLife'
  })
  msg += '\n[血量状态]90%'
  msg += `\n${name}结束`
  e.reply(`${LifeData[UID].name}${msg}`)
}
