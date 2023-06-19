import { plugin, BotApi, GameApi, AssociationApi } from '../../model/api/index.js'
// 汐颜
export class AssociationJoin extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)查看简历.*$/,
          fnc: 'View_Resume'
        },
        {
          reg: /^(#|\/)批准录取.*$/,
          fnc: 'Approval_Admission'
        },
        {
          reg: /^(#|\/)驳回申请.*$/,
          fnc: 'Denial_Application'
        },
        {
          reg: /^(#|\/)清空志愿$/,
          fnc: 'Clear_Volunteer'
        },
        {
          reg: /^(#|\/)展示所有简历$/,
          fnc: 'Show_All_Resume'
        }
      ]
    })
  }

  async View_Resume(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    const joinQQ = e.msg.replace(/^(#|\/)查看简历/, '')
    const assGP = AssociationApi.assUser.getAssOrGP(1, UID)
    if (assGP.assName == 0) {
      return false
    }
    const joinGP = GameApi.UserData.controlAction({
      NAME: joinQQ,
      CHOICE: 'user_level'
    })
    const ass = AssociationApi.assUser.getAssOrGP(2, assGP.assName)
    const find = ass.applyJoinList.findIndex((item) => item == joinQQ)
    if (find == -1) {
      return false
    }

    if (assGP.assJob < 8) {
      e.reply(`权限不足`)
      return false
    }

    let msg =
      `qq号:${joinQQ} \n` +
      `练气境界: ${joinGP.levelname}\n` +
      `炼体境界: ${joinGP.levelnamemax}` +
      '\n'
    e.reply(msg)
    return false
  }

  async Clear_Volunteer(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }
    const assGP = AssociationApi.assUser.getAssOrGP(1, UID)

    if (assGP.volunteerAss == undefined) {
      assGP.volunteerAss = 0
      AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
      return false
    }

    if (assGP.volunteerAss == 0) {
      return false
    }
    const ass = AssociationApi.assUser.getAssOrGP(2, assGP.volunteerAss)
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

  async Approval_Admission(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    const joinQQ = e.msg.replace(/^(#|\/)批准录取/, '')
    if (!ifexistplay || !e.isGroup || !AssociationApi.assUser.existAss('assGP', joinQQ)) {
      return false
    }
    const assGP = AssociationApi.assUser.getAssOrGP(1, UID)
    if (assGP.assName == 0) {
      return false
    }
    const ass = AssociationApi.assUser.getAssOrGP(2, assGP.assName)
    const find = ass.applyJoinList.findIndex((item) => item == joinQQ)
    const mostMem = AssociationApi.Config.numberMaximums[ass.level - 1] // 该宗门目前人数上限
    const nowMem = ass.allMembers.length // 该宗门目前人数
    if (mostMem <= nowMem) {
      e.reply(`弟子人数已经达到目前等级最大,无法加入`)
      return false
    }
    if (find == -1) {
      return false
    }
    const joinGP = AssociationApi.assUser.getAssOrGP(1, joinQQ)

    if (assGP.assJob >= 8) {
      const now = new Date().getTime()
      const nowTime = now.getTime() // 获取当前时间戳
      const date = AssociationApi.assUser.timeChange(nowTime)
      joinGP.assName = ass.id
      joinGP.assJob = 1
      joinGP.volunteerAss = 0
      joinGP.time = [date, nowTime]

      ass.allMembers.push(joinQQ)
      ass.applyJoinList = ass.applyJoinList.filter((item) => item != joinQQ)
      AssociationApi.assUser.setAssOrGP('association', ass.id, ass)
      AssociationApi.assUser.assEffCount(joinGP)
      e.reply(`已批准${joinQQ}的入宗申请，恭喜你的宗门又招收到一位新弟子`)
      return false
    } else {
      e.reply(`你没有权限`)
      return false
    }
  }

  async Denial_Application(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    const joinQQ = e.msg.replace(/^(#|\/)驳回申请/, '')

    if (!ifexistplay || !e.isGroup || !AssociationApi.assUser.existAss('assGP', joinQQ)) {
      return false
    }

    const assGP = AssociationApi.assUser.getAssOrGP(1, UID)
    if (assGP.assName == 0 || assGP.assJob < 8) {
      return false
    }

    const ass = AssociationApi.assUser.getAssOrGP(2, assGP.assName)
    let find = ass.applyJoinList.findIndex((item) => item == joinQQ)
    if (find == -1) {
      return false
    }

    const joinGP = AssociationApi.assUser.getAssOrGP(1, joinQQ)

    joinGP.volunteerAss = 0
    ass.applyJoinList = ass.applyJoinList.filter((item) => item != joinQQ)
    AssociationApi.assUser.setAssOrGP('assGP', joinQQ, joinGP)
    AssociationApi.assUser.setAssOrGP('association', ass.id, ass)
    e.reply(`已拒绝！`)
    return false
  }

  async Show_All_Resume(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }
    const assGP = AssociationApi.assUser.getAssOrGP(1, UID)
    if (assGP.assName == 0 || assGP.assJob < 8) {
      return false
    }
    let ass = AssociationApi.assUser.getAssOrGP(2, assGP.assName)
    if (ass.applyJoinList.length == 0) {
      e.reply(`你的宗门还没有收到任何简历！！！快去招收弟子吧！`)
      return false
    }
    let temp = ['简历列表']

    for (var i = 0; i < ass.applyJoinList.length; i++) {
      temp.push(`序号:${1 + i} ` + '\n' + `申请人QQ: ${ass.applyJoinList[i]}` + '\n')
    }
    BotApi.obtainingImages({ e, data: temp })
    return false
  }
}
