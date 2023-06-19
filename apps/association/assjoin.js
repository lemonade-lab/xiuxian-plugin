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
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return false
    }
    const joinPlayer = GameApi.Player.userMsgAction({
      NAME: joinQQ,
      CHOICE: 'user_level'
    })
    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)
    const find = ass.applyJoinList.findIndex((item) => item == joinQQ)
    if (find == -1) {
      return false
    }

    if (assPlayer.assJob < 8) {
      e.reply(`权限不足`)
      return false
    }

    let msg =
      `qq号:${joinQQ} \n` +
      `练气境界: ${joinPlayer.levelname}\n` +
      `炼体境界: ${joinPlayer.levelnamemax}` +
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
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)

    if (assPlayer.volunteerAss == undefined) {
      assPlayer.volunteerAss = 0
      AssociationApi.assUser.setAssOrPlayer('assPlayer', UID, assPlayer)
      return false
    }

    if (assPlayer.volunteerAss == 0) {
      return false
    }
    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.volunteerAss)
    if (!ass) {
      assPlayer.volunteerAss = 0
      AssociationApi.assUser.setAssOrPlayer('assPlayer', UID, assPlayer)
      e.reply(`清除成功！`)
      return false
    } else {
      assPlayer.volunteerAss = 0
      ass.applyJoinList = ass.applyJoinList.filter((item) => item != UID)
      AssociationApi.assUser.setAssOrPlayer('assPlayer', UID, assPlayer)
      AssociationApi.assUser.setAssOrPlayer('association', ass.id, ass)
      e.reply(`清除成功！`)
      return false
    }
  }

  async Approval_Admission(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    const joinQQ = e.msg.replace(/^(#|\/)批准录取/, '')
    if (!ifexistplay || !e.isGroup || !AssociationApi.assUser.existAss('assPlayer', joinQQ)) {
      return false
    }
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return false
    }
    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)
    const find = ass.applyJoinList.findIndex((item) => item == joinQQ)
    const mostMem = AssociationApi.config.numberMaximums[ass.level - 1] // 该宗门目前人数上限
    const nowMem = ass.allMembers.length // 该宗门目前人数
    if (mostMem <= nowMem) {
      e.reply(`弟子人数已经达到目前等级最大,无法加入`)
      return false
    }
    if (find == -1) {
      return false
    }
    const joinPlayer = AssociationApi.assUser.getAssOrPlayer(1, joinQQ)

    if (assPlayer.assJob >= 8) {
      const now = new Date().getTime()
      const nowTime = now.getTime() // 获取当前时间戳
      const date = AssociationApi.assUser.timeChange(nowTime)
      joinPlayer.assName = ass.id
      joinPlayer.assJob = 1
      joinPlayer.volunteerAss = 0
      joinPlayer.time = [date, nowTime]

      ass.allMembers.push(joinQQ)
      ass.applyJoinList = ass.applyJoinList.filter((item) => item != joinQQ)
      AssociationApi.assUser.setAssOrPlayer('association', ass.id, ass)
      AssociationApi.assUser.assEffCount(joinPlayer)
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

    if (!ifexistplay || !e.isGroup || !AssociationApi.assUser.existAss('assPlayer', joinQQ)) {
      return false
    }

    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0 || assPlayer.assJob < 8) {
      return false
    }

    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)
    let find = ass.applyJoinList.findIndex((item) => item == joinQQ)
    if (find == -1) {
      return false
    }

    const joinPlayer = AssociationApi.assUser.getAssOrPlayer(1, joinQQ)

    joinPlayer.volunteerAss = 0
    ass.applyJoinList = ass.applyJoinList.filter((item) => item != joinQQ)
    AssociationApi.assUser.setAssOrPlayer('assPlayer', joinQQ, joinPlayer)
    AssociationApi.assUser.setAssOrPlayer('association', ass.id, ass)
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
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0 || assPlayer.assJob < 8) {
      return false
    }
    let ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)
    if (ass.applyJoinList.length == 0) {
      e.reply(`你的宗门还没有收到任何简历！！！快去招收弟子吧！`)
      return false
    }
    let temp = ['简历列表']

    for (var i = 0; i < ass.applyJoinList.length; i++) {
      temp.push(`序号:${1 + i} ` + '\n' + `申请人QQ: ${ass.applyJoinList[i]}` + '\n')
    }
    BotApi.Robot.forwardMsg({ e, data: temp })
    return false
  }
}
