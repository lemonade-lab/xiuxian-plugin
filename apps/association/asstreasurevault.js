import { plugin, BotApi, GameApi, AssociationApi } from '#xiuxian-api'
// 汐颜
export class assTreasure extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^(#|\/)藏宝阁$/,
          fnc: 'treasureCabinetList'
        },
        {
          reg: /^(#|\/)置换.*$/,
          fnc: 'convertedLtem'
        },
        {
          reg: /^(#|\/)藏宝阁回收.*$/,
          fnc: 'reclaimItem'
        },
        {
          reg: /^(#|\/)我的贡献$/,
          fnc: 'showContribute'
        }
      ]
    })
  }

  async reclaimItem(e) {
    if (!super.verify(e)) return false
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
    if (ass.facility[1].status == 0) {
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
    let thingName = e.cmd_msg.replace(/^(#|\/)藏宝阁回收/, '')

    const searchThing = GameApi.Bag.searchBagByName({
      UID,
      name: thingName
    })
    if (!searchThing) {
      return false
    }
    ass.facility[1].buildNum -= 1
    AssociationApi.assUser.checkFacility(ass)
    let point = Math.trunc(searchThing.price / 600)
    assGP.contributionPoints += point
    assGP.historyContribution += point
    AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
    GameApi.Bag.addBagThing({
      UID,
      name: searchThing.name,
      ACCOUNT: -1
    })
    e.reply(`回收成功，你获得了${point}点贡献点！`)
    const id = searchThing.id.split('-')
    if (id[0] > 5 || id[2] > 19) {
      return false
    }
    const assTreasureCabinet = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assTreasure'
    })
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
      AssociationApi.assUser.setAssOrGP('assTreasure', assGP.AID, assTreasureCabinet)
    }
    return false
  }

  // 藏宝阁
  async treasureCabinetList(e) {
    if (!super.verify(e)) return false
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

    let msg = ['___[门派藏宝阁]___']
    let basetreasureCabinet = AssociationApi.assUser.baseTreasureVaultList
    let assTreasureCabinet = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assTreasure'
    })
    const ass = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assOciation'
    })

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

    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    return false
  }

  // 置换
  async convertedLtem(e) {
    if (!super.verify(e)) return false
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
    const thingName = e.cmd_msg.replace(/^(#|\/)置换/, '')

    if (ass.facility[1].status == 0 || thingName == '') {
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
    let basetreasureCabinet = AssociationApi.assUser.baseTreasureVaultList
    let assTreasureCabinet = GameApi.Data.controlAction({
      NAME: assGP.AID,
      CHOICE: 'assTreasure'
    })
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
      assGP.contributionPoints < exchangeThing.redeemPoint ||
      assGP.assJob < exchangeThing.privileges
    ) {
      e.reply(`贡献或权限不足！`)
      return false
    }
    ass.facility[1].buildNum -= 1
    AssociationApi.assUser.checkFacility(ass)
    assGP.contributionPoints -= exchangeThing.redeemPoint
    AssociationApi.assUser.setAssOrGP('assGP', UID, assGP)
    const addThing = GameApi.Data.searchThingById(exchangeThing.id)
    GameApi.Bag.addBagThing({
      UID,
      name: addThing.name,
      ACCOUNT: 1
    })
    e.reply(`置换成功！！！`)
    return false
  }

  async showContribute(e) {
    if (!super.verify(e)) return false
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
    e.reply(`历史总贡献${assGP.historyContribution}\n当前${assGP.contributionPoints}贡献`)
    return false
  }
}
