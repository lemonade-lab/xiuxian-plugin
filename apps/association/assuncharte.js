import { plugin, BotApi, GameApi, AssociationApi } from '../../model/api/index.js'
// 汐颜
export class AssUncharted extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)宗门秘境列表$/,
          fnc: 'List_AssUncharted'
        },
        {
          reg: /^(#|\/)探索宗门秘境.*$/,
          fnc: 'Go_Guild_Secrets'
        },
        {
          reg: /^(#|\/)秘境移动向.*$/,
          fnc: 'Labyrinth_Move'
        },
        {
          reg: /^(#|\/)宗门秘境更名.*$/,
          fnc: 'Rename_AssUncharted'
        },
        {
          reg: /^(#|\/)查看秘境收获$/,
          fnc: 'Show_Uncharted_Gain'
        },
        {
          reg: /^(#|\/)开启宝箱$/,
          fnc: 'Open_The_Chest'
        },
        {
          reg: /^(#|\/)逃离秘境$/,
          fnc: 'Escape_Uncharted'
        }
      ]
    })
  }

  async List_AssUncharted(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    // 无存档
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }
    const addres = '宗门秘境'
    let weizhi = []

    let assList = []
    const files = AssociationApi.assUser.readAssNames('association')
    for (let file of files) {
      file = file.replace('.json', '')
      assList.push(file)
    }

    for (let assId of assList) {
      const assUncharted = AssociationApi.assUser.getAssOrPlayer(2, assId)
      weizhi.push(assUncharted)
    }
    GoAssUncharted(e, weizhi, addres)
  }

  async Go_Guild_Secrets(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const { state, msg } = GameApi.Wrap.Go(UID)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay) {
      return false
    }
    let didian = e.msg.replace(/^(#|\/)探索宗门秘境/, '')
    didian = didian.trim()
    const weizhi = AssociationApi.assUser.assRelationList.find(
      (item) => item.unchartedName == didian
    )
    if (!weizhi) {
      return false
    }
    // 秘境所属宗门
    let ass = AssociationApi.assUser.getAssOrPlayer(2, weizhi.id)
    if (ass.facility[2].status == 0) {
      e.reply(`该秘境暂未开放使用！`)
      return false
    }

    const positionList = GameApi.UserData.controlAction({
      NAME: 'position',
      CHOICE: 'generate_position'
    })
    const position = positionList.find((item) => item.name == ass.resident.name)

    const action = GameApi.GameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    if (
      action.x < position.x1 ||
      action.x > position.x2 ||
      action.y < position.y1 ||
      action.y > position.y2
    ) {
      e.reply(`请先到达此宗门势力范围内`)
      return false
    }

    // 初始化 秘境等级，奖励等级，迷宫地图，秘境游玩临时存档

    // 秘境等级，驻地等级 -- 驻地+宗门
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
    let money = GameApi.GameUser.userBagSearch({
      UID,
      name: '下品灵石'
    })

    if (!money || money.acount < unchartedLevel * 5000) {
      e.reply(`没钱，买不起秘境门票`)
      return false
    }
    if (ass.spiritStoneAns < incentivesLevel * 5000) {
      e.reply(`这个宗门的灵石池，无法支撑秘境的运转了！`)
      return false
    }
    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)

    if (assPlayer.assName == ass.id) {
      GameApi.GameUser.userBag({
        UID,
        name: '下品灵石',
        ACCOUNT: Number(-unchartedLevel * 4500)
      })
    } else {
      GameApi.GameUser.userBag({
        UID,
        name: '下品灵石',
        ACCOUNT: Number(-unchartedLevel * 5000)
      })
    }
    ass.spiritStoneAns += (unchartedLevel - incentivesLevel) * 5000

    AssociationApi.assUser.setAssOrPlayer('association', ass.id, ass)

    // 完事了，该进秘境了
    // 初始化临时存档，选择随机地图，添加状态
    const nowTime = new Date().getTime()
    const actionObject = {
      actionID: 6,
      startTime: nowTime
    }

    GameApi.Wrap.setAction(UID, actionObject)

    const number = Math.trunc(Math.random() * 5)
    const interimArchive = {
      assResident: ass.resident.id,
      unchartedLevel,
      incentivesLevel,
      labyrinthMap: number,
      abscissa: 1,
      ordinate: 1,
      alreadyExplore: [],
      treasureChests: []
    }
    AssociationApi.assUser.setAssOrPlayer('interimArchive', UID, interimArchive)
    ass.facility[2].buildNum -= 1
    AssociationApi.assUser.checkFacility(ass)
    e.reply(`你已成功进入${didian}秘境,开始探索吧！`)
    return false
  }

  async Labyrinth_Move(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup || !AssociationApi.assUser.existAss('interimArchive', UID)) {
      return false
    }
    const player = GameApi.GameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    if (player.nowblood <= 1) {
      e.reply('血量不足...')
      return false
    }
    let direction = e.msg.replace(/^(#|\/)秘境移动向/, '')
    direction = direction.trim()
    const interimArchive = AssociationApi.assUser.getAssOrPlayer(3, UID)
    let abscissa = interimArchive.abscissa
    let ordinate = interimArchive.ordinate
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

    const labyrinthMap = AssociationApi.assUser.assLabyrinthList[interimArchive.labyrinthMap]
    const newPoint = labyrinthMap.find((item) => item.x == abscissa && item.y == ordinate)
    if (!newPoint || !newPoint.transit) {
      e.reply(`此路不通！！！`)
      return false
    }

    const CDTime = 60
    const ClassCD = ':LabyrinthMove'
    const nowTime = new Date().getTime()

    const cdSecond = GameApi.Wrap.getRedis(UID, ClassCD)
    if (cdSecond.expire) {
      e.reply(`休整一下再出发吧，剩余${cdSecond.expire}秒！`)
      return false
    }

    // 随机事件
    let random = Math.random()
    const everCame = interimArchive.alreadyExplore.find(
      (item) => item.x == abscissa && item.y == ordinate
    )
    if (everCame) {
      random = 0.1
    } else {
      interimArchive.alreadyExplore.push({
        x: abscissa,
        y: ordinate
      })
    }

    // 位置变更
    interimArchive.abscissa = abscissa
    interimArchive.ordinate = ordinate

    if (random < 0.2) {
      e.reply(`无事发生`)
    } else if (random < 0.35) {
      GameApi.GameUser.updataUser({
        UID,
        CHOICE: 'user_level',
        ATTRIBUTE: 'experiencemax',
        SIZE: Number(-150 * interimArchive.incentivesLevel)
      })
      e.reply(
        `你找到一处结界，不知法门只能暴力破解，却被结界反噬震伤，气血逆流，失去了${
          150 * interimArchive.incentivesLevel
        }气血`
      )
    } else if (random < 0.5) {
      GameApi.GameUser.updataUser({
        UID,
        CHOICE: 'user_level',
        ATTRIBUTE: 'experience',
        SIZE: Number(-100 * interimArchive.incentivesLevel)
      })
      e.reply(
        `你发现一汪灵泉，大口饮下，不料泉水有毒，失去了${100 * interimArchive.incentivesLevel}修为`
      )
    } else if (random < 0.65) {
      GameApi.Wrap.setRedis(UID, ClassCD, nowTime, CDTime)
      GameApi.GameUser.updataUser({
        UID,
        CHOICE: 'user_level',
        ATTRIBUTE: 'experience',
        SIZE: Number(120 * interimArchive.incentivesLevel)
      })
      e.reply(
        `这是一块灵气充裕之地，你静心修炼一会儿，获得了${120 * interimArchive.incentivesLevel}修为`
      )
    } else if (random < 0.85) {
      // 遇怪
      GameApi.Wrap.setRedis(UID, ClassCD, nowTime, CDTime)
      const battle = GameApi.GameUser.userMsgAction({
        NAME: UID,
        CHOICE: 'user_battle'
      })
      let levelId
      let buff = 1
      // 2 - 12  0 - 15
      if (interimArchive.unchartedLevel < 4) {
        // 2 3 级秘境，刷怪，2.3  和 3.4
        levelId = interimArchive.unchartedLevel + Math.trunc(Math.random() * 2)
      } else if (interimArchive.unchartedLevel < 8) {
        //  4 5 6 7级秘境 刷怪   4.5.6  5.6.7   7 8 9
        levelId = interimArchive.unchartedLevel + 1 + Math.trunc(Math.random() * 3)
      } else {
        // 8 9 10 11 12
        // 9 10
        levelId = 8 + Math.ceil(Math.random() * 2)
        // 11 - 15
        buff = Math.ceil(Math.random() * (interimArchive.unchartedLevel - 7)) + 10
        buff = (buff / 10).toFixed(2)
      }

      const LevelList = GameApi.UserData.controlAction({
        NAME: 'gaspractice',
        CHOICE: 'generate_level'
      })
      const LevelMax = LevelList.find((item) => item.id == levelId)

      const monsters = {
        nowblood: Math.floor(LevelMax.blood * buff),
        attack: Math.floor(LevelMax.attack * buff),
        defense: Math.floor(LevelMax.defense * buff),
        blood: Math.floor(LevelMax.blood * buff),
        burst: LevelMax.burst + LevelMax.id * 5,
        burstmax: LevelMax.burstmax + LevelMax.id * 10,
        speed: LevelMax.speed + 5
      }
      const battleMsg = GameApi.GameBattle.monsterbattle({
        e,
        battleA: battle,
        battleB: monsters
      })
      let msg = ['——[不巧遇见了怪物]——']
      battleMsg.msg.forEach((item) => {
        msg.push(item)
      })
      GameApi.GameUser.updataUser({
        UID,
        CHOICE: 'user_level',
        ATTRIBUTE: 'experiencemax',
        SIZE: Number(250 * interimArchive.incentivesLevel)
      })
      msg.push(`获得了${250 * interimArchive.incentivesLevel}气血`)

      e.reply(
        await BotApi.obtainingImages({
          path: 'msg',
          name: 'msg',
          data: { msg }
        })
      )
    } else {
      // 宝箱
      GameApi.Wrap.setRedis(UID, ClassCD, nowTime, CDTime)
      const chestsType = Math.ceil(Math.random() * 6)
      let chestsLevel
      // 0 - 15
      if (interimArchive.incentivesLevel <= 6) {
        // 0-6   0 - 2  0 - 8
        chestsLevel = interimArchive.incentivesLevel + Math.trunc(Math.random() * 3)
      } else {
        //  7 - 15  -2 - 2  5 - 17
        chestsLevel = interimArchive.incentivesLevel + Math.trunc(Math.random() * 5) - 2
      }
      const chests = {
        type: chestsType,
        level: chestsLevel
      }
      e.reply(`获得了一个宝箱，可使用#查看秘境收获，进行查看`)
      interimArchive.treasureChests.push(chests)
    }

    AssociationApi.assUser.setAssOrPlayer('interimArchive', UID, interimArchive)
    return false
  }

  async Rename_AssUncharted(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }
    let assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0 || assPlayer.assJob < 8) {
      return false
    }
    let ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)
    if (ass.facility[2].status == 0) {
      e.reply(`宗门秘境未建设好！`)
      return false
    }

    let newName = e.msg.replace(/^(#|\/)宗门秘境更名/, '')
    newName = newName.trim()
    const reg = /[^\u4e00-\u9fa5]/g // 汉字检验正则
    const res = reg.test(newName)
    // res为true表示存在汉字以外的字符
    if (res) {
      this.reply('宗门秘境名只能使用中文，请重新输入！')
      return false
    }
    const weizhi = AssociationApi.assUser.assRelationList.find(
      (item) => item.unchartedName == newName
    )
    if (weizhi) {
      e.reply(`秘境不允许重名`)
      return false
    }
    AssociationApi.assUser.assRename(assPlayer.assName, 2, newName)
    e.reply(`宗门秘境已成功更名为${newName}`)
    return false
  }

  async Show_Uncharted_Gain(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    if (!AssociationApi.assUser.existAss('interimArchive', UID)) {
      return false
    }
    const interimArchive = AssociationApi.assUser.getAssOrPlayer(3, UID)

    let msg = [`__[秘境收获]__`]

    if (interimArchive.treasureChests.length <= 0) {
      msg.push('空空如也！！！')
    } else {
      for (let i = 0; i < interimArchive.treasureChests.length; i++) {
        const map = ['随机', '武器', '防具', '法宝', '丹药', '功法', '灵石']
        const name = map[interimArchive.treasureChests[i].type]
        msg.push(`${interimArchive.treasureChests[i].level}级${name}宝箱`)
      }
    }
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    return false
  }

  async Open_The_Chest(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    if (!AssociationApi.assUser.existAss('interimArchive', UID)) {
      return false
    }
    const interimArchive = AssociationApi.assUser.getAssOrPlayer(3, UID)
    let msg = [`__[开启结果]__`]

    if (interimArchive.treasureChests.length <= 0) {
      msg.push('没宝箱开锤子呢')
    } else {
      for (let i = 0; i < interimArchive.treasureChests.length; i++) {
        let lastNum
        // 0 - 15
        if (interimArchive.incentivesLevel <= 6) {
          // 0 - 8  0-3 0 - 11
          lastNum = interimArchive.treasureChests[i].level + Math.trunc(Math.random() * 4)
        } else {
          // 5 - 17  -2 - 3   3 - 20
          lastNum = interimArchive.treasureChests[i].level + Math.trunc(Math.random() * 6) - 2
          lastNum = lastNum < 8 ? 8 : lastNum
          lastNum = lastNum > 19 ? 19 : lastNum
        }
        if (interimArchive.treasureChests[i].type != 6) {
          let thingId = interimArchive.treasureChests[i].type + '-1-' + lastNum
          if (interimArchive.treasureChests[i].type == 4 && lastNum >= 10) {
            thingId = interimArchive.treasureChests[i].type + '-2-' + lastNum
          }
          let addThing = AssociationApi.assUser.searchThingById(thingId)
          if (!addThing) {
            addThing = AssociationApi.assUser.searchThingById('6-1-2')
          }
          addNajieThings(addThing, UID, 1)
          msg.push(`你获得了${addThing.name}`)
        } else {
          GameApi.GameUser.userBag({
            UID,
            name: '下品灵石',
            ACCOUNT: Number(lastNum * 100)
          })
          msg.push(`你获得了${lastNum * 100}下品灵石`)
        }
      }
    }
    interimArchive.treasureChests = []
    AssociationApi.assUser.setAssOrPlayer('interimArchive', UID, interimArchive)
    const data = {
      msg
    }
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data }))
    return false
  }

  async Escape_Uncharted(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    if (AssociationApi.assUser.existAss('interimArchive', UID)) {
      const interimArchive = AssociationApi.assUser.getAssOrPlayer(3, UID)
      if (interimArchive.alreadyExplore.length > 11) {
        const idList = ['1-1-40', '2-1-40']
        const randomSource = Math.random()
        // unchartedLevel  incentivesLevel
        const probability = interimArchive.unchartedLevel * 0.03

        if (randomSource < probability) {
          // 获得特殊产出
          let addThing
          const find = AssociationApi.assUser.blessPlaceList.find(
            (item) => item.id == interimArchive.assResident
          )
          if (interimArchive.incentivesLevel > 12) {
            addThing = AssociationApi.assUser.searchThingById(find.specialty.best)
          } else if (interimArchive.incentivesLevel >= 8) {
            const location = Math.trunc(Math.random() * find.specialty.special.length)
            addThing = AssociationApi.assUser.searchThingById(find.specialty.special[location])
          } else {
            const location = Math.trunc(Math.random() * find.specialty.common.length)
            addThing = AssociationApi.assUser.searchThingById(find.specialty.common[location])
          }
          if (!addThing) {
            addThing = AssociationApi.assUser.searchThingById('6-1-2')
          }
          addNajieThings(addThing, UID, 1)
          e.reply(`你获得了${addThing.name}`)
        } else {
          const location = Math.trunc(Math.random() * idList.length)
          let addThing = AssociationApi.assUser.searchThingById(idList[location])
          if (!addThing) {
            addThing = AssociationApi.assUser.searchThingById('6-1-2')
          }
          addNajieThings(addThing, UID, 1)
          e.reply(`你获得了${addThing.name}`)
        }
      }
      AssociationApi.assUser.deleteAss('interimArchive', UID)
    }
    let action = GameApi.Wrap.getAction(UID)
    if (action.actionID != 6) {
      return false
    }
    GameApi.Wrap.deleteAction(UID)
    e.reply(`已成功脱离秘境`)
    return false
  }
}
/** 地点查询 */
async function GoAssUncharted(e, weizhi, addres) {
  let adr = addres
  let msg = ['***' + adr + '***']
  for (let i = 0; i < weizhi.length; i++) {
    const find = AssociationApi.assUser.assRelationList.find((item) => item.id == weizhi[i].id)
    const status = weizhi[i].facility[2].status == 0 ? '未建成' : '已启用'
    msg.push(
      '秘境名称:' +
        find.unchartedName +
        '\n' +
        '归属宗门:' +
        find.name +
        '\n' +
        '状态:' +
        status +
        '\n' +
        '地点:' +
        weizhi[i].resident.name
    )
  }
  e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
}
const addNajieThings = (thing, userQQ, account) => {
  GameApi.GameUser.userBag({
    UID: userQQ,
    name: thing.name,
    ACCOUNT: Number(account)
  })
  return false
}
