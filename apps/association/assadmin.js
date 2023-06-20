import { plugin, GameApi, AssociationApi } from '../../model/api/index.js'
// 汐颜
export class AssociationAdmin extends plugin {
  constructor() {
    super({
      name: 'AssociationAdmin',
      rule: [
        {
          reg: /^(#|\/)开宗立派.*$/,
          fnc: 'createAssociation'
        },
        {
          reg: /^(#|\/)(升级宗门|宗门升级)$/,
          fnc: 'lvupAssociation'
        },
        {
          reg: /^(#|\/)提拔.*$/,
          fnc: 'setAppointment'
        },
        {
          reg: /^(#|\/)逐出门派.*$/,
          fnc: 'deleteUserAssociation'
        },
        {
          reg: /^(#|\/)宗门改名.*$/,
          fnc: 'renameAssociation'
        }
      ]
    })
  }

  /**
   * 开宗立派
   * @param {*} e
   * @returns
   */
  async createAssociation(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    if (!AssociationApi.assUser.existAss('assGP', UID)) {
      return false
    }
    const assGP = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.AID != 0 || assGP.volunteerAss != 0) {
      e.reply(`你已有宗门或已有意向宗门，请先清空志愿`)
      return false
    }
    let money = GameApi.Bag.searchBagByName({ UID, name: '下品灵石' })
    if (!money || money.acount < 10000) {
      e.reply('开宗立派是需要本钱的,攒到[下品灵石]*10000再来吧')
      return false
    }
    let najieThingB = GameApi.Bag.searchBagByName({
      UID,
      name: '中等宗门令牌'
    })
    let najieThingA = GameApi.Bag.searchBagByName({
      UID,
      name: '下等宗门令牌'
    })
    // 两种令牌都不存在
    if (!najieThingA && !najieThingB) {
      e.reply('请先找(下等/中等)宗门令牌,以广招门徒~')
      return false
    }

    let AID = []
    if (najieThingB) {
      if (!AssociationApi.assUser.existAss('association', 'Ass000001')) {
        AID.push('Ass000001')
      }
      if (!AssociationApi.assUser.existAss('association', 'Ass000002')) {
        AID.push('Ass000002')
      }
      if (!AssociationApi.assUser.existAss('association', 'Ass000003')) {
        AID.push('Ass000003')
      }
      if (!AssociationApi.assUser.existAss('association', 'Ass000004')) {
        AID.push('Ass000004')
      }
    }

    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: -10000
    })

    // 可以建立隐藏宗门
    if (najieThingB && AID.length != 0) {
      GameApi.Bag.addBagThing({
        UID,
        name: najieThingB.name,
        ACCOUNT: -1
      })
      const nowTime = new Date().getTime() // 获取当前时间戳
      const date = GameApi.Method.timeChange(nowTime)

      // 随机数 1-4
      const location = Math.floor(Math.random() * AID.length)

      // 初始化宗门数据
      const AssData = getAss(AID[location], date, nowTime, UID, 4, 100000)

      // 玩家存档
      let assGP = GameApi.Listdata.controlAction({
        NMAE: UID,
        CHOICE: 'assGP'
      })
      assGP.AID = AID[location].id
      assGP.assJob10 = 10
      assGP.contributionPoints = 0
      assGP.historyContribution = 0
      assGP.favorability = 0
      assGP.volunteerAss = 0
      assGP.time = [date, nowTime]
      // 更新玩家天赋,并写入存档
      AssociationApi.assUser.assUpdataEfficiency(assGP)

      // ??
      AssociationApi.assUser.setAssOrGP('association', AID[location], AssData)
      // 普通宗门的
      let assthing = GameApi.Listdata.controlAction({
        NAME: 'BaseTreasureVault',
        CHOICE: 'assRelate'
      })
      // 隐藏宗门的
      let assthin = GameApi.Listdata.controlAction({
        NAME: AID[location],
        CHOICE: 'assassTreasu'
      })
      for (let i = 0; i < assthin.length; i++) {
        assthing[i].push.apply(assthin[i])
      }
      // 存储藏宝阁
      AssociationApi.assUser.setAssOrGP('assTreasure', AID[location], assthing)
      // 宗门名称表
      let assRelation = AssociationApi.assUser.assRelationList.find(
        (item) => item.id == AID[location]
      )
      e.reply(`成功找到${assRelation.name}遗址,建立了传承宗门${assRelation.name}`)
      return false
    }

    //  中等令牌的特权失效了
    if (najieThingA || najieThingB) {
      // 隐藏宗门没了，只能创建普通宗门，判断有无低级令牌
      if (najieThingA) {
        GameApi.Bag.addBagThing({
          UID,
          name: najieThingA.name,
          ACCOUNT: -1
        })
      } else if (najieThingB) {
        GameApi.Bag.addBagThing({
          UID,
          name: najieThingB.name,
          ACCOUNT: -1
        })
      }
      /** 设置上下文 */
      this.setContext('setAssociationName')
      /** 回复 */
      e.reply('请发送宗门的名字,后续可使用#宗门改名xxx进行修改(宗门名字最多6个中文字符)', false, {
        at: true
      })
      return false
    }
  }

  /** 获取宗门名称 */
  async setAssociationName(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const theMsg = this.e.message
    if (theMsg[0].type != 'text') {
      this.setContext('setAssociationName')
      this.reply('非法宗门,请重新输入:')
      return false
    }
    const associationName = theMsg[0].text
    if (
      associationName.length < 2 ||
      associationName.length > 6 ||
      !/^[\u4e00-\u9fa5]+$/.test(associationName)
    ) {
      this.setContext('setAssociationName')
      this.reply('非法宗门,请重新输入:')
      return false
    }
    // 检查宗门名称表
    const assRelation = AssociationApi.assUser.assRelationList.find(
      (item) => item.name == associationName
    )
    if (assRelation) {
      this.setContext('setAssociationName')
      this.reply('非法宗门,请重新输入:')
      return false
    }
    const nowTime = new Date().getTime()
    const date = GameApi.Method.timeChange(nowTime)
    const assGP = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    let replace = null
    // 如果宗门列表等于 0
    if (AssociationApi.assUser.assRelationList.length == 0) {
      replace = 1
    } else {
      const id =
        AssociationApi.assUser.assRelationList[AssociationApi.assUser.assRelationList.length - 1].id
      replace = Number(id.replace('Ass00000', '')) + 1
    }
    const associationID = 'Ass00000' + replace

    let relationAll = AssociationApi.assUser.assRelationList
    relationAll.push({
      id: associationID, // 宗门文件名
      name: associationName, // 宗门名称
      unchartedName: associationID
    })
    AssociationApi.assUser.setAssOrGP('assRelation', 'AssRelation', relationAll)

    assGP.AID = associationID
    assGP.assJob10 = 10
    assGP.contributionPoints = 0
    assGP.historyContribution = 0
    assGP.favorability = 0
    assGP.volunteerAss = 0
    assGP.time = [date, nowTime]
    // 写入玩家宗门数据
    AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)

    theAssociation(associationID, UID)
    let read = GameApi.Listdata.controlAction({
      NAME: 'BaseTreasureVault',
      CHOICE: 'assRelate'
    })
    AssociationApi.assUser.setAssOrGP('assTreasure', associationID, read) // 存储藏宝阁
    AssociationApi.assUser.assUpdataEfficiency(assGP)
    this.reply('宗门创建成功')
    /** 结束上下文 */
    this.finish('setAssociationName')
  }

  // 升级宗门
  async lvupAssociation(e) {
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
    if (assGP.AID == 0 || assGP.assJob < 8) {
      return false
    }
    const ass = GameApi.Listdata.controlAction({
      NAME: assGP.AID,
      CHOICE: 'association'
    })
    if (ass.level == AssociationApi.assUser.numberMaximums.length) {
      return false
    }
    if (ass.spiritStoneAns < ass.level * 30000) {
      e.reply(
        `本宗门目前灵石池中仅有${ass.spiritStoneAns}灵石,当前宗门升级需要${
          ass.level * 30000
        }灵石,数量不足`
      )
      return false
    }

    let najieThingA = GameApi.Bag.searchBagByName({
      UID,
      name: '中等宗门令牌'
    })
    let najieThingB = GameApi.Bag.searchBagByName({
      UID,
      name: '上等宗门令牌'
    })

    if (ass.level == 3) {
      if (!najieThingA) {
        e.reply(`升级中等宗门需要对应令牌，快去获取吧`)
        return false
      }
      GameApi.Bag.addBagThing({
        UID,
        name: najieThingA.name,
        ACCOUNT: Number(-1)
      })
    }

    if (ass.level == 6) {
      if (!najieThingB) {
        e.reply(`升级上等宗门需要对应令牌，快去获取吧`)
        return false
      }
      GameApi.Bag.addBagThing({
        UID,
        name: najieThingB.name,
        ACCOUNT: Number(-1)
      })
    }

    ass.spiritStoneAns -= ass.level * 30000
    ass.level += 1
    AssociationApi.assUser.setAssOrGP('association', ass.id, ass)
    const GPList = ass.allMembers
    for (let GPID of GPList) {
      const UID = GPID
      if (AssociationApi.assUser.existAss('assGP', UID)) {
        const assOrGP = GameApi.Listdata.controlAction({
          NAME: UID,
          CHOICE: 'assGP'
        })
        AssociationApi.assUser.assUpdataEfficiency(assOrGP)
      }
    }
    e.reply(
      '宗门升级成功' +
        `当前宗门等级为${ass.level},宗门人数上限提高到:${
          AssociationApi.assUser.numberMaximums[ass.level - 1]
        }`
    )
    return false
  }

  // 任命职位
  async setAppointment(e) {
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
    if (assGP.AID == 0 || assGP.assJob < 10) {
      return false
    }
    let memberUID = e.msg.replace(/^(#|\/)提拔/, '')
    memberUID = memberUID.trim()
    if (UID == memberUID) {
      return false
    }
    const ass = GameApi.Listdata.controlAction({
      NAME: assGP.AID,
      CHOICE: 'association'
    })
    const isinass = ass.allMembers.find((item) => item == memberUID)
    if (!isinass) {
      return false
    }

    const member = GameApi.Listdata.controlAction({
      NAME: memberUID,
      CHOICE: 'assGP'
    }) // 获取这个B的存档
    if (member.assJob > 5) {
      e.reply(`他已经是内门弟子了，不能再提拔了`)
      return false
    }
    if (member.historyContribution < (member.assJob + 1) * 100) {
      e.reply(`他的资历太浅，贡献不足，贸然提拔也许不能服众`)
      return false
    }

    member.assJob += 1
    AssociationApi.assUser.assUpdataEfficiency(member)

    e.reply(`提拔成功！！！`)
    return false
  }

  async renameAssociation(e) {
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
    const ass = GameApi.Listdata.controlAction({
      NAME: assGP.AID,
      CHOICE: 'association'
    })
    if (assGP.AID == 0 || assGP.assJob < 10) {
      return false
    }
    if (AssociationApi.assUser.assRelationList.findIndex((item) => item.id == ass.id) <= 3) {
      e.reply(`请好好继承隐藏宗门的传承吧，就不要想着改名了!!!`)
      return false
    }
    let associationName = e.msg.replace(/^(#|\/)宗门改名/, '')
    associationName = associationName.trim()

    if (ass.spiritStoneAns < 10000) {
      e.reply(`宗门更名需要1w灵石,攒够钱再来吧`)
      return false
    }
    ass.spiritStoneAns -= 10000
    AssociationApi.assUser.setAssOrGP('association', ass.id, ass)
    AssociationApi.assUser.renameAssociation(ass.id, 1, associationName)
    e.reply(`改名成功，宗门当前名称为${associationName}`)
    return false
  }

  async deleteUserAssociation(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    const GPA = GameApi.Listdata.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (GPA.AID == 0 || GPA.assJob < 8) {
      return false
    }

    let menpai = e.msg.replace(/^(#|\/)/, '')
    menpai = menpai.replace('逐出门派', '')
    const memberUID = menpai
    if (UID == memberUID) {
      return false
    }
    const GPB = GameApi.Listdata.controlAction({
      NAME: memberUID,
      CHOICE: 'assGP'
    })
    if (GPB.AID == 0) {
      return false
    }
    const bss = GameApi.Listdata.controlAction({
      NAME: GPB.AID,
      CHOICE: 'association'
    })
    if (GPA.AID != GPB.AID) {
      return false
    }
    if (GPB.assJob >= 8) {
      e.reply(`无权进行此操作`)
      return false
    }
    bss.allMembers = bss.allMembers.filter((item) => item != memberUID)
    GPB.favorability = 0
    GPB.assJob = 0
    GPB.AID = 0
    AssociationApi.assUser.setAssOrGP('association', bss.id, bss)
    AssociationApi.assUser.assUpdataEfficiency(GPB)
    e.reply('已踢出！')
    return false
  }
}

const getAss = (name, date, nowTime, holderUID, level = 1, spiritStoneAns = 0) => {
  return {
    id: name,
    level,
    createTime: [date, nowTime],
    spiritStoneAns,
    resident: {
      id: 0,
      name: 0,
      level: 0
    },
    facility: [
      {
        buildNum: 0,
        status: 0,
        more2: 0,
        more3: 0
      },
      {
        buildNum: 0,
        status: 0,
        more2: 0,
        more3: 0
      },
      {
        buildNum: 0,
        status: 0,
        more2: 0,
        more3: 0
      },
      {
        buildNum: 0,
        status: 0,
        more2: 0,
        more3: 0
      },
      {
        buildNum: 0,
        status: 0,
        more2: 0,
        more3: 0
      },
      {
        buildNum: 0,
        status: 0,
        more2: 0,
        more3: 0
      }
    ],
    divineBeast: 0,
    master: holderUID + '',
    allMembers: [holderUID + ''],
    applyJoinList: [],
    more1: 0,
    more2: 0,
    more3: 0
  }
}

/**
 * 创立新的宗门
 * @param name 宗门名称
 * @param holderUID 宗主UID号
 */
const theAssociation = (name, holderUID) => {
  const nowTime = new Date().getTime() // 获取当前时间戳
  const date = GameApi.Method.timeChange(nowTime)
  const Association = getAss(name, date, nowTime, holderUID)
  const treasureVault = [[], [], []]
  AssociationApi.assUser.setAssOrGP('association', name, Association)
  AssociationApi.assUser.setAssOrGP('assTreasure', name, treasureVault)
  return false
}
