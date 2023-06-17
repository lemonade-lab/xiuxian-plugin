import { BotApi, GameApi, plugin } from '../../../model/api/index.js'
export class BoxBag extends plugin {
  constructor() {
    super({
      rule: [
        { reg: /^(#|\/)储物袋$/, fnc: 'showBag' },
        { reg: /^(#|\/)储物袋升级$/, fnc: 'bagUp' }
      ]
    })
  }
  async showBag(e) {
    if (!this.verify(e)) return false
    const UID = e.user_id
    if (!GameApi.GameUser.existUserSatus({ UID })) {
      e.reply('已仙鹤')
      return false
    }
    const { path, name, data } = GameApi.Information.userBagShow({ UID })
    const isreply = e.reply(await BotApi.obtainingImages({ path, name, data }))
    BotApi.Robot.surveySet({ e, isreply })
    return false
  }
  async bagUp(e) {
    if (!this.verify(e)) return false
    if (!GameApi.GameUser.existUserSatus({ UID: e.user_id })) {
      e.reply('已仙鹤')
      return false
    }
    const { MSG } = GameApi.GamePublic.Go({ UID: e.user_id })
    if (MSG) {
      e.reply(MSG)
      return false
    }
    const UID = e.user_id
    const najie = GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_bag'
    })
    const najie_price = GameApi.DefsetUpdata.getConfig({
      app: 'parameter',
      name: 'cooling'
    }).najie_price[najie.grade]
    if (!najie_price) {
      return false
    }
    const thing = GameApi.GameUser.userBagSearch({
      UID,
      name: '下品灵石'
    })
    if (!thing || thing.acount < najie_price) {
      e.reply(`灵石不足,需要准备${najie_price}*[下品灵石]`)
      return false
    }
    najie.grade += 1
    GameApi.UserData.controlAction({
      NAME: UID,
      CHOICE: 'user_bag',
      DATA: najie
    })
    GameApi.GameUser.userBag({
      UID,
      name: '下品灵石',
      ACCOUNT: -Number(najie_price)
    })
    e.reply(`花了${najie_price}*[下品灵石]升级,目前储物袋为${najie.grade}`)
    return false
  }
}
