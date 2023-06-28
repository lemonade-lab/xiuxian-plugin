import { plugin, BotApi, GameApi, AssociationApi } from '#xiuxian-api'
// 汐颜
export class AssociationJoin extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)查看.*$/,
          fnc: 'viewResume'
        },
        {
          reg: /^(#|\/)招收.*$/,
          fnc: 'approvalAdmission'
        },
        {
          reg: /^(#|\/)驳回招收.*$/,
          fnc: 'denialApplication'
        },
        {
          reg: /^(#|\/)清空招收$/,
          fnc: 'clearVolunteer'
        },
        {
          reg: /^(#|\/)门派招收$/,
          fnc: 'showAllResume'
        }
      ]
    })
  }

  async viewResume(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    const joinUID = e.cmd_msg.replace(/^(#|\/)查看/, '')
    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.AID == 0) {
      e.reply('一介散修')
      return false
    }
    if (assGP.assJob < 8) {
      e.reply(`权限不足`)
      return false
    }
    const LevelData = GameApi.Data.controlAction({
      NAME: joinUID,
      CHOICE: 'playerLevel'
    })
    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    const find = ass.applyJoinList.findIndex((item) => item == joinUID)
    if (find == -1) {
      return false
    }

    let msg =
      `UID号:${joinUID} \n` +
      `练气境界: ${LevelData.gaspractice.realm}\n` +
      `炼体境界: ${LevelData.bodypractice.realm}` +
      '\n'
    e.reply(msg)
    return false
  }

  async clearVolunteer(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const assGP = GameApi.Data.controlAction({
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
    const ass = GameApi.Data.controlAction({
      NAME: assGP.volunteerAss,
      CHOICE: 'assOciation'
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
      AssociationApi.assUser.setAssOrGP('assOciation', ass.id, ass)
      e.reply(`清除成功！`)
      return false
    }
  }

  async approvalAdmission(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    const joinUID = e.cmd_msg.replace(/^(#|\/)招收/, '')
    if (!ifexistplay || !AssociationApi.assUser.existAss('assGP', joinUID)) {
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
    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    const find = ass.applyJoinList.findIndex((item) => item == joinUID)
    const mostMem = AssociationApi.assUser.numberMaximums[ass.level - 1] // 该门派目前人数上限
    const nowMem = ass.allMembers.length // 该门派目前人数
    if (mostMem <= nowMem) {
      e.reply(`弟子人数已达上限`)
      return false
    }
    if (find == -1) {
      return false
    }
    const joinGP = GameApi.Data.controlAction({
      NAME: joinUID,
      CHOICE: 'assGP'
    })

    if (assGP.assJob >= 8) {
      const nowTime = new Date().getTime() // 获取当前时间戳
      const date = GameApi.Method.timeChange(nowTime)
      joinGP.AID = ass.id
      joinGP.assJob = 1
      joinGP.volunteerAss = 0
      joinGP.time = [date, nowTime]

      ass.allMembers.push(joinUID)
      ass.applyJoinList = ass.applyJoinList.filter((item) => item != joinUID)
      AssociationApi.assUser.setAssOrGP('assOciation', ass.id, ass)
      AssociationApi.assUser.assUpdataEfficiency(joinGP)
      e.reply(`门派成功招收到一位新弟子${joinUID}`)
      return false
    } else {
      e.reply(`你没有权限`)
      return false
    }
  }

  async denialApplication(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    const joinUID = e.cmd_msg.replace(/^(#|\/)驳回招收/, '')

    if (!ifexistplay || !e.isGroup || !AssociationApi.assUser.existAss('assGP', joinUID)) {
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
    if (assGP.assJob < 8) {
      e.reply('取消不足')
      return false
    }

    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    let find = ass.applyJoinList.findIndex((item) => item == joinUID)
    if (find == -1) {
      return false
    }

    const joinGP = GameApi.Data.controlAction({
      NAME: joinUID,
      CHOICE: 'assGP'
    })

    joinGP.volunteerAss = 0
    ass.applyJoinList = ass.applyJoinList.filter((item) => item != joinUID)
    AssociationApi.assUser.setAssOrGP('assGP', joinUID, joinGP)
    AssociationApi.assUser.setAssOrGP('assOciation', ass.id, ass)
    e.reply(`已拒绝！`)
    return false
  }

  async showAllResume(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
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
    if (assGP.assJob < 8) {
      console.log('权限不足')
      return false
    }
    let AssData = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    if (AssData.applyJoinList.length == 0) {
      e.reply(`未有待招收弟子,快去提升门派知名度吧！`)
      return false
    }
    let temp = ['_[待招收列表]_']
    let i = 0
    for (let item of AssData.applyJoinList) {
      i++
      temp.push(`ID:${i}  UID: ${item}`)
    }
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg: temp } }))
    return false
  }
}
