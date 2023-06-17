import { plugin, BotApi, GameApi, AssociationApi } from '../../model/api/gameapi.js'
//汐颜
export class Association extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)申请加入.*$/,
          fnc: 'Join_association'
        },
        {
          reg: /^(#|\/)退出宗门$/,
          fnc: 'Exit_association'
        },
        {
          reg: /^(#|\/)宗门(上交|上缴|捐赠)灵石.*$/,
          fnc: 'give_association_lingshi'
        },
        {
          reg: /^(#|\/)宗门俸禄$/,
          fnc: 'gift_association'
        },
        {
          reg: /^(#|\/)(宗门列表)$/,
          fnc: 'List_appointment'
        },
        {
          reg: /^(#|\/)我的宗门$/,
          fnc: 'show_association'
        }
      ]
    })
  }

  async show_association(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return
    }
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return
    }
    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)
    const assRelation = AssociationApi.assUser.assRelationList.find((item) => item.id == ass.id)
    const msg = [`__[${assRelation.name}]__`]
    for (let item in ass.allMembers) {
      const qqNum = ass.allMembers[item]
      const player = await GameApi.GameUser.userMsgAction({
        NAME: qqNum,
        CHOICE: 'user_level'
      })
      const assPlayerA = AssociationApi.assUser.getAssOrPlayer(1, qqNum)
      msg.push(
        'QQ:' +
          qqNum +
          '\n' +
          '权限等级:' +
          assPlayerA.assJob +
          '\n' +
          '境界:' +
          player.levelname +
          '\n' +
          '历史贡献值:' +
          assPlayerA.historyContribution
      )
    }
    await BotApi.User.forwardMsg({ e, data: msg })
    return
  }

  //宗门俸禄
  async gift_association(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return
    }
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return
    }
    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)
    const nowTime = new Date().getTime() //获取当前日期的时间戳
    const oldTime = assPlayer.time[1]
    const days = Math.trunc((nowTime - oldTime) / (24 * 60 * 60 * 1000))
    if (assPlayer.contributionPoints <= 0 || assPlayer.historyContribution < days) {
      e.reply(`你对宗门做成的贡献不足，没有领取俸禄的资格！！！`)
      return
    }
    let Today = await AssociationApi.assUser.timeInvert(nowTime)
    let lasting_time = await AssociationApi.assUser.timeInvert(assPlayer.lastSignAss) //获得上次宗门签到日期
    if (Today.Y == lasting_time.Y && Today.M == lasting_time.M && Today.D == lasting_time.D) {
      e.reply(`今日已经领取过了`)
      return
    }
    if (ass.facility[4].status === 0) {
      e.reply(`聚灵阵破烂不堪，导致灵石池无法存取灵石，快去修建！`)
      return
    }

    const giftNumber = ass.level * 100 * assPlayer.assJob
    if (ass.spiritStoneAns - giftNumber < 0) {
      e.reply(`宗门灵石池不够发放俸禄啦，快去为宗门做贡献吧`)
      return
    }
    ass.spiritStoneAns -= giftNumber
    ass.facility[4].buildNum -= 1
    assPlayer.contributionPoints -= 1
    assPlayer.lastSignAss = nowTime
    await GameApi.GameUser.userBag({
      UID: UID,
      name: '下品灵石',
      ACCOUNT: Number(giftNumber)
    })
    await AssociationApi.assUser.checkFacility(ass)
    await AssociationApi.assUser.setAssOrPlayer('assPlayer', UID, assPlayer)
    e.reply([BotApi.segment.at(UID), `宗门俸禄领取成功,获得了${giftNumber}灵石`])
    return
  }

  //加入宗门
  async Join_association(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return
    }
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName != 0 || assPlayer.volunteerAss != 0) {
      e.reply(`你已有宗门或已有意向宗门，请先清空志愿`)
      return
    }

    let association_name = e.msg.replace('#申请加入', '')
    association_name = association_name.trim()
    const assRelation = AssociationApi.assUser.assRelationList.find(
      (item) => item.name == association_name
    )
    if (!assRelation) {
      return
    }
    association_name = assRelation.id
    const ass = AssociationApi.assUser.getAssOrPlayer(2, association_name)
    const mostMem = AssociationApi.config.numberMaximums[ass.level - 1] //该宗门目前人数上限
    const nowMem = ass.allMembers.length //该宗门目前人数
    if (mostMem <= nowMem) {
      e.reply(`${assRelation.name}的弟子人数已经达到目前等级最大,无法加入`)
      return
    }
    assPlayer.volunteerAss = association_name
    ass.applyJoinList.push(UID)
    await AssociationApi.assUser.setAssOrPlayer('association', association_name, ass)
    await AssociationApi.assUser.setAssOrPlayer('assPlayer', UID, assPlayer)
    e.reply(`已成功发出申请！`)
    return
  }

  //退出宗门
  async Exit_association(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return
    }
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return
    }
    const nowTime = new Date().getTime() //获取当前时间戳
    const time = 24 //分钟
    const addTime = assPlayer.time[1] + 60000 * time
    if (addTime > nowTime) {
      e.reply('加入宗门不满' + `${time}小时,无法退出`)
      return
    }
    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)
    if (assPlayer.assJob < 10) {
      ass.allMembers = ass.allMembers.filter((item) => item != assPlayer.qqNumber) //原来的职位表删掉这个B
      assPlayer.assName = 0
      assPlayer.assJob = 0
      assPlayer.favorability = 0
      await AssociationApi.assUser.setAssOrPlayer('association', ass.id, ass) //记录到存档
      await AssociationApi.assUser.assEffCount(assPlayer)
      e.reply('退出宗门成功')
    } else {
      if (ass.allMembers.length < 2) {
        await AssociationApi.assUser.deleteAss('association', assPlayer.assName)
        assPlayer.assName = 0
        assPlayer.assJob = 0
        assPlayer.favorability = 0
        await AssociationApi.assUser.assEffCount(assPlayer)
        e.reply('退出宗门成功,退出后宗门空无一人,自动解散')
      } else {
        ass.allMembers = ass.allMembers.filter((item) => item != assPlayer.qqNumber)
        assPlayer.assName = 0
        assPlayer.assJob = 0
        assPlayer.favorability = 0
        await AssociationApi.assUser.assEffCount(assPlayer)

        let randMember = { assJob: 0 }
        for (let item in ass.allMembers) {
          const qqNum = ass.allMembers[item]
          const assPlayerA = AssociationApi.assUser.getAssOrPlayer(1, qqNum)
          if (assPlayerA.assJob > randMember.assJob) {
            randMember = assPlayerA
          }
        }
        ass.master = randMember.qqNumber
        randMember.assJob = 10
        await AssociationApi.assUser.setAssOrPlayer('association', ass.id, ass) //记录到存档
        await AssociationApi.assUser.assEffCount(randMember)
        e.reply(`退出宗门成功,退出后,宗主职位由[${randMember.qqNumber}]接管`)
      }
    }
    return
  }

  //捐赠灵石
  async give_association_lingshi(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return
    }
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return
    }

    let reg = new RegExp(/#宗门(上交|上缴|捐赠)灵石/)
    let lingshi = e.msg.replace(reg, '')
    lingshi = await AssociationApi.assUser.numberVerify(lingshi)

    let money = await GameApi.GameUser.userBagSearch({
      UID: UID,
      name: '下品灵石'
    })
    if (!money) {
      e.reply(`你身上一分钱都没有！！！`)
      return
    } else if (money.acount < lingshi) {
      e.reply(`你身上只有${money.acount}灵石,数量不足`)
      return
    }

    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)
    const assRelation = AssociationApi.assUser.assRelationList.find(
      (item) => item.id == assPlayer.assName
    )
    if (ass.spiritStoneAns + lingshi > AssociationApi.config.spiritStoneAnsMax[ass.level - 1]) {
      e.reply(
        `${assRelation.name}的灵石池最多还能容纳${
          AssociationApi.config.spiritStoneAnsMax[ass.level - 1] - ass.spiritStoneAns
        }灵石,请重新捐赠`
      )
      return
    }
    ass.spiritStoneAns += lingshi
    assPlayer.contributionPoints += Math.trunc(lingshi / 1000)
    assPlayer.historyContribution += Math.trunc(lingshi / 1000)
    await GameApi.GameUser.userBag({
      UID: UID,
      name: '下品灵石',
      ACCOUNT: Number(-lingshi)
    })
    await AssociationApi.assUser.setAssOrPlayer('association', ass.id, ass)
    await AssociationApi.assUser.setAssOrPlayer('assPlayer', assPlayer.qqNumber, assPlayer)
    e.reply(
      `捐赠成功,你身上还有${money.acount - lingshi}灵石,宗门灵石池目前有${ass.spiritStoneAns}灵石`
    )
    return
  }

  //宗门列表
  async List_appointment(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return
    }
    const allNames = await AssociationApi.assUser.readAssNames('association')
    let temp = ['宗门列表']
    if (allNames.length == 0) {
      temp.push('暂时没有宗门数据')
    }
    for (let i = 0; i < allNames.length; i++) {
      const this_name = allNames[i].replace('.json', '')
      const assRelation = AssociationApi.assUser.assRelationList.find(
        (item) => item.id == this_name
      )
      const this_ass = await AssociationApi.assUser.getAssOrPlayer(2, this_name)
      let this_ass_xiuxian = 0
      if (this_ass.resident.name == 0) {
        this_ass_xiuxian = '无驻地'
      } else {
        this_ass_xiuxian = this_ass.resident.name
      }
      const BeastList = ['无神兽', '麒麟', '青龙', '白虎', '朱雀', '玄武']
      let this_ass_beast = BeastList[Number(this_ass.divineBeast)]
      temp.push(
        `序号:${1 + i} ` +
          '\n' +
          `宗名: ${assRelation.name}` +
          '\n' +
          `人数: ${this_ass.allMembers.length}/${
            AssociationApi.config.numberMaximums[this_ass.level - 1]
          }` +
          '\n' +
          `等级: ${this_ass.level}` +
          '\n' +
          `宗门驻地: ${this_ass_xiuxian}` +
          '\n' +
          `宗主: ${this_ass.master}` +
          '\n' +
          `宗门神兽: ${this_ass_beast}`
      )
    }
    await BotApi.User.forwardMsg({ e, data: temp })
    return
  }
}
