import { plugin, BotApi, GameApi, AssociationApi } from '#xiuxian-api'
// 汐颜
export class AssBlessPlace extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)洞天福地$/,
          fnc: 'blessPlaceList'
        },
        {
          reg: /^(#|\/)开采灵脉$/,
          fnc: 'exploitationVein'
        },
        {
          reg: /^(#|\/)入驻洞天.*$/,
          fnc: 'settledBlessedPlace'
        },
        {
          reg: /^(#|\/)修建.*$/,
          fnc: 'constructionGuild'
        },
        {
          reg: /^(#|\/)门派建筑$/,
          fnc: 'showAssociationBuilder'
        },
        {
          reg: /^(#|\/)集合攻打.*$/,
          fnc: 'assOciationBattle'
        }
      ]
    })
  }

  async assOciationBattle(e) {
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
    let AID = e.msg.replace(/^(#|\/)集合攻打/, '')
    AID = AID.trim()
    const assRelation = AssociationApi.assUser.assRelationList.find((item) => item.name == AID)
    if (!assRelation) {
      e.reply(`该门派不存在`)
      return false
    }

    AID = assRelation.id
    const battleAss = GameApi.Data.controlAction({
      NAME: AID,
      CHOICE: 'assOciation'
    })
    if (battleAss.resident.name == 0 || battleAss.id == assGP.AID) {
      return false
    }
    // 读取被攻打的门派势力范围
    const attackAss = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })

    const positionList = GameApi.Data.controlAction({
      NAME: 'position',
      CHOICE: 'generate_position'
    })
    const position = positionList.find((item) => item.name == battleAss.resident.name)

    const attack = getFightMember(attackAss.allMembers, position)
    const battle = getFightMember(battleAss.allMembers, position)
    let msg = ['___[战斗过程]___']
    msg.push('攻打方参与者:' + attack.toString())
    msg.push('防守方参与者:' + battle.toString())
    const attackObj = SealingFormation(attack)
    msg.push('你们结成了攻伐大阵，誓要攻破对方的山门，抢夺下这块山门！')
    const battleObj = SealingFormation(battle)
    battleObj.defense += Math.trunc(battleAss.facility[5].buildNum / 200) * 2500
    msg.push('防守方依托门派大阵，誓要将你们击退！')
    switch (battleAss.divineBeast) {
      case 1:
        battleObj.burst += 25
        msg.push('麒麟祥瑞降临，防守方变得幸运，更容易打出暴击了！')
        break
      case 2:
        battleObj.nowblood += 50000
        msg.push('青龙属木主生机，降下生命赐福，防守方血量提升了！')
        break
      case 3:
        battleObj.attack += 8000
        msg.push('白虎属金主杀伐，降下攻击赐福，防守方伤害变高了！')
        break
      case 4:
        battleObj.burstmax += 50
        msg.push('朱雀属火主毁灭，降下伤害赐福，防守方爆伤提升了！')
        break
      case 5:
        battleObj.defense += 8000
        msg.push('玄武属水主守护，降下免伤赐福，防守方防御提升了！')
        break
      default:
        msg.push('防守方没有神兽，并不能获得战斗加成')
    }
    msg.push('掀起门派大战，波及范围甚广，有违天和，进攻方全体煞气值加2点')
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    // 开打！
    const res = AssBattle(e, attackObj, battleObj)
    // 赢！
    if (battleAss.facility[5].status != 0) {
      battleAss.facility[5].buildNum -= 200
    }
    if (res == 1) {
      battleAss.resident = {
        id: 0,
        name: 0,
        level: 0
      }
      battleAss.facility = battleAss.facility.map(function (i) {
        i.buildNum = 0
        i.status = 0
        return i
      })
    }
    AssociationApi.assUser.checkFacility(battleAss)
    AddPrestige(attack)
    return false
  }

  // 秘境地点
  async blessPlaceList(e) {
    if (!this.verify(e)) return false
    let addres = '洞天福地'
    let weizhi = AssociationApi.assUser.blessPlaceList
    GoBlessPlace(e, weizhi, addres)
  }

  // 入驻洞天
  async settledBlessedPlace(e) {
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
    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    let blessedName = e.msg.replace(/^(#|\/)入驻洞天/, '')
    blessedName = blessedName.trim()
    // 洞天不存在
    const dongTan = AssociationApi.assUser.blessPlaceList.find((item) => item.name == blessedName)
    if (!dongTan) {
      e.reply(`[${blessedName}]不存在`)
      return false
    }
    const positionList = GameApi.Data.controlAction({
      NAME: 'point',
      CHOICE: 'generate_position'
    })
    const point = positionList.find((item) => item.name == blessedName)

    // 取洞天点位，是否在位置，在--->是否被占领
    const action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    if (action.x != point.x || action.y != point.y) {
      e.reply('不在该洞天位置')
      return false
    }

    const allNames = AssociationApi.assUser.readAssNames('assOciation')

    for (let i = 0; i < allNames.length; i++) {
      const theName = allNames[i].replace('.json', '')
      const thisAss = GameApi.Data.controlAction({
        NAME: theName,
        CHOICE: 'assOciation'
      })
      if (thisAss.resident.name == dongTan.name) {
        e.reply(`你尝试带着门派入驻${dongTan.name}，却发现有门派捷足先登了，只能通过开战强夺山门了`)
        return false
      }
    }
    ass.resident = dongTan
    ass.facility = ass.facility.map((i) => {
      i.buildNum = Math.trunc(i.buildNum * 0.7)
      i.status = 0
      return i
    })
    AssociationApi.assUser.setAssOrGP('assOciation', ass.id, ass)
    e.reply(`入驻成功,${ass.id}当前山门为:${dongTan.name},原有建设值继承70%，需要重新修建以启用`)
    return false
  }

  async exploitationVein(e) {
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
    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })

    if (ass.resident.name == 0) {
      e.reply(`你的门派还没有山门哦,没有灵脉可以开采`)
      return false
    }
    const positionList = GameApi.Data.controlAction({
      NAME: 'position',
      CHOICE: 'generate_position'
    })
    const position = positionList.find((item) => item.name == ass.resident.name)
    const action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    if (
      action.x < position.x1 ||
      action.x > position.x2 ||
      action.y < position.y1 ||
      action.y > position.y2
    ) {
      e.reply(`请先回山门范围`)
      return false
    }
    const now = new Date().getTime()
    const nowTime = now.getTime() // 获取当前日期的时间戳
    const Today = GameApi.Method.timeInvert(nowTime)
    const lastExplorTime = GameApi.Method.timeInvert(assGP.lastExplorTime) // 获得上次门派签到日期
    if (Today.Y == lastExplorTime.Y && Today.M == lastExplorTime.M && Today.D == lastExplorTime.D) {
      e.reply(`今日已经开采过灵脉,不可以竭泽而渔哦,明天再来吧`)
      return false
    }
    assGP.lastExplorTime = nowTime

    let giftLingshi = 0
    const LevelData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    giftLingshi = 500 * ass.resident.level * LevelData.gaspractice.realm

    const num = Math.trunc(giftLingshi)

    if (ass.spiritStoneAns + num > AssociationApi.assUser.spiritStoneAnsMax[ass.level - 1]) {
      ass.spiritStoneAns = AssociationApi.assUser.spiritStoneAnsMax[ass.level - 1]
    } else {
      ass.spiritStoneAns += num
    }

    assGP.contributionPoints += Math.trunc(num / 2000)
    assGP.historyContribution += Math.trunc(num / 2000)
    AssociationApi.assUser.setAssOrGP('assOciation', ass.id, ass)
    AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
    e.reply(
      `成功开采灵脉\n为门派灵石池贡献了${giftLingshi}灵石\n你获得了${Math.trunc(num / 2000)}贡献点`
    )
    return false
  }

  async constructionGuild(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    // 用户不存在
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const LevelData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.AID == 0) {
      e.reply('一介散修')
      return false
    }

    let ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    if (ass.resident.name == 0) {
      e.reply(`你的门派还没有山门`)
      return false
    }

    let buildName = e.msg.replace(/^(#|\/)修建/, '')
    buildName = buildName.trim()

    // 门派不存在
    const location = AssociationApi.assUser.buildNameList.findIndex((item) => item == buildName)
    if (location == -1) {
      return false
    }

    const positionList = GameApi.Data.controlAction({
      NAME: 'position',
      CHOICE: 'generate_position'
    })

    const position = positionList.find((item) => item.name == ass.resident.name)
    const action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })

    if (
      action.x < position.x1 ||
      action.x > position.x2 ||
      action.y < position.y1 ||
      action.y > position.y2
    ) {
      e.reply(`请先回门派`)
      return false
    }

    if (location != 0 && ass.facility[0].status == 0) {
      e.reply('门派连块平地都没有,你修建啥呀,先给山门修修吧')
      return false
    }

    const CDTime = 60
    const ClassCD = ':buildFacility'
    const nowTime = new Date().getTime()

    const cdSecond = GameApi.Burial.get(UID, ClassCD)
    if (cdSecond.expire) {
      e.reply(`修建中,剩余${cdSecond.expire}！`)
      return false
    }

    GameApi.Burial.set(UID + ClassCD, nowTime, CDTime)

    let add = Math.trunc(LevelData.gaspractice.realm / 10) + 3

    ass.facility[location].buildNum += add

    assGP.contributionPoints += Math.trunc(add / 2) + 1
    assGP.historyContribution += Math.trunc(add / 2) + 1
    AssociationApi.assUser.checkFacility(ass)
    ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    let msg = ass.facility[location].status == 0 ? '未启用' : '启用'
    AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
    e.reply(
      `建设成功~\n为${buildName}增加了${add}点建设值\n当前该设施建设总值为${ass.facility[location].buildNum},状态为` +
        msg
    )
    return false
  }

  async showAssociationBuilder(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    // 用户不存在
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

    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })

    let msg = [`__[门派建筑]__`]

    for (let i = 0; i < ass.facility.length; i++) {
      msg.push('建筑名称:' + AssociationApi.assUser.buildNameList[i])
      msg.push('建设值:' + ass.facility[i].buildNum)
      msg.push('建筑状态:' + (ass.facility[i].status == 0 ? '未启用' : '启用'))
    }
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
  }
}

/**
 *
 * @param {*} e
 * @param {*} weizhi
 * @param {*} addres
 */
async function GoBlessPlace(e, weizhi, addres) {
  let adr = addres
  let msg = ['***' + adr + '***']
  for (let i = 0; i < weizhi.length; i++) {
    msg.push(weizhi[i].name)
    msg.push('等级:' + weizhi[i].level)
    msg.push('修炼效率:' + weizhi[i].efficiency * 100 + '%')
  }
  e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
}

/**
 *
 * @param {*} members
 * @param {*} position
 * @returns
 */
function getFightMember(members, position) {
  let res = []
  for (let i = 0; i < members.length; i++) {
    const action = GameApi.Data.controlAction({
      NAME: members[i],
      CHOICE: 'playerAction'
    })
    if (
      action.x >= position.x1 &&
      action.x <= position.x2 &&
      action.y >= position.y1 &&
      action.y <= position.y2
    ) {
      res.push(members[i])
    }
  }
  return res
}

/**
 *
 * @param {*} members
 * @returns
 */
function SealingFormation(members) {
  let res = {
    nowblood: 0,
    attack: 0,
    defense: 0,
    blood: 999999999,
    burst: 0,
    burstmax: 50,
    speed: 0,
    power: 0
  }
  for (let i = 0; i < members.length; i++) {
    const battle = GameApi.Data.controlAction({
      NAME: members[i],
      CHOICE: 'playerBattle'
    })
    res.nowblood += battle.nowblood
    res.attack += battle.attack
    res.defense += battle.defense
    res.speed += battle.speed
    res.burst += 5
    res.burstmax += 10
  }
  return res
}

/**
 *
 * @param {*} e
 * @param {*} battleA
 * @param {*} battleB
 * @returns
 */
async function AssBattle(e, battleA, battleB) {
  let msg = []
  let UID = 1
  if (battleA.speed >= battleB.speed) {
    let hurt = battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 1

    if (GameApi.Method.isProbability(battleA.burst)) {
      hurt += Math.floor((hurt * battleA.burstmax) / 100)
    }
    battleB.nowblood = battleB.nowblood - hurt
    if (battleB.nowblood < 1) {
      e.reply('你们结成的阵法过于强大,只一招就攻破了对面的山门！')
      return UID
    } else {
      msg.push('你们催动法力,造成' + hurt + '伤害')
    }
  }
  // 循环回合，默认从B攻击开始
  var x = 1
  var y = 0
  var z = 1
  while (true) {
    x++
    z++
    // 分片发送消息
    if (x == 15) {
      e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
      msg = []
      x = 0
      y++
      if (y == 2) {
        UID = battleA.nowblood > battleB.nowblood ? 1 : 0
        // 就打2轮回
        break
      }
    }
    // B开始
    let hurt = battleB.attack - battleA.defense >= 0 ? battleB.attack - battleA.defense + 1 : 1
    if (GameApi.Method.isProbability(battleB.burst)) {
      hurt += Math.floor((hurt * battleB.burstmax) / 100)
    }
    battleA.nowblood = battleA.nowblood - hurt
    if (battleA.nowblood < 0) {
      msg.push('第' + z + '回合:对方依靠大阵回击，造成' + hurt + '伤害')
      e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
      e.reply('你们的进攻被击退了！！')
      UID = 0
      break
    } else {
      msg.push('第' + z + '回合:对方依靠大阵回击，造成' + hurt + '伤害')
    }
    // A开始
    hurt = battleA.attack - battleB.defense >= 0 ? battleA.attack - battleB.defense + 1 : 1
    if (GameApi.Method.isProbability(battleA.burst)) {
      hurt += Math.floor((hurt * battleA.burstmax) / 100)
    }
    battleB.nowblood = battleB.nowblood - hurt
    if (battleB.nowblood < 0) {
      msg.push('第' + z + '回合:你们结阵攻伐，造成' + hurt + '伤害')
      e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
      e.reply('你们击破了对面的山门！')
      break
    } else {
      msg.push('第' + z + '回合:你们结阵攻伐，造成' + hurt + '伤害')
    }
  }
  return UID
}

/**
 *
 * @param {*} members
 */
const AddPrestige = (members) => {
  for (let i = 0; i < members.length; i++) {
    GameApi.Special.addSpecial(members[i], 'prestige', 2)
  }
}
