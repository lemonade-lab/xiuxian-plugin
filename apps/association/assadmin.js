import { plugin, GameApi, AssociationApi } from '../../model/api/index.js'
// 汐颜
export class AssociationAdmin extends plugin {
  constructor() {
    super({
      name: 'AssociationAdmin',
      rule: [
        {
          reg: /^(#|\/)开宗立派$/,
          fnc: 'createAssociation'
        },
        {
          reg: /^(#|\/)门派升级$/,
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
          reg: /^(#|\/)门派改名.*$/,
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
    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.AID != 0 || assGP.volunteerAss != 0) {
      e.reply(`已有门派`)
      return false
    }
    if (assGP.AID != 0 || assGP.volunteerAss != 0) {
      e.reply(`已有意向门派,请先清空`)
      return false
    }
    let money = GameApi.Bag.searchBagByName({ UID, name: '下品灵石' })
    if (!money || money.acount < 10000) {
      e.reply('攒到[下品灵石]*10000再来吧')
      return false
    }
    let najieThingB = GameApi.Bag.searchBagByName({
      UID,
      name: '中等门派令牌'
    })
    let najieThingA = GameApi.Bag.searchBagByName({
      UID,
      name: '下等门派令牌'
    })
    // 两种令牌都不存在
    if (!najieThingA && !najieThingB) {
      e.reply('请先找(下等/中等)门派令牌,以广招门徒~')
      return false
    }

    let ADATA = []
    if (najieThingB) {
      if (!AssociationApi.assUser.existAss('assOciation', 'Ass000001')) {
        ADATA.push('Ass000001')
      }
      if (!AssociationApi.assUser.existAss('assOciation', 'Ass000002')) {
        ADATA.push('Ass000002')
      }
      if (!AssociationApi.assUser.existAss('assOciation', 'Ass000003')) {
        ADATA.push('Ass000003')
      }
      if (!AssociationApi.assUser.existAss('assOciation', 'Ass000004')) {
        ADATA.push('Ass000004')
      }
    }

    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: -10000
    })

    // 可以建立隐藏门派
    if (najieThingB && ADATA.length > 0) {
      GameApi.Bag.addBagThing({
        UID,
        name: najieThingB.name,
        ACCOUNT: -1
      })
      const nowTime = new Date().getTime() // 获取当前时间戳
      const date = GameApi.Method.timeChange(nowTime)

      // 随机数 1-4
      const location = Math.floor(Math.random() * ADATA.length)

      // 初始化门派数据
      const AssData = getAss(ADATA[location], date, nowTime, UID, 4, 100000)

      // 写入门派数据
      AssociationApi.assUser.setAssOrGP('assOciation', ADATA[location], AssData)

      // 玩家存档
      let assGP = GameApi.Data.controlAction({
        NAME: UID,
        CHOICE: 'assGP'
      })
      assGP.AID = ADATA[location]
      assGP.assJob = 10
      assGP.contributionPoints = 0
      assGP.historyContribution = 0
      assGP.favorability = 0
      assGP.volunteerAss = 0
      assGP.time = [date, nowTime]
      // 更新玩家天赋,并写入存档
      AssociationApi.assUser.assUpdataEfficiency(assGP)

      // 基础藏宝阁数据
      let assthing = GameApi.Data.controlAction({
        NAME: 'Ass000000',
        CHOICE: 'assTreasureVault'
      })

      // 隐藏门派的数据
      let assthin = GameApi.Data.controlAction({
        NAME: ADATA[location],
        CHOICE: 'assTreasureVault'
      })

      for (let i = 0; i < assthin.length; i++) {
        assthing[i].push.apply(assthin[i])
      }

      // 初始化藏宝阁数据
      AssociationApi.assUser.setAssOrGP('assTreasure', ADATA[location], assthing)

      const assRelationList = GameApi.Data.controlAction({
        NAME: 'assRelation',
        CHOICE: 'assRelation'
      })

      // 读取该门派名称
      const assRelation = assRelationList.find((item) => item.id == ADATA[location])

      e.reply(`成功找到${assRelation.name}遗址,建立了传承门派${assRelation.name}`)
      return false
    }

    //  中等令牌的特权失效了
    if (najieThingA || najieThingB) {
      // 隐藏门派没了，只能建立普通门派，判断有无低级令牌
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
      e.reply('你要建立的门派名称是？', false, {
        at: true
      })
      return false
    }
  }

  /** 获取门派名称 */
  async setAssociationName(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const theMsg = this.e.message
    if (theMsg[0].type != 'text') {
      this.setContext('setAssociationName')
      this.reply('非法门派,请重新输入:')
      return false
    }
    const assOciationName = theMsg[0].text
    if (
      assOciationName.length < 2 ||
      assOciationName.length > 6 ||
      !/^[\u4e00-\u9fa5]+$/.test(assOciationName)
    ) {
      this.setContext('setAssociationName')
      this.reply('非法门派,请重新输入:')
      return false
    }
    const assRelationList = GameApi.Data.controlAction({
      NAME: 'assRelation',
      CHOICE: 'assRelation'
    })
    // 检查门派名称表
    const assRelation = assRelationList.find((item) => item.name == assOciationName)
    if (assRelation) {
      this.setContext('setAssociationName')
      this.reply('非法门派,请重新输入:')
      return false
    }
    const nowTime = new Date().getTime()
    const date = GameApi.Method.timeChange(nowTime)
    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    let replace = null
    // 如果门派列表等于 0
    if (AssociationApi.assUser.assRelationList.length == 0) {
      replace = 1
    } else {
      const id =
        AssociationApi.assUser.assRelationList[AssociationApi.assUser.assRelationList.length - 1].id
      replace = Number(id.replace('Ass00000', '')) + 1
    }
    const assOciationID = 'Ass00000' + replace

    let relationAll = AssociationApi.assUser.assRelationList
    relationAll.push({
      id: assOciationID, // 门派文件名
      name: assOciationName, // 门派名称
      unchartedName: assOciationID
    })
    AssociationApi.assUser.setAssOrGP('assRelation', 'assRelation', relationAll)

    assGP.AID = assOciationID
    assGP.assJob = 10
    assGP.contributionPoints = 0
    assGP.historyContribution = 0
    assGP.favorability = 0
    assGP.volunteerAss = 0
    assGP.time = [date, nowTime]
    // 写入玩家门派数据
    AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)

    theAssociation(assOciationID, UID)
    let read = GameApi.Data.controlAction({
      NAME: 'Ass000000',
      CHOICE: 'assTreasureVault'
    })
    AssociationApi.assUser.setAssOrGP('assTreasure', assOciationID, read) // 存储藏宝阁
    AssociationApi.assUser.assUpdataEfficiency(assGP)
    this.reply('门派建立成功')
    /** 结束上下文 */
    this.finish('setAssociationName')
  }

  // 升级门派
  async lvupAssociation(e) {
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
    if (assGP.AID == 0 || assGP.assJob < 8) {
      e.reply('权限不足')
      return false
    }
    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    if (ass.level == AssociationApi.assUser.numberMaximums.length) {
      return false
    }
    if (ass.spiritStoneAns < ass.level * 30000) {
      e.reply(`${ass.spiritStoneAns}/${ass.level * 30000}数量不足`)
      return false
    }

    let najieThingA = GameApi.Bag.searchBagByName({
      UID,
      name: '中等门派令牌'
    })
    let najieThingB = GameApi.Bag.searchBagByName({
      UID,
      name: '上等门派令牌'
    })

    if (ass.level == 3) {
      if (!najieThingA) {
        e.reply(`升级中等门派需要对应令牌，快去获取吧`)
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
        e.reply(`升级上等门派需要对应令牌，快去获取吧`)
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
    AssociationApi.assUser.setAssOrGP('assOciation', ass.id, ass)
    const GPList = ass.allMembers
    for (let GPID of GPList) {
      const UID = GPID
      if (AssociationApi.assUser.existAss('assGP', UID)) {
        const assOrGP = GameApi.Data.controlAction({
          NAME: UID,
          CHOICE: 'assGP'
        })
        AssociationApi.assUser.assUpdataEfficiency(assOrGP)
      }
    }
    e.reply(
      `门派升级成功~\n当前门派等级为${ass.level}\n门派人数上限提高到:${
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
    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.AID == 0 || assGP.assJob < 10) {
      e.reply('权限不足')
      return false
    }
    let memberUID = e.msg.replace(/^(#|\/)提拔/, '')
    memberUID = memberUID.trim()
    if (UID == memberUID) {
      return false
    }
    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    const isinass = ass.allMembers.find((item) => item == memberUID)
    if (!isinass) {
      return false
    }

    const member = GameApi.Data.controlAction({
      NAME: memberUID,
      CHOICE: 'assGP'
    }) // 获取这个B的存档
    if (member.assJob > 5) {
      e.reply(`已是内门弟子`)
      return false
    }
    if (member.historyContribution < (member.assJob + 1) * 100) {
      e.reply(`资历太浅，贡献不足`)
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
    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    if (assGP.AID == 0 || assGP.assJob < 10) {
      e.reply('权限不足')
      return false
    }
    if (AssociationApi.assUser.assRelationList.findIndex((item) => item.id == ass.id) <= 3) {
      e.reply(`传承门派,勿忘初心`)
      return false
    }
    let assOciationName = e.msg.replace(/^(#|\/)门派改名/, '')
    assOciationName = assOciationName.trim()
    if (ass.spiritStoneAns < 10000) {
      e.reply('需要[下品灵石]*10000委托联盟向天下告知~')
      return false
    }
    ass.spiritStoneAns -= 10000
    AssociationApi.assUser.setAssOrGP('assOciation', ass.id, ass)
    AssociationApi.assUser.renameAssociation(ass.id, 1, assOciationName)
    e.reply(`成功委托联盟更改门派名称为${assOciationName}`)
    return false
  }

  async deleteUserAssociation(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    const GPA = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (GPA.AID == 0 || GPA.assJob < 8) {
      e.reply('权限不足')
      return false
    }

    let menpai = e.msg.replace(/^(#|\/)/, '')
    menpai = menpai.replace('逐出门派', '')
    const memberUID = menpai
    if (UID == memberUID) {
      return false
    }
    const GPB = GameApi.Data.controlAction({
      NAME: memberUID,
      CHOICE: 'assGP'
    })
    if (GPB.AID == 0) {
      return false
    }
    const bss = GameApi.Data.controlAction({
      NAME: GPB.AID,
      CHOICE: 'assOciation'
    })
    if (GPA.AID != GPB.AID) {
      return false
    }
    if (GPB.assJob >= 8) {
      e.reply('权限不足')
      return false
    }
    bss.allMembers = bss.allMembers.filter((item) => item != memberUID)
    GPB.favorability = 0
    GPB.assJob = 0
    GPB.AID = 0
    AssociationApi.assUser.setAssOrGP('assOciation', bss.id, bss)
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
 * 创立新的门派
 * @param name 门派名称
 * @param holderUID 掌门UID号
 */
function theAssociation(name, holderUID) {
  // 获取当前时间戳
  const nowTime = new Date().getTime()
  const date = GameApi.Method.timeChange(nowTime)
  const Association = getAss(name, date, nowTime, holderUID)
  const treasureVault = [[], [], []]
  AssociationApi.assUser.setAssOrGP('assOciation', name, Association)
  AssociationApi.assUser.setAssOrGP('assTreasure', name, treasureVault)
  return false
}
