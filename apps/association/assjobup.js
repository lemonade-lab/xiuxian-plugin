import { plugin, GameApi, AssociationApi } from '../../model/api/index.js'
// 汐颜
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
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }
    const assGP = AssociationApi.assUser.getAssOrGP(1, UID)
    if (assGP.assName == 0 || assGP.assJob > 9 || assGP.contributionPoints < 400) {
      return false
    }
    assGP.contributionPoints -= 400
    assGP.assJob += 1
    AssociationApi.assUser.assEffCount(assGP)
    e.reply(`职位提升成功！`)
    return false
  }

  async Commit_Regicide(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }
    const assGP = AssociationApi.assUser.getAssOrGP(1, UID)
    if (assGP.assName == 0 || assGP.assJob >= 10) {
      return false
    }
    const ass = AssociationApi.assUser.getAssOrGP(2, assGP.assName)

    const actionA = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const actionB = GameApi.UserData.controlAction({
      NAME: ass.master,
      CHOICE: 'user_action'
    })
    if (actionA.region != actionB.region) {
      e.reply('没有找到宗主的位置！')
      return false
    }

    const victory = GameApi.Battle.battle({
      e,
      A: UID,
      B: ass.master
    })
    const userLevel = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })

    if (victory == UID) {
      assGP.assJob = 10
      ass.allMembers = ass.allMembers.filter((item) => item != ass.master)
      const masterGP = AssociationApi.assUser.getAssOrGP(1, ass.master)
      masterGP.assName = 0
      masterGP.assJob = 0
      masterGP.favorability = 0
      AssociationApi.assUser.assEffCount(masterGP)
      ass.master = UID
      userLevel.prestige += 8
      e.reply(`谋划数载，篡位成功，你成功坐上了宗主之位，但也因为这一行为魔力值增加8点`)
    } else {
      ass.allMembers = ass.allMembers.filter((item) => item != UID)
      assGP.assName = 0
      assGP.assJob = 0
      assGP.favorability = 0
      assGP.contributionPoints = 0
      userLevel.prestige += 15
      e.reply(`你谋划篡位，被宗主识破了，不仅被逐出宗门，还让增加了15点魔力值`)
    }
    AssociationApi.assUser.assEffCount(assGP)
    AssociationApi.assUser.setAssOrGP('association', ass.id, ass)
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_level',
      DATA: userLevel
    })
    return false
  }

  async Launch_Job_Challenge(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    const assGP = AssociationApi.assUser.getAssOrGP(1, UID)
    if (assGP.assName == 0 || assGP.assJob >= 8) {
      return false
    }
    if (assGP.contributionPoints < 200) {
      e.reply(`你没有足够的贡献点作为比试的彩头，对方不接受你的挑战`)
      return false
    }

    const battleQQ = e.msg.replace(/^(#|\/)发起职位挑战/, '')
    const ifexists = AssociationApi.assUser.existArchive(battleQQ)
    if (!ifexists || !AssociationApi.assUser.existAss('assGP', battleQQ)) {
      return false
    }
    const battleGP = AssociationApi.assUser.getAssOrGP(1, battleQQ)
    if (
      battleGP.assName == 0 ||
      assGP.assName != battleGP.assName ||
      battleGP.assJob >= 10 ||
      battleGP.assJob < assGP.assJob ||
      battleGP.assJob > assGP.assJob + 2
    ) {
      return false
    }
    const actionA = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const actionB = GameApi.UserData.controlAction({
      NAME: battleQQ,
      CHOICE: 'user_action'
    })
    if (actionA.region != actionB.region) {
      e.reply('没有找到对方在哪里，无法挑战！')
      return false
    }
    const victory = GameApi.Battle.battle({ e, A: UID, B: battleQQ })
    if (victory == UID) {
      assGP.assJob += 1
      battleGP.assJob -= 1
      AssociationApi.assUser.assEffCount(assGP)
      AssociationApi.assUser.assEffCount(battleGP)
      e.reply(`你在赢得了比试的胜利，职位等级提高了，对方的职位等级降低一级`)
      return false
    } else {
      assGP.contributionPoints -= 200
      battleGP.contributionPoints += 200
      AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
      AssociationApi.assUser.setAssOrGP('assGP', battleQQ, battleGP)
      e.reply(`你技不如人，不仅没提高职位等级，还要给对方200贡献点！`)
      return false
    }
  }
}
