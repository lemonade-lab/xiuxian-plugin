import { GameApi, plugin } from '../../model/api/index.js'
export class BoxLevel extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)突破$/, fnc: 'levelUp' },
        { reg: /^(#|\/)破境$/, fnc: 'levelMaxUp' }
      ]
    })
  }

  async levelUp(e) {
    if (!this.verify(e)) return false
    if (!GameApi.Player.existUserSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    const { UserLevelUpMSG } = userLevelUp({
      UID: e.user_id
    })
    if (UserLevelUpMSG) {
      e.reply(UserLevelUpMSG)
    }
    return false
  }

  async levelMaxUp(e) {
    if (!this.verify(e)) return false
    if (!GameApi.Player.existUserSatus(e.user_id)) {
      e.reply('已仙鹤')
      return false
    }
    const { UserLevelUpMSG } = userLevelUp({
      UID: e.user_id,
      choise: 'max'
    })
    if (UserLevelUpMSG) {
      e.reply(UserLevelUpMSG)
    }
    return false
  }
}

/**
 * @param { UID, choise } param0
 * @returns
 */
function userLevelUp({ UID, choise }) {
  const ifexistplay = GameApi.Player.existUserSatus(UID)
  if (!ifexistplay) {
    return { UserLevelUpMSG: `已仙鹤` }
  }
  const player = GameApi.UserData.controlAction({
    NAME: UID,
    CHOICE: 'user_level'
  })
  let CDID = '6'
  const cf = GameApi.Defset.getConfig({ app: 'parameter', name: 'cooling' })
  let CDTime = cf.CD.Level_up ? cf.CD.Level_up : 0
  let name = '修为'
  const Levellist = GameApi.UserData.controlAction({
    CHOICE: 'generate_level',
    NAME: 'gaspractice'
  })
  const Levelmaxlist = GameApi.UserData.controlAction({
    CHOICE: 'generate_level',
    NAME: 'bodypractice'
  })
  const Level = Levellist.find((item) => item.id == player.levelId)
  const LevelMax = Levelmaxlist.find((item) => item.id == player.levelMaxId)
  if (choise) {
    CDID = '7'
    CDTime = cf.CD.LevelMax_up ? cf.CD.LevelMax_up : 0
    name = '气血'
    if (player.levelMaxId >= 11) {
      return
    }
    if (player.experiencemax < LevelMax.exp) {
      return {
        UserLevelUpMSG: `再积累${LevelMax.exp - player.experiencemax}气血后方可突破`
      }
    }
  } else {
    if (player.levelId == 10) {
      return { UserLevelUpMSG: `[(#|/)渡劫]后,成就仙人镜` }
    }
    if (player.levelId >= 11) {
      /* 仙人境 */
      return
    }
    if (player.experience < Level.exp) {
      return {
        UserLevelUpMSG: `再积累${Level.exp - player.experience}修为后方可突破`
      }
    }
  }
  const nowTime = new Date().getTime()
  const { state: coolingState, msg: coolingMsg } = GameApi.Wrap.cooling(UID, CDID)
  if (coolingState == 4001) {
    return { coolingMsg: `${coolingMsg}` }
  }
  GameApi.Wrap.setRedis(UID, CDID, nowTime, CDTime)
  if (Math.random() >= 1 - player.levelMaxId / 22) {
    let size = ''
    if (choise) {
      size = Math.floor(Math.random() * player.experiencemax)
      player.experiencemax -= size
    } else {
      size = Math.floor(Math.random() * player.experience)
      player.experience -= size
    }
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_level',
      DATA: player
    })
    return {
      UserLevelUpMSG: `${GameApi.UserAction.CopywritingLevel[
        Math.floor(Math.random() * Object.keys(GameApi.UserAction.CopywritingLevel).length)
      ]
        .replace(/name/g, name)
        .replace(/size/g, size)}`
    }
  }
  let returnTXT = ''
  if (choise) {
    if (player.levelMaxId > 1 && player.rankMaxId < 4) {
      player.rankMaxId = player.rankMaxId + 1
    } else {
      player.rankMaxId = 0
      player.levelMaxId = player.levelMaxId + 1
      player.levelnamemax = Levelmaxlist.find((item) => item.id == player.levelMaxId).name
    }
    player.experiencemax -= LevelMax.exp
    returnTXT = `突破成功至${player.levelnamemax}${
      GameApi.UserAction.LevelMiniName[player.rankMaxId]
    }`
  } else {
    if (player.levelId > 1 && player.rankId < 4) {
      player.rankId = player.rankId + 1
      returnTXT = `突破成功至${player.levelname}${GameApi.UserAction.LevelMiniName[player.rankId]}`
    } else {
      player.rankId = 0
      player.levelId = player.levelId + 1
      player.levelname = Levellist.find((item) => item.id == player.levelId).name
      const { size } = this.userLifeUp({
        UID,
        levelId: player.levelId
      })
      returnTXT = `突破成功至${player.levelname}${
        GameApi.UserAction.LevelMiniName[player.rankId]
      },寿命至${size}`
    }
    player.experience -= Level.exp
  }
  GameApi.UserData.controlAction({
    NAME: UID,
    CHOICE: 'user_level',
    DATA: player
  })
  GameApi.Player.readPanel(UID)
  return {
    UserLevelUpMSG: `${returnTXT}`
  }
}
