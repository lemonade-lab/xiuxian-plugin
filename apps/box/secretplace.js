import { BotApi, GameApi, plugin } from '#xiuxian-api'
export class BoxSecretplace extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)坐标信息$/, fnc: 'xyzaddress' },
        { reg: /^(#|\/)位置信息$/, fnc: 'showCity' },
        { reg: /^(#|\/)前往[\u4e00-\u9fa5]*$/, fnc: 'forward' },
        { reg: /^(#|\/)返回$/, fnc: 'falsePiont' },
        { reg: /^(#|\/)传送[\u4e00-\u9fa5]*$/, fnc: 'delivery' }
      ]
    })
  }

  async xyzaddress(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const isreply = e.reply(`坐标(${action.x},${action.y},${action.z})`)
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async showCity(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    if (action.address != 1) {
      e.reply('你对这里并不了解...')
      return false
    }
    const addressId = `${action.z}-${action.region}-${action.address}`
    const point = GameApi.Data.controlAction({
      NAME: 'point',
      CHOICE: 'generate_position'
    })
    const address = []
    const msg = []
    for (let item of point) {
      if (item.id.includes(addressId)) {
        address.push(item)
      }
    }
    for (let item of address) {
      msg.push(`地点名:${item.name}\n坐标(${item.x},${item.y})`)
    }
    const isreply = await e.reply(
      await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } })
    )
    BotApi.Robot.surveySet(e, isreply)
    return false
  }

  async falsePiont(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    let action = GameApi.Action.get(UID)
    if (!action) return false
    if (action.actionID == 2) {
      GameApi.Action.delete(UID)
      // 取消行为
      clearTimeout(GameApi.Place.get(UID))
      e.reply('已回到原地')
      return false
    }
    return false
  }

  async forward(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Action.Go(UID)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    /* 检查地点 */
    const action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const address = e.cmd_msg.replace(/^(#|\/)前往/, '')
    const Point = GameApi.Data.controlAction({
      NAME: 'point',
      CHOICE: 'generate_position'
    })
    const point = Point.find((item) => item.name == address)
    if (!point) {
      e.reply(`未知地点[${address}]`)
      return false
    }
    /* */
    const x = action.x
    const y = action.y
    const mx = point.x
    const my = point.y
    const PointId = point.id.split('-')
    const LevelsMsg = GameApi.Levels.getMsg(UID, 0)
    // 境界不足
    if (LevelsMsg.realm < PointId[3] - 1) {
      e.reply('[修仙联盟]守境者\n道友请留步')
      return false
    }
    const a = x - mx >= 0 ? x - mx : mx - x
    const b = y - my >= 0 ? y - my : my - y
    const BattleData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerBattle'
    })
    const the = Math.floor(a + b - (a + b) * BattleData.speed * 0.01)
    const time = the >= 0 ? the : 1
    // 设置定时器,并得到定时器id
    GameApi.Place.set(
      UID,
      setTimeout(() => {
        /* 这里清除行为 */
        GameApi.Action.delete(UID)
        action.x = mx
        action.y = my
        action.region = PointId[1]
        action.address = PointId[2]
        GameApi.Data.controlAction({
          NAME: UID,
          CHOICE: 'playerAction',
          DATA: action
        })
        if (global.segment) {
          e.reply([segment.at(UID), `成功抵达${address}`])
        } else {
          const LifeData = GameApi.Data.readInitial('life', 'playerLife', {})
          e.reply(`${LifeData[UID].name}成功抵达${address}`)
        }
      }, 1000 * time)
    )

    /**
     * 增加随机事件,当时间大于2分钟的时候,两分钟后触发随机事件
     * 该事件触发前提是,走路行为是存在的,不存时将取消该行为
     *
     */

    // 设置行为赶路
    GameApi.Action.set(UID, {
      actionID: 2,
      startTime: 1000 * time
    })
    e.reply(`正在前往${address}...\n需要${time}秒`)
    return false
  }

  async delivery(e) {
    if (!super.verify(e)) return false
    e = super.escape(e)
    const UID = e.user_id
    if (!GameApi.Player.getUserLifeSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Action.Go(UID)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const action = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerAction'
    })
    const x = action.x
    const y = action.y
    const address = e.cmd_msg.replace(/^(#|\/)传送/, '')
    const Posirion = GameApi.Data.controlAction({
      NAME: 'position',
      CHOICE: 'generate_position'
    })
    const position = Posirion.find((item) => item.name == address)
    if (!position) {
      return false
    }
    const positionID = position.id.split('-')
    const LevelData = GameApi.Data.controlAction({
      NAME: UID,
      CHOICE: 'playerLevel'
    })
    if (LevelData.gaspractice.realm < positionID[3] - 1) {
      e.reply('[修仙联盟]守境者\n道友请留步')
      return false
    }
    const point = GameApi.Data.controlAction({
      NAME: 'point',
      CHOICE: 'generate_position'
    })
    let key = 0
    for (let item of point) {
      const pointID = item.id.split('-')
      if (pointID[4] == 2) {
        if (item.x == x) {
          if ((item.y = y)) {
            key = 1
          }
        }
      }
    }
    if (key == 0) {
      return false
    }
    const lingshi = 1000
    const money = GameApi.Bag.searchBagByName({
      UID,
      name: '下品灵石'
    })
    if (!money || money.acount < lingshi) {
      e.reply(`[修仙联盟]守阵者\n需要花费${lingshi}*[下品灵石]`)
      return false
    }
    // 先扣钱
    GameApi.Bag.addBagThing({
      UID,
      name: '下品灵石',
      ACCOUNT: -lingshi
    })
    const mx = Math.floor(Math.random() * (position.x2 - position.x1)) + Number(position.x1)
    const my = Math.floor(Math.random() * (position.y2 - position.y1)) + Number(position.y1)
    const the = Math.floor(
      ((x - mx >= 0 ? x - mx : mx - x) + (y - my >= 0 ? y - my : my - y)) / 100
    )
    const time = the > 0 ? the : 1
    setTimeout(() => {
      // 清除行为
      GameApi.Action.delete(UID)
      action.x = mx
      action.y = my
      action.region = positionID[1]
      action.address = positionID[2]
      GameApi.Data.controlAction({
        NAME: UID,
        CHOICE: 'playerAction',
        DATA: action
      })
      if (global.segment) {
        e.reply([segment.at(UID), `成功传送至${address}`])
      } else {
        const LifeData = GameApi.Data.readInitial('life', 'playerLife', {})
        e.reply(`${LifeData[UID].name}成功传送至${address}`)
      }
    }, 1000 * time)
    // 传送行为记录
    GameApi.Action.set(UID, {
      actionID: 3,
      startTime: 1000 * time
    })
    e.reply(`[修仙联盟]守阵者\n传送对接${address}\n需要${time}秒`)
    return false
  }
}
