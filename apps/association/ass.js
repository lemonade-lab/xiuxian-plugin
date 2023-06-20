import { plugin, BotApi, GameApi, AssociationApi } from '../../model/api/index.js'
// 汐颜
export class Association extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)申请加入.*$/,
          fnc: 'JoinAssociation'
        },
        {
          reg: /^(#|\/)退出宗门$/,
          fnc: 'ExitAssociation'
        },
        {
          reg: /^(#|\/)宗门(上交|上缴|捐赠)灵石.*$/,
          fnc: 'giveAssociationMoney'
        },
        {
          reg: /^(#|\/)宗门俸禄$/,
          fnc: 'giftAssociation'
        },
        {
          reg: /^(#|\/)(宗门列表)$/,
          fnc: 'appointmentList'
        },
        {
          reg: /^(#|\/)我的宗门$/,
          fnc: 'showAssociation'
        }
      ]
    })
  }

  async showAssociation(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    // 宗门存档验证
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    console.log(ifexistplay)
    if (!ifexistplay) {
      return false
    }
    // 数据验证
    const assGP = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })

    console.log(assGP)
    if (assGP.assName == 0) {
      e.reply('已仙鹤')
      return false
    }
    const ass = GameApi.UserData.controlAction({
      NAME: assGP.assName,
      CHOICE: 'association'
    })
    console.log(ass)
    const assRelation = AssociationApi.assUser.assRelationList.find((item) => item.id == ass.id)
    if (!assRelation) {
      e.reply('宗门失效~')
      return
    }
    const msg = [`__[${assRelation.name}]__`]
    for (let item in ass.allMembers) {
      const UIDNum = ass.allMembers[item]
      const GP = GameApi.UserData.controlAction({
        NAME: UIDNum,
        CHOICE: 'playerLevel'
      })
      const assGPA = GameApi.UserData.controlAction({
        NAME: UIDNum,
        CHOICE: 'assGP'
      })
      msg.push(
        'UID:' +
          UIDNum +
          '\n' +
          '权限等级:' +
          assGPA.assJob +
          '\n' +
          '境界:' +
          GP.levelname +
          '\n' +
          '历史贡献值:' +
          assGPA.historyContribution
      )
    }
    const isreply = e.reply(
      await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } })
    )
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }

  // 宗门俸禄
  async giftAssociation(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const assGP = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.assName == 0) {
      return false
    }
    const ass = GameApi.UserData.controlAction({
      NAME: assGP.assName,
      CHOICE: 'association'
    })
    const nowTime = new Date().getTime() // 获取当前日期的时间戳
    const oldTime = assGP.time[1]
    const days = Math.trunc((nowTime - oldTime) / (24 * 60 * 60 * 1000))
    if (assGP.contributionPoints <= 0 || assGP.historyContribution < days) {
      e.reply(`你对宗门做成的贡献不足，没有领取俸禄的资格！！！`)
      return false
    }
    let Today = GameApi.Method.timeInvert(nowTime)
    let lastingTime = GameApi.Method.timeInvert(assGP.lastSignAss) // 获得上次宗门签到日期
    if (Today.Y == lastingTime.Y && Today.M == lastingTime.M && Today.D == lastingTime.D) {
      e.reply(`今日已经领取过了`)
      return false
    }
    if (ass.facility[4].status === 0) {
      e.reply(`聚灵阵破烂不堪，导致灵石池无法存取灵石，快去修建！`)
      return false
    }

    const giftNumber = ass.level * 100 * assGP.assJob
    if (ass.spiritStoneAns - giftNumber < 0) {
      e.reply(`宗门灵石池不够发放俸禄啦，快去为宗门做贡献吧`)
      return false
    }
    ass.spiritStoneAns -= giftNumber
    ass.facility[4].buildNum -= 1
    assGP.contributionPoints -= 1
    assGP.lastSignAss = nowTime
    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: Number(giftNumber)
    })
    AssociationApi.assUser.checkFacility(ass)
    AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
    e.reply([BotApi.segment.at(UID), `宗门俸禄领取成功,获得了${giftNumber}灵石`])
    return false
  }

  // 加入宗门
  async JoinAssociation(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const assGP = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.assName != 0 || assGP.volunteerAss != 0) {
      e.reply(`你已有宗门或已有意向宗门，请先清空志愿`)
      return false
    }

    let associationName = e.msg.replace(/^(#|\/)申请加入/, '')
    associationName = associationName.trim()
    const assRelation = AssociationApi.assUser.assRelationList.find(
      (item) => item.name == associationName
    )
    if (!assRelation) {
      return false
    }
    associationName = assRelation.id
    const ass = GameApi.UserData.controlAction({
      NAME: associationName,
      CHOICE: 'association'
    })
    const mostMem = AssociationApi.assUser.numberMaximums[ass.level - 1] // 该宗门目前人数上限
    const nowMem = ass.allMembers.length // 该宗门目前人数
    if (mostMem <= nowMem) {
      e.reply(`${assRelation.name}的弟子人数已经达到目前等级最大,无法加入`)
      return false
    }
    assGP.volunteerAss = associationName
    ass.applyJoinList.push(UID)
    AssociationApi.assUser.setAssOrGP('association', associationName, ass)
    AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
    e.reply(`已成功发出申请！`)
    return false
  }

  // 退出宗门
  async ExitAssociation(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const assGP = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.assName == 0) {
      return false
    }
    const nowTime = new Date().getTime() // 获取当前时间戳
    const time = 24 // 分钟
    const addTime = assGP.time[1] + 60000 * time
    if (addTime > nowTime) {
      e.reply('加入宗门不满' + `${time}小时,无法退出`)
      return false
    }
    const ass = GameApi.UserData.controlAction({
      NAME: assGP.assName,
      CHOICE: 'association'
    })
    if (assGP.assJob < 10) {
      ass.allMembers = ass.allMembers.filter((item) => item != assGP.qqNumber) // 原来的职位表删掉这个B
      assGP.assName = 0
      assGP.assJob = 0
      assGP.favorability = 0
      AssociationApi.assUser.setAssOrGP('association', ass.id, ass) // 记录到存档
      AssociationApi.assUser.assEffCount(assGP)
      e.reply('退出宗门成功')
    } else {
      if (ass.allMembers.length < 2) {
        AssociationApi.assUser.deleteAss('association', assGP.assName)// 删除宗门
        AssociationApi.assUser.deleteAss('assTreasureVault', assGP.assName)// 删除藏宝阁
        assGP.assName = 0
        assGP.assJob = 0
        assGP.favorability = 0
        AssociationApi.assUser.assEffCount(assGP)
        e.reply('退出宗门成功,退出后宗门空无一人,自动解散')
      } else {
        ass.allMembers = ass.allMembers.filter((item) => item != assGP.qqNumber)
        assGP.assName = 0
        assGP.assJob = 0
        assGP.favorability = 0
        AssociationApi.assUser.assEffCount(assGP)

        let randMember = { assJob: 0 }
        for (let item in ass.allMembers) {
          const UIDNum = ass.allMembers[item]
          const assGPA = GameApi.UserData.controlAction({
            NAME: UIDNum,
            CHOICE: 'assGP'
          })
          if (assGPA.assJob > randMember.assJob) {
            randMember = assGPA
          }
        }
        ass.master = randMember.qqNumber
        randMember.assJob = 10
        AssociationApi.assUser.setAssOrGP('association', ass.id, ass) // 记录到存档
        AssociationApi.assUser.assEffCount(randMember)
        e.reply(`退出宗门成功,退出后,宗主职位由[${randMember.qqNumber}]接管`)
      }
    }
    return false
  }

  // 捐赠灵石
  async giveAssociationMoney(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const assGP = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.assName == 0) {
      return false
    }

    let reg = /#宗门(上交|上缴|捐赠)灵石/
    let lingshi = e.msg.replace(reg, '')
    lingshi = GameApi.Method.numberVerify(lingshi)

    let money = GameApi.Bag.searchBagByName({
      UID,
      name: '下品灵石'
    })
    if (!money) {
      e.reply(`你身上一分钱都没有！！！`)
      return false
    } else if (money.acount < lingshi) {
      e.reply(`你身上只有${money.acount}灵石,数量不足`)
      return false
    }

    const ass = GameApi.UserData.controlAction({
      NAME: assGP.assName,
      CHOICE: 'association'
    })
    const assRelation = AssociationApi.assUser.assRelationList.find(
      (item) => item.id == assGP.assName
    )
    if (ass.spiritStoneAns + lingshi > AssociationApi.assUser.spiritStoneAnsMax[ass.level - 1]) {
      e.reply(
        `${assRelation.name}的灵石池最多还能容纳${
          AssociationApi.assUser.spiritStoneAnsMax[ass.level - 1] - ass.spiritStoneAns
        }灵石,请重新捐赠`
      )
      return false
    }
    ass.spiritStoneAns += lingshi
    assGP.contributionPoints += Math.trunc(lingshi / 1000)
    assGP.historyContribution += Math.trunc(lingshi / 1000)
    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: Number(-lingshi)
    })
    AssociationApi.assUser.setAssOrGP('association', ass.id, ass)
    AssociationApi.assUser.setAssOrGP('assGP', assGP.qqNumber, assGP)
    e.reply(
      `捐赠成功,你身上还有${money.acount - lingshi}灵石,宗门灵石池目前有${ass.spiritStoneAns}灵石`
    )
    return false
  }

  // 宗门列表
  async appointmentList(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const allNames = AssociationApi.assUser.readAssNames('association')
    let temp = ['宗门列表']
    if (allNames.length == 0) {
      temp.push('暂时没有宗门数据')
    }
    for (let i = 0; i < allNames.length; i++) {
      const theName = allNames[i].replace('.json', '')
      const assRelation = AssociationApi.assUser.assRelationList.find((item) => item.id == theName)
      const thisAss = GameApi.UserData.controlAction({
        NAME: theName,
        CHOICE: 'association'
      })
      let theAssXiuxian = 0
      if (thisAss.resident.name == 0) {
        theAssXiuxian = '无驻地'
      } else {
        theAssXiuxian = thisAss.resident.name
      }
      const BeastList = ['无神兽', '麒麟', '青龙', '白虎', '朱雀', '玄武']
      let thisAssBeast = BeastList[Number(thisAss.divineBeast)]
      temp.push(
        `序号:${1 + i} ` +
          '\n' +
          `宗名: ${assRelation.name}` +
          '\n' +
          `人数: ${thisAss.allMembers.length}/${
            AssociationApi.assUser.numberMaximums[thisAss.level - 1]
          }` +
          '\n' +
          `等级: ${thisAss.level}` +
          '\n' +
          `宗门驻地: ${theAssXiuxian}` +
          '\n' +
          `宗主: ${thisAss.master}` +
          '\n' +
          `宗门神兽: ${thisAssBeast}`
      )
    }
    BotApi.obtainingImages({ e, data: temp })
    return false
  }
}
