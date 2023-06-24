import { plugin, GameApi, AssociationApi } from '../../model/api/index.js'
// 汐颜
export class AssociationJobUp extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)门派职位提升$/,
          fnc: 'FetchJob'
        },
        {
          reg: /^(#|\/)谋权篡位$/,
          fnc: 'commitRegicide'
        },
        {
          reg: /^(#|\/)发起职位挑战.*$/,
          fnc: 'launchJobChallenge'
        }
      ]
    })
  }

  async FetchJob(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.AID == 0) {
      e.reply('一介散修')
      return false
    }
    if (assGP.contributionPoints < 400) {
      e.reply('贡献不足')
      return false
    }
    if (assGP.assJob > 9) {
      e.reply('已达上限')
      return false
    }
    assGP.contributionPoints -= 400
    assGP.assJob += 1
    AssociationApi.assUser.assUpdataEfficiency(assGP)
    e.reply(`职位提升成功！`)
    return false
  }

  async commitRegicide(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.AID == 0) {
      e.reply('一介散修')
      return false
    }
    if (assGP.assJob >= 10) {
      e.reply('已达上限')
      return false
    }
    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })

    const actionA = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const actionB = GameApi.Data.controlAction({
      NAME: ass.master,
      CHOICE: 'playerAction'
    })
    if (actionA.region != actionB.region) {
      e.reply('没有找到掌门的位置！')
      return false
    }

    const victory = GameApi.Battle.battle({}, {})
    const SpecialData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerSpecial'
    })

    if (victory == UID) {
      assGP.assJob = 10
      ass.allMembers = ass.allMembers.filter((item) => item != ass.master)
      const masterGP = GameApi.Data.controlAction({
        NAME: ass.master,
        CHOICE: 'assGP'
      })
      masterGP.AID = 0
      masterGP.assJob = 0
      masterGP.favorability = 0
      AssociationApi.assUser.assUpdataEfficiency(masterGP)
      ass.master = UID
      SpecialData.prestige += 8
      e.reply(`谋划数载，篡位成功，你成功坐上了掌门之位，但也因为这一行为煞气值增加8点`)
    } else {
      ass.allMembers = ass.allMembers.filter((item) => item != UID)
      assGP.AID = 0
      assGP.assJob = 0
      assGP.favorability = 0
      assGP.contributionPoints = 0
      SpecialData.prestige += 15
      e.reply(`你谋划篡位，被掌门识破了，不仅被逐出门派，还让增加了15点煞气值`)
    }
    AssociationApi.assUser.assUpdataEfficiency(assGP)
    AssociationApi.assUser.setAssOrGP('assOciation', ass.id, ass)
    GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerSpecial',
      DATA: SpecialData
    })
    return false
  }

  async launchJobChallenge(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })

    if (assGP.AID == 0) {
      e.reply('一介散修')
      return false
    }
    if (assGP.assJob >= 10) {
      e.reply('已达上限')
      return false
    }
    if (assGP.contributionPoints < 200) {
      e.reply(`你没有足够的贡献点作为比试的彩头，对方不接受你的挑战`)
      return false
    }

    const battleUID = e.msg.replace(/^(#|\/)发起职位挑战/, '')
    const ifexists = AssociationApi.assUser.existArchive(battleUID)
    if (!ifexists || !AssociationApi.assUser.existAss('assGP', battleUID)) {
      return false
    }
    const battleGP = GameApi.Data.controlAction({
      NAME: battleUID,
      CHOICE: 'assGP'
    })
    if (assGP.AID == 0) {
      e.reply('一介散修')
      return false
    }
    if (assGP.assJob >= 10) {
      e.reply('已达上限')
      return false
    }
    if (
      assGP.AID != battleGP.AID ||
      battleGP.assJob < assGP.assJob ||
      battleGP.assJob > assGP.assJob + 2
    ) {
      return false
    }
    const actionA = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const actionB = GameApi.Data.controlAction({
      NAME: battleUID,
      CHOICE: 'playerAction'
    })
    if (actionA.region != actionB.region) {
      e.reply('没有找到对方在哪里，无法挑战！')
      return false
    }
    const victory = GameApi.Battle.battle({}, {})
    if (victory == UID) {
      assGP.assJob += 1
      battleGP.assJob -= 1
      AssociationApi.assUser.assUpdataEfficiency(assGP)
      AssociationApi.assUser.assUpdataEfficiency(battleGP)
      e.reply(`你在赢得了比试的胜利，职位等级提高了，对方的职位等级降低一级`)
      return false
    } else {
      assGP.contributionPoints -= 200
      battleGP.contributionPoints += 200
      AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
      AssociationApi.assUser.setAssOrGP('assGP', battleUID, battleGP)
      e.reply(`你技不如人，不仅没提高职位等级，还要给对方200贡献点！`)
      return false
    }
  }
}
