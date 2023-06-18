import { BotApi, GameApi, plugin } from '../../../model/api/index.js'
export class BoxSecretplace extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)坐标信息$/, fnc: 'xyzaddress' },
        { reg: /^(#|\/)前往.*$/, fnc: 'forward' },
        { reg: /^(#|\/)返回$/, fnc: 'falsePiont' },
        { reg: /^(#|\/)传送.*$/, fnc: 'delivery' },
        { reg: /^(#|\/)位置信息$/, fnc: 'showCity' }
      ]
    })
  }

  async showCity(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const action = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    if (action.address != 1) {
      e.reply('你对这里并不了解...')
      return false
    }
    const addressId = `${action.z}-${action.region}-${action.address}`
    const point = GameApi.UserData.controlAction({
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
    e.reply(await BotApi.obtainingImages({ path: 'msg', name: 'msg', data: { msg } }))
    return false
  }

  async falsePiont(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Wrap.Go(e.user_id)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const UID = e.user_id
    GameApi.GamePlace.setUserTime(UID, 0)
    clearTimeout(GameApi.GamePlace.getUserAction(UID))
    e.reply('你回到了原地')
    return false
  }

  async xyzaddress(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus(UID)) {
      e.reply('已仙鹤')
      return false
    }
    const action = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const isreply = e.reply(`坐标(${action.x},${action.y},${action.z})`)
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }

  async forward(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Wrap.Go(e.user_id)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const UID = e.user_id
    if (GameApi.GamePlace.getUserTime(UID) == 1) {
      return false
    }
    const action = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const x = action.x
    const y = action.y
    const address = e.msg.replace(/^(#|\/)前往/, '')
    const Point = GameApi.UserData.controlAction({
      NAME: 'point',
      CHOICE: 'generate_position'
    })
    const point = Point.find((item) => item.name == address)
    if (!point) {
      return false
    }
    const mx = point.x
    const my = point.y
    const PointId = point.id.split('-')
    const level = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (level.levelId < PointId[3]) {
      e.reply('[修仙联盟]守境者\n道友请留步')
      return false
    }
    const a = x - mx >= 0 ? x - mx : mx - x
    const b = y - my >= 0 ? y - my : my - y
    const battle = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    const the = Math.floor(a + b - (a + b) * battle.speed * 0.01)
    const time = the >= 0 ? the : 1
    GameApi.GamePlace.setUserAction(
      UID,
      setTimeout(() => {
        GameApi.GamePlace.setUserTime(UID, 0)
        action.x = mx
        action.y = my
        action.region = PointId[1]
        action.address = PointId[2]
        GameApi.UserData.controlAction({
          NAME: UID,
          CHOICE: 'user_action',
          DATA: action
        })
        e.reply([segment.at(UID), `成功抵达${address}`])
      }, 1000 * time)
    )
    GameApi.GamePlace.setUserTime(UID, 1)
    e.reply(`正在前往${address}...\n需要${time}秒`)
    return false
  }

  async delivery(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    const { state, msg } = GameApi.Wrap.Go(e.user_id)
    if (state == 4001) {
      e.reply(msg)
      return false
    }
    const UID = e.user_id
    if (GameApi.GamePlace.getUserDelivery(UID) == 1) {
      return false
    }
    const action = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const x = action.x
    const y = action.y
    const address = e.msg.replace(/^(#|\/)传送/, '')
    const Posirion = GameApi.UserData.controlAction({
      NAME: 'position',
      CHOICE: 'generate_position'
    })
    const position = Posirion.find((item) => item.name == address)
    if (!position) {
      return false
    }
    const positionID = position.id.split('-')
    const level = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (level.levelId < positionID[3]) {
      e.reply('[修仙联盟]守境者\n道友请留步')
      return false
    }
    const point = GameApi.UserData.controlAction({
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
    const money = GameApi.GameUser.userBagSearch({
      UID,
      name: '下品灵石'
    })
    if (!money || money.acount < lingshi) {
      e.reply(`[修仙联盟]守阵者\n需要花费${lingshi}*[下品灵石]`)
      return false
    }
    // 先扣钱
    GameApi.GameUser.userBag({
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
      GameApi.GamePlace.setUserDelivery(UID, 0)
      action.x = mx
      action.y = my
      action.region = positionID[1]
      action.address = positionID[2]
      GameApi.UserData.controlAction({
        NAME: UID,
        CHOICE: 'user_action',
        DATA: action
      })
      e.reply([segment.at(UID), `成功传送至${address}`])
    }, 1000 * time)
    GameApi.GamePlace.setUserDelivery(UID, 1)
    e.reply(`[修仙联盟]守阵者\n传送对接${address}\n需要${time}秒`)
    return false
  }
}
