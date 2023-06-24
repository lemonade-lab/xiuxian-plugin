import { plugin, BotApi, GameApi, AssociationApi } from '../../model/api/index.js'
// 汐颜
export class AssUncharted extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)门派秘境$/,
          fnc: 'assUnchartedList'
        },
        {
          reg: /^(#|\/)探索门派秘境.*$/,
          fnc: 'goGuildSecrets'
        },
        {
          reg: /^(#|\/)秘境移动向.*$/,
          fnc: 'labyrinthMove'
        },
        {
          reg: /^(#|\/)门派秘境更名.*$/,
          fnc: 'renameAssUncharted'
        },
        {
          reg: /^(#|\/)查看秘境收获$/,
          fnc: 'showUnchartedGain'
        },
        {
          reg: /^(#|\/)开启宝箱$/,
          fnc: 'openChest'
        },
        {
          reg: /^(#|\/)逃离秘境$/,
          fnc: 'escapeUncharted'
        }
      ]
    })
  }

  async assUnchartedList(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    // 无存档
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    const addres = '门派秘境'
    let weizhi = []

    let assList = []
    const files = AssociationApi.assUser.readAssNames('assOciation')
    for (let file of files) {
      file = file.replace('.json', '')
      assList.push(file)
    }

    for (let assId of assList) {
      const assUncharted = GameApi.Data.controlAction({
        NAME: assId,
        CHOICE: 'assOciation'
      })
      weizhi.push(assUncharted)
    }
    GoAssUncharted(e, weizhi, addres)
  }

  async goGuildSecrets(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const { state, msg } = GameApi.Action.Go(UID)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    let didian = e.msg.replace(/^(#|\/)探索门派秘境/, '')
    didian = didian.trim()
    const weizhi = AssociationApi.assUser.assRelationList.find(
      (item) => item.unchartedName == didian
    )
    if (!weizhi) {
      return false
    }
    // 秘境所属门派
    let ass = GameApi.Data.controlAction({
      NAME: weizhi.id,
      CHOICE: 'assOciation'
    })
    if (ass.facility[2].status == 0) {
      e.reply(`该秘境暂未开放！`)
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
      e.reply(`请先到达此门派势力范围内`)
      return false
    }

    // 初始化 秘境等级，奖励等级，迷宫地图，秘境游玩临时存档

    // 秘境等级，山门等级 -- 山门+门派
    // 1 - 3   +   1 - 9
    // 2 - 12
    const unchartedLevel = ass.resident.level + Math.ceil(Math.random() * ass.level)
    // 奖励等级
    let incentivesLevel
    if (unchartedLevel <= 3) {
      incentivesLevel = 2
    } else {
      // 2 - 12  +   -2  - 3
      // 0 - 15
      incentivesLevel = unchartedLevel + Math.trunc(Math.random() * 6) - 2
    }
    e.reply(`本次生成秘境等级为${unchartedLevel},奖励等级为${incentivesLevel}`)
    let money = GameApi.Bag.searchBagByName({
      UID,
      name: '下品灵石'
    })
    if (!money || money.acount < unchartedLevel * 5000) {
      e.reply(`灵石不足,无法开启秘境`)
      return false
    }
    if (ass.spiritStoneAns < incentivesLevel * 5000) {
      e.reply(`该门派的灵石池已无法支撑秘境的运转！`)
      return false
    }
    const assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.AID == ass.id) {
      GameApi.Bag.addBagThing({
        UID,
        name: '下品灵石',
        ACCOUNT: Number(-unchartedLevel * 4500)
      })
    } else {
      GameApi.Bag.addBagThing({
        UID,
        name: '下品灵石',
        ACCOUNT: Number(-unchartedLevel * 5000)
      })
    }
    ass.spiritStoneAns += (unchartedLevel - incentivesLevel) * 5000

    AssociationApi.assUser.setAssOrGP('assOciation', ass.id, ass)

    // 完事了，该进秘境了
    // 初始化临时存档，选择随机地图，添加状态
    const nowTime = new Date().getTime()

    GameApi.Action.set(UID, {
      actionID: 6,
      startTime: nowTime
    })

    const number = Math.trunc(Math.random() * 5)
    const assArchive = {
      assResident: ass.resident.id,
      unchartedLevel,
      incentivesLevel,
      labyrinthMap: number,
      abscissa: 1,
      ordinate: 1,
      alreadyExplore: [],
      treasureChests: []
    }
    AssociationApi.assUser.setAssOrGP('assArchive', UID, assArchive)
    ass.facility[2].buildNum -= 1
    AssociationApi.assUser.checkFacility(ass)
    e.reply(`你已成功进入${didian}秘境,开始探索吧！`)
    return false
  }

  async labyrinthMove(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !AssociationApi.assUser.existAss('assArchive', UID)) {
      return false
    }
    const GP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle'
    })
    if (GP.nowblood <= 1) {
      e.reply('血量不足...')
      return false
    }
    let direction = e.msg.replace(/^(#|\/)秘境移动向/, '')
    direction = direction.trim()
    const assArchive = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assArchive'
    })
    let abscissa = assArchive.abscissa
    let ordinate = assArchive.ordinate
    switch (true) {
      case direction == '上':
        ordinate += 1
        break
      case direction == '下':
        ordinate -= 1
        break
      case direction == '左':
        abscissa -= 1
        break
      case direction == '右':
        abscissa += 1
        break
      default:
        direction = 0
        break
    }
    if (direction == 0) {
      return false
    }

    const labyrinthMap = AssociationApi.assUser.assLabyrinthList[assArchive.labyrinthMap]
    const newPoint = labyrinthMap.find((item) => item.x == abscissa && item.y == ordinate)
    if (!newPoint || !newPoint.transit) {
      e.reply(`此路不通！！！`)
      return false
    }

    const CDTime = 60
    const ClassCD = ':LabyrinthMove'
    const nowTime = new Date().getTime()

    const cdSecond = GameApi.Burial.get(UID, ClassCD)
    if (cdSecond.expire) {
      e.reply(`休整一下再出发吧，剩余${cdSecond.expire}秒！`)
      return false
    }

    // 随机事件
    let random = Math.random()
    const everCame = assArchive.alreadyExplore.find(
      (item) => item.x == abscissa && item.y == ordinate
    )
    if (everCame) {
      random = 0.1
    } else {
      assArchive.alreadyExplore.push({
        x: abscissa,
        y: ordinate
      })
    }

    // 位置变更
    assArchive.abscissa = abscissa
    assArchive.ordinate = ordinate

    if (random < 0.2) {
      e.reply(`无事发生`)
    } else if (random < 0.35) {
      GameApi.Levels.addExperience(UID, 1, assArchive.incentivesLevel)

      e.reply(
        `你找到一处结界，不知法门只能暴力破解，却被结界反噬震伤，气血逆流，失去了${
          150 * assArchive.incentivesLevel
        }气血`
      )
    } else if (random < 0.5) {
      GameApi.Levels.addExperience(UID, 0, assArchive.incentivesLevel)
      e.reply(
        `你发现一汪灵泉，大口饮下，不料泉水有毒，失去了${100 * assArchive.incentivesLevel}修为`
      )
    } else if (random < 0.65) {
      GameApi.Burial.set(UID, ClassCD, nowTime, CDTime)
      GameApi.Levels.addExperience(UID, 0, assArchive.incentivesLevel)
      e.reply(
        `这是一块灵气充裕之地，你静心修炼一会儿，获得了${120 * assArchive.incentivesLevel}修为`
      )
    } else if (random < 0.85) {
      // 遇怪
      GameApi.Burial.set(UID, ClassCD, nowTime, CDTime)
      const battle = GameApi.Data.controlAction({
        NAME: UID,
        CHOICE: 'playerBattle'
      })
      let levelId
      let buff = 1
      // 2 - 12  0 - 15
      if (assArchive.unchartedLevel < 4) {
        // 2 3 级秘境，刷怪，2.3  和 3.4
        levelId = assArchive.unchartedLevel + Math.trunc(Math.random() * 2)
      } else if (assArchive.unchartedLevel < 8) {
        //  4 5 6 7级秘境 刷怪   4.5.6  5.6.7   7 8 9
        levelId = assArchive.unchartedLevel + 1 + Math.trunc(Math.random() * 3)
      } else {
        // 8 9 10 11 12
        // 9 10
        levelId = 8 + Math.ceil(Math.random() * 2)
        // 11 - 15
        buff = Math.ceil(Math.random() * (assArchive.unchartedLevel - 7)) + 10
        buff = (buff / 10).toFixed(2)
      }

      const LevelList = GameApi.Data.controlAction({
        NAME: 'gaspractice',
        CHOICE: 'fixed_levels'
      })
      const LevelMax = LevelList[levelId]
      const monsters = {
        nowblood: Math.floor(LevelMax.blood * buff),
        attack: Math.floor(LevelMax.attack * buff),
        defense: Math.floor(LevelMax.defense * buff),
        blood: Math.floor(LevelMax.blood * buff),
        burst: LevelMax.burst + LevelMax.id * 5,
        burstmax: LevelMax.burstmax + LevelMax.id * 10,
        speed: LevelMax.speed + 5
      }
      const LifeData = GameApi.Data.readInitial('life', 'playerLife', {})
      const BMSG = GameApi.Fight.start(
        { battleA: battle, UIDA: UID, NAMEA: LifeData[UID].name },
        { battleB: monsters, UIDB: 1, NAMEB: '怪物' }
      )
      if (BMSG.victory == UID) {
        GameApi.Levels.addExperience(UID, 1, assArchive.incentivesLevel)
        BMSG.msg.push(`获得了${250 * assArchive.incentivesLevel}气血`)
      }
      e.reply(
        await BotApi.obtainingImages({
          path: 'msg',
          name: 'msg',
          data: { msg: BMSG.msg }
        })
      )
    } else {
      // 宝箱
      GameApi.Burial.set(UID, ClassCD, nowTime, CDTime)
      const chestsType = Math.ceil(Math.random() * 6)
      let chestsLevel
      // 0 - 15
      if (assArchive.incentivesLevel <= 6) {
        // 0-6   0 - 2  0 - 8
        chestsLevel = assArchive.incentivesLevel + Math.trunc(Math.random() * 3)
      } else {
        //  7 - 15  -2 - 2  5 - 17
        chestsLevel = assArchive.incentivesLevel + Math.trunc(Math.random() * 5) - 2
      }
      const chests = {
        type: chestsType,
        level: chestsLevel
      }
      e.reply(`获得了一个宝箱，可使用#查看秘境收获，进行查看`)
      assArchive.treasureChests.push(chests)
    }

    AssociationApi.assUser.setAssOrGP('assArchive', UID, assArchive)
    return false
  }

  async renameAssUncharted(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    let assGP = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assGP'
    })
    if (assGP.AID == 0) {
      e.reply('一介散修')
      return false
    }
    if (assGP.assJob < 8) {
      e.reply('权限不足')
      return false
    }
    let ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })
    if (ass.facility[2].status == 0) {
      e.reply(`门派秘境未建设好！`)
      return false
    }
    let newName = e.msg.replace(/^(#|\/)门派秘境更名/, '')
    if (newName.length < 2 || newName.length > 6 || !/^[\u4e00-\u9fa5]+$/.test(newName)) {
      e.reply('非法秘境~')
      return false
    }
    const weizhi = AssociationApi.assUser.assRelationList.find(
      (item) => item.unchartedName == newName
    )
    if (weizhi) {
      e.reply('非法秘境~')
      return false
    }
    AssociationApi.assUser.renameAssociation(assGP.AID, 2, newName)
    e.reply(`门派秘境已成功更名为${newName}`)
    return false
  }

  async showUnchartedGain(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    if (!AssociationApi.assUser.existAss('assArchive', UID)) {
      return false
    }
    const assArchive = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assArchive'
    })

    let msg = [`__[秘境收获]__`]

    if (assArchive.treasureChests.length <= 0) {
      msg.push('空空如也！！！')
    } else {
      for (let i = 0; i < assArchive.treasureChests.length; i++) {
        const map = ['随机', '武器', '防具', '法宝', '丹药', '功法', '灵石']
        const name = map[assArchive.treasureChests[i].type]
        msg.push(`${assArchive.treasureChests[i].level}级${name}宝箱`)
      }
    }
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    return false
  }

  async openChest(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    if (!AssociationApi.assUser.existAss('assArchive', UID)) {
      return false
    }
    const assArchive = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'assArchive'
    })
    let msg = [`__[开启结果]__`]

    if (assArchive.treasureChests.length <= 0) {
      msg.push('没宝箱开锤子呢')
    } else {
      for (let i = 0; i < assArchive.treasureChests.length; i++) {
        let lastNum
        // 0 - 15
        if (assArchive.incentivesLevel <= 6) {
          // 0 - 8  0-3 0 - 11
          lastNum = assArchive.treasureChests[i].level + Math.trunc(Math.random() * 4)
        } else {
          // 5 - 17  -2 - 3   3 - 20
          lastNum = assArchive.treasureChests[i].level + Math.trunc(Math.random() * 6) - 2
          lastNum = lastNum < 8 ? 8 : lastNum
          lastNum = lastNum > 19 ? 19 : lastNum
        }
        if (assArchive.treasureChests[i].type != 6) {
          let thingId = assArchive.treasureChests[i].type + '-1-' + lastNum
          if (assArchive.treasureChests[i].type == 4 && lastNum >= 10) {
            thingId = assArchive.treasureChests[i].type + '-2-' + lastNum
          }
          let addThing = GameApi.Data.searchThingById(thingId)
          if (!addThing) {
            addThing = GameApi.Data.searchThingById('6-1-2')
          }
          GameApi.Bag.addBagThing({
            UID,
            name: addThing.name,
            ACCOUNT: 1
          })
          msg.push(`你获得了${addThing.name}`)
        } else {
          GameApi.Bag.addBagThing({
            UID,
            name: '下品灵石',
            ACCOUNT: lastNum * 100
          })
          msg.push(`你获得了${lastNum * 100}下品灵石`)
        }
      }
    }
    assArchive.treasureChests = []
    AssociationApi.assUser.setAssOrGP('assArchive', UID, assArchive)

    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    return false
  }

  async escapeUncharted(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }

    if (AssociationApi.assUser.existAss('assArchive', UID)) {
      const assArchive = GameApi.Data.controlAction({
        NAME: UID,
        CHOICE: 'assArchive'
      })
      if (assArchive.alreadyExplore.length > 11) {
        const idList = ['1-1-40', '2-1-40']
        const randomSource = Math.random()
        // unchartedLevel  incentivesLevel
        const probability = assArchive.unchartedLevel * 0.03

        if (randomSource < probability) {
          // 获得特殊产出
          let addThing
          const find = AssociationApi.assUser.blessPlaceList.find(
            (item) => item.id == assArchive.assResident
          )
          if (assArchive.incentivesLevel > 12) {
            addThing = GameApi.Data.searchThingById(find.specialty.best)
          } else if (assArchive.incentivesLevel >= 8) {
            const location = Math.trunc(Math.random() * find.specialty.special.length)
            addThing = GameApi.Data.searchThingById(find.specialty.special[location])
          } else {
            const location = Math.trunc(Math.random() * find.specialty.common.length)
            addThing = GameApi.Data.searchThingById(find.specialty.common[location])
          }
          if (!addThing) {
            addThing = GameApi.Data.searchThingById('6-1-2')
          }
          GameApi.Bag.addBagThing({
            UID,
            name: addThing.name,
            ACCOUNT: 1
          })
          e.reply(`你获得了${addThing.name}`)
        } else {
          const location = Math.trunc(Math.random() * idList.length)
          let addThing = GameApi.Data.searchThingById(idList[location])
          if (!addThing) {
            addThing = GameApi.Data.searchThingById('6-1-2')
          }
          GameApi.Bag.addBagThing({
            UID,
            name: addThing.name,
            ACCOUNT: 1
          })
          e.reply(`你获得了${addThing.name}`)
        }
      }
      AssociationApi.assUser.deleteAss('assArchive', UID)
    }
    let action = GameApi.Action.get(UID)
    if (action.actionID != 6) {
      return false
    }
    GameApi.Action.delete(UID)
    e.reply(`已成功脱离秘境`)
    return false
  }
}
/**
 *  地点查询
 * @param {*} e
 * @param {*} weizhi
 * @param {*} addres
 */
async function GoAssUncharted(e, weizhi, addres) {
  let msg = ['***' + addres + '***']
  for (let i = 0; i < weizhi.length; i++) {
    const find = AssociationApi.assUser.assRelationList.find((item) => item.id == weizhi[i].id)
    const status = weizhi[i].facility[2].status == 0 ? '未建成' : '已启用'
    msg.push('秘境名称:' + find.unchartedName)
    msg.push('归属门派:' + find.name + '\n')
    msg.push('状态:' + status + '\n')
    msg.push('地点:' + weizhi[i].resident.name)
  }
  e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
}
