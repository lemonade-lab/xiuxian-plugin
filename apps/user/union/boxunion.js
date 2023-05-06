import { BotApi, GameApi, plugin, name, dsc, verify } from '../../../model/api/api.js'
export class boxunion extends plugin {
  constructor() {
    super({
      name,
      dsc,
      rule: [
        { reg: '^#联盟报到$', fnc: 'userCheckin' },
        { reg: '^#联盟签到$', fnc: 'userSignin' },
        { reg: '^#联盟商会$', fnc: 'unionShop' }
      ]
    })
  }

  unionShop = async (e) => {
    if (!verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    const address_name = '联盟'
    if (!GameApi.GameMap.mapAction(address_name)) {
      e.reply(`需[#前往+城池名+${address_name}]`)
    }
    e.reply('待世界升级~')
    return false
  }

  userSignin = async (e) => {
    if (!verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    const address_name = '联盟'
    if (!GameApi.GameMap.mapAction(address_name)) {
      e.reply(`需[#前往+城池名+${address_name}]`)
    }
    e.reply('待世界升级~')
    return false
  }

  userCheckin = async (e) => {
    if (!verify(e)) return false
    const UID = e.user_id
    if (!(await GameApi.GameUser.existUserSatus({ UID }))) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = await GameApi.GamePublic.Go({ UID })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const address_name = '联盟'
    if (!GameApi.GameMap.mapAction(address_name)) {
      e.reply(`需[#前往+城池名+${address_name}]`)
    }

    const level = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_level'
    })
    if (level.level_id != 1) {
      e.reply('[修仙联盟]方正\n前辈莫要开玩笑')
      return false
    }

    const action = await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action'
    })
    if (action.newnoe != 1) {
      e.reply('[修仙联盟]方正\n道友要不仔细看看自己的储物袋')
      return false
    }
    action.newnoe = 0
    await GameApi.UserData.listAction({
      NAME: UID,
      CHOICE: 'user_action',
      DATA: action
    })

    const randomthing = await GameApi.GameUser.randomThing()
    await GameApi.GameUser.userBag({
      UID,
      name: randomthing.name,
      ACCOUNT: randomthing.acount
    })
    e.reply(`[修仙联盟]方正\n看你骨骼惊奇\n就送你[${randomthing.name}]吧`)
    return false
  }
}
