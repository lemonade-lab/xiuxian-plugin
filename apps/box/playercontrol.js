import { BotApi, GameApi, plugin } from '#xiuxian-api'
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
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const UIDB = BotApi.Robot.at(e)
    if (!UIDB) return false
    if (UID == UIDB) {
      e.reply('咦惹~')
      return false
    }
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
    const cf = GameApi.Defset.getConfig('cooling')
    const CDTime = cf.CD.Ambiguous ? cf.CD.Ambiguous : 5
    const CDID = 14
    const nowTime = new Date().getTime()
    const { state: coolingState, msg: msgCooling } = GameApi.Burial.cooling(e.user_id, CDID)
    if (coolingState == 4001) {
      e.reply(msgCooling)
      return false
    }
    GameApi.Burial.set(UID, CDID, nowTime, CDTime)
    const LevelDataA = GameApi.Data.read(UID, 'playerLevel')
    const LevelDataB = GameApi.Data.read(UIDB, 'playerLevel')
    const sizeA = Math.floor(LevelDataA.gaspractice.experience * 0.15) // 主动的
    const sizeB = Math.floor(LevelDataB.gaspractice.experience * 0.1) // 被动的
    const expA = sizeA > 2200 ? 2200 : sizeA
    const expB = sizeB > 2200 ? 2200 : sizeB
    LevelDataA.gaspractice.experience += expA
    LevelDataB.gaspractice.experience += expB
    GameApi.Data.write(UIDB, 'playerLevel', LevelDataB)
    GameApi.Data.write(UID, 'playerLevel', LevelDataA)
    e.reply('你两情投意合,奇怪的修为增加了~')
    return false
  }

  async transmissionPower(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const UIDB = BotApi.Robot.at(e)
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
    const LifeData = GameApi.Data.read('life', 'playerLife', {})
    e.reply(`${LifeData[UID]}成功传功[修为]*${size}给${LifeData[UIDB]}`)
    return false
  }

  async biguan(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
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
    if (!super.verify(e)) return false
    e = super.escape(e)
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
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    let action = GameApi.Action.get(UID)
    if (!action) return false
    if (action.actionID != 0) return false
    const startTime = action.startTime
    const time = Math.floor((new Date().getTime() - startTime) / 60000)
    if (time <= 1) {
      e.reply('只是呆了一会儿...')
      GameApi.Action.delete(UID)
      return false
    }
    GameApi.Action.delete(UID)
    upgrade(e, UID, time, '闭关', 'biguan', 0)
    return false
  }

  async endWork(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    let action = GameApi.Action.get(UID)
    if (!action) return false
    if (action.actionID != 1) return false
    const startTime = action.startTime
    const time = Math.floor((new Date().getTime() - startTime) / 60000)
    if (time <= 1) {
      e.reply('只是呆了一会儿...')
      GameApi.Action.delete(UID)
      return false
    }
    GameApi.Action.delete(UID)
    upgrade(e, UID, time, '降妖', 'work', 1)
    return false
  }
}

function upgrade(e, UID, time, name, key, othername) {
  const talent = GameApi.Data.read(UID, 'playerTalent')
  const buff = Math.floor(talent.talentsize / 100) + Number(1)
  const config = GameApi.Defset.getConfig('cooling')
  let other = Math.floor(config[key].size * time * buff)
  if (Math.random() * (100 - 1) + 1 < 20) {
    other -= Math.floor(other / 3)
  }
  let msg = `闭关结束\n[修为]*${other}`
  if (othername != 0) {
    msg = `降妖归来\n[气血]*${other}`
  }
  // 经验增加
  console.log(othername)
  GameApi.Levels.addExperience(UID, othername, other)
  // 更新血量
  const blood = GameApi.Player.addBlood(UID, time * 10)
  const LifeData = GameApi.Data.controlAction({
    NAME: 'life',
    CHOICE: 'playerLife'
  })
  msg += `\n恢复了${time * 10 >= 100 ? 100 : time * 10}%的血量`
  msg += `\n当前血量:${blood}`
  msg += `\n${name}结束`
  e.reply(`${LifeData[UID].name}${msg}`)
}
