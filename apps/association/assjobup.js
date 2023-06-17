import { plugin, BoxApi, AssociationApi } from '../../model/api/gameapi.js'
//汐颜
export class AssociationJobUp extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)宗门职位提升$/,
          fnc: 'FetchJob'
        },
        {
          reg: /^(#|\/)谋权篡位$/,
          fnc: 'Commit_Regicide'
        },
        {
          reg: /^(#|\/)发起职位挑战.*$/,
          fnc: 'Launch_Job_Challenge'
        }
      ]
    })
  }

  async FetchJob(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return
    }
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0 || assPlayer.assJob > 9 || assPlayer.contributionPoints < 400) {
      return
    }
    assPlayer.contributionPoints -= 400
    assPlayer.assJob += 1
    await AssociationApi.assUser.assEffCount(assPlayer)
    e.reply(`职位提升成功！`)
    return
  }

  async Commit_Regicide(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return
    }
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0 || assPlayer.assJob >= 10) {
      return
    }
    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)

    const actionA = await BoxApi.GameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const actionB = await BoxApi.GameUser.userMsgAction({
      NAME: ass.master,
      CHOICE: 'user_action'
    })
    if (actionA.region != actionB.region) {
      e.reply('没有找到宗主的位置！')
      return
    }

    const victory = await BoxApi.GameBattle.battle({
      e,
      A: UID,
      B: ass.master
    })
    const userLevel = await BoxApi.GameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_level'
    })

    if (victory == UID) {
      assPlayer.assJob = 10
      ass.allMembers = ass.allMembers.filter((item) => item != ass.master)
      const masterPlayer = AssociationApi.assUser.getAssOrPlayer(1, ass.master)
      masterPlayer.assName = 0
      masterPlayer.assJob = 0
      masterPlayer.favorability = 0
      await AssociationApi.assUser.assEffCount(masterPlayer)
      ass.master = UID
      userLevel.prestige += 8
      e.reply(`谋划数载，篡位成功，你成功坐上了宗主之位，但也因为这一行为魔力值增加8点`)
    } else {
      ass.allMembers = ass.allMembers.filter((item) => item != UID)
      assPlayer.assName = 0
      assPlayer.assJob = 0
      assPlayer.favorability = 0
      assPlayer.contributionPoints = 0
      userLevel.prestige += 15
      e.reply(`你谋划篡位，被宗主识破了，不仅被逐出宗门，还让增加了15点魔力值`)
    }
    await AssociationApi.assUser.assEffCount(assPlayer)
    await AssociationApi.assUser.setAssOrPlayer('association', ass.id, ass)
    await BoxApi.GameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_level',
      DATA: userLevel
    })
    return
  }

  async Launch_Job_Challenge(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return
    }

    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0 || assPlayer.assJob >= 8) {
      return
    }
    if (assPlayer.contributionPoints < 200) {
      e.reply(`你没有足够的贡献点作为比试的彩头，对方不接受你的挑战`)
      return
    }

    const battleQQ = e.msg.replace('#发起职位挑战', '')
    const ifexists = await AssociationApi.assUser.existArchive(battleQQ)
    if (!ifexists || !AssociationApi.assUser.existAss('assPlayer', battleQQ)) {
      return
    }
    const battlePlayer = AssociationApi.assUser.getAssOrPlayer(1, battleQQ)
    if (
      battlePlayer.assName == 0 ||
      assPlayer.assName != battlePlayer.assName ||
      battlePlayer.assJob >= 10 ||
      battlePlayer.assJob < assPlayer.assJob ||
      battlePlayer.assJob > assPlayer.assJob + 2
    ) {
      return
    }
    const actionA = await BoxApi.GameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const actionB = await BoxApi.GameUser.userMsgAction({
      NAME: battleQQ,
      CHOICE: 'user_action'
    })
    if (actionA.region != actionB.region) {
      e.reply('没有找到对方在哪里，无法挑战！')
      return
    }
    const victory = await BoxApi.GameBattle.battle({ e, A: UID, B: battleQQ })
    if (victory == UID) {
      assPlayer.assJob += 1
      battlePlayer.assJob -= 1
      await AssociationApi.assUser.assEffCount(assPlayer)
      await AssociationApi.assUser.assEffCount(battlePlayer)
      e.reply(`你在赢得了比试的胜利，职位等级提高了，对方的职位等级降低一级`)
      return
    } else {
      assPlayer.contributionPoints -= 200
      battlePlayer.contributionPoints += 200
      await AssociationApi.assUser.setAssOrPlayer('assPlayer', UID, assPlayer)
      await AssociationApi.assUser.setAssOrPlayer('assPlayer', battleQQ, battlePlayer)
      e.reply(`你技不如人，不仅没提高职位等级，还要给对方200贡献点！`)
      return
    }
  }
}
