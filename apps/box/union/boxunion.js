import { BotApi, GameApi, plugin } from '../../../model/api/index.js'
export class boxunion extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)联盟报到$/, fnc: 'userCheckin' },
        { reg: /^(#|\/)联盟签到$/, fnc: 'userSignin' },
        { reg: /^(#|\/)联盟商会$/, fnc: 'unionShop' }
      ]
    })
  }

  async unionShop(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const addressName = '联盟'
    if (!GameApi.GameMap.mapAction({ UID, addressName })) {
      e.reply(`需[(#|/)前往+城池名+${addressName}]`)
    }
    e.reply('待世界升级~')
    return false
  }

  async userSignin(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const addressName = '联盟'
    if (!GameApi.GameMap.mapAction({ UID, addressName })) {
      e.reply(`需[(#|/)前往+城池名+${addressName}]`)
    }
    e.reply('待世界升级~')
    return false
  }

  async userCheckin(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = GameApi.GamePublic.Go({ UID })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const addressName = '联盟'
    if (!GameApi.GameMap.mapAction({ UID, addressName })) {
      e.reply(`需[(#|/)前往+城池名+${addressName}]`)
    }

    const level = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (level.levelId != 1) {
      e.reply('[修仙联盟]方正\n前辈莫要开玩笑')
      return false
    }

    const action = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    if (action.newnoe != 1) {
      e.reply('[修仙联盟]方正\n道友要不仔细看看自己的储物袋')
      return false
    }
    action.newnoe = 0
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_action',
      DATA: action
    })

    const randomthing = GameApi.GameUser.randomThing()
    GameApi.GameUser.userBag({
      UID,
      name: randomthing.name,
      ACCOUNT: randomthing.acount
    })
    e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧`)
    return false
  }
}
