import { plugin, BotApi, GameApi, AssociationApi } from '../../model/api/index.js'
// 汐颜
export class AssociationJoin extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)查看简历.*$/,
          fnc: 'viewResume'
        },
        {
          reg: /^(#|\/)批准录取.*$/,
          fnc: 'approvalAdmission'
        },
        {
          reg: /^(#|\/)驳回申请.*$/,
          fnc: 'denialApplication'
        },
        {
          reg: /^(#|\/)清空志愿$/,
          fnc: 'clearVolunteer'
        },
        {
          reg: /^(#|\/)展示所有简历$/,
          fnc: 'showAllResume'
        }
      ]
    })
  }

  async viewResume(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    const joinUID = e.msg.replace(/^(#|\/)查看简历/, '')
    const assGP = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.assName == 0) {
      return false
    }
    const joinGP = GameApi.Listdata.controlAction({
      NAME: joinUID,
      CHOICE: 'playerLevel'
    })
    const ass = GameApi.Listdata.controlAction({
      NAME: assGP.assName,
      CHOICE: 'association'
    })
    const find = ass.applyJoinList.findIndex((item) => item == joinUID)
    if (find == -1) {
      return false
    }

    if (assGP.assJob < 8) {
      e.reply(`权限不足`)
      return false
    }

    let msg =
      `UID号:${joinUID} \n` +
      `练气境界: ${joinGP.levelname}\n` +
      `炼体境界: ${joinGP.levelnamemax}` +
      '\n'
    e.reply(msg)
    return false
  }

  async clearVolunteer(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const assGP = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })

    if (assGP.volunteerAss == undefined) {
      assGP.volunteerAss = 0
      AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
      return false
    }

    if (assGP.volunteerAss == 0) {
      return false
    }
    const ass = GameApi.Listdata.controlAction({
      NAME: assGP.volunteerAss,
      CHOICE: 'association'
    })
    if (!ass) {
      assGP.volunteerAss = 0
      AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
      e.reply(`清除成功！`)
      return false
    } else {
      assGP.volunteerAss = 0
      ass.applyJoinList = ass.applyJoinList.filter((item) => item != UID)
      AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
      AssociationApi.assUser.setAssOrGP('association', ass.id, ass)
      e.reply(`清除成功！`)
      return false
    }
  }

  async approvalAdmission(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    const joinUID = e.msg.replace(/^(#|\/)批准录取/, '')
    if (!ifexistplay || !e.isGroup || !AssociationApi.assUser.existAss('assGP', joinUID)) {
      return false
    }
    const assGP = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.assName == 0) {
      return false
    }
    const ass = GameApi.Listdata.controlAction({
      NAME: assGP.assName,
      CHOICE: 'association'
    })
    const find = ass.applyJoinList.findIndex((item) => item == joinUID)
    const mostMem = AssociationApi.assUser.numberMaximums[ass.level - 1] // 该宗门目前人数上限
    const nowMem = ass.allMembers.length // 该宗门目前人数
    if (mostMem <= nowMem) {
      e.reply(`弟子人数已经达到目前等级最大,无法加入`)
      return false
    }
    if (find == -1) {
      return false
    }
    const joinGP = GameApi.Listdata.controlAction({
      NAME: joinUID,
      CHOICE: 'assGP'
    })

    if (assGP.assJob >= 8) {
      const nowTime = new Date().getTime() // 获取当前时间戳
      const date = GameApi.Method.timeChange(nowTime)
      joinGP.assName = ass.id
      joinGP.assJob = 1
      joinGP.volunteerAss = 0
      joinGP.time = [date, nowTime]

      ass.allMembers.push(joinUID)
      ass.applyJoinList = ass.applyJoinList.filter((item) => item != joinUID)
      AssociationApi.assUser.setAssOrGP('association', ass.id, ass)
      AssociationApi.assUser.assEffCount(joinGP)
      e.reply(`已批准${joinUID}的入宗申请，恭喜你的宗门又招收到一位新弟子`)
      return false
    } else {
      e.reply(`你没有权限`)
      return false
    }
  }

  async denialApplication(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    const joinUID = e.msg.replace(/^(#|\/)驳回申请/, '')

    if (!ifexistplay || !e.isGroup || !AssociationApi.assUser.existAss('assGP', joinUID)) {
      return false
    }

    const assGP = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.assName == 0 || assGP.assJob < 8) {
      return false
    }

    const ass = GameApi.Listdata.controlAction({
      NAME: assGP.assName,
      CHOICE: 'association'
    })
    let find = ass.applyJoinList.findIndex((item) => item == joinUID)
    if (find == -1) {
      return false
    }

    const joinGP = GameApi.Listdata.controlAction({
      NAME: joinUID,
      CHOICE: 'assGP'
    })

    joinGP.volunteerAss = 0
    ass.applyJoinList = ass.applyJoinList.filter((item) => item != joinUID)
    AssociationApi.assUser.setAssOrGP('assGP', joinUID, joinGP)
    AssociationApi.assUser.setAssOrGP('association', ass.id, ass)
    e.reply(`已拒绝！`)
    return false
  }

  async showAllResume(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const assGP = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.assName == 0 || assGP.assJob < 8) {
      return false
    }
    let ass = GameApi.Listdata.controlAction({
      NAME: assGP.assName,
      CHOICE: 'association'
    })
    if (ass.applyJoinList.length == 0) {
      e.reply(`你的宗门还没有收到任何简历！！！快去招收弟子吧！`)
      return false
    }
    let temp = ['简历列表']

    for (var i = 0; i < ass.applyJoinList.length; i++) {
      temp.push(`序号:${1 + i} ` + '\n' + `申请人UID: ${ass.applyJoinList[i]}` + '\n')
    }
    BotApi.obtainingImages({ e, data: temp })
    return false
  }
}
