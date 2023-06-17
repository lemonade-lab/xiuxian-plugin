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
  showCity = async (e) => {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    if (action.address != 1) {
      e.reply('你对这里并不了解...')
      return false
    }
    const addressId = `${action.z}-${action.region}-${action.address}`
    const point = await GameApi.UserData.listAction({
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
    await BotApi.User.forwardMsg({ e, data: msg })
    return false
  }
  falsePiont = async (e) => {
    if (!this.verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    GameApi.GamePlace.setUserTime(UID,0)
    clearTimeout(GameApi.GamePlace.getUserAction(UID))
    e.reply('你回到了原地')
    return false
  }

  xyzaddress = async (e) => {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const isreply = await e.reply(`坐标(${action.x},${action.y},${action.z})`)
    await BotApi.User.surveySet({ e, isreply })
    return false
  }

  forward = async (e) => {
    if (!this.verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    if (GameApi.GamePlace.getUserTime(UID) == 1) {
      return false
    }
    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const x = action.x
    const y = action.y
    const address = e.msg.replace(/^(#|\/)前往/, '')
    const Point = await GameApi.UserData.listAction({
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
    const level = GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (level.level_id < PointId[3]) {
      e.reply('[修仙联盟]守境者\n道友请留步')
      return false
    }
    const a = x - mx >= 0 ? x - mx : mx - x
    const b = y - my >= 0 ? y - my : my - y
    const battle = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_battle'
    })
    const the = Math.floor(a + b - (a + b) * battle.speed * 0.01)
    const time = the >= 0 ? the : 1
    GameApi.GamePlace.setUserAction(UID,setTimeout(async () => {
      GameApi.GamePlace.setUserTime(UID,0)
      action.x = mx
      action.y = my
      action.region = PointId[1]
      action.address = PointId[2]
      await GameApi.UserData.listAction({
        NAME: UID,
        CHOICE: 'user_action',
        DATA: action
      })
      e.reply([segment.at(UID), `成功抵达${address}`])
    }, 1000 * time))
    GameApi.GamePlace.setUserTime(UID,1)
    e.reply(`正在前往${address}...\n需要${time}秒`)
    return false
  }
  delivery = async (e) => {
    if (!this.verify(e)) return false
    if (!(await GameApi.GameUser.existUserSatus({ UID: e.user_id }))) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = await GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    if (GameApi.GamePlace.getUserDelivery(UID) == 1) {
      return false
    }
    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    const x = action.x
    const y = action.y
    const address = e.msg.replace(/^(#|\/)传送/, '')
    const Posirion = await GameApi.UserData.listAction({
      NAME: 'position',
      CHOICE: 'generate_position'
    })
    const position = Posirion.find((item) => item.name == address)
    if (!position) {
      return false
    }
    const positionID = position.id.split('-')
    const level = GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (level.level_id < positionID[3]) {
      e.reply('[修仙联盟]守境者\n道友请留步')
      return false
    }
    const point = await GameApi.UserData.listAction({
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
    const money = await GameApi.GameUser.userBagSearch({
      UID,
      name: '下品灵石'
    })
    if (!money || money.acount < lingshi) {
      e.reply(`[修仙联盟]守阵者\n需要花费${lingshi}*[下品灵石]`)
      return false
    }
    //先扣钱
    await GameApi.GameUser.userBag({
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
    setTimeout(async () => {
      GameApi.GamePlace.setUserDelivery(UID,0)
      action.x = mx
      action.y = my
      action.region = positionID[1]
      action.address = positionID[2]
      await GameApi.UserData.listAction({
        NAME: UID,
        CHOICE: 'user_action',
        DATA: action
      })
      e.reply([segment.at(UID), `成功传送至${address}`])
    }, 1000 * time)
    GameApi.GamePlace.setUserDelivery(UID,1)
    e.reply(`[修仙联盟]守阵者\n传送对接${address}\n需要${time}秒`)
    return false
  }
}
