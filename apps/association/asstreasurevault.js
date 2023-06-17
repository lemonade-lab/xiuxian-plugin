import { plugin, BotApi, GameApi, AssociationApi } from '../../model/api/index.js'
//汐颜
export class TreasureVault extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)(宗门藏宝阁|藏宝阁)$/,
          fnc: 'List_treasureCabinet'
        },
        {
          reg: /^(#|\/)兑换.*$/,
          fnc: 'Converted_Item'
        },
        {
          reg: /^(#|\/)藏宝阁回收.*$/,
          fnc: 'Reclaim_Item'
        },
        {
          reg: /^(#|\/)我的贡献$/,
          fnc: 'Show_Contribute'
        }
      ]
    })
  }
  async Reclaim_Item(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return false
    }
    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)

    if (ass.facility[1].status == 0) {
      return false
    }

    const positionList = await GameApi.UserData.controlAction({
      NAME: 'position',
      CHOICE: 'generate_position'
    })
    const position = positionList.find((item) => item.name == ass.resident.name)
    const action = await GameApi.GameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    if (
      action.x < position.x1 ||
      action.x > position.x2 ||
      action.y < position.y1 ||
      action.y > position.y2
    ) {
      e.reply(`请先回宗门`)
      return false
    }
    let thingName = e.msg.replace('#藏宝阁回收', '')

    const searchThing = await GameApi.GameUser.userBagSearch({
      UID: UID,
      name: thingName
    })
    if (!searchThing) {
      return false
    }
    ass.facility[1].buildNum -= 1
    await AssociationApi.assUser.checkFacility(ass)
    let point = Math.trunc(searchThing.price / 600)
    assPlayer.contributionPoints += point
    assPlayer.historyContribution += point
    await AssociationApi.assUser.setAssOrPlayer('assPlayer', UID, assPlayer)
    await Add_najie_things(searchThing, UID, -1)
    e.reply(`回收成功，你获得了${point}点贡献点！`)

    const id = searchThing.id.split('-')
    if (id[0] > 5 || id[2] > 19) {
      return false
    }
    const assTreasureCabinet = AssociationApi.assUser.getAssOrPlayer(4, assPlayer.assName)
    const length = Math.ceil(ass.level / 3)
    let isExist = false
    for (let i = 0; i < length; i++) {
      const location = assTreasureCabinet[i].findIndex((item) => item.id == searchThing.id)
      if (location != -1) {
        isExist = true
      }
    }

    if (!isExist) {
      let location = 0
      if (point < 10) {
        location = 0
      } else if (point < 100) {
        location = 1
      } else {
        location = 2
      }
      let addTing = {
        id: searchThing.id,
        name: searchThing.name,
        privileges: location * 2 + 1,
        redeemPoint: Math.ceil(searchThing.price / 500)
      }
      assTreasureCabinet[location].push(addTing)
      await AssociationApi.assUser.setAssOrPlayer(
        'assTreasureVault',
        assPlayer.assName,
        assTreasureCabinet
      )
    }
    return false
  }

  //藏宝阁
  async List_treasureCabinet(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return false
    }

    let msg = ['___[宗门藏宝阁]___']
    let basetreasureCabinet = AssociationApi.assUser.baseTreasureVaultList
    let assTreasureCabinet = AssociationApi.assUser.getAssOrPlayer(4, assPlayer.assName)
    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)

    const length = Math.ceil(ass.level / 3)
    for (let i = 0; i < length; i++) {
      assTreasureCabinet[i].push(...basetreasureCabinet[i])
      msg.push(`第${i + 1}层`)
      for (let j = 0; j < assTreasureCabinet[i].length; j++) {
        msg.push(
          '物品:' +
            `${assTreasureCabinet[i][j].name}` +
            '\n所需贡献值:' +
            `${assTreasureCabinet[i][j].redeemPoint}` +
            '\n所需权限:' +
            `${assTreasureCabinet[i][j].privileges}`
        )
      }
    }

    await BotApi.User.forwardMsg({ e, data: msg })
    return false
  }

  //兑换
  async Converted_Item(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return false
    }

    const ass = AssociationApi.assUser.getAssOrPlayer(2, assPlayer.assName)
    const thingName = e.msg.replace('#兑换', '')

    if (ass.facility[1].status == 0 || thingName == '') {
      return false
    }

    const positionList = await GameApi.UserData.controlAction({
      NAME: 'position',
      CHOICE: 'generate_position'
    })
    const position = positionList.find((item) => item.name == ass.resident.name)
    const action = await GameApi.GameUser.userMsgAction({
      NAME: UID,
      CHOICE: 'user_action'
    })

    if (
      action.x < position.x1 ||
      action.x > position.x2 ||
      action.y < position.y1 ||
      action.y > position.y2
    ) {
      e.reply(`请先回宗门`)
      return false
    }
    let basetreasureCabinet = AssociationApi.assUser.baseTreasureVaultList
    let assTreasureCabinet = AssociationApi.assUser.getAssOrPlayer(4, assPlayer.assName)
    let length = Math.ceil(ass.level / 3)
    let exchangeThing
    for (let i = 0; i < length; i++) {
      assTreasureCabinet[i].push(...basetreasureCabinet[i])
      if (assTreasureCabinet[i].find((item) => item.name == thingName)) {
        exchangeThing = assTreasureCabinet[i].find((item) => item.name == thingName)
      }
    }
    if (!exchangeThing) {
      return false
    }
    if (
      assPlayer.contributionPoints < exchangeThing.redeemPoint ||
      assPlayer.assJob < exchangeThing.privileges
    ) {
      e.reply(`贡献或权限不足！`)
      return false
    }
    ass.facility[1].buildNum -= 1
    await AssociationApi.assUser.checkFacility(ass)
    assPlayer.contributionPoints -= exchangeThing.redeemPoint
    AssociationApi.assUser.setAssOrPlayer('assPlayer', UID, assPlayer)
    const addThing = await AssociationApi.assUser.searchThingById(exchangeThing.id)
    await Add_najie_things(addThing, UID, 1)
    e.reply(`兑换成功！！！`)
    return false
  }
  async Show_Contribute(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    const ifexistplay = await AssociationApi.assUser.existArchive(UID)
    if (!ifexistplay || !e.isGroup) {
      return false
    }

    const assPlayer = AssociationApi.assUser.getAssOrPlayer(1, UID)
    if (assPlayer.assName == 0) {
      return false
    }
    e.reply(
      `你当前还剩${assPlayer.contributionPoints}贡献点，历史贡献值总和为${assPlayer.historyContribution}`
    )
    return false
  }
}
const Add_najie_things = async (thing, user_qq, account) => {
  await GameApi.GameUser.userBag({
    UID: user_qq,
    name: thing.name,
    ACCOUNT: Number(account)
  })
  return false
}
